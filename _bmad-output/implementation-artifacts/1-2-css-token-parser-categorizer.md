# Story 1.2: CSS Token Parser & Categorizer

Status: review

## Story

As a developer,
I want the build-time pipeline to parse CSS custom properties from theme-govie and categorize them by type,
So that all design tokens are accurately extracted and organized for the UI to consume.

## Acceptance Criteria

1. `parseCss.ts` reads the `@ogcio/theme-govie` CSS theme files using PostCSS and extracts all CSS custom properties as raw token objects
2. `categorize.ts` classifies each token into one of: color, spacing, typography, border, shadow, or other
3. Each token carries its name, category, light value, dark value, and raw CSS property
4. `colorUtils.ts` correctly parses hex, RGB, and HSL color formats
5. Co-located unit tests in `parseCss.test.ts` and `categorize.test.ts` verify extraction correctness and edge cases
6. The parser handles the actual `@ogcio/theme-govie@1.21.4` CSS structure (`:root` and `[data-theme]` attribute selectors, `var()` references) without failing

## Tasks / Subtasks

- [x] Task 1: Implement CSS parser — `src/lib/pipeline/parseCss.ts` (AC: #1, #3, #6)
  - [x] Read light.css and dark.css from `@ogcio/theme-govie/dist/`
  - [x] Use PostCSS `parse()` + `walkDecls(/^--/, cb)` to extract all `--gieds-*` custom properties
  - [x] Build light-value map from light.css's `[data-theme="govie-light"]` rule
  - [x] Build dark-value map from dark.css's `[data-theme="govie-dark"]` rule
  - [x] Merge by property name into raw token objects with `{ name, lightValue, darkValue, rawProperty }`
  - [x] Handle tokens that exist in only one theme (use the other theme's value as fallback)
  - [x] Resolve `node_modules/@ogcio/theme-govie/dist/` path using `require.resolve` or `createRequire`
- [x] Task 2: Implement color utilities — `src/lib/colorUtils.ts` (AC: #4)
  - [x] Parse hex colors (#RGB, #RRGGBB, #RRGGBBAA)
  - [x] Parse `rgb()` / `rgba()` notation
  - [x] Parse `hsl()` / `hsla()` notation
  - [x] Provide `isColor(value: string): boolean` detection function
  - [x] Co-located tests in `src/lib/colorUtils.test.ts`
- [x] Task 3: Implement token categorizer — `src/lib/pipeline/categorize.ts` (AC: #2)
  - [x] Categorize using token name prefix patterns from the `--gieds-*` naming convention
  - [x] Map prefixes to categories: color, spacing/sizing, typography, border, shadow, other
  - [x] Return `Token[]` array with the `category` field populated
- [x] Task 4: Write comprehensive tests (AC: #5)
  - [x] `src/lib/pipeline/parseCss.test.ts` — verify extraction from actual theme-govie CSS files
  - [x] `src/lib/pipeline/categorize.test.ts` — verify categorization rules with known token samples
  - [x] Ensure `pnpm test` script exists in package.json (add `"test": "vitest run"` if missing)
- [x] Task 5: Integration verification
  - [x] Run parser against actual `@ogcio/theme-govie@1.21.4` and verify token count is reasonable (~600+ tokens)
  - [x] Verify all categories have at least one token
  - [x] Verify no tokens are lost in the merge (light + dark counts match)

## Dev Notes

### CRITICAL: Actual CSS Structure of @ogcio/theme-govie@1.21.4

The architecture doc mentions parsing "CSS theme files" generically. The ACTUAL structure is very specific and the developer MUST understand it:

**Package exports 3 CSS files:**
- `dist/theme.css` — Contains BOTH `:root { ... }` (light/base) AND `[data-theme="govie-dark"] { ... }` blocks
- `dist/light.css` — Contains `[data-theme="govie-light"] { ... }` block only
- `dist/dark.css` — Contains `[data-theme="govie-dark"] { ... }` block only

**Recommended parsing strategy:** Parse `light.css` and `dark.css` separately. Both use attribute selectors (`[data-theme="govie-light"]` and `[data-theme="govie-dark"]`), NOT `@media (prefers-color-scheme)`. This is a critical deviation from what the architecture doc might imply.

**Token naming convention:** All tokens use the `--gieds-` prefix (Government of Ireland Electronic Design System).

**Token count:** ~665 custom properties per theme file (~1333 lines in theme.css). Expect 600-700 unique token names.

**Composite tokens:** Many semantic tokens use `var()` references to other tokens. For example:
```css
--gieds-color-text-tone-primary-fill-default: var(--gieds-color-neutral-white);
--gieds-surface-primary-default: var(--gieds-color-emerald-800);
--gieds-typography-default-heading-xl: var(--gieds-type-scale-heading-bold-700);
```

The parser should store the raw `var(--gieds-...)` string as the value — do NOT attempt to resolve `var()` references at parse time. Resolution is a separate concern for the UI or a future pipeline step.

### PostCSS API for This Task

Use `postcss.parse()` (synchronous, no plugins needed) to get the AST, then `walkDecls(/^--/, cb)` to find custom properties:

```typescript
import postcss from 'postcss';
import { readFileSync } from 'fs';

const css = readFileSync(cssPath, 'utf8');
const root = postcss.parse(css, { from: cssPath });
const tokens: Record<string, string> = {};

root.walkDecls(/^--/, (decl) => {
  tokens[decl.prop] = decl.value;
});
```

The CSS files have a single top-level rule each (`:root` or `[data-theme="..."]`), so all `--gieds-*` declarations are direct children of that one rule. No complex nesting, no `@layer`, no `@media` to traverse.

### Token Categories — Mapping from --gieds-* Prefixes

Based on analysis of the actual CSS content, categorize using these prefix rules:

| Prefix Pattern | Category | Examples |
|---------------|----------|----------|
| `--gieds-color-*` | `"color"` | `--gieds-color-gray-500`, `--gieds-color-text-tone-primary-fill-default`, `--gieds-color-surface-*`, `--gieds-color-icon-*`, `--gieds-color-border-*`, `--gieds-color-shadow-*` |
| `--gieds-border-width-*` | `"border"` | `--gieds-border-width-100` through `--gieds-border-width-800` |
| `--gieds-border-radius-*` | `"border"` | `--gieds-border-radius-100` through `--gieds-border-radius-full` |
| `--gieds-font-*` | `"typography"` | `--gieds-font-family-*`, `--gieds-font-size-*`, `--gieds-font-weight-*`, `--gieds-font-line-height-*` |
| `--gieds-type-scale-*` | `"typography"` | `--gieds-type-scale-heading-bold-*`, `--gieds-type-scale-text-*` |
| `--gieds-typography-*` | `"typography"` | `--gieds-typography-default-heading-*`, `--gieds-typography-xl-text-*` |
| `--gieds-surface-*` | `"color"` | `--gieds-surface-primary-default` (these resolve to color values) |
| `--gieds-spacing-*` | `"spacing"` | If any spacing tokens exist |
| Everything else | `"other"` | Fallback for unrecognized patterns |

**Important nuances:**
- `--gieds-color-border-*` is a COLOR token (color of borders), not a border dimension token → category `"color"`
- `--gieds-color-shadow-*` is a COLOR token (color of shadows), not a shadow shorthand → category `"color"`
- `--gieds-border-width-*` and `--gieds-border-radius-*` are BORDER dimension tokens → category `"border"`
- `--gieds-surface-*` tokens resolve to color values → category `"color"`
- There are NO `--gieds-shadow-*` shorthand tokens in this version (shadow is only a color category)
- There are NO `--gieds-spacing-*` tokens visible in the current CSS — spacing may be absent

The categorizer should use a cascading prefix match (longest match wins) to handle these overlaps correctly.

### Architecture Compliance

**File locations (MUST follow exactly):**
- `src/lib/pipeline/parseCss.ts` — CSS parser
- `src/lib/pipeline/parseCss.test.ts` — Parser tests
- `src/lib/pipeline/categorize.ts` — Token categorizer
- `src/lib/pipeline/categorize.test.ts` — Categorizer tests
- `src/lib/colorUtils.ts` — Color parsing utilities
- `src/lib/colorUtils.test.ts` — Color utility tests

**Import style:** Use `@/*` absolute imports. Group: Node.js built-ins first, then external packages, then `@/` internal imports, separated by blank lines.

**TypeScript interfaces:** Use the canonical `Token` and `TokenCategory` types from `@/types/token`. Do NOT create alternative type definitions.

**Testing:** Use Vitest (already installed). Co-locate tests next to source files. Test with actual `@ogcio/theme-govie` CSS from node_modules.

**No runtime dependencies:** PostCSS is a build-time-only dependency. `parseCss.ts` and `categorize.ts` will run in Node.js during the build pipeline, never in the browser.

### Previous Story Intelligence (Story 1.1)

Story 1.1 established the project foundation. Key facts from that implementation:

- **Project scaffolded** with Next.js 16.2.3, React 19.2.4, TypeScript 5.x, Tailwind v4
- **Packages installed:** `@ogcio/theme-govie@1.21.4`, `postcss@8.5.9`, `vitest@4.1.4`
- **Types defined:** `Token`, `ColorToken`, `ContrastPair`, `TokenCategory` in `src/types/token.ts`
- **Directory structure created** but `src/lib/pipeline/` contains only `.gitkeep`
- **Vitest configured** in `vitest.config.ts` with globals and `@` alias, but NO `"test"` script in package.json — the dev agent should add `"test": "vitest run"` to package.json scripts
- **3 existing tests** pass: `token.test.ts`, `alias.test.ts`, `theme.test.ts`
- **Build works:** `pnpm build` produces `out/` successfully

### colorUtils.ts Scope

The architecture specifies `colorUtils.ts` for hex/RGB/HSL parsing. For THIS story, the primary need is:

1. `isColor(value: string): boolean` — detect if a raw CSS value is a color (needed by categorizer as a secondary signal)
2. `parseHex(hex: string): { r: number; g: number; b: number }` — parse hex to RGB components (needed by Story 1.3 for WCAG computation)
3. `parseRgb(rgb: string): { r: number; g: number; b: number }` — parse `rgb()`/`rgba()` strings
4. `parseHsl(hsl: string): { r: number; g: number; b: number }` — parse `hsl()`/`hsla()` and convert to RGB

Keep it focused. The WCAG contrast ratio computation itself belongs in Story 1.3 (`wcag.ts`), not here.

### What SUCCESS Looks Like

After this story is complete:
1. Running the parser against `@ogcio/theme-govie@1.21.4` extracts ~600-700 tokens
2. Every token has a `name`, `category`, `lightValue`, `darkValue`, and `rawProperty`
3. Color tokens are correctly identified (hundreds of `--gieds-color-*` tokens)
4. Border tokens (`--gieds-border-width-*`, `--gieds-border-radius-*`) are categorized as `"border"`
5. Typography tokens (`--gieds-font-*`, `--gieds-type-scale-*`, `--gieds-typography-*`) are categorized as `"typography"`
6. All tests pass with `pnpm test` (which must be a working script)
7. No tokens are silently dropped — the parser accounts for every `--gieds-*` declaration

### Anti-Patterns to Avoid

- Do NOT try to resolve `var()` references at parse time — store the raw `var(--gieds-...)` string
- Do NOT hardcode file paths to node_modules — use `require.resolve` or `createRequire` to locate the package
- Do NOT use `fs/promises` async when synchronous `readFileSync` is simpler for build-time scripts
- Do NOT create a `utils/` directory — color utilities go in `src/lib/colorUtils.ts`
- Do NOT import PostCSS plugins — use bare `postcss.parse()` only (no processing needed)
- Do NOT filter out `var()` reference tokens — they are valid semantic tokens the UI will display
- Do NOT assume `@media (prefers-color-scheme)` — the CSS uses `[data-theme]` attribute selectors

### Project Structure Notes

- Files created in this story live in `src/lib/pipeline/` and `src/lib/` — both within the build-time boundary
- These files are Node.js-only (filesystem access via `fs`), never imported by client-side code
- The `.gitkeep` files in `src/lib/pipeline/` can be removed once real files are added
- No changes to `src/app/`, `src/components/`, or `src/hooks/` in this story

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- [Source: _bmad-output/planning-artifacts/prd.md#Token Data Pipeline]
- [Source: node_modules/@ogcio/theme-govie/dist/theme.css — actual CSS structure analysis]
- [Source: node_modules/@ogcio/theme-govie/dist/light.css — light theme structure]
- [Source: node_modules/@ogcio/theme-govie/dist/dark.css — dark theme structure]

## Dev Agent Record

### Agent Model Used

Claude claude-4.6-opus (Amelia persona)

### Debug Log References

- Initial `require.resolve('@ogcio/theme-govie/package.json')` failed because the package's `exports` field restricts subpath access. Fixed by resolving `@ogcio/theme-govie/light.css` and `@ogcio/theme-govie/dark.css` directly (both are exported).
- Discovered actual token prefixes differ from story notes: `--gieds-space-*` (not `--gieds-spacing-*`), `--gieds-shadow-*` shorthand tokens do exist (6 tokens), `--gieds-size-*` tokens present. Updated categorizer rules accordingly.

### Completion Notes List

- Implemented `parseCss.ts` — reads light.css/dark.css via PostCSS, extracts 664 unique tokens, merges light/dark values with fallback
- Implemented `colorUtils.ts` — parseHex (3/4/6/8 digit), parseRgb, parseHsl with HSL-to-RGB conversion, isColor detection
- Implemented `categorize.ts` — cascading prefix-match rules: color (433), spacing (53), typography (119), border (15), shadow (6), other (38)
- Added `"test": "vitest run"` to package.json scripts
- 71 tests passing (66 existing + 5 new), 0 lint errors
- Token count: 664 (within 600-700 expected range), all categories populated, no tokens lost in merge, var() references preserved as raw strings

### File List

- src/lib/pipeline/parseCss.ts (new)
- src/lib/pipeline/parseCss.test.ts (new)
- src/lib/pipeline/categorize.ts (new)
- src/lib/pipeline/categorize.test.ts (new)
- src/lib/colorUtils.ts (new)
- src/lib/colorUtils.test.ts (new)
- src/lib/pipeline/.gitkeep (deleted)
- package.json (modified — added "test" script)
