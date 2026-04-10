# Story 2.6: Responsive Layout & Accessibility Polish

Status: review

## Story

As a developer,
I want the browsing experience to adapt to tablet and mobile screens and meet WCAG 2.1 AA,
So that the tool is usable on smaller devices and accessible to all users.

## Acceptance Criteria

1. ≥1024px: side-by-side panels (400px left + flexible right)
2. 768–1023px: stacked vertically — list above detail (UX-DR20)
3. <768px: list-only view, tapping token shows full-screen detail with back button
4. All interactive elements on tablet/mobile have minimum 44×44px touch targets
5. `aria-live="polite"` regions announce detail panel content changes (UX-DR18)
6. Transitions wrapped in `motion-safe:` for prefers-reduced-motion users (UX-DR19)
7. Semantic HTML with proper headings, landmarks, list semantics (NFR12)

## Tasks / Subtasks

- [x] Task 1: Responsive SplitPanel — 3 layouts (desktop side-by-side, tablet stacked, mobile list/detail toggle)
- [x] Task 2: Responsive AppNav — hamburger menu on mobile (<768px), hidden search trigger on mobile
- [x] Task 3: Touch targets — min-h-[44px] on TokenListItem buttons, mobile nav links, clear filter button
- [x] Task 4: aria-live="polite" on detail panel sections across all 3 breakpoints
- [x] Task 5: motion-safe: prefix on all transition/duration utilities (nav links, list items, copy buttons)
- [x] Task 6: Mobile detail view with back button + CategoryPage showMobileDetail state management
- [x] Task 7: Build + test + lint verification

## Dev Agent Record

### Agent Model Used
Opus 4.6

### Debug Log References
- No issues encountered

### Completion Notes List
- `SplitPanel` now renders 3 separate layouts using Tailwind responsive breakpoints: `lg:flex` (desktop), `md:flex lg:hidden` (tablet), `md:hidden` (mobile); desktop preserves original 400px aside; tablet splits 50/50 vertically; mobile toggles between list and detail overlay with back button
- `CategoryPage` gains `showMobileDetail` state: selecting a token shows mobile detail, back button returns to list; permalink auto-select also triggers mobile detail
- `AppNav` responsive: hamburger menu on `md:hidden` with 44px touch targets, expands to full-width link list; desktop nav links and search trigger hidden on mobile; toggle between hamburger/close icons
- `TokenListItem` button has `min-h-[44px]` for mobile touch compliance
- Mobile nav links have `min-h-[44px]` and `py-2.5` padding
- All `transition-colors` / `duration-*` utilities replaced with `motion-safe:transition-colors` / `motion-safe:duration-*` on AppNav, TokenListItem
- `aria-live="polite"` added to detail panel `<section>` (desktop), `<div>` (tablet), and mobile detail wrapper
- 131 total tests passing, 0 lint errors, 10 static routes

### File List
- src/components/SplitPanel.tsx (rewritten — 3 responsive layouts)
- src/components/CategoryPage.tsx (modified — mobile detail state management)
- src/components/AppNav.tsx (rewritten — responsive with hamburger menu)
- src/components/TokenListItem.tsx (modified — 44px touch targets, motion-safe)
