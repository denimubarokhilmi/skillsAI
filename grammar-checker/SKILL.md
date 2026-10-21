---
name: grammar-checker
description: Grammar & spelling checker via LanguageTool API.
---

# Grammar Checker

## When to Use
- Review tugas tata tulis ilmiah
- Cek grammar Bahasa Indonesia
- Cek spelling English paper
- Polish draft sebelum submit

## Process
1. Extract teks dari file
2. POST ke LanguageTool: curl -X POST https://api.languagetool.org/v2/check -d 'language=id' -d 'text=...'
3. Parse matches: message, replacements, offset
4. Tampilkan koreksi ke Habib
5. Apply fix kalo disetujui

## Don't Do
- LanguageTool API rate limited — split teks panjang
- API cek grammar, bukan semantik — jangan andelin buat konten

## Integration
- academic-document-assistant — workflow dokumen akademik
- writing-skills — format penulisan
