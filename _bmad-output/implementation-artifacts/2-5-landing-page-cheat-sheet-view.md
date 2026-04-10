# Story 2.5: Landing Page & Cheat Sheet View

Status: review

## Story

As a developer,
I want a landing page that orients me to the token system and a cheat sheet for dense reference,
So that I can understand the scope of available tokens at a glance and quickly scan everything on one screen.

## Acceptance Criteria

1. Landing page displays category cards in grid (3 columns desktop, 2 tablet, 1 mobile) (UX-DR14)
2. Each card shows category visual preview, name in Bitter serif, token count, description
3. Clicking a card navigates to the corresponding category page
4. `/cheatsheet` shows dense single-screen overview organized by category (FR10)
5. Each cheat sheet token shows name, visual preview, both theme values in compact format
6. Screen-only (no special print styling)

## Tasks / Subtasks

- [x] Task 1: Rewrite landing page with category cards grid, mini preview samples, responsive columns
- [x] Task 2: Create cheat sheet page with dense 3-column grid, compact token rows, category sections
- [x] Task 3: Build + test + lint verification

## Dev Agent Record

### Agent Model Used
Opus 4.6

### Debug Log References
- No issues encountered

### Completion Notes List
- Landing page: 6 category cards (Colors, Spacing, Typography, Borders, Shadows, Contrast) in responsive grid (1/2/3 cols); each card has mini visual preview (color swatches, spacing bars, typography samples, border squares, shadow squares, AA/AAA badges), Bitter serif heading, description, token count; green border + shadow on hover; total token count in subtitle with code-formatted package name
- Cheat sheet: all 664 tokens in 6 category sections ordered by category; each section has sticky header with count; 3-column responsive grid of compact rows (32px color swatch / no preview for non-color + monospace name + value + dark value if different + ghost copy button on hover); token values truncated with 10px font for density
- Both pages are static Server Components — no client-side JS needed
- 131 total tests passing, 0 lint errors, 10 static routes

### File List
- src/app/page.tsx (rewritten — landing page with category cards)
- src/app/cheatsheet/page.tsx (rewritten — dense token cheat sheet)
