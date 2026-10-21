---
name: dispatching-parallel-agents
description: Use when facing 2+ independent tasks without shared state/dependencies.
---
# Dispatching Parallel Agents

Delegate independent problems to specialized agents with isolated context. One agent per problem domain.

## When to Use
**Use when:**
- 3+ test files failing with different root causes
- Multiple subsystems broken independently
- Each problem understood without context from others
- No shared state between investigations

**Don't use when:**
- Failures are related (fix one might fix others)
- Need full system state understanding
- Agents would interfere with each other

## Pattern
1. **Identify domains** - Group by what's broken
2. **Create focused tasks** - Specific scope, clear goal, constraints, expected output
3. **Dispatch parallel** - All run concurrently
4. **Review & integrate** - Read summaries, verify no conflicts, run full suite

## Agent Prompt Must Include
- Specific scope (one test file / subsystem)
- Clear goal (make these tests pass)
- Constraints (don't change other code)
- Expected output (summary of findings + fixes)

## Verification After
1. Review each agent summary
2. Check for conflicts between agent changes
3. Run full test suite
4. Spot check (agents can make systematic errors)
