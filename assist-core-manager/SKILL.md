---
name: assist-core-manager
description: Sync durable learnings from completed conversations to the assist-core Obsidian vault and GitHub repo. Use after tasks with reusable decisions, workflows, fixes, or project memory.
---

# Assist-Core Manager

## Vault Access
- Vault/repo: `workspace/assist-core/`
- Symlink target: `C:\Users\LEGION\Obsidian\assist-core\`
- GitHub: `Haafzd/assist-core`

## When to Sync
- Reusable lesson learned from a completed task.
- Durable project decision or convention.
- New workflow, checklist, or troubleshooting note.
- Significant personal/project memory update.

## Workflow
1. Identify durable learning; skip transient chat noise.
2. Write daily log: `logs/YYYY-MM-DD.md`.
3. If reusable, create or update `lessons/[topic].md`.
4. Update `MEMORY.md` only for significant persistent context.
5. Run `git status` and review diff.
6. Commit with clear message and push only after content is checked.

## Don't Store
- Secrets, tokens, passwords, cookies, private keys.
- One-off temporary errors without reusable value.
- Sensitive personal data unless explicitly approved.

## Naming
- Use `snake_case` filenames.
- Keep notes atomic and link related lessons.
