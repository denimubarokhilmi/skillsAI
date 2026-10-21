---
name: lms-helper
description: Monitor and manage LMS Tel-U courses, check assignments, deadlines, and academic schedule. Use when Habib asks about kuliah, tugas, jadwal, deadline, or LMS Tel-U.
---

# LMS Helper

## Context
- Habib adalah mahasiswa Telkom University.
- LMS URL: https://lms.telkomuniversity.ac.id/auth/oidc/
- Account email: haafzd@student.telkomuniversity.ac.id

## Requirements
- Use browser automation when LMS data is needed.
- Reuse existing logged-in browser session when available.
- If login is required, ask Habib to complete login manually. Never ask for or store password/OTP.

## Workflow
1. Open LMS dashboard.
2. Scan active courses, announcements, assignments, quizzes, and calendar.
3. Prioritize deadlines within 3 days, then within 7 days.
4. Capture: course, task title, due date/time, submission status, and link.
5. Report concise action list.

## Output Format
Course: [course]
Task: [title]
Due: [date/time]
Status: [not started/submitted/unknown]
Next: [action]
Link: [URL]

## Don't Do
- Jangan submit tugas tanpa instruksi eksplisit.
- Jangan ubah profil, password, atau course settings.
- Jangan simpan kredensial.
