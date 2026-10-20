# Atelier Vasilina

Сайт-портfolio и заказов для ручной росписи, вышивки и кастома одежды.

## Возможности

- Красивая главная с анимациями (Framer Motion), галерея работ, форма заказа
- Админка `/admin`: загрузка фото → **автоматическое удаление фона** (rembg) → PNG на сайте
- API на FastAPI, SQLite, хранение заявок

## Быстрый старт

### 1. Backend

```powershell
cd backend
copy .env.example .env
..\.venv\Scripts\pip install -r requirements.txt
..\.venv\Scripts\uvicorn main:app --reload --port 8000
```

Пароль админки по умолчанию: `vasilina` (меняется в `backend/.env` → `ADMIN_PASSWORD`).

При первой загрузке с удалением фона rembg скачает модель (~170 МБ).

### 2. Frontend

```powershell
cd frontend
npm install framer-motion
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000). Админка: [http://localhost:3000/admin](http://localhost:3000/admin).

## Структура

- `backend/` — API, обработка изображений, база
- `frontend/` — Next.js 15, Tailwind 4

## Советы по фото

- Снимай вещь на однотонном фоне (белый/серый) — rembg работает точнее
- Если фон сложный, сними галочку «Убрать фон» и обработай вручную в PNG
