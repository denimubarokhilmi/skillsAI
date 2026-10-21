---
name: database-client
description: Query databases — SQLite and PostgreSQL. Use for schema checks, debugging queries, backups, restores, and migrations.
---

# Database Client

## When to Use
- Cek schema database
- Query data untuk debugging
- Backup atau restore database
- Migrasi database
- Setup PostgreSQL buat project

## Process
1. SQLite connect: `sqlite3 file.db`
2. SQLite tables: `.tables`
3. SQLite schema: `.schema table_name`
4. PostgreSQL install: `winget install PostgreSQL.PostgreSQL`
5. PostgreSQL connect: `psql -h localhost -U postgres -d dbname`
6. PostgreSQL tables: `\dt`
7. PostgreSQL describe: `\d+ table`
8. Query sample: `SELECT * FROM table LIMIT 10;`
9. SQLite export: `.mode csv` then `.output file.csv`
10. PostgreSQL backup: `pg_dump -U postgres db > backup.sql`
11. PostgreSQL restore: `psql -U postgres db < backup.sql`

## Don't Do
- Jangan drop table atau database tanpa backup
- Jangan query tanpa `LIMIT` kalo tabel gede
- Jangan simpan credential di query atau query string
- Test migration di staging dulu

## Integration
- `docker-manager` — bisa run PostgreSQL di container
- `state_5.sqlite`, `goals_1.sqlite` di codex-home/
