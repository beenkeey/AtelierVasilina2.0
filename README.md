# VoiceOfSilencE — визитка для GitHub Pages

Одностраничный сайт: витрина картин (на рамах), одежды с росписью/вышивкой, заказ через **Telegram**.

## Как это устроено

| Было (сервер) | Стало (под Instagram / GitHub Pages) |
|---------------|--------------------------------------|
| FastAPI + админка | Статический сайт, каталог в JSON |
| Форма заказа на сайте | Кнопка → Telegram с готовым текстом |
| rembg на сервере | Скрипт `tools/prepare_work.py` на твоём ПК |

Подробнее про Telegram: [docs/TELEGRAM.md](docs/TELEGRAM.md)

## Локально

```powershell
cd frontend
copy .env.local.example .env.local
# пропиши NEXT_PUBLIC_TELEGRAM=username_без_@
npm install
npm run dev
```

## Добавить работу

1. Сфотографируй (для одежды — однотонный фон).
2. На ПК (нужен `.venv` с `rembg`, как в `backend/requirements.txt`):

```powershell
.\.venv\Scripts\python tools\prepare_work.py путь\к\фото.jpg --title "Название" --category painting --medium pastel --price 4500 --featured
```

Категории: `painting`, `wearable`, `embroidery`, `custom`.  
Для картин — `--medium acrylic|pastel|marker|ink|pencil|mixed`.

3. Проверь `frontend/public/catalog.json` и `frontend/public/works/`.
4. Закоммить и push → GitHub Pages обновится.

## GitHub Pages

1. Репозиторий на GitHub → **Settings → Pages → Build and deployment → GitHub Actions**.
2. В **Settings → Secrets and variables → Actions → Variables** добавь `TELEGRAM_USERNAME` (опционально, для CI).
3. Push в `main` — workflow `.github/workflows/pages.yml` соберёт сайт.

URL: `https://<user>.github.io/<repo>/`

## Папки

- `frontend/` — сайт (Next.js static export)
- `tools/prepare_work.py` — подготовка фото и каталога
- `backend/` — старый API (не нужен для Pages; можно использовать только зависимости для rembg)
- `docs/TELEGRAM.md` — бот vs простые ссылки
