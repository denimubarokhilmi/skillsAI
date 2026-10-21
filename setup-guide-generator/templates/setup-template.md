# Setup Guide — [Nama Project]
_Generated: [tanggal]_

## Prerequisites
- PHP ^8.2 (dari composer.json)
- Composer 2.x
- Node.js 20.x (dari .nvmrc)
- MySQL 8.0
- Package manager: npm (terdeteksi dari package-lock.json)

<!-- Jika docker-compose.yml ditemukan, tampilkan section ini SEBELUM manual install -->
## Quick Start (Docker)
```
docker compose up -d
```
Akses di http://localhost:8000

---

## Clone & Install (Manual)

<!-- Jika monorepo, pecah jadi ### Backend dan ### Frontend seperti contoh berikut -->
### Backend
```
git clone [repo-url]
cd backend
composer install
```

### Frontend
```
cd frontend
npm install
```

## Environment
```
cp .env.example .env
php artisan key:generate
```

Field yang WAJIB diisi manual (tidak ada default value di .env.example):
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `API_KEY`

## Database
```
php artisan migrate
php artisan db:seed
```
⚠ Kredensial default dari seeder (jika ada) HANYA untuk development — jangan dipakai di production.

## Run
- Dev: `php artisan serve` + `npm run dev` (jalankan di dua terminal terpisah)
- Build: `npm run build`

## Testing
- Backend: `php artisan test`
- Frontend: `npm run test`

## Struktur Folder (depth 1)
- `app/` — business logic (models, controllers, services)
- `routes/` — definisi route API & web
- `resources/` — views & frontend assets
- `database/` — migrations & seeders
- `tests/` — automated tests

## Cek Status
- Buka http://localhost:8000
- Login default (jika ada seeder dev): `admin@example.com` / `password` — dev only, jangan dipakai di production

## Dokumentasi Terkait
- Lihat `output/api-contract.md` untuk detail endpoint API (jika tersedia)
