#!/usr/bin/env python3
import argparse
import re
import json
import subprocess
import sys
from pathlib import Path

STYLE_RULES = [
    ("industrial-brutalist-ui", r"security|terminal|developer|devtool|infra|ops|data-heavy|blueprint|military|audit|log|monitoring"),
    ("minimalist-ui", r"docs|knowledge|calm|clean|editorial|admin|public|regulated|health|finance|trust|minimal"),
    ("high-end-visual-design", r"premium|luxury|agency|launch|consumer|marketing|conversion|brand|saas|startup"),
]

PROJECT_RULES = [
    ("B2B SaaS", r"saas|b2b|enterprise|sales|crm|workflow|automation"),
    ("devtool", r"developer|api|sdk|cli|devtool|infra|terminal"),
    ("dashboard/admin", r"dashboard|admin|analytics|report|table|filter|metric"),
    ("consumer app", r"consumer|mobile|social|marketplace|booking|ecommerce|commerce"),
    ("public/regulated service", r"government|public|health|medical|finance|bank|insurance|legal|compliance"),
    ("portfolio/marketing site", r"portfolio|landing|marketing|campaign|launch|website"),
]

AUDIENCE_KEYWORDS = ("pengguna", "user", "wisatawan", "visitor", "pengunjung", "customer", "client", "member")


def pick(rules, text, default):
    for name, pattern in rules:
        if re.search(pattern, text, re.I):
            return name
    return default


def bullets(text, heading):
    match = re.search(rf"(?is)^#+\s*{re.escape(heading)}\b(.*?)(?=^#+\s|\Z)", text, re.M)
    if not match:
        return []
    return [line.strip("- *\t") for line in match.group(1).splitlines() if line.strip().startswith(("-", "*"))][:8]


def compact(text):
    return re.sub(r"\s+", " ", text).strip()


def load_js_prd(js_path):
    # Evaluate the prd-data.js CommonJS module via a Node subprocess and return it as JSON.
    resolved = str(Path(js_path).resolve())
    posix_path = resolved.replace(chr(92), "/")
    node_code = "const data = require(" + json.dumps(posix_path) + "); console.log(JSON.stringify(data));"
    try:
        res = subprocess.run(["node", "-e", node_code], capture_output=True, text=True, check=True)
        return json.loads(res.stdout)
    except Exception as e:
        print(f"Error executing Node.js evaluator: {e}", file=sys.stderr)
        return None


def pick_audience(stakeholders):
    if not stakeholders:
        return "target users"
    for sh in stakeholders:
        low = sh.lower()
        if any(k in low for k in AUDIENCE_KEYWORDS):
            return sh
    return stakeholders[-1]


def extract_design_tokens(design_system):
    """Pull style direction + concrete tokens straight from prd-data.js `designSystem`,
    instead of guessing style from keyword regex. This is the field prd_mapping.md
    previously ignored entirely."""
    if not design_system:
        return None
    tokens = {
        "styleDirection": design_system.get("styleDirection", "").strip(),
        "typography": design_system.get("typography", []) or [],
        "colorPalette": design_system.get("colorPalette", []) or [],
        "cssTokens": design_system.get("cssTokens", []) or [],
    }
    return tokens


def extract_frontend_constraints(fc):
    if not fc:
        return []
    lines = []
    if fc.get("stylingApproach"):
        lines.append(f"Styling approach: {fc['stylingApproach']}")
    for p in fc.get("prohibitions", []) or []:
        lines.append(f"Prohibited: {p}")
    for t in fc.get("tokenRules", []) or []:
        lines.append(f"Token rule: {t}")
    return lines


def extract_features(business_requirements, feature_specs, scope):
    """functionalRequirements[] does not exist in prd-data.js. Real keys are
    `businessRequirements[]` (BR-xx, human-readable) and `featureSpecs[]` (FR-xx,
    implementation detail incl. uiStates). Prefer businessRequirements for the
    Key Screens/Features list; featureSpecs feeds State Rules separately."""
    features = []
    for br in business_requirements or []:
        name = br.get("name")
        if name:
            features.append(f"{br.get('id', '')} {name}".strip())
    if not features:
        for fs in feature_specs or []:
            name = fs.get("name")
            if name:
                features.append(f"{fs.get('id', '')} {name}".strip())
    if not features and scope:
        features.append(scope)
    return features


def extract_state_rules(feature_specs):
    """featureSpecs[].uiStates is exactly the loading/empty/error/disabled/success
    detail the 'State Rules' section of DESIGN.md promises. prd_mapping.md and the
    old script never read this field."""
    rules = []
    for fs in feature_specs or []:
        ui_states = fs.get("uiStates")
        if not ui_states:
            continue
        label = f"{fs.get('id', '')} {fs.get('name', '')}".strip()
        for state_name in ("loading", "empty", "error", "disabled", "success"):
            val = ui_states.get(state_name)
            if val:
                rules.append(f"{label} — {state_name}: {val}")
    return rules


def extract_component_mapping(file_map):
    """fileMap[] (feature/route/controller/service/model/schema/component/test) is the
    real traceability data. There is no top-level `routes[]` or `traceabilityMatrix[]`
    key in prd-data.js — the old script's `data.get('routes')` check always missed."""
    mapping = []
    for entry in file_map or []:
        feature = entry.get("feature", "")
        route = entry.get("route", "")
        component = entry.get("component", "")
        controller = entry.get("controller", "")
        parts = [p for p in (route, controller, component) if p and p != "-"]
        mapping.append(f"{feature}: " + " -> ".join(parts))
    return mapping


def extract_constraints(dependencies, risks, out_of_scope, assumptions, frontend_lines):
    constraints = list(frontend_lines)
    for dep in dependencies or []:
        if isinstance(dep, dict) and dep.get("dependency"):
            constraints.append(f"Dependency: {dep.get('dependency')} (Deadline: {dep.get('deadline', 'N/A')})")
    for risk in risks or []:
        if isinstance(risk, dict) and risk.get("risk"):
            constraints.append(f"Risk mitigation: {risk.get('mitigation', '')}")
    for oos in out_of_scope or []:
        constraints.append(f"Out of scope: {oos}")
    for a in assumptions or []:
        if isinstance(a, dict) and a.get("assumption"):
            constraints.append(f"Assumption: {a.get('assumption')}")
    return constraints


def generate_from_js(data):
    meta = data.get("meta", {})
    overview = data.get("overview", {})
    title = meta.get("title", "Product")
    project = meta.get("project", "product interface")

    design_system = data.get("designSystem")
    frontend_constraints = data.get("frontendConstraints")
    tech_stack = data.get("techStack", {})

    tokens = extract_design_tokens(design_system)
    if tokens and tokens["styleDirection"]:
        # Existing design system wins over keyword-guessed style (see BASE_DESIGN.md
        # Direction Ladder #1: "Existing product design system").
        style = "project design system (see tokens)"
    else:
        all_text = json.dumps(data)
        style = pick(STYLE_RULES, all_text, "high-end-visual-design")

    audience = pick_audience(overview.get("stakeholders"))
    goals = overview.get("objectives", []) or []
    features = extract_features(data.get("businessRequirements"), data.get("featureSpecs"), overview.get("scope"))
    frontend_lines = extract_frontend_constraints(frontend_constraints)
    constraints = extract_constraints(
        data.get("dependencies"), data.get("risks"), overview.get("outOfScope"),
        data.get("assumptions"), frontend_lines
    )
    component_mapping = extract_component_mapping(data.get("fileMap"))
    state_rules = extract_state_rules(data.get("featureSpecs"))
    stack_summary = ", ".join(
        (tech_stack.get("backend", []) + tech_stack.get("frontend", []))[:4]
    ) or "project-native stack"

    if not goals:
        goals = ["make primary workflow obvious", "build trust quickly", "reduce cognitive load"]
    if not features:
        features = ["primary navigation", "main content area", "empty/loading/error states", "responsive layout"]
    if not constraints:
        constraints = ["preserve existing stack and design tokens", "avoid AI-slop visual defaults", "respect accessibility basics"]

    return generate_markdown_template(
        title, project, audience, style, goals, features, constraints,
        tokens=tokens, component_mapping=component_mapping, state_rules=state_rules,
        stack_summary=stack_summary,
    )


def generate_markdown_template(title, project, audience, style, goals, features, constraints,
                                tokens=None, component_mapping=None, state_rules=None, stack_summary=None):
    stack_summary = stack_summary or "project-native stack/design system"

    tokens_section = ""
    if tokens and (tokens["colorPalette"] or tokens["typography"] or tokens["cssTokens"]):
        lines = []
        if tokens["styleDirection"]:
            lines.append(f"Style direction: {tokens['styleDirection']}")
        for c in tokens["colorPalette"]:
            lines.append(f"- Color `{c.get('name')}` `{c.get('hex')}` — {c.get('usage')}")
        for t in tokens["typography"]:
            lines.append(f"- Type `{t.get('name')}` {t.get('fontFamily')} {t.get('size')} — {t.get('usage')}")
        for tok in tokens["cssTokens"]:
            lines.append(f"- Token `{tok.get('token')}: {tok.get('value')}` — {tok.get('usage')}")
        tokens_section = "\n## Primary Style (from existing designSystem)\n\n" + "\n".join(lines) + "\n"

    mapping_section = ""
    if component_mapping:
        mapping_section = "\n## Component / Page Mapping\n\n" + "\n".join(f"- {m}" for m in component_mapping) + "\n"

    state_section = ""
    if state_rules:
        state_section = "\n## State Rules (empty/loading/error/disabled/success)\n\n" + "\n".join(f"- {s}" for s in state_rules) + "\n"

    return f"""# DESIGN.md

Generated from PRD data by `impeccable-design-taste/scripts/generate-design-md.py`.

## Design Read

`Design read: {project} ({title}) for {audience}, primary style {style}, using {stack_summary}, avoiding generic AI template patterns.`

## Product Goals

{chr(10).join(f"- {g}" for g in goals)}

## Target Audience

- {audience}

## Key Screens / Features

{chr(10).join(f"- {f}" for f in features)}

## UX Risks & Constraints

{chr(10).join(f"- {c}" for c in constraints)}
{tokens_section}
## Skill Routing

- Use `impeccable` for UX structure, accessibility, hierarchy, states, responsive behavior, and polish.
- Use `ui-ux-pro-max` for palette, font pairing, style families, charts, and pattern selection (only if no existing `designSystem` tokens override this).
- Use `frontend-design` when result feels generic or too template-like.
- Use existing project design system tokens as primary visual direction when present; otherwise `{style}`. Do not mix competing style skills at equal strength.
- Use `design-taste-frontend` for landing/marketing/portfolio sections.
- Use `redesign-existing-projects` before modifying existing UI.
- Use `shadcn` only when project has shadcn or `components.json`.
- Use `gpt-taste` only when PRD explicitly asks for GSAP, kinetic storytelling, or heavy scroll motion.
- Use Figma/imagegen skills only when PRD asks for Figma files, mockups, screenshots, or image concepts.
{mapping_section}
## Responsive Rules

- Layout must remain usable on small laptop and mobile breakpoints.
- Respect existing grid/spacing tokens if `designSystem.cssTokens` defines them.

## Accessibility Rules

- Preserve contrast, focus states, labels, and keyboard navigation.
- Respect `prefers-reduced-motion`.
{state_section}
## Visual Rules

- Choose one primary visual language and commit.
- Make one dominant action per screen.
- Use typography, spacing, and contrast to make hierarchy clear within 3 seconds.
- Prefer existing tokens/components over new visual systems.
- Never hardcode styling directly on an element's `class`/`style` attribute or inside a component/model definition — route it through design tokens or a component class instead. This includes repeated Tailwind-style utility-class stacks on markup; extract them into a reusable class/component rather than inlining each time.
- Avoid purple-blue mesh gradients, fake dashboards, generic SaaS icon grids, random glass, and equal-card monotony.

## Acceptance Checklist

- Primary style selected: `{style}`.
- UI fits `{project}` audience and workflow.
- Existing stack/design tokens preserved.
- Empty, loading, error, and disabled states covered where relevant.
- Responsive behavior specified.
- Accessibility basics included.
- No conflicting UI skills applied blindly.
"""


def generate_from_markdown(prd_text):
    plain = compact(prd_text)
    project = pick(PROJECT_RULES, plain, "product interface")
    style = pick(STYLE_RULES, plain, "high-end-visual-design")
    audience = "target users"
    aud = re.search(r"(?i)(audience|target users?|users?)\s*[:\-]\s*([^\n\.]+)", prd_text)
    if aud:
        audience = aud.group(2).strip()
    goals = bullets(prd_text, "Goals") or bullets(prd_text, "Objectives") or bullets(prd_text, "Tujuan")
    features = bullets(prd_text, "Features") or bullets(prd_text, "Requirements") or bullets(prd_text, "Fitur") or bullets(prd_text, "Kebutuhan")
    constraints = bullets(prd_text, "Constraints") or bullets(prd_text, "Non-Goals") or bullets(prd_text, "Batasan")

    if not goals:
        goals = ["make primary workflow obvious", "build trust quickly", "reduce cognitive load"]
    if not features:
        features = ["primary navigation", "main content area", "empty/loading/error states", "responsive layout"]
    if not constraints:
        constraints = ["preserve existing stack and design tokens", "avoid AI-slop visual defaults", "respect accessibility basics"]

    return generate_markdown_template("Document", project, audience, style, goals, features, constraints)


def main():
    parser = argparse.ArgumentParser(description="Generate DESIGN.md from PRD text/markdown or prd-data.js.")
    parser.add_argument("prd", help="Path to PRD markdown/text or prd-data.js file")
    parser.add_argument("-o", "--output", default="DESIGN.md", help="Output DESIGN.md path")
    args = parser.parse_args()

    prd_path = Path(args.prd)
    if not prd_path.exists():
        print(f"Error: PRD path '{args.prd}' does not exist.", file=sys.stderr)
        sys.exit(1)

    if prd_path.suffix == ".js":
        data = load_js_prd(prd_path)
        if data is None:
            sys.exit(1)
        output_content = generate_from_js(data)
    else:
        prd_text = prd_path.read_text(encoding="utf-8")
        output_content = generate_from_markdown(prd_text)

    Path(args.output).write_text(output_content, encoding="utf-8")
    print(args.output)


if __name__ == "__main__":
    main()
