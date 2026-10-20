from pathlib import Path

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from config import UPLOAD_DIR, settings
from database import Base, engine, get_db
from image_utils import save_work_image
from models import Order, Work
from schemas import OrderCreate, OrderOut, WorkCreate, WorkOut, WorkUpdate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vasilina Atelier API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def work_to_out(work: Work) -> WorkOut:
    return WorkOut(
        id=work.id,
        title=work.title,
        description=work.description,
        category=work.category,
        price=work.price,
        image_url=f"/api/images/{work.image_path}",
        featured=work.featured,
        sort_order=work.sort_order,
        created_at=work.created_at,
    )


def verify_admin(password: str | None) -> None:
    if not password or password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Неверный пароль администратора")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/works", response_model=list[WorkOut])
def list_works(category: str | None = None, featured_only: bool = False, db: Session = Depends(get_db)):
    q = db.query(Work).order_by(Work.sort_order.desc(), Work.created_at.desc())
    if category:
        q = q.filter(Work.category == category)
    if featured_only:
        q = q.filter(Work.featured.is_(True))
    return [work_to_out(w) for w in q.all()]


@app.get("/api/works/{work_id}", response_model=WorkOut)
def get_work(work_id: int, db: Session = Depends(get_db)):
    work = db.get(Work, work_id)
    if not work:
        raise HTTPException(status_code=404, detail="Работа не найдена")
    return work_to_out(work)


@app.get("/api/images/{filename}")
def get_image(filename: str):
    path = UPLOAD_DIR / Path(filename).name
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Изображение не найдено")
    return FileResponse(path, media_type="image/png")


@app.post("/api/orders", response_model=OrderOut)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    if payload.work_id is not None and not db.get(Work, payload.work_id):
        raise HTTPException(status_code=400, detail="Указанная работа не существует")
    order = Order(
        customer_name=payload.customer_name.strip(),
        contact=payload.contact.strip(),
        message=payload.message.strip(),
        work_id=payload.work_id,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@app.get("/api/admin/orders", response_model=list[OrderOut])
def admin_list_orders(admin_password: str, db: Session = Depends(get_db)):
    verify_admin(admin_password)
    return db.query(Order).order_by(Order.created_at.desc()).all()


@app.post("/api/admin/works", response_model=WorkOut)
async def admin_create_work(
    admin_password: str = Form(...),
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form("custom"),
    price: float | None = Form(None),
    featured: bool = Form(False),
    sort_order: int = Form(0),
    remove_background: bool = Form(True),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    verify_admin(admin_password)
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Нужен файл изображения")

    raw = await image.read()
    if len(raw) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Файл больше 15 МБ")

    filename = save_work_image(raw, remove_background=remove_background)
    work = Work(
        title=title.strip(),
        description=description.strip(),
        category=category.strip(),
        price=price,
        image_path=filename,
        featured=featured,
        sort_order=sort_order,
    )
    db.add(work)
    db.commit()
    db.refresh(work)
    return work_to_out(work)


@app.patch("/api/admin/works/{work_id}", response_model=WorkOut)
def admin_update_work(
    work_id: int,
    payload: WorkUpdate,
    admin_password: str,
    db: Session = Depends(get_db),
):
    verify_admin(admin_password)
    work = db.get(Work, work_id)
    if not work:
        raise HTTPException(status_code=404, detail="Работа не найдена")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(work, key, value)
    db.commit()
    db.refresh(work)
    return work_to_out(work)


@app.delete("/api/admin/works/{work_id}")
def admin_delete_work(work_id: int, admin_password: str, db: Session = Depends(get_db)):
    verify_admin(admin_password)
    work = db.get(Work, work_id)
    if not work:
        raise HTTPException(status_code=404, detail="Работа не найдена")
    image_file = UPLOAD_DIR / work.image_path
    db.delete(work)
    db.commit()
    if image_file.is_file():
        image_file.unlink(missing_ok=True)
    return {"ok": True}
