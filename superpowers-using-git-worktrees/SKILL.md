---
name: using-git-worktrees
description: Use when starting feature work needing isolation or before executing implementation plans.
---
# Using Git Worktrees

Ensure isolated workspace exists via native tools or git worktree fallback.

## Purpose
Isolate feature work from current workspace without losing uncommitted changes or context.

## Process
1. Check if isolated workspace already exists
2. If yes: verify it's clean and ready
3. If no: create one (prefer native platform tools, fallback to git worktree)

## Git Worktree Commands
```bash
# Create new worktree
git worktree add ../feature-name -b feature-name

# List worktrees
git worktree list

# Remove worktree (after work complete)
git worktree remove ../feature-name
```

## When to Use
- Before executing implementation plan (isolate changes)
- Starting feature work (don't contaminate main workspace)
- Parallel work on multiple branches
- Need clean slate without losing current work

## Integration
Used by `superpowers:subagent-driven-development` and `superpowers:executing-plans` to ensure isolated workspace.
