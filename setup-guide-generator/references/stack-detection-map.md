# Stack Detection Map — setup-guide-generator

Mapping file manifest yang ditemukan → stack → command standar. Baca bagian yang relevan sesuai file yang ditemukan di project.

## Laravel (PHP)
**Penanda**: `composer.json` dengan dependency `laravel/framework`

| Kebutuhan | Sumber Deteksi | Command |
|---|---|---|
| Versi PHP | `composer.json` → `require.php` (mis. `"^8.2"`) | - |
| Install | `composer.json` ada | `composer install` |
| Env | `.env.example` → `.env` | `cp .env.example .env` lalu `php artisan key:generate` |
| Migrate | selalu | `php artisan migrate` |
| Seed | `database/seeders/` isinya >1 file atau `DatabaseSeeder.php` tidak kosong | `php artisan db:seed` |
| Dev server | selalu | `php artisan serve` |
| Frontend asset (kalau pakai Vite/Mix) | ada `vite.config.js` atau `webpack.mix.js` | `npm run dev` (paralel dengan artisan serve) |
| Build | ada `vite.config.js` | `npm run build` |
| Test | `phpunit.xml` ada | `php artisan test` |

## Django (Python)
**Penanda**: file `manage.py` di root

| Kebutuhan | Sumber Deteksi | Command |
|---|---|---|
| Versi Python | `pyproject.toml` → `requires-python`, atau `runtime.txt`, atau `.python-version` | - |
| Install | `requirements.txt` atau `pyproject.toml` | `pip install -r requirements.txt` atau `poetry install` |
| Env | `.env.example` → `.env` (kalau pakai django-environ) | `cp .env.example .env` |
| Migrate | selalu | `python manage.py migrate` |
| Seed | ada custom management command `seed` atau fixture di `fixtures/` | `python manage.py loaddata <fixture>` atau `python manage.py seed` |
| Dev server | selalu | `python manage.py runserver` |
| Test | selalu | `python manage.py test` atau `pytest` kalau ada `pytest.ini` |

## Node.js / Express / generic JS backend
**Penanda**: `package.json` di root tanpa Laravel/Django, ada `express` atau framework serupa di dependencies

| Kebutuhan | Sumber Deteksi | Command |
|---|---|---|
| Versi Node | `.nvmrc`, atau `package.json` → `engines.node` | - |
| Package manager | lockfile (lihat bawah) | - |
| Install | selalu | `npm install` / `yarn` / `pnpm install` sesuai lockfile |
| Env | `.env.example` → `.env` | `cp .env.example .env` |
| Dev server | script `dev` di `package.json` | `npm run dev` |
| Build | script `build` di `package.json` | `npm run build` |
| Test | script `test` di `package.json` | `npm run test` |

## React / Vue / frontend-only (dalam monorepo)
**Penanda**: `package.json` dengan `react`/`vue` di dependencies, terpisah dari backend

Sama seperti Node.js di atas, tapi biasanya juga punya:
- `VITE_API_URL` atau sejenisnya di `.env` → arahkan ke URL backend
- Command dev biasanya `npm run dev` dengan Vite/CRA, port default beda dari backend (catat kalau ada konflik port potensial)

## Package Manager Detection (semua stack Node)
| Lockfile ditemukan | Package Manager | Install Command |
|---|---|---|
| `package-lock.json` | npm | `npm install` |
| `yarn.lock` | yarn | `yarn install` |
| `pnpm-lock.yaml` | pnpm | `pnpm install` |
| Tidak ada lockfile sama sekali | tidak pasti | tandai `[package manager tidak terdeteksi dari lockfile, default ke npm]` |

## Docker Detection (semua stack)
Kalau ada `docker-compose.yml` di root (atau di tiap service untuk monorepo):
- Baca `services:` di file itu untuk tahu service apa saja (app, db, redis, dll) dan port yang di-expose.
- Command utama: `docker compose up -d`
- Jangan hapus instruksi manual install — tetap tulis sebagai "Alternatif: Manual Install" di bawah Docker section.

## Monorepo Detection
Kalau root project TIDAK punya manifest langsung, tapi ada subfolder dengan manifest masing-masing (mis. `backend/composer.json` + `frontend/package.json`):
- Treat sebagai monorepo.
- Generate section terpisah per service di SETUP.md, masing-masing dengan Prerequisites/Install/Env/Run sendiri.
- Kalau ada `docker-compose.yml` di root yang orchestrate kedua service, itu jadi Quick Start utama; manual per-service tetap ditulis sebagai alternatif.
