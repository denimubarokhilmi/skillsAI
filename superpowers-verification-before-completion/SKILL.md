---
name: verification-before-completion
description: Use when about to claim work is complete/fixed/passing. Evidence before assertions always.
---
# Verification Before Completion

Run verification commands and confirm output BEFORE claiming success. Never claim "done" without proof.

## Hard Rule
**NEVER** say "tests pass", "build succeeds", "issue fixed", or "ready to merge" without showing actual command output proving it.

## Checklist
- [ ] Run all relevant tests - show output
- [ ] Run build/compile - show output
- [ ] Verify specific behavior manually if needed
- [ ] Check no regressions in related areas
- [ ] Confirm all acceptance criteria met

## Process
1. Identify verification commands needed
2. Run each command
3. Capture and show output
4. Interpret results (pass/fail)
5. ONLY THEN claim complete

## Red Flags (never do this)
- "Tests should pass now"
- "This should fix it"
- "The build will work"
- "Looks good to me"

Evidence first, claims second. Always.
