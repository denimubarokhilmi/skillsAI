---
name: setup-guide-generator
description: Generate a SETUP.md onboarding guide from project source code, so a new developer can run the project in 5 minutes. Detects stack, exact tool versions, package manager, Docker availability, required env vars, database setup, and monorepo structure (separate backend/frontend). Use this whenever the user asks for a setup guide, onboarding doc, "cara install project ini", or "README buat developer baru".
---

# Setup Guide Generator

Membaca source code project (bisa monorepo) dan menghasilkan `output/SETUP.md` yang bisa langsung diikuti developer baru.

## Kapan pakai skill ini
- User minta panduan setup/instalasi project.
- User minta "onboarding doc" atau "README buat developer baru".
- User kasih path project (satu folder, atau monorepo dengan subfolder backend/frontend).

## Alur Kerja

### 1. Deteksi Struktur Project
Cek apakah ini single-stack atau monorepo:
- Kalau ada `backend/` (atau nama serupa) berisi `composer.json`/`manage.py`/dll DAN folder terpisah `frontend/` berisi `package.json` → **monorepo**, generate section per service.
- Kalau cuma satu manifest di root → single-stack.

Baca `references/stack-detection-map.md` untuk mapping lengkap file manifest → stack → command. Wajib dibaca sebelum mulai menyusun Prerequisites/Install/Run, jangan menebak command dari ingatan umum.

### 2. Deteksi Docker
Cek `docker-compose.yml` atau `Dockerfile` di root (atau di tiap service kalau monorepo). Kalau ada:
- Docker jadi jalur **utama** (Quick Start).
- Manual install tetap ditulis sebagai alternatif di bawahnya, jangan dihapus — sebagian dev tidak pakai Docker.

### 3. Deteksi Versi Tool Exact
Jangan cuma bilang "butuh PHP" atau "butuh Node" — ambil versi spesifik dari:
- `composer.json` → `require.php`
- `package.json` → `engines.node`, atau baca `.nvmrc` kalau ada
- `pyproject.toml` → `[tool.poetry.dependencies].python` atau `requires-python`
- `requirements.txt` tidak selalu ada info versi Python — cek `runtime.txt` atau `.python-version` sebagai fallback

### 4. Deteksi Package Manager
Cek lockfile untuk menentukan command install yang benar:
- `package-lock.json` → npm
- `yarn.lock` → yarn
- `pnpm-lock.yaml` → pnpm
- `composer.lock` → composer (PHP, selalu pakai ini kalau ada composer.json)

### 5. Environment Variables
- Baca `.env.example`. Field dengan value kosong (`KEY=`) → tandai **wajib diisi manual**. Field dengan value terisi → tandai sebagai default/optional.
- Kalau `.env.example` tidak ada: scan source code untuk `env(...)` (Laravel), `os.getenv(...)`/`os.environ[...]` (Python), `process.env.X` (Node), kumpulkan sebagai daftar env var yang dipakai, tandai `[terdeteksi dari kode, verifikasi manual — .env.example tidak ditemukan]`.

### 6. Database Setup
- Laravel: `php artisan migrate`, seeder kalau ada `database/seeders/` isinya lebih dari `DatabaseSeeder.php` kosong → `php artisan db:seed`.
- Django: `python manage.py migrate`.
- **Kredensial default dari seeder**: kalau ditemukan (misal `User::create(['email' => 'admin@example.com', 'password' => ...])` di seeder), WAJIB cantumkan warning: "Kredensial default ini HANYA untuk development, jangan dipakai di production."

### 7. Testing Command
Deteksi dari struktur project:
- Ada `phpunit.xml` atau folder `tests/` di Laravel → `php artisan test` atau `./vendor/bin/phpunit`
- Ada `pytest.ini`/`pyproject.toml` dengan pytest config → `pytest`
- Ada script `"test"` di `package.json` → `npm run test` (atau yarn/pnpm sesuai deteksi step 4)

### 8. Struktur Folder
List folder depth 1 dari root project, kasih penjelasan singkat 1 baris per folder inti (skip folder seperti `vendor/`, `node_modules/`, `.git/`).

### 9. Susun Output
Pakai `templates/setup-template.md` sebagai kerangka. Kalau monorepo, duplikasi section Install/Env/Run per service dengan heading terpisah (`### Backend`, `### Frontend`).

Di bagian akhir, kalau `output/api-contract.md` ada di project yang sama, tambahkan link cross-reference ke file itu.

### 10. Idempotency
Overwrite penuh tiap run — SETUP.md derivative murni dari source code terkini, bukan dokumen yang biasa di-edit manual berkelanjutan. Kalau user memang sudah edit manual sebelumnya dan minta preserve, konfirmasi dulu sebelum overwrite.

## Referensi
- `references/stack-detection-map.md` — mapping manifest file → stack → command per framework
- `templates/setup-template.md` — kerangka format output
