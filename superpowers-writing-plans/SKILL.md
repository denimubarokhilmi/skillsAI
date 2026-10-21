---
name: writing-plans
description: Use when you have spec/requirements for multi-step task, before touching code.
---
# Writing Plans

Write comprehensive implementation plans with bite-sized tasks. Assume skilled developer with zero codebase context.

**Announce:** "I'm using the writing-plans skill to create the implementation plan."

**Save to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

## File Structure First
Before defining tasks, map which files will be created/modified and what each is responsible for. Clear boundaries, focused files, one responsibility each.

## Bite-Sized Granularity
Each step = one action (2-5 min): Write test → Run to verify fail → Write minimal impl → Run to verify pass → Commit

## Plan Header (REQUIRED)
```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** [One sentence]
**Architecture:** [2-3 sentences]
**Tech Stack:** [Key tech/libs]
---
```

## Task Structure
````markdown
### Task N: [Component Name]
**Files:**
- Create: `exact/path/file.py`
- Modify: `exact/path/existing.py:123-145`
- Test: `tests/exact/path/test.py`

- [ ] Step 1: Write the failing test
```python
[actual test code]
```
- [ ] Step 2: Run test to verify fail
Run: `[exact command]`
Expected: FAIL with "[exact message]"

- [ ] Step 3: Write minimal implementation
```python
[actual impl code]
```
- [ ] Step 4: Run test to verify pass
Run: `[exact command]`
Expected: PASS

- [ ] Step 5: Commit
```bash
git add [files]
git commit -m "[message]"
```
````

## NO PLACEHOLDERS
Never write: "TBD", "TODO", "implement later", "add appropriate error handling", "similar to Task N", "write tests for the above", or steps without code blocks.
Every step must have actual content engineer needs.

## Self-Review
1. **Spec coverage:** Each spec requirement has a task?
2. **Placeholder scan:** Any red flags from above?
3. **Type consistency:** Names/signatures match across tasks?

Fix inline. No re-review.

## Execution Handoff
Offer choice: "Plan complete. Two options: 1) Subagent-Driven (recommended) or 2) Inline Execution. Which?"
If Subagent-Driven → use `superpowers:subagent-driven-development`
If Inline → use `superpowers:executing-plans`
