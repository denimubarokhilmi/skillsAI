---
name: ponytail-audit
description: >
  Whole-repo audit for over-engineering. Like ponytail-review, but scans the
  entire codebase instead of a diff: a ranked list of what to delete, simplify,
  or replace with stdlib/native equivalents. Use when the user says "audit this
  codebase", "audit for over-engineering", "what can I delete from this repo",
  "find bloat", "ponytail-audit", or "/ponytail-audit". One-shot report, does
  not apply fixes.
---

ponytail-review, repo-wide. Scan the whole tree instead of a diff. Rank
findings biggest cut first.

## Trigger

The user wants a repo-wide bloat/complexity report, not a review of a
specific diff (that's ponytail-review) and not a correctness/security pass.
If they haven't pointed at a repo or directory, ask which one before starting.

## Workflow

1. Walk the repo tree (skip generated dirs: `node_modules`, `dist`,
   `build`, vendored/lock files, `.git`).
2. Hunt for the patterns below across the whole codebase, not line-by-line
   diff reasoning — look for repeated bloat patterns across files, not just
   isolated instances.
3. Emit one finding per line, ranked biggest cut first.
4. Close with the `net:` line. Nothing to cut → say so and stop.

## Tags

Same as ponytail-review:

- `delete:` dead code, unused flexibility, speculative feature. Replacement: nothing.
- `stdlib:` hand-rolled thing the standard library ships. Name the function.
- `native:` dependency or code doing what the platform already does. Name the feature.
- `yagni:` abstraction with one implementation, config nobody sets, layer with one caller.
- `shrink:` same logic, fewer lines. Show the shorter form.

## Hunt

Deps the stdlib or platform already ships, single-implementation interfaces,
factories with one product, wrappers that only delegate, files exporting one
thing, dead flags and config, hand-rolled stdlib.

## Output

One line per finding, ranked: `<tag> <what to cut>. <replacement>. [path]`.
End with `net: -<N> lines, -<M> deps possible.` Nothing to cut: `Lean already. Ship.`

## Boundaries

Complexity only, correctness bugs, security holes, and performance go to a
normal review pass. Lists findings, applies nothing. One-shot.
"stop ponytail-audit" or "normal mode" to revert.
