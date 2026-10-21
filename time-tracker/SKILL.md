---
name: time-tracker
description: File-based time tracking. Catat mulai/selesai task.
---

# Time Tracker

## When to Use
- Tracking waktu belajar
- Report produktivitas harian
- Weekly review
- Identifikasi time sink

## Process
1. Mulai task: create entry at workspace/memory/time/YYYY-MM-DD.json
2. Selesai: update entry with end time
3. Report hari ini: baca file → total jam per tag
4. Report mingguan: aggregate 7 file → total per tag → insight

Format entry:
{"date":"YYYY-MM-DD","tasks":[{"start":"09:00","end":"10:30","task":"...","tag":"kuliah"}]}

## Don't Do
- Jangan lupa stop timer — kalo lupa, tanya Habib
- Tag konsisten biar report akurat

## Integration
- project-tracker — project status
- assist-core-manager — daily log ke vault
- Cron midnight — daily summary
