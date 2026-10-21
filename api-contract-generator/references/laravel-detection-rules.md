# Laravel Detection Rules — api-contract-generator

Panduan pattern untuk ekstraksi detail endpoint dari source code Laravel. Baca bagian yang relevan sesuai kebutuhan ekstraksi saat itu.

## 1. Path Params
Ambil langsung dari definisi route, bukan dari controller.
- Pattern: `Route::get('/users/{id}', ...)`, `Route::put('/posts/{post}/comments/{comment}', ...)`
- Ekstrak semua `{nama}` sebagai path param. Kalau ada `{id?}` (optional), tandai optional.

## 2. Query Params
Cari di body method controller:
- `$request->query('page')`
- `$request->get('filter')`
- `$request->input('sort')` — hati-hati, `input()` bisa juga baca dari body pada POST/PUT. Kalau method GET, treat sebagai query param. Kalau POST/PUT dan bukan bagian dari `rules()`, treat sebagai optional query param dan tandai `[terdeteksi otomatis, verifikasi manual]`.

## 3. Request Body — Prioritas Deteksi

**Prioritas 1: Form Request / DTO via type hint**
```php
public function store(StoreUserRequest $request)
```
→ Buka file `StoreUserRequest` (biasanya di `app/Http/Requests/`), baca method `rules()`:
```php
public function rules(): array
{
    return [
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8|confirmed',
    ];
}
```
→ Terjemahkan tiap rule jadi wireframe: `email: string, required, unique` / `password: string, required, min:8`.

**Prioritas 2: Inline validate (fallback kalau tidak ada Form Request)**
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
    ]);
}
```
→ Ekstrak array rules langsung dari sini dengan cara yang sama.

**Prioritas 3: Tidak ada validasi ditemukan**
→ Tandai Request Body sebagai `[tidak terdeteksi validasi eksplisit — cek manual]`, jangan mengarang field.

## 4. Response — Success & Error
Baca SEMUA statement `return response()->json(...)` dalam method (bisa lebih dari satu):
```php
return response()->json(['data' => $user], 201);
return response()->json(['error' => 'Not found'], 404);
```
- Kelompokkan berdasarkan status code: 2xx → Success Response, 4xx/5xx → Error Response.
- Kalau ada dalam blok `try { ... } catch (...) { ... }`, return di dalam `catch` otomatis masuk Error Response meski status code tidak eksplisit disebut (asumsikan 500 kalau tidak ada, tandai `[asumsi]`).
- Kalau return pakai Resource class (`return new UserResource($user)`), tandai `[response via Resource class: UserResource — struktur exact perlu dicek langsung ke file Resource]` daripada menebak field-nya.

## 5. Status Code Inference
- Eksplisit di argumen kedua `response()->json($data, 201)` → pakai apa adanya.
- Tidak eksplisit:
  - GET → asumsi `200`
  - POST (create) → asumsi `201`
  - PUT/PATCH → asumsi `200`
  - DELETE → asumsi `200` atau `204` (cek apakah ada body di response; kalau kosong → `204`)
  - Semua asumsi ini WAJIB ditandai `[asumsi]` di output.

## 6. Auth Detection
Baca middleware di level route atau constructor controller:
- `auth:sanctum` atau `auth:api` → **Bearer Token**
- `auth:web` atau `auth` tanpa guard eksplisit dan route ada di `routes/web.php` → **Session Cookie**
- Tidak ada middleware auth sama sekali → **Public**
- `can:...` atau policy middleware tambahan → catat sebagai note tambahan setelah auth type, mis. "Bearer Token + permission: edit-posts"

## 7. Skip Condition
Method controller yang:
- `return view(...)`
- `return redirect(...)`
- Tidak ada `return` yang menghasilkan JSON

→ SKIP, jangan masukkan ke `api-contract.md`. Ini biasanya controller untuk halaman web biasa, bukan API.
