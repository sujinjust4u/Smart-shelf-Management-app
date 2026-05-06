from ultralytics import YOLO
import cv2
import numpy as np
import os

# Get path to model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best.pt")

try:
    model = YOLO(MODEL_PATH)
except Exception as e:
    print(f"Warning: Could not load model at {MODEL_PATH}. Make sure best.pt exists.")
    model = None

def process_image(image_bytes: bytes):
    """
    Process image bytes with YOLOv8 to detect items
    Returns dict with bounding boxes and total count.
    """
    if model is None:
        # Mock response if model missing
        return {
            "count": 0,
            "boxes": [],
            "error": "Model not loaded"
        }

    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    # Decode image
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Run inference
    results = model(img)
    
    boxes = []
    count = 0
    
    for r in results:
        boxes_data = r.boxes
        for box in boxes_data:
            # Extract box coordinates (xyxy)
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            # Extract confidence and class ID
            conf = box.conf[0].item()
            cls_id = int(box.cls[0].item())
            
            # Assuming we want all classes or a specific 'product' class
            # You can filter by cls_id if your model has multiple classes
            
            boxes.append({
                "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                "confidence": conf,
                "class_id": cls_id
            })
            count += 1
            
    return {
        "count": count,
        "boxes": boxes
    }
