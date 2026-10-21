---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code.
---
# Test-Driven Development

Red → Green → Refactor. Write test first, always.

## The Cycle
1. **Red** - Write failing test for one specific behavior
2. **Green** - Write minimal code to make test pass
3. **Refactor** - Clean up while keeping tests green
4. **Repeat** - Next behavior

## Hard Rules
- **NEVER** write implementation before test
- **ONE** behavior per test
- **MINIMAL** code to pass (no gold-plating)
- **RUN** test after each step (verify red, then green)

## Test Structure
```
def test_specific_behavior():
    # Arrange: Set up test data
    input_data = setup()
    
    # Act: Call function under test
    result = function(input_data)
    
    # Assert: Verify expected outcome
    assert result == expected
```

## Benefits
- Catches bugs before they exist
- Documents expected behavior
- Forces good design (testable = well-designed)
- Refactor with confidence

## Red Flags (Don't Do This)
- "I'll write tests after implementation"
- "This is too simple to need a test"
- "Let me just try this first..."
- Writing multiple behaviors in one test

## When Writing Tests
**Start with happy path** - Normal case first
**Then edge cases** - Empty input, null, max values
**Then error cases** - Invalid input, exceptions
**One assertion per test** - Clear failure messages

## Integration with Plans
Plans should specify:
- Exact test to write (with code)
- Command to run test
- Expected failure message
- Minimal implementation to pass
- Verification command

Follow plan's TDD steps exactly. Don't skip ahead to implementation.
