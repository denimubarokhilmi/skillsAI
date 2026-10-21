---
name: receiving-code-review
description: Use when receiving code review feedback. Requires technical rigor, not performative agreement.
---
# Receiving Code Review

Act on code review feedback with technical rigor. Verify suggestions before implementing. Push back on technically questionable feedback.

## Core Principle
**Technical rigor over performative agreement.** Don't blindly implement suggestions. Verify they're correct.

## Process
1. **Read feedback carefully** - Understand what reviewer wants and why
2. **Verify technically** - Is the suggestion correct? Will it work?
3. **Classify feedback:**
   - **Valid & clear** → Implement
   - **Valid but unclear** → Ask clarifying questions
   - **Technically questionable** → Push back with reasoning
   - **Wrong** → Explain why, propose alternative

## When to Push Back
- Suggestion would break existing behavior
- Suggestion conflicts with spec/requirements
- Suggestion introduces bugs/edge cases
- Suggestion violates project patterns
- Performance/security implications not considered

## How to Push Back
Be respectful but direct:
- "I see the concern, but [technical reason why current approach is better]"
- "This suggestion would cause [specific problem]. Alternative: [your proposal]"
- "Can you clarify [specific aspect]? I'm concerned about [specific edge case]"

## Implementation
After addressing all feedback:
1. Make approved changes
2. Run full verification (tests, build)
3. Respond to reviewer with summary of changes made
4. Note any feedback you pushed back on and why

Never say "I'll implement all suggestions" without verification. Technical correctness > pleasing reviewer.
