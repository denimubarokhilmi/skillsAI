---
name: subagent-driven-development
description: Execute implementation plans with independent tasks using fresh subagent per task + two-stage review.
---
# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with spec compliance review then code quality review after each.

**Core:** Fresh subagent per task + two-stage review (spec → quality) = high quality, fast iteration

**Continuous execution:** Execute all plan tasks without stopping. Only stop for: blocker you cannot resolve, ambiguity preventing progress, or all tasks complete. No "should I continue?" prompts.

## When to Use
- Have implementation plan
- Tasks mostly independent
- Stay in this session (vs `superpowers:executing-plans`, which is for a parallel/separate session instead)

## Process Per Task
1. **Dispatch implementer** with full task text + context (using the Implementer Prompt below).
2. **Implementer asks questions?** Answer them before proceeding.
3. **Implementer implements** - writes code, tests, commits, self-reviews.
4. **Check implementer status** (see below) before moving on.
5. **Dispatch spec reviewer** (using the Spec Reviewer Prompt below) - confirms code matches spec.
6. **Spec issues?** Implementer fixes → reviewer re-reviews → repeat until approved.
7. **Dispatch code quality reviewer** (using the Quality Reviewer Prompt below) - checks implementation quality.
8. **Quality issues?** Implementer fixes → reviewer re-reviews → repeat until approved.
9. **Mark task complete** in TodoWrite.

## Setup
Before starting:
1. Read plan file ONCE.
2. Extract ALL tasks with full text + context.
3. Create TodoWrite with all tasks.
4. Execute tasks sequentially without pausing.

## Handling Implementer Status

Implementer subagents should report one of four statuses. Handle each
before moving to review — don't treat every return as "done":

- **DONE:** Proceed to spec compliance review.
- **DONE_WITH_CONCERNS:** Work is complete but the implementer flagged
  doubts. Read the concerns first. If they're about correctness or scope,
  resolve them before review. If they're just observations, note them
  and proceed to review.
- **NEEDS_CONTEXT:** The implementer is missing information it needs.
  Provide it and re-dispatch — don't guess on its behalf.
- **BLOCKED:** The implementer cannot complete the task. Diagnose why:
  missing context → provide it and retry; task needs more reasoning →
  retry with a more capable model; task too large → split it; plan itself
  is wrong → escalate to the human. Never force a retry with nothing changed.

## Subagent Prompts (Inline)

### 1. Implementer Prompt
```markdown
You are an Implementer subagent. Your goal is to complete this specific task:
[INSERT TASK TEXT HERE]

Context:
[INSERT RELEVANT CODE/PLAN CONTEXT HERE]

Instructions:
- Write clean, working code matching the specifications.
- Avoid introducing speculative features or unrelated changes.
- Add minimal, runnable assert checks or test cases to verify correctness.
- Run tests and fix any compilation or execution errors.
- Report your status as one of: DONE, DONE_WITH_CONCERNS (+ concerns),
  NEEDS_CONTEXT (+ what's missing), or BLOCKED (+ why).
```

### 2. Spec Compliance Reviewer Prompt
```markdown
You are a Spec Compliance Reviewer subagent. Review the implementation of this task:
[INSERT TASK TEXT]

Compare the code changes against the task requirements.
- Does the code fulfill all requirements in the task description?
- Are there missing inputs, incorrect edge cases, or broken logic?
- Respond with "APPROVED" or a clear list of missing/incorrect items.
```

### 3. Code Quality Reviewer Prompt
```markdown
You are a Code Quality Reviewer subagent. Review the implementation of this task:
[INSERT TASK TEXT]

Check:
- Clean code principles, styling consistency, and layout correctness.
- Avoidance of unneeded dependencies or speculative abstractions (YAGNI).
- Proper error handling and input validation.
- Respond with "APPROVED" or a clear list of code quality issues.
```

## Red Flags (Never Do)
- Start implementation on main/master without user consent
- Skip reviews (spec OR quality)
- Proceed with unfixed issues
- Dispatch multiple implementers in parallel (conflicts)
- Make subagent read plan file (provide full text)
- Ignore subagent questions
- Treat BLOCKED/NEEDS_CONTEXT as DONE and move on anyway
- **Start quality review before spec compliance ✅** (wrong order)
- Move to next task while reviews have open issues

## After All Tasks
Dispatch final code reviewer for entire implementation, then use `superpowers:finishing-a-development-branch`.

## Integration
Requires: `superpowers:using-git-worktrees`, `superpowers:writing-plans`, `superpowers:requesting-code-review`, `superpowers:finishing-a-development-branch`
