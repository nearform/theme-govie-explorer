# Story 1.4: Token Pipeline Orchestration & Build Validation

Status: review

## Story

As a developer,
I want a single pre-build script that runs the full pipeline and validates the output,
So that token data is always fresh, accurate, and the build fails clearly on errors.

## Acceptance Criteria

1. `scripts/generate-tokens.ts` reads theme-govie CSS, runs the full pipeline, and writes `tokens.json` and `contrastMatrix.json` to `src/data/`
2. `validate.ts` checks the extracted token count and logs a warning if it deviates from the expected range
3. The build fails with a clear, descriptive error message if `@ogcio/theme-govie` is missing or the CSS structure is unrecognizable (NFR14)
4. Co-located unit tests in `validate.test.ts` verify validation thresholds
5. The full pipeline completes in under 30 seconds (NFR15)
6. `pnpm generate-tokens` is a configured script in `package.json`

## Tasks / Subtasks

- [x] Task 1: Implement validation module — `src/lib/pipeline/validate.ts` (AC: #2, #3)
  - [x] Implement `validateTokenCount(count: number): { valid: boolean; warning?: string }` with expected range 500-800
  - [x] Implement `validateCssStructure(lightCss: string, darkCss: string): { valid: boolean; error?: string }` checking for data-theme selectors
  - [x] Implement `validatePackageAvailable(): { available: boolean; error?: string }` checking if @ogcio/theme-govie resolves
  - [x] Co-located tests in `validate.test.ts`
- [x] Task 2: Implement pipeline orchestrator — `scripts/generate-tokens.ts` (AC: #1, #3, #5)
  - [x] Install `tsx` as dev dependency for running TypeScript scripts with path alias support
  - [x] Import parseCss, categorize, computeContrastPairs, and validate functions
  - [x] Run full pipeline: parse → categorize → compute WCAG → validate → write JSON
  - [x] Write `tokens.json` (all tokens as Token[]) to `src/data/`
  - [x] Write `contrastMatrix.json` (contrast pair map serialized) to `src/data/`
  - [x] Log pipeline summary (token count, category breakdown, contrast pairs count, elapsed time)
  - [x] Exit with code 1 on validation failure
- [x] Task 3: Configure package.json script (AC: #6)
  - [x] Add `"generate-tokens": "tsx scripts/generate-tokens.ts"` to package.json scripts
- [x] Task 4: Verify full pipeline execution (AC: #1, #5)
  - [x] Run `pnpm generate-tokens` and verify `src/data/tokens.json` and `src/data/contrastMatrix.json` are written
  - [x] Verify pipeline completes in under 30 seconds (actual: 0.02s)
  - [x] Verify JSON file contents are valid and match expected structure

## Dev Notes

### Architecture Compliance

- `scripts/generate-tokens.ts` — Build-time entry point
- `src/lib/pipeline/validate.ts` + `validate.test.ts` — Validation logic
- Uses `@/*` imports (resolved by tsx)
- Output files: `src/data/tokens.json`, `src/data/contrastMatrix.json`

### Data Output Format

**tokens.json** — Array of Token objects:
```json
[
  { "name": "--gieds-color-gray-500", "category": "color", "lightValue": "#828893", "darkValue": "#828893", "rawProperty": "--gieds-color-gray-500" }
]
```

**contrastMatrix.json** — Object keyed by token name → ContrastPair[]:
```json
{
  "--gieds-color-neutral-white": [
    { "against": "--gieds-color-neutral-black", "ratio": 21, "meetsAA": true, "meetsAAA": true }
  ]
}
```

### Previous Story Intelligence

- Story 1.2: `parseCss()` extracts 664 tokens, `categorize()` maps to Token[]
- Story 1.3: `computeContrastPairs()` returns `Map<string, ContrastPair[]>`
- Token count: 664 (expect 500-800 range for validation)
- All pipeline modules use `@/` imports — tsx needed for script execution

## Dev Agent Record

### Agent Model Used

Claude claude-4.6-opus (Amelia persona)

### Debug Log References

No issues encountered. All tasks completed on first attempt.

### Completion Notes List

- Implemented `validate.ts` with three validation functions: `validateTokenCount` (range 500-800, zero=fail), `validateCssStructure` (checks data-theme selectors), `validatePackageAvailable` (require.resolve check)
- 13 new tests in `validate.test.ts` covering boundary values, empty CSS, missing selectors, whitespace-only input
- Implemented `scripts/generate-tokens.ts` — full pipeline orchestrator: validate package → validate CSS → parse → categorize → compute WCAG pairs → validate count → write JSON
- Pipeline outputs: `tokens.json` (664 tokens, 4649 lines) and `contrastMatrix.json` (101 color tokens × 100 pairs = 10100 contrast pairs, 60803 lines)
- Pipeline execution time: 0.02s (vs 30s budget — NFR15)
- Installed `tsx@4.21.0` as dev dependency for TypeScript script execution with `@/*` path alias support
- Added `"generate-tokens": "tsx scripts/generate-tokens.ts"` to package.json
- Deleted `.gitkeep` placeholders in `scripts/` and `src/data/` (replaced by real files)
- 107 total tests passing, 0 lint errors

### File List

- src/lib/pipeline/validate.ts (new)
- src/lib/pipeline/validate.test.ts (new)
- scripts/generate-tokens.ts (new)
- scripts/.gitkeep (deleted)
- src/data/.gitkeep (deleted)
- src/data/tokens.json (generated)
- src/data/contrastMatrix.json (generated)
- package.json (modified — added generate-tokens script, tsx dev dependency)
