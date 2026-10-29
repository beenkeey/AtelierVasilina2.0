#!/usr/bin/env python3
"""Импорт всех фото из папки «Работы» в public/works + catalog.json."""
from __future__ import annotations

import json
import re
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Работы"
CATALOG = ROOT / "frontend" / "public" / "catalog.json"
WORKS_DIR = ROOT / "frontend" / "public" / "works"

# Заливка углов при наклоне — как фон карточки на сайте (#1a1619)
CARD_FILL_RGB = (26, 22, 25)

# rotate: градусы против часовой (PIL); crop: доли (top, bottom, left, right) от 0..1
WORKS = [
    {
        "file": "photo_2026-10-20_15-08-16.jpg",
        "id": "futbolka-osminog-slukhi",
        "title": "Футболка «Слухи»",
        "description": "Роспись акрилом: осьминог и надпись на чёрной футболке.",
        "category": "wearable",
        "featured": True,
        "remove_bg": False,
        "rotate": 0,
    },
    {
        "file": "photo_2026-10-20_15-09-00.jpg",
        "id": "vyshivka-lyubov",
        "title": "Вышивка «Любовь»",
        "description": "Объёмная вышивка с градиентом от розового к синему.",
        "category": "embroidery",
        "featured": True,
        "remove_bg": False,
        "rotate": 90,
        "crop": (0.11, 0.24, 0.02, 0.02),
    },
    {
        "file": "photo_2026-10-20_15-09-00 (2).jpg",
        "id": "kartina-redflags-prazdnik",
        "title": "«Гирлянда из редфлагов»",
        "description": "Авторская работа маркерами на холсте — ироничный праздничный сюжет.",
        "category": "painting",
        "medium": "marker",
        "featured": False,
        "remove_bg": False,
        "rotate": 0,
    },
    {
        "file": "photo_2026-10-20_15-09-01.jpg",
        "id": "futbolka-abyuzer",
        "title": "Футболка «Абьюзер»",
        "description": "Объёмные буквы с градиентом на голубой футболке.",
        "category": "wearable",
        "featured": True,
        "remove_bg": True,
        "rotate": -90,
        "crop": (0.11, 0.24, 0.02, 0.02),
    },
    {
        "file": "photo_2026-10-20_15-09-01 (2).jpg",
        "id": "tolstovka-marina-carica",
        "title": "Толстовка «Марина / Царица»",
        "description": "Роспись и граффити-надпись на розовой толстовке.",
        "category": "custom",
        "featured": False,
        "remove_bg": False,
        "rotate": 0,
    },
    {
        "file": "photo_2026-10-20_15-09-02.jpg",
        "id": "tolstovka-koty-future",
        "title": "«The future is hidden»",
        "description": "Роспись на мятной толстовке: коты, цветы и акценты.",
        "category": "wearable",
        "featured": True,
        "remove_bg": False,
        "rotate": 0,
    },
    {
        "file": "photo_2026-10-20_15-09-02 (2).jpg",
        "id": "futbolka-stitch-deadpool",
        "title": "Футболка Stitch × Deadpool",
        "description": "Роспись маркерами/акрилом на чёрной футболке.",
        "category": "wearable",
        "featured": False,
        "remove_bg": False,
        "rotate": 0,
    },
    {
        "file": "photo_2026-10-20_15-09-03.jpg",
        "id": "vyshivka-derevo-zhizn",
        "title": "«Вся жизнь как дерево до снега»",
        "description": "Вышивка на чёрной ткани — дерево и строки стихов.",
        "category": "embroidery",
        "featured": True,
        "remove_bg": False,
        "rotate": 0,
    },
    {
        "file": "photo_2026-10-20_15-09-05.jpg",
        "id": "kartina-vyzhivalschik",
        "title": "«Выживальщик»",
        "description": "Рисунок акрилом и маркерами — авторская иллюстрация на бумаге/холсте.",
        "category": "painting",
        "medium": "mixed",
        "featured": True,
        "remove_bg": False,
        "rotate": 90,
    },
    {
        "file": "photo_2026-10-20_15-09-06.jpg",
        "id": "vyshivka-stih-pro-pitie",
        "title": "Вышивка — авторский стих",
        "description": "Ручная вышивка текста на белой ткани.",
        "category": "embroidery",
        "featured": False,
        "remove_bg": False,
        "rotate": 0,
        "tilt": -6,
    },
    {
        "file": "photo_2026-10-23_13-35-12.jpg",
        "id": "futbolka-volki-neon",
        "title": "«Мои танцы» — неоновые волки",
        "description": "Роспись на чёрной ткани: волки и кислотные акценты.",
        "category": "custom",
        "featured": True,
        "remove_bg": False,
        "rotate": 0,
        "tilt": -8,
    },
]


def slug_ok(s: str) -> str:
    return re.sub(r"[^\w-]", "", s)


def rotate_on_card(img: Image.Image, degrees: float) -> Image.Image:
    if not degrees:
        return img
    if img.mode == "RGBA":
        rotated = img.rotate(
            degrees,
            expand=True,
            resample=Image.Resampling.BICUBIC,
            fillcolor=(0, 0, 0, 0),
        )
        canvas = Image.new("RGBA", rotated.size, (*CARD_FILL_RGB, 255))
        canvas.alpha_composite(rotated)
        return canvas.convert("RGB")
    return img.rotate(
        degrees,
        expand=True,
        resample=Image.Resampling.BICUBIC,
        fillcolor=CARD_FILL_RGB,
    )


def apply_crop(img: Image.Image, crop: tuple[float, float, float, float]) -> Image.Image:
    top, bottom, left, right = crop
    w, h = img.size
    return img.crop(
        (
            int(w * left),
            int(h * top),
            int(w * (1 - right)),
            int(h * (1 - bottom)),
        )
    )


def process_item(spec: dict) -> dict:
    path = SOURCE / spec["file"]
    if not path.is_file():
        raise FileNotFoundError(path)

    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    if spec.get("crop"):
        img = apply_crop(img, spec["crop"])

    rot = spec.get("rotate", 0)
    remove_bg = spec.get("remove_bg", False)
    tilt = spec.get("tilt", 0)

    # Сначала выравниваем (скриншоты), потом вырезаем фон, потом лёгкий наклон
    if rot:
        img = rotate_on_card(img.convert("RGB"), rot)

    if remove_bg:
        from rembg import remove

        buf = BytesIO()
        img.convert("RGB").save(buf, format="JPEG", quality=92)
        cut = Image.open(BytesIO(remove(buf.getvalue()))).convert("RGBA")
        img = cut

    if tilt:
        img = rotate_on_card(img, tilt)

    work_id = slug_ok(spec["id"])
    WORKS_DIR.mkdir(parents=True, exist_ok=True)

    if remove_bg or img.mode == "RGBA":
        if img.mode != "RGBA":
            img = img.convert("RGBA")
        out_name = f"{work_id}.png"
        out_path = WORKS_DIR / out_name
        img.save(out_path, format="PNG", optimize=True)
    else:
        out_name = f"{work_id}.jpg"
        out_path = WORKS_DIR / out_name
        img.convert("RGB").save(out_path, format="JPEG", quality=90, optimize=True)

    entry = {
        "id": work_id,
        "title": spec["title"],
        "description": spec["description"],
        "category": spec["category"],
        "price": None,
        "featured": spec.get("featured", False),
        "image": f"/works/{out_name}",
        "available": True,
    }
    if spec.get("medium"):
        entry["medium"] = spec["medium"]

    print(f"  OK {spec['file']} -> {out_name}")
    return entry


def main() -> None:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    site = catalog.get("site")
    entries: list[dict] = []
    for i, spec in enumerate(WORKS, 1):
        print(f"[{i}/{len(WORKS)}] {spec['file']}")
        entries.append(process_item(spec))

    catalog["works"] = entries
    if site:
        catalog["site"] = site
    CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nГотово: {len(entries)} работ в catalog.json")


if __name__ == "__main__":
    main()
