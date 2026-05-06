import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

MIN_STOCK_THRESHOLD = int(os.getenv("MIN_STOCK_THRESHOLD", 2))
TARGET_EMAIL = "amitabhmama43@gmail.com"

def evaluate_stock_status(item_count: int) -> str:
    """
    Compare detected count against the threshold.
    """
    if item_count <= MIN_STOCK_THRESHOLD:
        return "EMPTY"
    return "STOCKED"

def _send_email(smtp_email: str, smtp_password: str, to_email: str, subject: str, body: str, image_bytes: bytes = None):
    """Helper to send a single email."""
    try:
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = smtp_email
        msg['To'] = to_email
        msg.set_content(body)
        if image_bytes:
            msg.add_attachment(image_bytes, maintype='image', subtype='jpeg', filename='shelf_scan.jpg')
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(smtp_email, smtp_password)
            server.send_message(msg)
        print(f"[SUCCESS] Email sent to {to_email}")
    except Exception as e:
        print(f"[ERROR] Failed to send email to {to_email}: {e}")

def notify_admin(status: str, count: int, image_bytes: bytes = None, user_email: str = None):
    """
    Send scan report email to both the user and the admin.
    """
    if status == "EMPTY":
        print(f"[ALERT] Shelf is running empty! Only {count} items remaining.")
    else:
        print(f"[INFO] Shelf is stocked. {count} items detected.")

    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")
    admin_email = os.getenv("ADMIN_EMAIL", "sujin.is.online@gmail.com")

    if not smtp_email or not smtp_password:
        print("[WARNING] SMTP_EMAIL and SMTP_PASSWORD are not set in .env. Skipping email notification.")
        return

    status_emoji = "⚠️ ALERT" if status == "EMPTY" else "✅ STOCKED"
    subject = f"{status_emoji}: Shelf Scan Report — {count} items detected"

    admin_body = (
        f"📦 New Shelf Scan Logged\n"
        f"{'='*40}\n"
        f"Status      : {status}\n"
        f"Items Found : {count}\n"
        f"Scanned By  : {user_email or 'Unknown User'}\n\n"
        f"See the attached image for the shelf snapshot.\n"
    )

    # Send to admin always
    _send_email(smtp_email, smtp_password, admin_email, subject, admin_body, image_bytes)

    # Send to the logged-in user if their email is known
    if user_email and user_email != admin_email:
        user_body = (
            f"Hi there!\n\n"
            f"Your shelf scan has been processed successfully.\n"
            f"{'='*40}\n"
            f"Status      : {status}\n"
            f"Items Found : {count}\n\n"
            f"{'⚠️ A restock may be needed soon!' if status == 'EMPTY' else '✅ Shelf looks well stocked!'}\n\n"
            f"See the attached image for the shelf snapshot.\n"
        )
        _send_email(smtp_email, smtp_password, user_email, subject, user_body, image_bytes)

