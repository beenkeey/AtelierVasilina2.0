from datetime import datetime

from pydantic import BaseModel, Field


class WorkCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    category: str = "custom"
    price: float | None = None
    featured: bool = False
    sort_order: int = 0


class WorkUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    price: float | None = None
    featured: bool | None = None
    sort_order: int | None = None


class WorkOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    price: float | None
    image_url: str
    featured: bool
    sort_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=1, max_length=200)
    contact: str = Field(min_length=3, max_length=300)
    message: str = Field(min_length=1, max_length=5000)
    work_id: int | None = None


class OrderOut(BaseModel):
    id: int
    customer_name: str
    contact: str
    message: str
    work_id: int | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
