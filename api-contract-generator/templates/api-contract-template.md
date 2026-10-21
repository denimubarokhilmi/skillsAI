# API Contract — [Nama Project]
_Generated: [tanggal]_

## Table of Contents
- [Resource: Auth](#auth)
- [Resource: Users](#users)
<!-- tambahkan resource lain sesuai controller yang ditemukan -->

---

## Auth

### POST /api/login

| Field | Detail |
|---|---|
| Method | POST |
| URL | /api/login |
| Auth | Public (tidak perlu login) |
| Path Params | - |
| Query Params | - |
| Request Body | email: string, required, email format; password: string, required, min:8 |
| Success Response | 200 OK — { token: string, user: object } |
| Error Response | 422 Unprocessable Entity — { errors: { field: [message] } } |
| Validation Rules | email: required, email; password: required, min:8 |

---

## Users

### GET /api/users/{id}

| Field | Detail |
|---|---|
| Method | GET |
| URL | /api/users/{id} |
| Auth | Bearer Token |
| Path Params | id: integer, required |
| Query Params | - |
| Request Body | - |
| Success Response | 200 OK — { id, name, email, created_at } |
| Error Response | 404 Not Found — { message: "User not found" } |
| Validation Rules | - |

<!-- ulangi pola di atas untuk tiap endpoint -->

---

<!-- MANUAL -->
<!-- Bagian di bawah ini tidak akan ditimpa saat regenerate. Tambahkan catatan manual di sini. -->
<!-- END MANUAL -->
