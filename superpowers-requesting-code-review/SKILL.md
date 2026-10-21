---
name: requesting-code-review
description: >
  Request a code review before merging, after a major feature, or after
  a complex/risky change. Use when a significant chunk of work just
  finished — a feature, a subagent task, a tricky bug fix — and before
  moving on or opening a PR. Produces a structured review request and
  a structured verdict, not an open-ended "does this look ok?".
---

# Requesting Code Review

Ask for a code review after completing significant work, using a
consistent request format so the reviewer (a subagent, a teammate, or a
human) gets exactly the context needed to evaluate it — not your full
session history, just the work product and what it was supposed to do.

**Core principle:** Review early, review often. Small, frequent reviews
catch issues before they compound; a single review at the very end does not.

## Trigger

**Always request review:**
- After completing a major feature or task in a multi-step plan
- Before merging to main / opening a PR
- After a complex or risky implementation (concurrency, auth, data migration)

**Worth requesting:**
- When stuck (a fresh read often reveals the actual blocker)
- Before a refactor (get a baseline read first)
- After fixing a gnarly bug (confirm the fix addresses the cause, not the symptom)

## Workflow

**1. Scope the diff.** Identify exactly what changed:
```bash
BASE_SHA=$(git rev-parse HEAD~1)   # or the relevant base, e.g. origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Compose the review request.** Fill in every field below — don't skip
one because it "seems obvious"; the reviewer has none of your context:

```
## Review Request
DESCRIPTION: <one paragraph: what you built and why>
REQUIREMENTS: <what it was supposed to do — the plan/spec/ticket it maps to>
BASE_SHA / HEAD_SHA (or file list, if not in a git repo)
FILES CHANGED: <list>
KEY DECISIONS: <trade-offs made and why>
TESTS ADDED: <what's covered, what isn't>
BREAKING CHANGES: <any, or "none">
KNOWN LIMITATIONS: <anything you know is incomplete or risky>
AREAS NEEDING ATTENTION: <specific things you want scrutinized>
```

**3. Dispatch it.** If subagents are available (e.g. a `Task` tool with a
general-purpose type), dispatch a code-reviewer subagent with this request
so the review happens with fresh eyes and none of your session's framing.
If subagents aren't available, present the same structured request to the
user or reviewer directly and ask for the verdict in the output contract below.

**4. Act on the verdict** — see Output contract.

## Output contract

The reviewer's response should come back structured, not free-form:

```
## Review Verdict
STRENGTHS: <what's solid>
CRITICAL: <must-fix before proceeding — list or "none">
IMPORTANT: <should-fix before merging — list or "none">
MINOR: <can defer — list or "none">
ASSESSMENT: Ready to proceed / Needs fixes / Needs discussion
```

Act on it in this order:
- Fix Critical issues immediately, before anything else.
- Fix Important issues before proceeding to the next task.
- Log Minor issues for later; don't let them block progress.
- If you believe a flagged issue is wrong, push back with concrete
  reasoning (code, tests, or a spec citation) — don't just defer or
  just override silently.

## Example

```
[Just completed Task 2: Add verification function]

## Review Request
DESCRIPTION: Added verifyIndex() and repairIndex() with 4 issue types
REQUIREMENTS: Task 2 from docs/plans/deployment-plan.md
BASE_SHA: a7981ec / HEAD_SHA: 3df7661
FILES CHANGED: index.ts, index.test.ts
KEY DECISIONS: repair runs in a dry-run mode by default
TESTS ADDED: 4 issue types, dry-run vs apply
BREAKING CHANGES: none
KNOWN LIMITATIONS: no progress indicator for large indexes
AREAS NEEDING ATTENTION: repairIndex() error handling

## Review Verdict
STRENGTHS: Clean architecture, real tests
CRITICAL: none
IMPORTANT: Missing progress indicator for large indexes
MINOR: Magic number (100) for reporting interval
ASSESSMENT: Ready to proceed after the progress indicator is added
```

## Red flags — never do these

- Skip review because "it's simple"
- Ignore a Critical finding
- Proceed with an unfixed Important finding
- Dismiss valid technical feedback without a counter-argument

## Integration with workflows

- **Subagent-driven development:** review after each task, fix before the next.
- **Executing a plan:** review at each natural checkpoint, not just at the end.
- **Ad-hoc development:** review before merge, and any time you're stuck.
