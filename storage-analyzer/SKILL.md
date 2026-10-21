---
name: storage-analyzer
description: >
  Scan disk usage, find the largest files/folders, find duplicates, and
  clean up temp/cache files on Windows. Use when the user says disk is
  almost full, wants to find what's eating space, or wants to clean
  temp/cache/old logs. PowerShell-based; requires the exec/PowerShell
  tool to be available.
---

# Storage Analyzer

## When to use

- Disk almost full
- Find the largest files/folders
- Clean up temporary files
- Find duplicate files

## Prerequisites

Requires PowerShell (Windows) and the ability to run shell commands. If
running on macOS/Linux, use the equivalent (`df -h`, `du -sh */ | sort -h`,
`fdupes`/`rmlint`) instead of the PowerShell commands below — the workflow
is the same, only the commands differ.

## Safety

- **Never delete without listing first and getting explicit confirmation**
  on which specific files/folders to remove.
- **Never recursive-delete from a drive root** (`C:\`, `/`) or any path the
  user hasn't explicitly scoped.
- **Never touch** `C:\Windows`, `C:\Windows\System32`, `C:\Program Files`,
  `C:\Program Files (x86)`, or platform-equivalent system directories.
- When deleting duplicates, always keep at least one copy — show the user
  which copy would be kept before removing the others.

## Process

1. **Check free space:**
   ```powershell
   Get-PSDrive -PSProvider FileSystem
   ```
2. **Largest files:**
   ```powershell
   Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue |
     Sort-Object Length -Descending | Select-Object -First 50 FullName, Length
   ```
3. **Largest folders:** sum file sizes per top-level folder, sort descending.
4. **Duplicates:** group by `Length` first (cheap), then hash only files
   within size-matched groups (`Get-FileHash`), then flag groups with
   count > 1.
5. **Cleanup candidates:** temp folders, browser/app caches, old logs —
   list these with sizes and last-modified dates, don't delete yet.

## Output contract

Present findings as a table before taking any destructive action:

| Path | Size | Type | Action proposed |
|------|------|------|------------------|
| ... | ... | duplicate / temp / old log | delete / keep |

Then ask which rows to act on. Only delete the rows the user confirms.
End with a one-line summary: space freed, files removed.

## Don't

- Don't delete files without confirmation.
- Don't recursive-delete from a drive root.
- Don't touch system directories (System32, Program Files, or platform
  equivalents).

## Integration

- exec tool — runs the PowerShell (or shell) commands
- MEMORY.md — log what was cleaned up, when, and how much space it freed
