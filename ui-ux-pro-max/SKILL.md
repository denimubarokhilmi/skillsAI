---
name: ui-ux-pro-max
description: UI/UX design intelligence with searchable database — 84 styles, 161 color palettes, 73 font pairings, 99 UX guidelines, 25 chart types across 17 tech stacks.
---

# UI UX Pro Max

Comprehensive design guide for web and mobile applications. Contains searchable database with priority-based recommendations.

## Prerequisites
Check if Python is installed:
```powershell
python --version
```
If not: `winget install Python.Python.3.12`

## How to Use

### Step 1: Generate Design System (REQUIRED)
```powershell
python skills/ui-ux-pro-max/scripts/search.py "<product_type> <keywords>" --design-system [-p "Project Name"]
```

### Step 2: Domain Search (as needed)
```powershell
python skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

**Domains:** `product`, `style`, `color`, `typography`, `landing`, `chart`, `ux`, `icon`

### Step 3: Stack Search (for code generation)
```powershell
python skills/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>
```

**Stacks:** `react`, `nextjs`, `vue`, `nuxtjs`, `angular`, `svelte`, `flutter`, `react-native`, `swiftui`, `jetpack-compose`, `laravel`, `html-tailwind`, `shadcn`, `astro`, `javafx`, `nuxt-ui`, `threejs`

## Data Included
- **84 UI styles** — glassmorphism, minimalism, brutalism, neumorphism, etc.
- **161 color palettes** — organized by product type
- **73 font pairings** — with Google Fonts import URLs
- **99 UX guidelines** — best practices & anti-patterns
- **25 chart types** — with library recommendations
- **17 tech stacks** — framework-specific patterns

## Trigger
Use when user says: "buat design", "UI/UX", "landing page", "style", "color palette", "font pairing", "design system"
