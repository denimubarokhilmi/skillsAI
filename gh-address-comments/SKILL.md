---
name: gh-address-comments
description: >
  Address review and issue comments on the open GitHub PR for the current
  branch, using the gh CLI. Use when the user says "address the PR
  comments", "handle the review feedback", "respond to the comments on
  my PR", "gh-address-comments", or similar. Requires gh CLI installed
  and authenticated, and the current branch to have an open PR.
metadata:
  short-description: Address comments in a GitHub PR review
---

# PR Comment Handler

Find the open PR for the current branch and work through its comments with
the user, one confirmed batch at a time. Never push code changes or reply
to comments without the user picking which ones to act on first.

## Prerequisites

- `gh` CLI installed and on PATH.
- `gh auth status` succeeds. If not, tell the user to run `gh auth login`
  and stop — do not attempt to escalate permissions or bypass sandboxing
  to force auth through. If `gh auth status` fails inside a sandboxed
  environment for reasons other than missing auth, report the failure to
  the user rather than retrying with elevated privileges.
- Current branch has an associated open PR (`gh pr view` succeeds).

## 1) Inspect comments needing attention

Run `scripts/fetch_comments.py`. It prints all conversation comments,
review submissions, and inline review threads for the PR as JSON.

## 2) Summarize and number them

For each unresolved thread/comment, show:
- A number
- File + line (for inline threads)
- One-line summary of the request
- One-line estimate of what a fix would involve

Skip threads already marked `isResolved: true` unless the user asks to see
everything.

## 3) Ask which to address

Ask the user which numbered items to act on. Accept ranges, "all", or "none".

## 4) Apply fixes for selected items only

For each selected item:
- Make the code change addressing that specific comment.
- Note which comment number the change addresses.

Do not touch code tied to comments the user didn't select.

## Output contract

End with a short summary table:

| # | Comment | Status |
|---|---------|--------|
| 1 | <one-line summary> | Fixed / Skipped / Needs discussion |

Then remind the user to review the diff and push/reply themselves — this
skill edits local files, it does not push commits or post replies to
GitHub on its own.

## Notes

- If `gh` hits an auth or rate-limit error mid-run, tell the user to run
  `gh auth login` (or wait for the rate limit) and retry — don't attempt
  to work around it with elevated permissions.
