from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from database import engine, SessionLocal, Base, User, ShelfCheck, init_db, get_db
from detector import process_image
from stock_logic import evaluate_stock_status, notify_admin

# Initialize DB tables
init_db()
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

# Load environment variables
load_dotenv()

# Rate Limiter setup
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Shelf Stock Monitoring API")

# Setup Rate Limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Secure Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# CORS Middleware (Restrict in production)
origins = [
    "http://localhost:5173",  # React Admin Dashboard
    "http://127.0.0.1:5173",
    "exp://localhost:19000",  # React Native Expo
    "exp://127.0.0.1:19000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development. Change to 'origins' in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Shelf Stock Monitoring API"}

@app.get("/api/health")
@limiter.limit("5/minute")
def health_check(request: Request):
    return {"status": "ok"}

@app.post("/api/detect")
@limiter.limit("10/minute")
async def detect_shelf(request: Request, file: UploadFile = File(...), user_email: str = Form(None), db: Session = Depends(get_db)):
    """
    Receive an image from the mobile app, process with YOLOv8, and save result.
    """
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type")

    # Read image bytes
    image_bytes = await file.read()
    
    # Process with YOLO
    result = process_image(image_bytes)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    count = result["count"]
    boxes = result["boxes"]
    
    # Evaluate stock
    status = evaluate_stock_status(count)
    
    # Notify via Email (admin + user)
    notify_admin(status, count, image_bytes, user_email)
    
    # Save to database
    db_check = ShelfCheck(
        item_count=count,
        status=status,
        image_url=file.filename
    )
    db.add(db_check)
    db.commit()
    db.refresh(db_check)
    
    return {
        "id": db_check.id,
        "count": count,
        "status": status,
        "boxes": boxes
    }

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    """
    Get live stats for the admin dashboard.
    """
    total_checks = db.query(ShelfCheck).count()
    empty_shelves = db.query(ShelfCheck).filter(ShelfCheck.status == "EMPTY").count()
    return {
        "total_checks": total_checks,
        "empty_shelves": empty_shelves,
        "stocked": total_checks - empty_shelves
    }

@app.get("/api/history")
def get_history(db: Session = Depends(get_db), limit: int = 50):
    """
    Get history logs.
    """
    checks = db.query(ShelfCheck).order_by(ShelfCheck.timestamp.desc()).limit(limit).all()
    return checks
