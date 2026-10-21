---
name: executing-plans
description: Execute written implementation plan in separate session with review checkpoints.
---
# Executing Plans

Load plan, review critically, execute all tasks, report when complete.

**Announce:** "I'm using the executing-plans skill to implement this plan."

**Note:** Superpowers works much better with subagents. If available, use `superpowers:subagent-driven-development` instead.

## Process

### Step 1: Load & Review Plan
1. Read plan file
2. Review critically - identify questions/concerns
3. If concerns: Raise with user before starting
4. If no concerns: Create TodoWrite and proceed

### Step 2: Execute Tasks
For each task:
1. Mark as `in_progress`
2. Follow each step exactly (bite-sized steps from plan)
3. Run verifications as specified
4. Mark as `completed`

### Step 3: Complete Development
After all tasks verified:
- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED:** Use `superpowers:finishing-a-development-branch`

## When to STOP
**Stop immediately when:**
- Hit blocker (missing dep, test fails, unclear instruction)
- Plan has critical gaps
- Don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## Integration
**Required skills:**
- `superpowers:using-git-worktrees` - Ensures isolated workspace
- `superpowers:writing-plans` - Creates the plan
- `superpowers:finishing-a-development-branch` - Completes dev after tasks

**Never start implementation on main/master without explicit user consent.**
