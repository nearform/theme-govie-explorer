# Story 2.4: Category Filtering & List Search

Status: review

## Story

As a developer,
I want to filter tokens within a category page by typing in the list panel,
So that I can narrow down a large token list quickly without leaving the category view.

## Acceptance Criteria

1. Filter input at top of list panel filters in real time using substring match on token names (UX-DR26)
2. Matched characters highlighted in light purple (#dfccff)
3. "×" clear button appears in filter input when text is present
4. Semantic group ordering maintained in filtered results
5. No-match empty state: "No tokens match '[filter]' in [category]" with "Clear filter" suggestion (UX-DR13)

## Tasks / Subtasks

- [x] Task 1: Create FilterInput component with search icon, clear button, styled input
- [x] Task 2: Create HighlightMatch component for substring highlighting in nf-light-purple
- [x] Task 3: Add filterQuery prop to TokenListItem for highlighted names
- [x] Task 4: Integrate filtering into CategoryPage — filteredGroups, empty state, group count update
- [x] Task 5: Update SplitPanel aside to flex layout for fixed filter + scrollable list
- [x] Task 6: Build + test + lint verification

## Dev Agent Record

### Agent Model Used
Opus 4.6

### Debug Log References
- No issues encountered

### Completion Notes List
- Created `FilterInput` — search icon, monospace input, clear "×" button shown when value present, green focus border, placeholder customizable per category
- Created `HighlightMatch` — finds first case-insensitive substring match, wraps in `<mark>` with `bg-nf-light-purple` styling
- Added `filterQuery` prop to `TokenListItem`, wraps token name in `HighlightMatch`
- `CategoryPage` now manages filter state, computes `filteredGroups` via `useMemo` with case-insensitive substring matching, shows per-group filtered count, empty state with "Clear filter" button
- Updated `SplitPanel` aside from `overflow-y-auto` to `flex flex-col` so `CategoryPage` can own the scroll via `overflow-y-auto` on the nav element
- All category pages (colors, spacing, typography, borders, shadows) get filtering automatically via shared `CategoryPage`
- 131 total tests passing, 0 lint errors, 10 static routes

### File List
- src/components/FilterInput.tsx (new)
- src/components/HighlightMatch.tsx (new)
- src/components/TokenListItem.tsx (modified — filterQuery prop + HighlightMatch)
- src/components/CategoryPage.tsx (modified — filter state, filteredGroups, empty state)
- src/components/SplitPanel.tsx (modified — aside flex layout)
