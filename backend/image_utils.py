import uuid
from io import BytesIO
from pathlib import Path

from PIL import Image

from config import UPLOAD_DIR


def save_work_image(raw_bytes: bytes, remove_background: bool = True) -> str:
    """Process upload: optional bg removal, save PNG with alpha."""
    if remove_background:
        from rembg import remove

        processed = remove(raw_bytes)
    else:
        processed = raw_bytes

    img = Image.open(BytesIO(processed))
    if img.mode != "RGBA":
        img = img.convert("RGBA")

    filename = f"{uuid.uuid4().hex}.png"
    dest: Path = UPLOAD_DIR / filename
    img.save(dest, format="PNG", optimize=True)
    return filename
