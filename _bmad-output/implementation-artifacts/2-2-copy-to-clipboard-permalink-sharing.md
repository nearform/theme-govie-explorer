# Story 2.2: Copy to Clipboard & Permalink Sharing

Status: review

## Story

As a developer,
I want to copy a token's CSS variable to my clipboard in one click and share permalinks,
So that I can use tokens immediately in my code and share references with colleagues.

## Acceptance Criteria

1. `var(--token-name)` written to clipboard via Clipboard API on copy click
2. Copy icon swaps to green checkmark for 1.5s, then reverts — no toast/snackbar (UX-DR22)
3. CopyButton works in 3 variants: primary (green bg in detail), ghost (appears on hover in list), inline (small icon) (UX-DR12)
4. Clipboard API failure shows "Copy failed" for 2s
5. `aria-label` updates from "Copy token value" to "Copied" during feedback
6. Permalink button generates URL with token encoded and copies to clipboard (UX-DR21)
7. Navigating to permalink URL auto-selects token in list (FR21)
8. URL state encodes category via path, token via query param, sans `--` prefix

## Tasks / Subtasks

- [x] Task 1: Create CopyButton component — 3 variants, clipboard API, feedback states
- [x] Task 2: Create PermalinkButton component — generates URL, copies to clipboard
- [x] Task 3: Integrate CopyButton into TokenDetail (primary) and TokenListItem (ghost)
- [x] Task 4: Add permalink support — URL query param auto-selection on /colors
- [x] Task 5: Tests for tokenUrl utility (stripPrefix, addPrefix, buildTokenPermalink, getTokenFromSearchParams)

## Dev Agent Record

### Agent Model Used
Opus 4.6

### Debug Log References
- `useSearchParams()` requires Suspense boundary for Next.js static export — extracted ColorsContent client component wrapped in Suspense
- SVG icons needed `aria-hidden="true"` to satisfy biome alt-text lint rule

### Completion Notes List
- Created `CopyButton` with 3 variants: primary (green bg, text label), ghost (invisible until group-hover, icon-only), inline (small icon); uses Clipboard API with try/catch, 1.5s success feedback, 2s error feedback, `aria-label` toggles to "Copied"
- Created `PermalinkButton` — builds URL via `buildTokenPermalink()`, copies full origin + path to clipboard, link icon swaps to checkmark on success
- Created `tokenUrl.ts` utility with `stripPrefix`, `addPrefix`, `buildTokenPermalink`, `getTokenFromSearchParams` — all pure functions, round-trip tested
- Integrated CopyButton (primary) and PermalinkButton into TokenDetail; CopyButton (ghost) into TokenListItem
- Extracted `ColorsContent` client component from `/colors/page.tsx`, wrapped in `<Suspense>` for `useSearchParams()` compatibility with static export
- Permalink auto-selection: reads `?token=` param on mount, finds matching token, auto-selects once
- 9 new tests in `tokenUrl.test.ts` covering strip/add prefix, permalink building, round-trip, null handling
- 127 total tests passing, 0 lint errors, static build produces 10 routes

### File List
- src/components/CopyButton.tsx (new)
- src/components/PermalinkButton.tsx (new)
- src/lib/tokenUrl.ts (new)
- src/lib/tokenUrl.test.ts (new)
- src/components/TokenDetail.tsx (modified — added CopyButton primary + PermalinkButton + category prop)
- src/components/TokenListItem.tsx (modified — added ghost CopyButton, restructured as div+button for group-hover)
- src/app/colors/ColorsContent.tsx (new — extracted client component with useSearchParams)
- src/app/colors/page.tsx (rewritten — Suspense wrapper)
