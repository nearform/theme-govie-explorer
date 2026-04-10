# Story 2.1: Split Panel Layout & Color Token Browsing

Status: review

## Story

As a developer,
I want to browse color tokens in a split-panel layout with visual swatches and side-by-side theme comparison,
So that I can scan the full color palette and visually confirm the right token before using it.

## Acceptance Criteria

1. SplitPanel layout with 400px fixed left list panel and flexible right detail panel (UX-DR5)
2. Left panel shows color tokens as TokenListItems with 36px split light/dark circle swatches, monospace token name, hex value (UX-DR6)
3. Tokens grouped by semantic intent with section headers
4. Clicking a token highlights it (light green bg) and populates the right panel
5. TokenDetail shows 200px vertically-split swatch, monospace name at 18px, light/dark value boxes (UX-DR7)
6. ColorSwatch renders at all 4 size variants: mini (32px), small (36px), large (200px), contrast (80px) with 1px white divider (UX-DR8)
7. Empty state when no token selected: "Select a token to see details" (UX-DR13)

## Tasks / Subtasks

- [x] Task 1: Create ColorSwatch component with 4 size variants (AC: #6)
- [x] Task 2: Create SplitPanel layout component (AC: #1)
- [x] Task 3: Create EmptyState component (AC: #7)
- [x] Task 4: Create TokenListItem component for color tokens (AC: #2)
- [x] Task 5: Create TokenDetail component (AC: #5)
- [x] Task 6: Implement color token grouping utility (AC: #3)
- [x] Task 7: Wire /colors page with all components and token data (AC: #1-7)

## Dev Agent Record

### Agent Model Used
Opus 4.6

### Debug Log References
- No issues encountered

### Completion Notes List
- Created `ColorSwatch` — 4 size variants (mini 32px, small 36px, large 200px, contrast 80px) with vertical light/dark split, 1px white divider, scaled border radius
- Created `SplitPanel` — 400px fixed left aside with scroll + flexible right section, height calc(100vh - 56px) to account for nav bar
- Created `EmptyState` — centered message + optional hint text in muted grey
- Created `TokenListItem` — button element with ColorSwatch (small), monospace token name (truncated), hex value; light green bg when selected, light grey on hover
- Created `TokenDetail` — centered layout with large ColorSwatch, monospace name at lg size, light/dark value boxes in white cards with shadow
- Created `groupColorTokens` utility — 18 regex-based rules mapping token name prefixes to semantic groups: Neutral, Primary, Secondary, Emerald, Green, Blue, Red, Yellow, Gold, Purple, Orange, Support, Text, Icon, Border Color, Shadow Color, System, Surface; preserves rule order in output; unmatched tokens go to 'Other'
- Wired `/colors` page as client component with `useState` for selection, groups rendered as sticky-header sections, nav+section semantic HTML
- 11 new tests in `groupTokens.test.ts` covering: filtering, individual groups, rule order, empty input, palette scales, actual token data integration
- 118 total tests passing, 0 lint errors, static build produces 10 routes

### File List
- src/components/ColorSwatch.tsx (new)
- src/components/SplitPanel.tsx (new)
- src/components/EmptyState.tsx (new)
- src/components/TokenListItem.tsx (new)
- src/components/TokenDetail.tsx (new)
- src/lib/groupTokens.ts (new)
- src/lib/groupTokens.test.ts (new)
- src/app/colors/page.tsx (rewritten)
