# Next.js Detection Rules — api-contract-generator

Next.js punya dua sistem routing API yang beda total — cek dulu mana yang dipakai project sebelum mulai ekstraksi.

## 0. Deteksi Versi Routing
- Ada folder `app/api/**/route.ts` (atau `.js`) → **App Router** (Next.js 13+).
- Ada folder `pages/api/**/*.ts` → **Pages Router** (lama, masih banyak dipakai).
- Project bisa punya keduanya sekaligus — proses dua-duanya.

## 1. App Router (`app/api/**/route.ts`)

### Menemukan Endpoint
- Path folder = URL. `app/api/users/[id]/route.ts` → `GET/POST/... /api/users/{id}`.
- `[id]` di nama folder → **Path Param**. `[...slug]` → catch-all.
- Method HTTP ditentukan oleh nama function export: `export async function GET(...)`, `POST(...)`, dst.

### Request Body
```ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createUserSchema.parse(body); // Zod
}
```
- **Prioritas 1 — Zod schema**: cari `.parse()` / `.safeParse()` dengan `z.object({...})`. Baca field, tipe, `.optional()`.
- **Prioritas 2 — Yup/Joi**: pattern serupa.
- **Prioritas 3 — manual**: `const { email } = await request.json()` + `if (!email)`.

### Query Params
```ts
const { searchParams } = new URL(request.url);
const page = searchParams.get('page');
```
→ Semua `searchParams.get('x')` adalah query param.

### Response
Cari `return NextResponse.json(data, { status: ... })` atau `Response.json(...)`. 2xx Success, 4xx/5xx Error.

### Auth
- Cek `middleware.ts` → kalau matcher cover path ini → Session/Bearer.
- Cek handler: `getServerSession(...)` → Session. `request.headers.get('authorization')` → Bearer.
- Tidak ada → Public.

## 2. Pages Router (`pages/api/**/*.ts`)

### Menemukan Endpoint
- Path file = URL. `pages/api/users/[id].ts` → `/api/users/{id}`.
- Semua method dalam satu default export, dibedakan lewat `req.method`:
```ts
if (req.method === 'POST') { ... }
```

### Request Body & Response
- Body: `req.body` — cari validasi schema atau manual.
- Response: `res.status(xxx).json(data)`.

### Query Params
`req.query.page` — semua query param.

### Auth
Cek helper `await requireAuth(req)` atau `getServerSession`.

## 3. Skip Condition
- Route buat image/asset serving.
- File re-export atau proxy tanpa logic — tandai verifikasi manual.
