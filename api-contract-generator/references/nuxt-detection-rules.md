# Vue / Nuxt Detection Rules — api-contract-generator

**Catatan**: Vue murni (Vite/Vue CLI) adalah frontend — tidak punya API endpoint. Kalau project cuma Vue tanpa Nuxt, arahkan ke reference backend (Laravel/Django/Node).

Berlaku untuk **Nuxt.js** (punya server-side API routes di folder `server/`).

## 1. Menemukan Endpoint
- Path file di `server/api/` = URL. `server/api/users/[id].ts` → `/api/users/{id}`.
- Suffix file menentukan method:
  - `users.get.ts` → GET, `users.post.ts` → POST
  - `users/[id].put.ts` → PUT, `users/[id].delete.ts` → DELETE
  - `users.ts` (tanpa suffix) → handle semua method, cek `getMethod(event)`.

## 2. Path & Query Params
- Path param: `[id].ts` → ambil dari `getRouterParam(event, 'id')`.
- Query param: `getQuery(event)`.

## 3. Request Body
```ts
const body = await readBody(event);
const result = createUserSchema.safeParse(body); // Zod
```
- Prioritas 1 — Zod/Yup schema.
- Prioritas 2 — manual: `const { email } = await readBody(event)` + validasi manual.

## 4. Response
- Return value dari `defineEventHandler` = response body (implicit 200).
- Error: `throw createError({ statusCode: 404, ... })`.
- `setResponseStatus(event, 201)` → explicit status.

## 5. Auth
- Middleware `server/middleware/` → Session Cookie.
- `getHeader(event, 'authorization')` → Bearer Token.
- `requireUserSession(event)` (nuxt-auth) → Session.

## 6. Skip Condition
- File yang return HTML/render — skip.
- File proxy — dokumentasikan dengan catatan `[proxy ke URL]`.
