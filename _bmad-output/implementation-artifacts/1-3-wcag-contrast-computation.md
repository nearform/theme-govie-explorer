# Story 1.3: WCAG Contrast Computation

Status: review

## Story

As a developer,
I want the pipeline to pre-compute WCAG contrast ratios for all color token pairs,
So that the contrast checker has instant access to accessibility compliance data without runtime computation.

## Acceptance Criteria

1. `wcag.ts` computes relative luminance and contrast ratios for all color token pairs
2. Each pair produces a `ContrastPair` with: token names, contrast ratio (1–21), `meetsAA` (≥4.5:1), and `meetsAAA` (≥7:1) flags
3. The computation handles all supported color formats (hex, RGB, HSL)
4. Co-located unit tests in `wcag.test.ts` verify known contrast ratios and edge values (black/white = 21:1, identical colors = 1:1)
5. The implementation is zero-dependency (~30 lines)

## Tasks / Subtasks

- [x] Task 1: Implement WCAG 2.1 relative luminance and contrast ratio — `src/lib/pipeline/wcag.ts` (AC: #1, #2, #5)
  - [x] Implement `relativeLuminance(rgb: RGB): number` per WCAG 2.1 formula
  - [x] Implement `contrastRatio(l1: number, l2: number): number` returning ratio 1–21
  - [x] Implement `checkContrast(color1: RGB, color2: RGB): { ratio: number; meetsAA: boolean; meetsAAA: boolean }`
  - [x] Export WCAG threshold constants: `WCAG_AA_THRESHOLD = 4.5`, `WCAG_AAA_THRESHOLD = 7`
- [x] Task 2: Implement color pair matrix computation (AC: #1, #3)
  - [x] Implement `computeContrastPairs(tokens: Token[]): Map<string, ContrastPair[]>` that filters to color tokens with resolvable color values
  - [x] Parse color values via `colorUtils.ts` (hex, RGB, HSL) — skip tokens with `var()` references
  - [x] Compute all unique pairs (n*(n-1)/2), avoid duplicate reverse pairs
- [x] Task 3: Write comprehensive unit tests — `src/lib/pipeline/wcag.test.ts` (AC: #4)
  - [x] Test black/white contrast = 21:1
  - [x] Test identical colors contrast = 1:1
  - [x] Test known WCAG AA boundary (ratio ~4.5)
  - [x] Test known WCAG AAA boundary (ratio ~7)
  - [x] Test relative luminance edge cases (pure RGB primaries)
  - [x] Test integration with actual theme-govie color tokens
- [x] Task 4: Verify zero-dependency constraint (AC: #5)
  - [x] Confirm wcag.ts imports only from `@/lib/colorUtils` and `@/types/token` — no external packages

## Dev Notes

### WCAG 2.1 Contrast Ratio Formula

**Relative luminance** (per WCAG 2.1 definition):
```
L = 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin
```

Where each channel (R, G, B as 0–1 sRGB):
```
if C_sRGB <= 0.04045:  C_lin = C_sRGB / 12.92
else:                   C_lin = ((C_sRGB + 0.055) / 1.055) ^ 2.4
```

**Contrast ratio**:
```
ratio = (L_lighter + 0.05) / (L_darker + 0.05)
```

Where L_lighter is the higher luminance value.

### Architecture Compliance

- File: `src/lib/pipeline/wcag.ts` + `src/lib/pipeline/wcag.test.ts`
- Uses `@/*` absolute imports
- Uses `RGB` type and parse functions from `@/lib/colorUtils`
- Uses `ContrastPair` from `@/types/token`
- Zero external dependencies — only uses built-in math
- Constants: `WCAG_AA_THRESHOLD`, `WCAG_AAA_THRESHOLD`

### Key Implementation Decision: Skip var() Tokens

Many color tokens have `var(--gieds-...)` as their value (references to other tokens). These cannot be resolved to a color at build time without a full CSS resolution engine. The pipeline should:
- Only compute contrast pairs for tokens with resolvable color values (hex, rgb, hsl)
- Skip tokens whose values are `var()` references
- The UI will handle unresolvable tokens separately

### Previous Story Intelligence (Story 1.2)

- `parseCss()` extracts 664 tokens, 433 categorized as color
- `colorUtils.ts` provides `parseHex()`, `parseRgb()`, `parseHsl()`, `isColor()`
- Many color tokens have `var()` references (~401 of 664 total). Only tokens with direct color values (hex/rgb/hsl) will produce contrast pairs.
- `Token` and `ContrastPair` interfaces in `@/types/token`

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#WCAG Contrast Computation]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3]
- [WCAG 2.1 Contrast Ratio Definition](https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio)

## Dev Agent Record

### Agent Model Used

Claude claude-4.6-opus (Amelia persona)

### Debug Log References

No issues encountered. All tasks completed on first attempt.

### Completion Notes List

- Implemented `relativeLuminance()` per WCAG 2.1 sRGB linearization formula (channel ≤ 0.04045 → /12.92, else ((c+0.055)/1.055)^2.4)
- Implemented `contrastRatio()` — (lighter+0.05)/(darker+0.05), always ≥ 1
- Implemented `checkContrast()` — returns ratio rounded to 2 decimals + meetsAA/meetsAAA booleans
- Implemented `computeContrastPairs()` returning `Map<string, ContrastPair[]>` — filters to color tokens with resolvable values (hex/rgb/hsl), skips var() references, computes all unique pairs bidirectionally
- Exported `WCAG_AA_THRESHOLD = 4.5` and `WCAG_AAA_THRESHOLD = 7` constants
- 23 new tests covering: luminance edge cases, contrast ratio symmetry, AA/AAA boundaries, var() skipping, multi-format parsing, integration with actual theme-govie tokens
- Zero external dependencies — only imports from `@/lib/colorUtils` and `@/types/token`
- 94 total tests passing, 0 lint errors

### File List

- src/lib/pipeline/wcag.ts (new)
- src/lib/pipeline/wcag.test.ts (new)
