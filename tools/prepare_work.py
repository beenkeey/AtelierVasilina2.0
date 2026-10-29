#!/usr/bin/env python3
"""
Локально: фото → (опционально) без фона → public/works/ + запись в catalog.json

Пример:
  python tools/prepare_work.py photo.jpg --title "Лес" --category painting --medium acrylic --price 5000 --featured
"""
from __future__ import annotations

import argparse
import json
import re
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "frontend" / "public" / "catalog.json"
WORKS_DIR = ROOT / "frontend" / "public" / "works"


def slugify(text: str) -> str:
    s = re.sub(r"[^\w\s-]", "", text.lower())
    s = re.sub(r"[\s_-]+", "-", s).strip("-")
    return s or uuid.uuid4().hex[:8]


def remove_bg(raw: bytes) -> bytes:
    from rembg import remove

    return remove(raw)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("image", type=Path)
    parser.add_argument("--title", required=True)
    parser.add_argument("--description", default="")
    parser.add_argument(
        "--category",
        choices=["painting", "embroidery", "wearable", "custom"],
        default="painting",
    )
    parser.add_argument(
        "--medium",
        choices=["acrylic", "pastel", "marker", "ink", "pencil", "mixed"],
        default=None,
    )
    parser.add_argument("--price", type=float, default=None)
    parser.add_argument("--featured", action="store_true")
    parser.add_argument("--no-remove-bg", action="store_true")
    args = parser.parse_args()

    raw = args.image.read_bytes()
    if not args.no_remove_bg:
        raw = remove_bg(raw)

    from PIL import Image
    from io import BytesIO

    img = Image.open(BytesIO(raw))
    if img.mode != "RGBA":
        img = img.convert("RGBA")

    work_id = slugify(args.title)
    out_name = f"{work_id}.png"
    WORKS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = WORKS_DIR / out_name
    img.save(out_path, format="PNG", optimize=True)

    entry = {
        "id": work_id,
        "title": args.title,
        "description": args.description,
        "category": args.category,
        "price": args.price,
        "featured": args.featured,
        "image": f"/works/{out_name}",
        "available": True,
    }
    if args.medium:
        entry["medium"] = args.medium

    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    catalog["works"] = [w for w in catalog["works"] if w.get("id") != work_id]
    catalog["works"].insert(0, entry)
    CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"OK: {out_path.relative_to(ROOT)}")
    print(f"Добавлено в catalog.json: {work_id}")


if __name__ == "__main__":
    main()
