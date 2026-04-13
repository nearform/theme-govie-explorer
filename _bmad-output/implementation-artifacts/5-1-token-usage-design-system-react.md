# Story 5.1: Token Usage Mapping for design-system-react Components

Status: review

## Story

As a developer,
I want to see which `@ogcio/design-system-react` components use each token,
So that I can understand the practical impact of a token and find the right component when I know the token (or vice versa).

## Acceptance Criteria

1. A build-time script `scripts/generate-token-usage.ts` scans the compiled `@ogcio/design-system-react@1.34.0` package and produces `src/data/tokenUsage.json` mapping tokens to component names and vice versa
2. The scanner extracts `--gieds-*` CSS variable references from `dist/styles.css` and all `dist/**/*.js` component files, mapping each reference to its parent component directory
3. The scanner extracts `gi-*` utility class names from component JS files and resolves them to their underlying `--gieds-*` tokens via the compiled `dist/styles.css`
4. `tokenUsage.json` contains two top-level keys: `byToken` (token name → component name array) and `byComponent` (component name → token name array with categories)
5. The TokenDetail component displays a "Used by" section listing the design-system-react components that reference the selected token
6. A new `/usage` route displays a searchable, browsable list of all design-system-react components with their token dependencies grouped by category
7. Clicking a token in the `/usage` page navigates to that token's detail page in its category route
8. Clicking a component name links to the external Storybook at `ds.services.gov.ie/storybook-react` where available
9. The `generate-token-usage` script is idempotent and runs via `pnpm generate-token-usage`
10. Co-located unit tests verify the scanner correctly extracts token references from sample CSS and JS content

## Tasks / Subtasks

- [x] Task 1: Build-time token usage scanner — `scripts/generate-token-usage.ts` (AC: #1, #2, #3, #9)
  - [x] Locate the `@ogcio/design-system-react` package using `createRequire` + `require.resolve`
  - [x] Parse `dist/styles.css` to build a map of `gi-*` utility classes → `--gieds-*` CSS variables they reference
  - [x] Scan all `dist/**/*.js` files, extract component names from directory structure (e.g. `dist/alert/` → `Alert`)
  - [x] For each component JS file, extract inline `var(--gieds-*)` references and `gi-*` class name strings
  - [x] Resolve `gi-*` classes to their underlying `--gieds-*` tokens using the styles.css map
  - [x] Deduplicate and merge into `byToken` and `byComponent` mappings
  - [x] Write `src/data/tokenUsage.json`
  - [x] Add `"generate-token-usage": "tsx scripts/generate-token-usage.ts"` to package.json scripts
- [x] Task 2: Token usage data types — `src/types/tokenUsage.ts` (AC: #4)
  - [x] Define `TokenUsageMap` interface with `byToken` and `byComponent` shapes
  - [x] Define `ComponentTokenEntry` with component name, category, and token list
- [x] Task 3: Scanner unit tests — `src/lib/pipeline/tokenUsageScanner.test.ts` (AC: #10)
  - [x] Test extraction of `var(--gieds-*)` from JS content
  - [x] Test extraction of `gi-*` class names from JS content
  - [x] Test resolution of `gi-*` classes to `--gieds-*` tokens via CSS
  - [x] Test component name derivation from file paths
- [x] Task 4: Enhance TokenDetail with "Used by" section (AC: #5, #8)
  - [x] Import `tokenUsage.json` as static data
  - [x] Add a "Used by" section below the existing copy/permalink buttons
  - [x] List component names as pills/chips with optional Storybook links
  - [x] Show empty state if no components reference the token
- [x] Task 5: Create `/usage` route page (AC: #6, #7, #8)
  - [x] Create `src/app/usage/page.tsx` with a list of all design-system-react components
  - [x] Add a filter input for searching components by name
  - [x] Show each component's token dependencies grouped by category (color, spacing, typography, border, shadow)
  - [x] Each token entry links to its detail page in the appropriate category route
  - [x] Add "Usage" to the AppNav navigation links
- [x] Task 6: Integration — wire into build pipeline
  - [x] Ensure `generate-token-usage` can run independently or as part of the full pipeline
  - [x] Verify `tokenUsage.json` is gitignored alongside other generated data files
  - [x] Log summary stats: components analyzed, tokens mapped, unmapped tokens count

## Dev Notes

### CRITICAL: Structure of @ogcio/design-system-react@1.34.0 Compiled Output

The package is compiled via Vite + Tailwind CLI. Understanding its structure is essential for the scanner:

**Package layout:**
- `dist/index.js` — re-exports all components (minified ESM)
- `dist/index.d.ts` — TypeScript declarations for all exports
- `dist/styles.css` — single minified Tailwind v3.4 CSS bundle containing all utility classes
- `dist/<component>/` — per-component directories (e.g. `dist/alert/`, `dist/atoms/Button.js`)
  - Contains `variants.js` (Tailwind Variants definitions with `gi-*` classes)
  - Contains component JS files with occasional inline `var(--gieds-*)` references

**Two token reference patterns to scan:**

1. **`gi-*` utility classes in JS** — Most token references are via semantic Tailwind classes like `gi-bg-color-surface-intent-info-default`, `gi-text-color-text-intent-info-default`, `gi-border-color-border-intent-info-subtle`. These appear as string literals in `variants.js` files and component JS. Each `gi-*` class maps to one or more `--gieds-*` CSS variables in `dist/styles.css`.

2. **Direct `var(--gieds-*)` in JS** — A few components embed CSS variable references directly as inline styles or arbitrary Tailwind values. Examples: focus rings in `dist/details/details.js`, spacing in `dist/footer/footer.js` (`var(--gieds-space-80)`).

**Component name derivation:**
- The `dist/` directory contains subdirectories named after components: `alert`, `accordion`, `atoms`, `breadcrumbs`, `button`, `card`, `checkbox`, `chip`, `combobox`, `cookie-banner`, `details`, `drawer`, `dropdown`, `file-upload`, `footer`, `form`, `header`, `heading`, `icons`, `inset-text`, `link`, `list`, `logos`, `modal`, `pagination`, `paragraph`, `phase-banner`, `popover`, `progress-bar`, `progress-stepper`, `radio`, `score-select`, `section-break`, `select`, `select-next`, `side-nav`, `spinner`, `stack`, `summary-list`, `table`, `tabs`, `tag`, `text-area`, `text-input`, `toast`, `tooltip`
- Convert directory names to PascalCase for display: `cookie-banner` → `CookieBanner`, `text-input` → `TextInput`
- The `atoms/` directory contains sub-components — scan recursively

### CSS Parsing Strategy for gi-* → --gieds-* Resolution

The `dist/styles.css` file is minified Tailwind output. Each `gi-*` class is a CSS rule like:

```css
.gi-bg-color-surface-intent-info-default{background-color:var(--gieds-color-surface-intent-info-default)}
```

**Parsing approach:**
1. Use PostCSS (already installed) to parse `dist/styles.css`
2. Walk all rules, extract selector (`.gi-*` class name) and declarations
3. For each declaration value containing `var(--gieds-*)`, record the mapping
4. Build a `Map<string, string[]>` of gi-class → gieds-token-names

This reuses the same PostCSS dependency from Story 1.2 — no new dependencies needed.

### JS Scanning Strategy for Token References

Component JS files are minified ESM. Token references appear as string literals:

**For `var(--gieds-*)` references:**
Use regex: `var\(--gieds-[a-zA-Z0-9-]+\)` to extract all CSS variable references from JS content.

**For `gi-*` class references:**
Use regex: `gi-[a-zA-Z0-9-]+` to extract all utility class names from JS string literals.
Note: may have false positives from minified variable names. Filter to only classes that exist in the styles.css map.

**Scan all `.js` files under `dist/`** (excluding `index.js` which just re-exports). Group findings by parent component directory.

### tokenUsage.json Data Shape

```typescript
interface TokenUsageData {
  byToken: Record<string, string[]>;
  byComponent: Record<string, {
    tokens: string[];
    categories: Record<TokenCategory, string[]>;
  }>;
  meta: {
    packageVersion: string;
    componentsAnalyzed: number;
    tokensReferenced: number;
    generatedAt: string;
  };
}
```

Example:
```json
{
  "byToken": {
    "--gieds-color-surface-intent-info-default": ["Alert", "Toast"],
    "--gieds-space-80": ["Footer"]
  },
  "byComponent": {
    "Alert": {
      "tokens": ["--gieds-color-surface-intent-info-default", "--gieds-color-border-intent-info-subtle"],
      "categories": {
        "color": ["--gieds-color-surface-intent-info-default", "--gieds-color-border-intent-info-subtle"],
        "spacing": [],
        "typography": [],
        "border": [],
        "shadow": [],
        "other": []
      }
    }
  },
  "meta": {
    "packageVersion": "1.34.0",
    "componentsAnalyzed": 45,
    "tokensReferenced": 200,
    "generatedAt": "2026-04-10T18:00:00Z"
  }
}
```

### UI Integration: TokenDetail "Used by" Section

Add below the existing copy/permalink buttons in `src/components/TokenDetail.tsx`:

- Import `tokenUsage` from `@/data/tokenUsage.json`
- Look up `tokenUsage.byToken[token.name]` to get component list
- Render as small rounded pills/chips (similar to CategoryChips style)
- Each pill links to `https://ds.services.gov.ie/storybook-react/?path=/docs/components-${kebabCase(name)}--docs` (Storybook convention)
- If no components reference the token, show a subtle "Not directly used by any component" message
- Keep the section visually lightweight — this is supplementary context, not the primary detail

### UI Integration: /usage Route

Create `src/app/usage/page.tsx` following the same layout patterns as other category pages:

- No SplitPanel for this page — use a single-column card-based layout
- Filter input at top (reuse `FilterInput` component pattern)
- Each component card shows:
  - Component name (PascalCase) as heading
  - Token count badge
  - Grouped token lists by category with mini color swatches for color tokens
  - Link to Storybook docs
- Clicking a token navigates to its category page with the token selected: e.g. `/colors?token=gieds-color-surface-intent-info-default`

### AppNav Update

Add `{ href: '/usage', label: 'Usage' }` to the `NAV_LINKS` array in `src/components/AppNav.tsx`.

### Architecture Compliance

**File locations (MUST follow exactly):**
- `scripts/generate-token-usage.ts` — Build-time entry script
- `src/lib/pipeline/tokenUsageScanner.ts` — Core scanner logic (testable, separate from script orchestration)
- `src/lib/pipeline/tokenUsageScanner.test.ts` — Co-located unit tests
- `src/types/tokenUsage.ts` — TypeScript interfaces
- `src/data/tokenUsage.json` — Generated output (gitignored)
- `src/app/usage/page.tsx` — Usage route page
- `src/components/TokenDetail.tsx` — Modified to include "Used by" section

**Import style:** Use `@/*` absolute imports. Group: Node.js built-ins first, then external packages, then `@/` internal imports.

**TypeScript:** Use strict types. Reference existing `Token` and `TokenCategory` from `@/types/token`. Define new interfaces in `@/types/tokenUsage.ts`.

**Testing:** Use Vitest. Co-locate tests. Test the scanner logic with synthetic CSS/JS content, not just against the live package (which may change).

**No new runtime dependencies:** PostCSS is already installed for build-time use. The scanner is build-time only (Node.js), never runs in the browser. `tokenUsage.json` is consumed as a static import by client-side components.

### Previous Story Intelligence

From the completed stories in Epic 1 and Epic 2:

- **PostCSS parsing pattern** from Story 1.2: use `postcss.parse(css)` + `walkDecls()` / `walkRules()` — same approach applies to scanning `dist/styles.css`
- **File resolution pattern** from Story 1.2: use `createRequire(import.meta.url)` + `require.resolve()` to locate packages — same approach for finding `@ogcio/design-system-react`
- **Data generation pattern** from `scripts/generate-tokens.ts`: follow the same structure (validate → scan → transform → write JSON → log summary)
- **TokenDetail component** is a simple functional component with props — adding a "Used by" section is straightforward composition
- **Category pages** use `CategoryPage` component with `SplitPanel` — the `/usage` page should NOT use SplitPanel (different information architecture)
- **FilterInput** component exists and handles real-time substring filtering with highlight and clear button
- **URL state encoding** uses `?token=` query param for token selection — reuse for cross-linking from `/usage` to category pages

### Storybook URL Convention

The `@ogcio/design-system-react` Storybook is hosted at `ds.services.gov.ie/storybook-react`. The URL pattern for component docs is:

```
https://ds.services.gov.ie/storybook-react/?path=/docs/components-<kebab-case-name>--docs
```

Example: `Alert` → `https://ds.services.gov.ie/storybook-react/?path=/docs/components-alert--docs`

Not all components may have Storybook pages. The link should be rendered as a regular anchor (`<a>`) with `target="_blank"` and `rel="noopener noreferrer"`. If Storybook availability cannot be determined at build time, render all links and let 404s happen naturally.

### Anti-Patterns to Avoid

- Do NOT import `@ogcio/design-system-react` components at runtime — this story is about scanning the compiled output at build time, not rendering the components
- Do NOT attempt to parse source TypeScript — the package only ships compiled JS and CSS
- Do NOT add `@ogcio/design-system-react/styles.css` to the app's CSS imports — the explorer uses its own neutral theme
- Do NOT create a `utils/` directory — scanner logic goes in `src/lib/pipeline/tokenUsageScanner.ts`
- Do NOT hardcode component names — derive them from the `dist/` directory structure dynamically
- Do NOT store the full CSS content of each component — only store token name references
- Do NOT make the scanner synchronous-only if async reads perform better — `readFileSync` is fine for build-time scripts but `readdir`/`readFile` async are acceptable too
- Do NOT assume all `gi-*` strings in minified JS are valid class names — validate against the styles.css class map

### What SUCCESS Looks Like

After this story is complete:
1. Running `pnpm generate-token-usage` produces `src/data/tokenUsage.json` with ~40+ components and their token references
2. The TokenDetail panel for any token shows which components use it (or "Not directly used" if none)
3. The `/usage` page lists all design-system-react components with their token dependencies
4. Clicking a token in `/usage` navigates to the correct category page with that token selected
5. The scanner handles minified JS and CSS correctly without false positives from variable name collisions
6. All unit tests pass with `pnpm test`
7. The build pipeline runs without errors: `pnpm generate-tokens && pnpm generate-token-usage && pnpm build`

### Project Structure Notes

- New files in `src/lib/pipeline/` extend the existing build-time boundary — same pattern as `parseCss.ts` and `categorize.ts`
- `src/data/tokenUsage.json` joins `tokens.json` and `contrastMatrix.json` as a generated data file — should be gitignored
- The `/usage` route is a new App Router page alongside existing category routes
- `src/types/tokenUsage.ts` adds to the shared type boundary

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.1]
- [Source: node_modules/@ogcio/design-system-react/dist/ — compiled package structure analysis]
- [Source: node_modules/@ogcio/design-system-react/dist/alert/variants.js — gi-* class pattern example]
- [Source: node_modules/@ogcio/design-system-react/dist/styles.css — Tailwind CSS bundle]
- [Source: node_modules/@ogcio/design-system-react/README.md — consumer integration docs]
- [Source: src/components/TokenDetail.tsx — existing detail panel to extend]
- [Source: src/components/AppNav.tsx — navigation links to update]
- [Source: scripts/generate-tokens.ts — pipeline script pattern to follow]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- `require.resolve('@ogcio/design-system-react/package.json')` fails because package.json is not in the `exports` field. Fallback: resolve the main entry point then navigate up to find package.json.
- `dist/styles.css` is minified Tailwind v3.4 output — PostCSS parses it correctly. The `.gi-*` selector extraction works via `walkRules` + regex on the selector string.
- Minified JS contains `gi-` prefixed class strings as string literals in variant definitions — regex extraction with validation against the CSS class map eliminates false positives.
- 52 components found (vs ~45 predicted in story notes) — some sub-packages like `data-table`, `character-count`, `error-text`, `hint-text`, `label` are separate component directories.

### Completion Notes List

- Implemented `src/lib/pipeline/tokenUsageScanner.ts` — core scanner with PostCSS-based gi-class→token resolution and regex-based JS scanning. Handles both `var(--gieds-*)` direct references and `gi-*` utility class resolution.
- Implemented `scripts/generate-token-usage.ts` — build-time entry script following the same pattern as `generate-tokens.ts`. Locates package, runs scanner, writes JSON, logs summary.
- Created `src/types/tokenUsage.ts` — TypeScript interfaces for `TokenUsageData`, `ComponentTokenEntry`, `TokenUsageMeta`.
- Created 20 unit tests in `tokenUsageScanner.test.ts` covering all exported functions: `kebabToPascal`, `extractVarGiedsFromJs`, `extractGiClassesFromJs`, `buildGiClassToTokenMap`, `resolveGiClassesToTokens`, `groupTokensByCategory`.
- Enhanced `TokenDetail.tsx` with "Used by" section showing component pills that link to Storybook docs at ds.services.gov.ie/storybook-react.
- Created `/usage` route with `UsageContent.tsx` — card-based layout with FilterInput, component cards showing token counts by category, expandable token lists with color swatches, links to category detail pages and Storybook.
- Added "Usage" link to AppNav navigation.
- Added `"generate-token-usage"` script to package.json.
- Added `/src/data/*.json` to `.gitignore` for generated data files.
- Scanner results: 52 components analyzed, 191 unique tokens referenced from @ogcio/design-system-react@1.34.0.
- All 168 tests pass (14 test files), lint passes (biome), build succeeds with 11 routes including `/usage`.

### File List

- scripts/generate-token-usage.ts (new)
- src/lib/pipeline/tokenUsageScanner.ts (new)
- src/lib/pipeline/tokenUsageScanner.test.ts (new)
- src/types/tokenUsage.ts (new)
- src/data/tokenUsage.json (new, generated)
- src/app/usage/page.tsx (new)
- src/app/usage/UsageContent.tsx (new)
- src/components/TokenDetail.tsx (modified — added "Used by" section)
- src/components/AppNav.tsx (modified — added "Usage" nav link)
- package.json (modified — added generate-token-usage script)
- .gitignore (modified — added /src/data/*.json)
