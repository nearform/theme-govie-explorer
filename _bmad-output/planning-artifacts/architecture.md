---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/brainstorming/brainstorming-session-2026-04-10-1640.md'
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-04-10'
project_name: 'theme-govie-tokens'
user_name: 'Matteo'
date: '2026-04-10'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (27 FRs across 8 domains):**

| Domain | FRs | Architectural Implication |
|--------|-----|--------------------------|
| Token Data Pipeline | FR1–FR4 | Build-time extraction layer: CSS parser, categorizer, WCAG pre-computer, validation gate |
| Token Browsing & Navigation | FR5–FR10 | Multi-route category pages with visual renderers per token type (color, spacing, typography, etc.) |
| Search & Discovery | FR11–FR13 | Client-side fuzzy search engine, reverse index (value→name), command palette overlay |
| Theme Comparison | FR14–FR15 | Dual-value data model: every token carries both light and dark resolved values |
| Accessibility Tooling | FR16–FR18 | Pre-computed contrast matrix (all color pairs), filterable by AA/AAA, pairing suggestion engine |
| Copy & Share | FR19–FR21 | Clipboard API integration, URL fragment routing for permalinks |
| Keyboard Interaction | FR22–FR24 | Global keyboard handler, focus management system, shortcut registry |
| Application Shell | FR25–FR27 | Static export, no runtime dependencies, neutral (non-Gov.ie) styling |

**Non-Functional Requirements (15 NFRs across 3 domains):**

| Domain | NFRs | Architectural Constraint |
|--------|------|------------------------|
| Performance | NFR1–NFR6 | FCP < 1s, TTI < 2s, search < 100ms, Cmd+K < 200ms, Lighthouse 90+, JS bundle < 200KB gzipped |
| Accessibility | NFR7–NFR12 | WCAG 2.1 AA, keyboard-only operation, semantic HTML, respects user preferences |
| Build-Time Integration | NFR13–NFR15 | Auto-parse `theme-govie` CSS, fail-fast on missing input, full build < 30s |

**Scale & Complexity:**

- Primary domain: Static web application (developer tooling)
- Complexity level: Low — no server, no auth, no database, no real-time; complexity is in build pipeline + client UX
- Estimated architectural components: ~5 (build pipeline, data layer, search engine, UI shell, accessibility tooling)

### Technical Constraints & Dependencies

- **Next.js 16 static export** — No API routes, no server components at runtime, no ISR. All data must exist at build time.
- **`theme-govie` CSS package** — Single external dependency for token source. Build fails if absent or structurally unrecognizable (NFR14).
- **Tailwind CSS** — Styling framework. The app uses its own neutral theme, not the Gov.ie tokens, to avoid visual coupling.
- **200KB JS budget (gzipped)** — Rules out heavyweight search libraries or UI frameworks beyond React/Next.js itself.
- **30-second build budget** — Must include CSS parsing, WCAG contrast computation for all color pairs (potentially O(n²)), and static export.
- **Offline-capable** — No runtime fetch calls. All token data embedded in static assets.

### Cross-Cutting Concerns Identified

- **Dual-theme data threading** — Every token must carry light and dark values from extraction → data layer → UI. This affects the data model, component props, and rendering logic across all category pages.
- **Keyboard accessibility** — Global shortcut system (Cmd+K, arrow navigation, Enter to select) must work consistently across all routes without conflicting with browser defaults.
- **Build-time data consistency** — The token data JSON produced at build time is the single source of truth for the entire app. Any inconsistency in parsing, categorization, or WCAG computation propagates everywhere.
- **Performance budget compliance** — The 200KB JS limit and < 100ms search requirement constrain every library choice and data structure decision.
- **Permalink routing** — URL fragments or query parameters must encode token identity and survive page reload in a statically exported SPA.

## Starter Template Evaluation

### Primary Technology Domain

Static web application (developer tooling) — Next.js 16 with static export, client-side interactivity, build-time data generation.

### Starter Options Considered

**Option 1: `create-next-app` (Official CLI) — Recommended**

The official Next.js scaffolding tool. Running `create-next-app@latest` with Next.js 16.2 (current as of April 2026) provides: Next.js 16.2 with App Router, TypeScript 5.x, Tailwind CSS v4.2 (CSS-first configuration), Turbopack (default dev/build bundler), ESLint, `src/` directory option, `@/*` import alias.

**Option 2: Community starter (`nextjs-16-starter-tailwind`)**

Adds Docker configuration and light/dark mode on top of official scaffolding. Unnecessary complexity — Docker is irrelevant for static export, and we need our own dual-theme data model rather than a CSS theme toggle.

**Option 3: Vite + React (no Next.js)**

Pure SPA with Vite. Loses Next.js's static site generation, file-based routing, and `generateStaticParams()` for category pages. The PRD's multi-route category pages map naturally to App Router routes. Next.js static export produces the same result (static files) with better DX for route-based code splitting.

### Selected Starter: `create-next-app` (Official)

**Rationale for Selection:**
- Official, actively maintained — guaranteed compatibility with Next.js 16
- Defaults align with PRD requirements (TypeScript, Tailwind, App Router)
- Minimal scaffolding — add `output: 'export'` and build from there
- No unnecessary dependencies
- The `--empty` flag gives a clean canvas without boilerplate pages

**PRD Correction:** The PRD mentions "Vite" as part of the tech stack, but Next.js 16 uses Turbopack (Rust-based bundler) as its default. These are separate ecosystems. Architecture proceeds with Next.js 16 + Turbopack.

**Initialization Command:**

```bash
npx create-next-app@latest theme-govie-tokens --ts --tailwind --eslint --app --src-dir --use-pnpm --empty
```

Then add static export to `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
};

export default nextConfig;
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript 5.x with strict mode
- React 19.2 (included with Next.js 16)
- Node.js 20.9+ (LTS required)

**Styling Solution:**
- Tailwind CSS v4.2 — CSS-first configuration via `@theme` directives in `globals.css`
- No `tailwind.config.js` needed (v4 uses `@import "tailwindcss"` + `@theme` blocks)
- Automatic content detection

**Build Tooling:**
- Turbopack (default) — Rust-based bundler, ~2–5x faster production builds
- Static export via `output: 'export'` — generates `out/` directory with static HTML/CSS/JS
- React Compiler available (opt-in) for automatic memoization

**Code Organization:**
- `src/` directory for application code
- App Router file-based routing (`src/app/`)
- `@/*` import alias for clean imports
- Layout/page/loading convention per route

**Development Experience:**
- Turbopack dev server with Fast Refresh
- Built-in ESLint with Next.js rules
- TypeScript strict checking

**Static Export Constraints:**
- No API routes, no server components at runtime, no ISR
- Dynamic routes require `generateStaticParams()` — all paths known at build time
- Category routes (`/colors`, `/spacing`, etc.) are fixed — not a limitation
- Token permalinks use URL hash fragments (client-side only)

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Build-time token pipeline tooling (CSS parser, WCAG computation)
2. Client-side search engine choice
3. State management approach
4. Command palette implementation strategy

**Important Decisions (Shape Architecture):**
5. Hosting strategy
6. Testing strategy

**Deferred Decisions (Post-MVP):**
- Multi-format export tooling (Phase 2)
- Color blindness simulation library (Phase 2)
- CI/CD pipeline specifics (decide when hosting target is chosen)

### Data Architecture

**CSS Parser: PostCSS 8.5.8** (build-time only dependency)
- Industry-standard CSS processor with plugin ecosystem
- Clean AST API for extracting CSS custom properties
- ~25KB, but irrelevant — build-time only, not shipped to client
- Rationale: Best ecosystem fit for CSS tooling; robust against complex CSS structures (`@layer`, `@media`, nested rules)

**WCAG Contrast Computation: Custom implementation**
- ~30 lines implementing the WCAG 2.1 relative luminance and contrast ratio formulas
- Handles hex, rgb, hsl color parsing and conversion
- Zero dependencies
- Rationale: The formula is well-defined and trivial; a library dependency is unnecessary overhead

**Token Data Model:**
- Build-time pipeline produces static JSON consumed by the client
- Every token carries: name, category, light value, dark value, raw CSS property
- Color tokens additionally carry pre-computed contrast ratios against all other color tokens
- Data is imported as static JSON at build time — no runtime fetch

### Authentication & Security

Not applicable. Zero-auth static site. No user data, no server, no API endpoints. The `noindex` meta tag prevents public search indexing.

### API & Communication Patterns

Not applicable. No backend, no API routes, no external service calls. All data is embedded at build time.

### Frontend Architecture

**State Management: URL state + React built-ins**
- Filter state, search query, and selected token encoded in URL params/hash
- Enables permalinks (FR20–FR21) as a natural consequence — the URL *is* the state
- Local UI state (modal open, focus index) via `useState`
- Shared state (token data) via React Context or module-level imports
- Zero additional dependencies
- Rationale: The app has no server state and no user accounts; URL state gives permalink support for free

**Search Engine: Fuse.js 7.1.0** (~25KB minified)
- Fuzzy search across token names and values (FR11)
- Reverse lookup: search by value to find token names (FR12)
- Weighted multi-field search with configurable scoring
- < 100ms for ~500 tokens (NFR3) — well within Fuse.js's performance envelope
- Rationale: Purpose-built for fuzzy search with good scoring; 25KB fits within 200KB JS budget

**Command Palette: Custom implementation** (powered by Fuse.js)
- Modal overlay with text input + filtered results list + keyboard navigation
- Triggered by Cmd+K / Ctrl+K (FR13, FR23)
- Uses Fuse.js for search — no separate search engine needed
- ~100–150 lines of focused code
- Rationale: `cmdk` (the standard library) has known React 19 / Next.js 16 compatibility issues. Custom implementation avoids dependency risk, and Fuse.js already handles the hard part

**Clipboard Integration: Native Clipboard API**
- `navigator.clipboard.writeText()` for one-click copy (FR19)
- No library needed — modern browser API with full support in target browsers

### Infrastructure & Deployment

**Hosting: Host-agnostic**
- Build produces `out/` directory with static HTML/CSS/JS
- Deployable to any static host (GitHub Pages, Vercel, Netlify, S3+CloudFront, any CDN)
- No hosting-specific configuration in the codebase
- Deployment target deferred — architecture does not depend on it
- Rationale: Internal developer tool; keep options open, avoid vendor lock-in

**Testing: Vitest** (unit tests on critical path only)
- Test the CSS token parser (correctness of extraction, categorization)
- Test WCAG contrast computation (mathematical accuracy)
- Test search index construction and fuzzy matching
- No UI component tests — static app with visual output best verified by inspection
- Rationale: Testing effort focused on the build-time pipeline and core functions where bugs would silently corrupt all downstream data

### Decision Impact Analysis

**Implementation Sequence:**
1. Project scaffolding (`create-next-app` + static export config)
2. Build-time token pipeline (PostCSS parser → categorizer → WCAG computer → JSON output)
3. Token data model and static import
4. App shell with routing (category pages)
5. Visual token renderers per category
6. Search engine (Fuse.js index) + command palette
7. Accessibility tooling (contrast matrix, pairing suggestions)
8. Keyboard navigation + permalinks
9. Polish: copy-to-clipboard, cheat sheet view, responsive tweaks

**Cross-Component Dependencies:**
- Token data model (step 2) is consumed by every UI component — must be stable before UI work begins
- Fuse.js search index depends on the token data model shape
- Command palette depends on Fuse.js integration
- Contrast matrix depends on pre-computed WCAG data from the pipeline
- Permalinks depend on URL state encoding conventions established in the app shell

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

8 areas where AI agents could make different choices, grouped into naming, structure, data format, and process patterns.

### Naming Patterns

**File Naming:**
- Components: PascalCase matching component name — `TokenCard.tsx`, `CommandPalette.tsx`
- Utilities/hooks: camelCase — `useTokenSearch.ts`, `parseTokens.ts`
- Data/config: camelCase — `tokenData.json`, `searchConfig.ts`
- Test files: Co-located, same name with `.test` suffix — `parseTokens.test.ts`

**Code Naming:**
- Variables/functions: `camelCase` — `tokenName`, `getContrastRatio()`
- Components: `PascalCase` — `TokenCard`, `ContrastMatrix`
- Types/interfaces: `PascalCase` with descriptive names — `Token`, `ColorToken`, `ContrastResult`
- Constants: `SCREAMING_SNAKE_CASE` — `WCAG_AA_THRESHOLD`, `MAX_SEARCH_RESULTS`
- CSS classes: Tailwind utility classes only (no custom class naming needed)

### Structure Patterns

**Component Organization — by feature, not by type:**

- `src/lib/` — Build-time pipeline code (parser, categorizer, WCAG computation) + shared utilities
- `src/components/` — Shared UI components (search input, copy button, token card base)
- `src/app/(routes)/` — Route-specific pages and layouts, each route owns its own specialized renderers
- `src/data/` — Generated token data JSON (build-time output consumed by client)
- `src/hooks/` — Custom React hooks (`useTokenSearch`, `useKeyboardShortcuts`, `useClipboard`)
- `src/types/` — Shared TypeScript interfaces and types

**Test Location:** Co-located with source — `src/lib/parseTokens.test.ts` next to `src/lib/parseTokens.ts`

### Data Format Patterns

**Token Data Interface (canonical shape consumed by all components):**

```typescript
interface Token {
  name: string;           // e.g. "--color-bg-secondary"
  category: TokenCategory; // "color" | "spacing" | "typography" | "border" | "shadow" | "other"
  lightValue: string;     // resolved value in light theme
  darkValue: string;      // resolved value in dark theme
  rawProperty: string;    // original CSS custom property declaration
}

interface ColorToken extends Token {
  category: "color";
  contrastPairs: ContrastPair[];
}

interface ContrastPair {
  against: string;        // other token name
  ratio: number;          // contrast ratio (1–21)
  meetsAA: boolean;
  meetsAAA: boolean;
}
```

**URL State Encoding:**
- Category filter: path-based — `/colors`, `/spacing`, `/typography`
- Search query: `?q=secondary`
- Selected token permalink: `#--color-bg-secondary` (hash fragment)
- Multiple filters: `?q=secondary&level=aa` (query params, camelCase keys)

### Process Patterns

**Error Handling:**
- Build-time errors (missing CSS file, parse failure): throw with descriptive message, fail the build (NFR14)
- Client-side: React Error Boundaries at the route level
- No `try/catch` swallowing errors silently — always log or re-throw

**Loading States:**
- Not applicable at runtime — all data is static, embedded at build time
- No loading spinners, no skeleton screens — pages render complete on first paint

**Import Style:**
- Absolute imports via `@/*` alias — `import { Token } from '@/types/token'`
- No relative `../../../` paths
- Group imports: React/Next.js first, then external libraries, then `@/` internal imports, separated by blank lines

### Enforcement Guidelines

**All AI Agents MUST:**
1. Use the `Token` / `ColorToken` interfaces exactly as defined — no ad-hoc token shapes
2. Place build-time code in `src/lib/`, UI code in `src/components/` or route directories
3. Use `@/*` absolute imports — never relative paths beyond `./` within the same directory
4. Use Tailwind utility classes for all styling — no inline styles, no CSS modules, no styled-components
5. Encode user-facing state in the URL — filters, search, selected token must survive page reload

**Anti-Patterns:**
- Creating a `utils/` or `helpers/` grab-bag folder — use `src/lib/` with descriptive file names
- Adding `any` types — use the defined interfaces
- Using `useEffect` for data fetching — there is no data fetching; token data is a static import
- Creating wrapper components that just forward props — keep component hierarchy flat

## Project Structure & Boundaries

### Complete Project Directory Structure

```
theme-govie-tokens/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
├── .eslintrc.json
├── .gitignore
├── .env.example                          # THEME_GOVIE_CSS_PATH
│
├── scripts/
│   └── generate-tokens.ts                # Build-time entry: runs pipeline, writes JSON to src/data/
│
├── src/
│   ├── app/
│   │   ├── globals.css                   # Tailwind @import + @theme overrides (neutral palette)
│   │   ├── layout.tsx                    # Root layout: app shell, keyboard shortcut provider, command palette
│   │   ├── page.tsx                      # Landing: category overview, token summary stats
│   │   ├── colors/
│   │   │   └── page.tsx                  # Color tokens: swatches, side-by-side light/dark, copy
│   │   ├── spacing/
│   │   │   └── page.tsx                  # Spacing tokens: scale visualization, value decorators
│   │   ├── typography/
│   │   │   └── page.tsx                  # Typography tokens: font samples, size/weight preview
│   │   ├── borders/
│   │   │   └── page.tsx                  # Border tokens: rendered border previews
│   │   ├── shadows/
│   │   │   └── page.tsx                  # Shadow tokens: rendered shadow previews
│   │   ├── contrast/
│   │   │   └── page.tsx                  # WCAG contrast checker: matrix, AA/AAA badges, pairing suggestions
│   │   └── cheatsheet/
│   │       └── page.tsx                  # Dense all-tokens overview (screen-only)
│   │
│   ├── components/
│   │   ├── TokenCard.tsx                 # Base token display: name, values, copy button, permalink
│   │   ├── ColorSwatch.tsx               # Color preview with light/dark side-by-side
│   │   ├── SpacingScale.tsx              # Visual spacing scale bar
│   │   ├── TypographySample.tsx          # Typography preview with sample text
│   │   ├── ContrastMatrix.tsx            # WCAG contrast ratio grid with AA/AAA badges
│   │   ├── ContrastPairingSuggestions.tsx # Accessible text/background combinations
│   │   ├── CommandPalette.tsx            # Cmd+K modal: input + Fuse.js results + keyboard nav
│   │   ├── SearchInput.tsx               # Inline search bar with fuzzy + reverse lookup
│   │   ├── CategoryChips.tsx             # Filter chips for token categories
│   │   ├── CopyButton.tsx               # One-click copy to clipboard with feedback
│   │   ├── TokenPermalink.tsx            # Permalink icon/button per token
│   │   └── AppNav.tsx                    # Top navigation: category links, search trigger, shortcuts help
│   │
│   ├── hooks/
│   │   ├── useTokenSearch.ts             # Fuse.js index init + search hook
│   │   ├── useKeyboardShortcuts.ts       # Global keyboard handler
│   │   ├── useClipboard.ts              # Clipboard API wrapper with copy feedback state
│   │   └── useUrlState.ts               # URL query param + hash sync
│   │
│   ├── lib/
│   │   ├── pipeline/
│   │   │   ├── parseCss.ts              # PostCSS-based CSS custom property extractor
│   │   │   ├── parseCss.test.ts         # Tests: extraction correctness, edge cases
│   │   │   ├── categorize.ts            # Token categorizer
│   │   │   ├── categorize.test.ts       # Tests: categorization accuracy
│   │   │   ├── wcag.ts                  # WCAG 2.1 relative luminance + contrast ratio computation
│   │   │   ├── wcag.test.ts             # Tests: known contrast ratios, edge values
│   │   │   ├── validate.ts              # Build-time token count validation + warnings
│   │   │   └── validate.test.ts         # Tests: validation thresholds
│   │   ├── colorUtils.ts                # Hex/RGB/HSL parsing and conversion
│   │   ├── colorUtils.test.ts           # Tests: color parsing edge cases
│   │   └── searchConfig.ts              # Fuse.js configuration (keys, weights, thresholds)
│   │
│   ├── types/
│   │   ├── token.ts                     # Token, ColorToken, ContrastPair, TokenCategory
│   │   └── search.ts                    # SearchResult, SearchOptions
│   │
│   └── data/
│       ├── tokens.json                  # Generated: all tokens with light/dark values
│       └── contrastMatrix.json          # Generated: pre-computed color pair contrast data
│
├── public/
│   └── favicon.ico
│
└── out/                                  # Static export output (gitignored)
```

### Architectural Boundaries

**Build-Time Boundary (Node.js — `scripts/` + `src/lib/pipeline/`):**
- Runs during `next build` or as a pre-build script
- Has access to filesystem (reads `theme-govie` CSS files)
- Writes to `src/data/*.json`
- Uses PostCSS (Node.js dependency, never shipped to client)
- This code never runs in the browser

**Client-Side Boundary (`src/app/` + `src/components/` + `src/hooks/`):**
- Runs in the browser as a static SPA
- Consumes `src/data/*.json` as static imports
- No filesystem access, no Node.js APIs
- All interactivity: search, filter, copy, keyboard, navigation

**Type Boundary (`src/types/`):**
- Shared between build-time and client-side code
- Defines the contract between the pipeline and the UI
- The `Token` / `ColorToken` interfaces are the integration point

### Requirements to Structure Mapping

| FR Domain | Primary Location | Key Files |
|-----------|-----------------|-----------|
| Token Data Pipeline (FR1–FR4) | `src/lib/pipeline/` | `parseCss.ts`, `categorize.ts`, `wcag.ts`, `validate.ts` |
| Token Browsing (FR5–FR10) | `src/app/*/page.tsx` | Category route pages + `TokenCard.tsx` |
| Search & Discovery (FR11–FR13) | `src/hooks/` + `src/components/` | `useTokenSearch.ts`, `CommandPalette.tsx`, `SearchInput.tsx` |
| Theme Comparison (FR14–FR15) | `src/components/` | `ColorSwatch.tsx` (side-by-side), `TokenCard.tsx` (dual values) |
| Accessibility Tooling (FR16–FR18) | `src/app/contrast/` + `src/components/` | `ContrastMatrix.tsx`, `ContrastPairingSuggestions.tsx` |
| Copy & Share (FR19–FR21) | `src/hooks/` + `src/components/` | `useClipboard.ts`, `CopyButton.tsx`, `TokenPermalink.tsx` |
| Keyboard Interaction (FR22–FR24) | `src/hooks/` | `useKeyboardShortcuts.ts`, `CommandPalette.tsx` |
| Application Shell (FR25–FR27) | `src/app/` | `layout.tsx`, `globals.css`, `next.config.ts` |

### Data Flow

```
theme-govie CSS files
       │
       ▼
[scripts/generate-tokens.ts]  ← Build-time (Node.js)
       │
       ├── parseCss.ts (PostCSS) → raw custom properties
       ├── categorize.ts → Token[] with categories
       ├── wcag.ts → ContrastPair[] for color tokens
       └── validate.ts → token count check
       │
       ▼
[src/data/tokens.json + contrastMatrix.json]  ← Static JSON artifacts
       │
       ▼
[src/app/*/page.tsx]  ← Client-side (browser)
       │
       ├── static import of token data
       ├── Fuse.js index built on first render
       ├── URL state drives filter/search/permalink
       └── Components render token previews
```

### Development Workflow

- **Dev server:** `pnpm dev` — Turbopack dev server with Fast Refresh
- **Token generation:** `pnpm generate-tokens` — Pre-build script to regenerate `src/data/*.json`
- **Build:** `pnpm generate-tokens && pnpm build` — Generate tokens then static export to `out/`
- **Test:** `pnpm test` — Vitest runs co-located `.test.ts` files in `src/lib/`
- **Deploy:** Copy `out/` directory to any static host

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are compatible: Next.js 16.2 + React 19.2 + TypeScript 5.x + Tailwind CSS v4.2 (officially supported together), PostCSS 8.5.8 (build-time only), Fuse.js 7.1.0 (framework-agnostic), Vitest (TypeScript-compatible). No contradictory decisions found.

**Pattern Consistency:**
PascalCase components / camelCase utilities follows standard React/Next.js convention. Co-located tests supported by Vitest. `@/*` import alias provided by `create-next-app`. Tailwind-only styling — no competing system.

**Structure Alignment:**
Build-time / client-side boundary cleanly separated via `src/lib/pipeline/` vs `src/app/`. `src/types/` shared between boundaries as the contract layer. Route-per-category matches App Router's file-based routing.

### Requirements Coverage Validation ✅

**Functional Requirements:** 27/27 covered.

| FR | Covered By |
|----|------------|
| FR1–FR4 (Pipeline) | `src/lib/pipeline/` — parseCss, categorize, wcag, validate |
| FR5–FR10 (Browsing) | Route pages + TokenCard, ColorSwatch, SpacingScale, TypographySample |
| FR11–FR13 (Search) | `useTokenSearch.ts` (Fuse.js) + `CommandPalette.tsx` + `SearchInput.tsx` |
| FR14–FR15 (Themes) | Dual-value Token interface + ColorSwatch side-by-side rendering |
| FR16–FR18 (WCAG) | `ContrastMatrix.tsx` + `ContrastPairingSuggestions.tsx` + pre-computed data |
| FR19–FR21 (Copy/Share) | `CopyButton.tsx` + `useClipboard.ts` + `TokenPermalink.tsx` + `useUrlState.ts` |
| FR22–FR24 (Keyboard) | `useKeyboardShortcuts.ts` + `CommandPalette.tsx` |
| FR25–FR27 (Shell) | Static export + neutral Tailwind theme + no auth/install |

**Non-Functional Requirements:** 15/15 covered.

| NFR | Architectural Support |
|-----|----------------------|
| NFR1–NFR2 (FCP/TTI) | Static export, no runtime fetch, pre-rendered HTML |
| NFR3–NFR4 (Search/Cmd+K latency) | Fuse.js on ~500 tokens; lightweight custom modal |
| NFR5 (Lighthouse 90+) | Static site, semantic HTML, Tailwind utilities |
| NFR6 (JS < 200KB) | Monitor — base ~120KB + Fuse.js 25KB leaves ~55KB headroom |
| NFR7–NFR12 (WCAG 2.1 AA) | Semantic HTML, keyboard hooks, focus rings, prefers-reduced-motion |
| NFR13–NFR15 (Build) | PostCSS pipeline, fail-fast validation, lightweight computation |

### Implementation Readiness ✅

**Decision Completeness:** All critical decisions documented with specific versions. Implementation patterns comprehensive with examples and anti-patterns. Consistency rules enforceable via ESLint + TypeScript strict mode.

**Structure Completeness:** Every file and directory defined. All 27 FRs mapped to specific locations. Integration points (build-time → JSON → client) clearly specified.

**Pattern Completeness:** Naming, structure, data format, process, and import patterns all specified. Anti-patterns documented.

### Gap Analysis

**No critical gaps.** Two monitoring items:

1. **JS Bundle Budget (NFR6):** Base framework ~120KB + Fuse.js 25KB = ~145KB, leaving ~55KB for app code. Feasible but tight. Mitigation: lazy-load Fuse.js if needed; monitor with `next build` output.

2. **Contrast Matrix Size:** O(N²) color pairs could produce large JSON for many color tokens. Mitigation: load only on `/contrast` route; virtualize rendering if needed.

### Architecture Completeness Checklist

- [x] Project context analyzed (27 FRs, 15 NFRs, 5 user journeys)
- [x] Scale and complexity assessed (low — static app, no backend)
- [x] Technical constraints identified (static export, 200KB budget, 30s build)
- [x] Cross-cutting concerns mapped (dual-theme, keyboard, data consistency, permalinks)
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined (build-time → JSON → client-side)
- [x] Performance considerations addressed
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Data format patterns specified (Token/ColorToken interfaces)
- [x] Process patterns documented (error handling, imports)
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Data flow mapped
- [x] All requirements mapped to specific files

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — low complexity project with well-defined boundaries, no external service dependencies, and a clear data flow from CSS source to static UI.

**Key Strengths:**
- Clean two-boundary architecture (build-time pipeline → static JSON → client SPA)
- Zero runtime dependencies beyond React/Next.js
- Every FR and NFR mapped to a specific file/component
- Token interface is the single contract between pipeline and UI
- URL-as-state gives permalinks and shareability for free

**Areas for Future Enhancement:**
- Bundle size optimization if budget becomes tight (lazy-load Fuse.js, code-split contrast matrix)
- Contrast matrix virtualization for large token sets
- CI/CD pipeline (deferred — depends on hosting choice)
- E2E tests with Playwright (deferred to post-MVP)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries (build-time vs client-side)
- Use the Token/ColorToken interfaces as the canonical data shape
- Encode user-facing state in the URL
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
npx create-next-app@latest theme-govie-tokens --ts --tailwind --eslint --app --src-dir --use-pnpm --empty
```
Then configure `output: 'export'` in `next.config.ts` and set up the directory structure.
