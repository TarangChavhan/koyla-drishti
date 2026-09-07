import random
import re
from datetime import datetime, timezone
from typing import Any, Dict, Optional

def generate_id(prefix: str, length: int = 4) -> str:
    """Generate human-readable government ID like KD-104, INS-2401, VIO-1024, ALT-9021."""
    num = random.randint(10 ** (length - 1), (10 ** length) - 1)
    return f"{prefix}-{num}"

def format_current_timestamp() -> str:
    """Format timestamp as 'Today, 14:30' or '07 Sep 2026'."""
    now = datetime.now()
    return now.strftime("%d %b %Y, %H:%M")

def sanitize_filename(filename: str) -> str:
    """Strip dangerous characters from uploaded filenames."""
    clean = re.sub(r"[^a-zA-Z0-9_.-]", "_", filename)
    return clean

ALLOWED_FILE_EXTENSIONS = {"pdf", "jpg", "jpeg", "png", "xlsx", "csv"}

def is_allowed_file(filename: str) -> bool:
    """Check if file extension is authorized."""
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_FILE_EXTENSIONS

def standard_response(
    success: bool = True,
    message: Optional[str] = None,
    data: Optional[Any] = None,
    error_code: Optional[str] = None
) -> Dict[str, Any]:
    """Standard API response wrapper adhering to project specification."""
    resp = {"success": success}
    if message is not None:
        resp["message"] = message
    if data is not None:
        resp["data"] = data
    if error_code is not None:
        resp["error_code"] = error_code
    return resp
