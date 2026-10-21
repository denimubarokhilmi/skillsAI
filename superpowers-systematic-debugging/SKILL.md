---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior before proposing fixes.
---
# Systematic Debugging

Root cause first, fix second. No guessing.

## Hard Rule
**NEVER** propose a fix until you understand root cause. "Try this" without diagnosis = wrong.

## Process
1. **Reproduce** - Confirm bug exists, document exact steps
2. **Isolate** - Narrow down to smallest failing case
3. **Hypothesize** - Form theory about root cause
4. **Test hypothesis** - Add logging, breakpoints, minimal test
5. **Confirm root cause** - Prove your theory correct
6. **Fix** - Now and only now, implement fix
7. **Verify** - Confirm fix works, no regressions

## Techniques
**Binary search:**
- Comment out half the code
- Does bug still happen?
- Repeat until you find the line

**Add instrumentation:**
- Log inputs/outputs at each step
- Find where expectation diverges from reality

**Minimal reproduction:**
- Strip away everything not related to bug
- Reduces noise, focuses on problem

**Git bisect:**
- Find commit that introduced bug
- Narrows search space dramatically

## Red Flags (Don't Do This)
- "Let's try changing X and see if it helps"
- "Maybe if we add a timeout..."
- "This might fix it"
- "Probably a race condition" (without proof)

## When Stuck
- Take a break
- Explain bug to rubber duck
- Check assumptions (are they actually true?)
- Read docs for library/API being used
- Search for similar issues

Root cause → Fix → Verify. Always this order.
