# Story 1.1: Project Scaffolding, Design Tokens & Data Model

Status: review

## Story

As a developer,
I want the project scaffolded with Next.js 16, Tailwind v4.2, NearForm brand theming, and canonical TypeScript interfaces,
So that all subsequent development has a consistent foundation and data contract.

## Acceptance Criteria

1. The project is initialized with `create-next-app@latest --ts --tailwind --eslint --app --src-dir --use-pnpm --empty` and builds successfully with `output: 'export'` in `next.config.ts`
2. `@ogcio/theme-govie@1.21.4`, `@ogcio/design-system-react@1.34.0`, `postcss`, `fuse.js`, and `vitest` are installed as dependencies
3. The directory structure matches the architecture spec: `src/lib/pipeline/`, `src/components/`, `src/hooks/`, `src/types/`, `src/data/`, `scripts/`
4. `src/types/token.ts` defines `Token`, `ColorToken`, `ContrastPair`, and `TokenCategory` interfaces exactly per architecture
5. `globals.css` configures Tailwind `@theme` with all 12 NearForm brand color tokens (UX-DR1)
6. Bitter (serif) + Inter (sans-serif) fonts are configured with system monospace for token data (UX-DR2)
7. The 7-level type scale is implemented as Tailwind theme extensions (UX-DR3)
8. `@/*` import alias is configured and working

## Tasks / Subtasks

- [x] Task 1: Initialize Next.js project (AC: #1)
  - [x] Run `npx create-next-app@latest theme-govie-tokens --ts --tailwind --eslint --app --src-dir --use-pnpm --empty` in the parent directory (the workspace root IS the project root — scaffold IN PLACE or into a temp directory and move files up)
  - [x] Set `output: 'export'` in `next.config.ts`
  - [x] Verify `pnpm build` produces an `out/` directory successfully
- [x] Task 2: Install required packages (AC: #2)
  - [x] `pnpm add @ogcio/theme-govie@1.21.4 @ogcio/design-system-react@1.34.0`
  - [x] `pnpm add -D postcss vitest`
  - [x] `pnpm add fuse.js`
  - [x] Verify all packages resolve without peer dependency errors
- [x] Task 3: Create directory structure (AC: #3)
  - [x] Create `src/lib/pipeline/` (build-time token pipeline code)
  - [x] Create `src/components/` (shared UI components)
  - [x] Create `src/hooks/` (custom React hooks)
  - [x] Create `src/types/` (shared TypeScript interfaces)
  - [x] Create `src/data/` (generated token data JSON — add `.gitkeep`)
  - [x] Create `scripts/` (build-time scripts)
  - [x] Add placeholder `.gitkeep` files in empty directories
- [x] Task 4: Define TypeScript interfaces (AC: #4)
  - [x] Create `src/types/token.ts` with exact interfaces from architecture
  - [x] Export `Token`, `ColorToken`, `ContrastPair`, `TokenCategory`
- [x] Task 5: Configure NearForm brand theme in globals.css (AC: #5, #6, #7)
  - [x] Configure Tailwind v4 CSS-first `@theme` directive with all 12 NearForm brand color tokens
  - [x] Configure Bitter + Inter fonts via `next/font/google` and connect to Tailwind theme
  - [x] Implement the 7-level type scale as Tailwind custom theme extensions
  - [x] Set custom letter-spacing and antialiased rendering
- [x] Task 6: Verify import alias (AC: #8)
  - [x] Confirm `@/*` import alias works in `tsconfig.json`
  - [x] Test with a cross-directory import (e.g., import types from a page)
- [x] Task 7: Final validation
  - [x] `pnpm build` completes without errors and produces `out/`
  - [x] TypeScript strict mode passes with no errors
  - [x] ESLint passes with no errors

## Dev Notes

### Critical: This Is a Greenfield Project

There is NO existing code in the workspace. The workspace directory is empty except for `_bmad-output/` planning artifacts and `.cursor/` configuration. The dev agent must scaffold the project from scratch.

**Scaffolding strategy:** Since the workspace root IS the project root, the agent should either:
- (A) Run `create-next-app` targeting the current directory (may require empty dir), OR
- (B) Run `create-next-app` into a temp subdirectory, then move all generated files up to the workspace root

Option (B) is safer since the workspace already contains non-project files (`_bmad-output/`, `.cursor/`).

### Architecture Compliance

**Technology Stack (exact versions):**
- Next.js 16.x (latest via `create-next-app@latest`) — includes React 19.2, TypeScript 5.x
- Tailwind CSS v4.2 — CSS-first configuration via `@theme` directives (NO `tailwind.config.js`)
- Turbopack — default bundler, replaces Webpack/Vite
- Node.js 20.9+ (LTS)
- pnpm as package manager

**Static Export Configuration:**

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
};

export default nextConfig;
```

**Constraints:**
- No API routes, no server components at runtime, no ISR
- All data must exist at build time
- No runtime fetch calls — all token data will be static JSON imports
- No `next/image` default loader (static export limitation)

### TypeScript Interfaces — Exact Definitions

These interfaces are the canonical data contract consumed by every component in the app. Define them EXACTLY as specified:

```typescript
// src/types/token.ts

export type TokenCategory = "color" | "spacing" | "typography" | "border" | "shadow" | "other";

export interface Token {
  name: string;           // e.g. "--color-bg-secondary"
  category: TokenCategory;
  lightValue: string;     // resolved value in light theme
  darkValue: string;      // resolved value in dark theme
  rawProperty: string;    // original CSS custom property declaration
}

export interface ColorToken extends Token {
  category: "color";
  contrastPairs: ContrastPair[];
}

export interface ContrastPair {
  against: string;        // other token name
  ratio: number;          // contrast ratio (1–21)
  meetsAA: boolean;
  meetsAAA: boolean;
}
```

### NearForm Brand Color System (UX-DR1)

All 12 brand colors must be configured as Tailwind custom theme tokens via `@theme` in `globals.css`:

| Token Name | Hex | Usage |
|------------|-----|-------|
| `--color-nf-deep-navy` | `#000e38` | Nav, command palette, dark surfaces |
| `--color-nf-green` | `#00e6a4` | Primary accent, focus rings, copy confirmation |
| `--color-nf-dark-green` | `#07a06f` | Hover/pressed states on green elements |
| `--color-nf-light-green` | `#ccfaed` | Selected states, success surfaces, AAA badge bg |
| `--color-nf-purple` | `#9966ff` | Category accents |
| `--color-nf-light-purple` | `#dfccff` | Search highlights, text selection |
| `--color-nf-blue` | `#478bff` | Links, secondary actions, AA badge |
| `--color-nf-light-blue` | `#d6e6ff` | Info surfaces |
| `--color-nf-grey` | `#d9d9d9` | Borders, dividers |
| `--color-nf-light-grey` | `#f4f8fa` | Alternating backgrounds, card surfaces |
| `--color-nf-deep-grey` | `#444450` | Secondary text |
| `--color-nf-muted-grey` | `#727783` | Placeholders, tertiary text |

### Tailwind v4.2 CSS-First Configuration

Tailwind v4 does NOT use `tailwind.config.js`. Configuration is done entirely in CSS via `@theme` directives in `globals.css`.

**Example structure for `globals.css`:**

```css
@import "tailwindcss";

@theme {
  /* NearForm Brand Colors */
  --color-nf-deep-navy: #000e38;
  --color-nf-green: #00e6a4;
  --color-nf-dark-green: #07a06f;
  --color-nf-light-green: #ccfaed;
  --color-nf-purple: #9966ff;
  --color-nf-light-purple: #dfccff;
  --color-nf-blue: #478bff;
  --color-nf-light-blue: #d6e6ff;
  --color-nf-grey: #d9d9d9;
  --color-nf-light-grey: #f4f8fa;
  --color-nf-deep-grey: #444450;
  --color-nf-muted-grey: #727783;

  /* Font Families */
  --font-heading: "Bitter", serif;
  --font-sans: "Inter", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}
```

**Font Loading:** Use `next/font/google` to load Bitter and Inter. Apply them as CSS variables on `<html>` or `<body>`, then reference those variables in the `@theme` block.

```typescript
// src/app/layout.tsx
import { Bitter, Inter } from 'next/font/google';

const bitter = Bitter({
  subsets: ['latin'],
  variable: '--font-bitter',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Apply: <html className={`${bitter.variable} ${inter.variable}`}>
```

Then in `globals.css`, wire the CSS variables from `next/font` into the Tailwind `@theme`:

```css
@theme {
  --font-heading: var(--font-bitter), serif;
  --font-sans: var(--font-inter), sans-serif;
}
```

### 7-Level Type Scale (UX-DR3)

Implement as custom theme extensions. These map to specific usage contexts:

| Level | Size | Line Height | Font | Tailwind Usage |
|-------|------|-------------|------|----------------|
| Page title | 28px | 1.2em | Bitter (heading) | `text-[28px] font-heading leading-[1.2]` |
| Section title | 21px | 1.3em | Bitter (heading) | `text-[21px] font-heading leading-[1.3]` |
| UI large | 18px | 1.4em | Inter (sans) | `text-lg font-sans leading-[1.4]` |
| UI base | 16px | 1.5em | Inter (sans) | `text-base font-sans leading-[1.5]` |
| Token name | 14px | 1.4em | Monospace | `text-sm font-mono leading-[1.4]` |
| Token value | 14px | 1.4em | Monospace | `text-sm font-mono leading-[1.4]` |
| Caption | 12px | 1.3em | Inter (sans) | `text-xs font-sans leading-[1.3]` |

Additional typography settings:
- Letter spacing on headings: `-0.01em` (`tracking-[-0.01em]`)
- Antialiased rendering: apply `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` on `body`

### Import Alias Configuration

The `@/*` import alias should be configured automatically by `create-next-app`. Verify in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**CRITICAL RULE:** Use `@/*` absolute imports everywhere. Never use relative `../` paths beyond `./` within the same directory. Group imports: React/Next.js first, then external libraries, then `@/` internal imports, separated by blank lines.

### File Naming Conventions

- Components: PascalCase — `TokenCard.tsx`, `CommandPalette.tsx`
- Utilities/hooks: camelCase — `useTokenSearch.ts`, `parseCss.ts`
- Data/config: camelCase — `tokenData.json`, `searchConfig.ts`
- Test files: Co-located, same name with `.test` suffix — `parseCss.test.ts`
- Types: PascalCase with descriptive names — `Token`, `ColorToken`, `ContrastPair`
- Constants: `SCREAMING_SNAKE_CASE` — `WCAG_AA_THRESHOLD`

### Anti-Patterns to Avoid

- Do NOT create a `tailwind.config.js` — Tailwind v4 uses CSS-first `@theme` directives
- Do NOT create a `utils/` or `helpers/` grab-bag folder — use `src/lib/` with descriptive file names
- Do NOT add `any` types — use the defined interfaces
- Do NOT use `useEffect` for data fetching — there is no data fetching in this app
- Do NOT create wrapper components that just forward props
- Do NOT use inline styles for the tool's own UI — use Tailwind utility classes
- Do NOT use CSS modules or styled-components — Tailwind-only styling
- Do NOT import Gov.ie theme tokens for the tool's own styling — the app uses NearForm brand colors

### Packages to Install — Exact Versions

| Package | Version | Type | Purpose |
|---------|---------|------|---------|
| `@ogcio/theme-govie` | `1.21.4` | dependency | CSS token source for the build pipeline |
| `@ogcio/design-system-react` | `1.34.0` | dependency | Design system React components |
| `postcss` | latest | devDependency | Build-time CSS parser (used by pipeline in future stories) |
| `fuse.js` | `7.1.0` (or latest 7.x) | dependency | Client-side fuzzy search (~25KB) |
| `vitest` | latest | devDependency | Unit testing framework |

### What SUCCESS Looks Like

After this story is complete:
1. `pnpm dev` starts the Turbopack dev server with a blank page styled with NearForm branding
2. `pnpm build` completes and produces `out/` directory (static export)
3. The root `page.tsx` renders a minimal page (can be a placeholder) using Bitter heading font, Inter body font, and NearForm green accent
4. All 12 NearForm brand colors are available as Tailwind utilities (e.g., `bg-nf-deep-navy`, `text-nf-green`)
5. `src/types/token.ts` exports all 4 type definitions
6. All directories exist and the project structure matches the architecture spec
7. TypeScript and ESLint pass with zero errors

### Project Structure Notes

The final structure after this story should be:

```
theme-govie-tokens/
├── _bmad-output/                    # Planning artifacts (pre-existing, do not touch)
├── .cursor/                         # Cursor config (pre-existing, do not touch)
├── node_modules/
├── scripts/                         # Build-time scripts (empty for now)
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind @import + @theme with NearForm brand
│   │   ├── layout.tsx               # Root layout with font configuration
│   │   └── page.tsx                 # Minimal placeholder page
│   ├── components/                  # Shared UI components (empty for now)
│   ├── data/                        # Generated token JSON (empty, with .gitkeep)
│   ├── hooks/                       # Custom React hooks (empty for now)
│   ├── lib/
│   │   └── pipeline/                # Build-time pipeline code (empty for now)
│   └── types/
│       └── token.ts                 # Token, ColorToken, ContrastPair, TokenCategory
├── public/
│   └── favicon.ico
├── .eslintrc.json
├── .gitignore
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design System Foundation]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Visual Design Foundation]
- [Source: _bmad-output/planning-artifacts/prd.md#Additional Requirements]

## Dev Agent Record

### Agent Model Used

Claude claude-4.6-opus (Amelia persona)

### Debug Log References

No issues encountered. All tasks completed on first attempt.

### Completion Notes List

- Scaffolded Next.js 16.2.3 via create-next-app into temp directory, moved files to workspace root (Option B)
- Set `output: 'export'` in next.config.ts for static export
- Installed @ogcio/theme-govie@1.21.4, @ogcio/design-system-react@1.34.0, fuse.js@7.3.0, postcss@8.5.9, vitest@4.1.4
- Created full directory structure: src/lib/pipeline/, src/components/, src/hooks/, src/types/, src/data/, scripts/
- Defined Token, ColorToken, ContrastPair, TokenCategory interfaces exactly per architecture spec
- Configured Tailwind v4 CSS-first @theme with all 12 NearForm brand colors
- Configured Bitter (heading) + Inter (sans) fonts via next/font/google with CSS variable wiring
- Applied antialiased rendering and heading letter-spacing (-0.01em)
- Created placeholder page.tsx using NearForm branding (Bitter heading, Inter body, green accent)
- Verified @/* import alias works with cross-directory import test
- All 16 tests pass, build produces out/, ESLint clean

### File List

- next.config.ts (new)
- package.json (new)
- pnpm-lock.yaml (new)
- pnpm-workspace.yaml (new)
- tsconfig.json (new)
- eslint.config.mjs (new)
- postcss.config.mjs (new)
- next-env.d.ts (new)
- vitest.config.ts (new)
- .gitignore (new)
- AGENTS.md (new)
- CLAUDE.md (new)
- README.md (new)
- src/app/globals.css (new)
- src/app/layout.tsx (new)
- src/app/page.tsx (new)
- src/app/theme.test.ts (new)
- src/app/alias.test.ts (new)
- src/types/token.ts (new)
- src/types/token.test.ts (new)
- src/components/.gitkeep (new)
- src/hooks/.gitkeep (new)
- src/data/.gitkeep (new)
- src/lib/pipeline/.gitkeep (new)
- scripts/.gitkeep (new)
