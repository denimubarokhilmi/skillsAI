---
name: writing-skills
description: Use when creating new skills, editing existing skills, or verifying skills work before deployment.
---
# Writing Skills

Create or modify skill files following superpowers conventions.

## Skill File Structure
```markdown
---
name: skill-name
description: When to use this skill (one line)
---
# Skill Title

Brief overview (1-2 sentences).

## When to Use
- Bullet list of scenarios
- When skill applies

## Process/Checklist
1. Step by step instructions
2. Keep concise
3. Actionable items

## Red Flags / Don't Do
- Common mistakes
- Anti-patterns to avoid

## Integration (if applicable)
Required/related skills this works with.
```

## Naming Convention
- Lowercase with hyphens: `my-new-skill`
- Descriptive: name tells what it does
- Folder: `skills/my-new-skill/SKILL.md`

## Content Guidelines
**Be concise** - Remove unnecessary prose, keep actionable content
**Be specific** - Exact commands, file paths, examples
**Be complete** - All info needed to use skill successfully
**No placeholders** - No TBD, TODO, "add details later"

## Front Matter (required)
```yaml
---
name: skill-name
description: Brief description (triggers/when to use)
---
```

## Testing Before Deployment
1. Read skill as if seeing it first time
2. Check: Can someone follow this without questions?
3. Check: Any ambiguity or missing steps?
4. Check: Examples clear and correct?
5. Deploy to skills folder
6. Test by invoking in actual session

## Editing Existing Skills
1. Read current version completely
2. Identify what needs change
3. Make surgical edits (don't rewrite entire file)
4. Verify change doesn't break existing functionality
5. Test in actual session

Keep skills focused. One skill = one workflow. Don't combine unrelated processes.
