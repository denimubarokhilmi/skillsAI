---
name: rich-messages
description: Telegram rich formatting guide — buttons, markdown, polls.
---

# Rich Messages

## When to Use
- Kirim pesan dengan tombol interaktif
- Buat poll
- Format kode biar rapi
- Split pesan panjang

## Process
1. **bold**, *italic*, code, ~~strikethrough~~, ||spoiler||
2. Inline button: {"inline_keyboard":[[{"text":"OK","callback_data":"ok"}]]}
3. URL button: {"text":"Link","url":"https://..."}
4. Poll: {"type":"poll","question":"...","options":["A","B"]}
5. Split pesan > 4000 chars jadi beberapa pesan

## Don't Do
- Jangan kirim wall of text
- 1 pesan = 1 topik
- Jangan spam reaction

## Integration
- Telegram channel — semua output lewat sini
- imsg, slack — format berbeda tiap platform
