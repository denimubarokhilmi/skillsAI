---
name: markitdown
description: Convert files to markdown — Word, Excel, PDF, HTML.
---

# Markitdown

## When to Use
- Extract konten dari Word (.docx)
- Convert Excel ke markdown table
- Convert PDF ke markdown
- Extract artikel HTML

## Process
1. Word: pandoc file.docx -o file.md -t gfm (kalo pandoc ada)
2. HTML: curl <url> | html2markdown
3. PDF: pake pdf skill → extract → format ke md
4. Excel: baca csv → format ke markdown table

## Don't Do
- Format bisa lossy — verify hasilnya
- Jangan convert file sensitif tanpa izin

## Integration
- pdf — PDF extraction
- document-extract plugin
- academic-document-assistant — hasil convert buat draft
