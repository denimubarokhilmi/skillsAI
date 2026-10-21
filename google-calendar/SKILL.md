---
name: google-calendar
description: Google Calendar API. Butuh OAuth setup sekali.
---

# Google Calendar

## When to Use
- Cek jadwal hari ini
- Daily briefing
- Tambah event deadline
- Cek 7 hari ke depan

## Process
1. Setup: console.cloud.google.com → enable Calendar API
2. List hari ini: GET /calendars/primary/events?timeMin=today&timeMax=today
3. List 7 hari: GET /calendars/primary/events?timeMin=today&timeMax=+7days
4. Create: POST /calendars/primary/events dengan body json

## Don't Do
- Jangan pake API key buat write — butuh OAuth
- Kalo token expire, minta Habib re-auth

## Integration
- Cron daily briefing — auto cek jadwal
- MEMORY.md — jadwal kuliah tersimpan
