---
name: finishing-a-development-branch
description: Use when implementation complete, tests pass, need to decide integration approach.
---
# Finishing a Development Branch

Present structured options for integrating completed work: merge, PR, or cleanup.

## When to Use
- Implementation complete
- All tests pass
- Ready to integrate work

## Process
1. **Verify complete:**
   - All tasks done
   - Tests pass
   - No TODOs/placeholders
   - Documentation updated

2. **Present options:**

**Option A: Direct Merge**
- Merge branch to main/master
- Push immediately
- Best for: Small changes, solo projects, trusted environment

**Option B: Pull Request**
- Create PR with description
- Request review
- Best for: Team projects, need review, CI/CD checks

**Option C: Cleanup & Archive**
- Commit final state
- Archive branch
- Don't merge yet
- Best for: Exploratory work, spike, not ready for production

3. **User chooses** - Execute chosen option

## After Integration
- Delete worktree (if used)
- Clean up temporary files
- Update documentation if needed

Never assume which option user wants. Present all three, let them choose.
