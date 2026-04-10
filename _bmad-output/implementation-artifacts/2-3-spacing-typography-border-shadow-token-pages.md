# Story 2.3: Spacing, Typography, Border & Shadow Token Pages

Status: review

## Story

As a developer,
I want to browse spacing, typography, border, and shadow tokens with type-specific visual previews,
So that I can understand the full design system beyond colors and pick the right tokens for any property.

## Acceptance Criteria

1. `/spacing` — SplitPanel with horizontal bar previews (width proportional to value) + large ruler bar in detail
2. `/typography` — "Aa" samples in list + "The quick brown fox" rendered in token's style in detail
3. `/borders` — small squares with border applied in list + large square in detail
4. `/shadows` — small squares with shadow applied in list + large card in detail
5. All pages use same SplitPanel layout, copy button, permalink pattern from 2.1/2.2
6. Inline value decorators (pixel value, font family, shorthand) next to visual preview

## Tasks / Subtasks

- [x] Task 1: Create category-specific preview components (SpacingPreview, TypographyPreview, BorderPreview, ShadowPreview)
- [x] Task 2: Create TokenPreview dispatcher + extend TokenListItem/TokenDetail to use it
- [x] Task 3: Create shared CategoryPage component with SplitPanel + useSearchParams permalink
- [x] Task 4: Add groupByCategory utility for non-color categories
- [x] Task 5: Wire /spacing, /typography, /borders, /shadows pages with Suspense boundaries
- [x] Task 6: Tests for groupByCategory + build/lint verification

## Dev Agent Record

### Agent Model Used
Opus 4.6

### Debug Log References
- No issues encountered

### Completion Notes List
- Created `SpacingPreview` — horizontal bar (width proportional to px/rem value, max 120px in list / 400px in detail), ruler tick marks, px label; parses both px and rem units
- Created `TypographyPreview` — "Aa" sample in list, "The quick brown fox" in detail; applies font-family/size/weight/line-height/letter-spacing based on token name analysis
- Created `BorderPreview` — squares (36px list / 160px detail) with border-width or border-radius applied in NearForm blue
- Created `ShadowPreview` — white rounded squares with box-shadow applied
- Created `TokenPreview` — dispatcher component using exhaustive switch on `token.category` to render the right preview
- Refactored `TokenListItem` and `TokenDetail` to use `TokenPreview` instead of hardcoded color-only conditionals
- Created `CategoryPage` — shared component with SplitPanel, useSearchParams permalink, selection state, grouped token list, empty state
- Simplified `ColorsContent` to delegate to `CategoryPage`
- Added `groupByCategory()` utility for single-group pages (spacing, typography, border, shadow)
- Created 4 new route pages with Suspense-wrapped content components
- 4 new tests for `groupByCategory` covering filtering, empty results, label capitalization, all categories
- 131 total tests passing, 0 lint errors, 10 static routes

### File List
- src/components/previews/SpacingPreview.tsx (new)
- src/components/previews/TypographyPreview.tsx (new)
- src/components/previews/BorderPreview.tsx (new)
- src/components/previews/ShadowPreview.tsx (new)
- src/components/previews/TokenPreview.tsx (new)
- src/components/CategoryPage.tsx (new)
- src/components/TokenListItem.tsx (modified — uses TokenPreview)
- src/components/TokenDetail.tsx (modified — uses TokenPreview)
- src/lib/groupTokens.ts (modified — added groupByCategory)
- src/lib/groupTokens.test.ts (modified — added groupByCategory tests)
- src/app/colors/ColorsContent.tsx (simplified — delegates to CategoryPage)
- src/app/spacing/page.tsx (rewritten)
- src/app/spacing/SpacingContent.tsx (new)
- src/app/typography/page.tsx (rewritten)
- src/app/typography/TypographyContent.tsx (new)
- src/app/borders/page.tsx (rewritten)
- src/app/borders/BordersContent.tsx (new)
- src/app/shadows/page.tsx (rewritten)
- src/app/shadows/ShadowsContent.tsx (new)
