# Story 1.5: App Shell with NearForm-Branded Navigation

Status: review

## Story

As a developer,
I want the app shell with navigation, route structure, and global accessibility patterns in place,
So that all category pages have a consistent branded frame and the app is deployable as a zero-friction static site.

## Acceptance Criteria

1. AppNav component displays with deep navy background (#000e38), logo left, category links center-left, Cmd+K search trigger right (UX-DR23)
2. Category links include: Colors, Spacing, Typography, Borders, Shadows, Contrast, Cheatsheet
3. Active nav link shows in NearForm green, other links at 65% opacity, white on hover
4. Dark branded chrome (nav) + light content area (white/light grey alternating) hybrid design (UX-DR25)
5. Skip-to-content link is first focusable element, visually hidden, visible on focus (UX-DR17)
6. All interactive elements use `focus-visible:ring-2 ring-nf-green ring-offset-2` (UX-DR15)
7. Route pages exist as empty placeholders for /colors, /spacing, /typography, /borders, /shadows, /contrast, /cheatsheet
8. App loads without login, installation, or build steps (FR25)
9. All functionality works offline after initial load — no runtime fetch calls (FR26)
10. `pnpm build` produces a static `out/` directory

## Tasks / Subtasks

- [x] Task 1: Create AppNav component — `src/components/AppNav.tsx` (AC: #1, #2, #3)
  - [x] Deep navy background, 56px height, flexbox layout
  - [x] Logo left: "Token Explorer" in Bitter serif, green accent on "Token"
  - [x] Category links center-left: Colors, Spacing, Typography, Borders, Shadows, Contrast, Cheatsheet
  - [x] Active link detection using `usePathname()` — green text when active, 65% opacity default, white on hover
  - [x] Cmd+K search trigger right — pill button with "Search tokens..." text and ⌘K badge
- [x] Task 2: Create skip-to-content link and update root layout (AC: #4, #5, #6)
  - [x] Add skip-to-content link as first child of body — sr-only, visible on focus
  - [x] Integrate AppNav into layout.tsx
  - [x] Add `id="main-content"` to main content wrapper
  - [x] Light content area background (white/light grey)
- [x] Task 3: Add global focus ring styles (AC: #6)
  - [x] Add focus-visible ring pattern to globals.css as `@utility focus-ring`
- [x] Task 4: Create route placeholder pages (AC: #7)
  - [x] /colors/page.tsx, /spacing/page.tsx, /typography/page.tsx
  - [x] /borders/page.tsx, /shadows/page.tsx
  - [x] /contrast/page.tsx, /cheatsheet/page.tsx
- [x] Task 5: Verify static build (AC: #8, #9, #10)
  - [x] Run `pnpm build` and verify `out/` contains all routes (10 pages, all static)
  - [x] Confirm no runtime fetch calls — zero fetch in codebase

## Dev Notes

### Nav Design (from UX mockups)
- Height: 56px, bg: #000e38 (deep navy)
- Logo: Bitter serif, 15px, white with green span for "Token"
- Links: Inter 13px, rgba(255,255,255,0.65) default, white on hover, NearForm green when active
- Links have 6px/12px padding, 6px border-radius
- Search trigger: pill with rgba(255,255,255,0.08) bg, 0.12 border, "Search tokens... ⌘K"
- No sidebar, no hamburger — flat single-level top navigation

### Next.js 16 App Router Notes
- `usePathname()` from `next/navigation` for active link detection — requires `'use client'` directive
- Static export with `output: 'export'` — all routes must be statically renderable
- Route pages are server components by default; AppNav must be a client component (uses hooks)

## Dev Agent Record

### Agent Model Used

Claude claude-4.6-opus (Amelia persona)

### Debug Log References

No issues encountered. All tasks completed on first attempt.

### Completion Notes List

- Created `AppNav` client component — deep navy bar (56px), Bitter serif logo with green "Token" accent, 7 category links with `usePathname()` active detection (green text / 65% opacity / white hover), Cmd+K search trigger pill
- Updated `layout.tsx` — skip-to-content link (sr-only, visible on focus with green bg), AppNav integration, `#main-content` wrapper with white bg
- Added `@utility focus-ring` to globals.css for reusable focus ring pattern
- Created 7 route placeholder pages: /colors, /spacing, /typography, /borders, /shadows, /contrast, /cheatsheet
- Updated landing page to work within new layout frame
- `pnpm build` produces static `out/` with 10 routes (index + 7 categories + 404 + _not-found), all prerendered as static content
- Zero runtime fetch calls, zero lint errors, 107 tests pass

### File List

- src/components/AppNav.tsx (new)
- src/components/.gitkeep (deleted)
- src/app/layout.tsx (modified — added skip-to-content, AppNav, main wrapper)
- src/app/page.tsx (modified — adapted for layout frame)
- src/app/globals.css (modified — added @utility focus-ring)
- src/app/colors/page.tsx (new)
- src/app/spacing/page.tsx (new)
- src/app/typography/page.tsx (new)
- src/app/borders/page.tsx (new)
- src/app/shadows/page.tsx (new)
- src/app/contrast/page.tsx (new)
- src/app/cheatsheet/page.tsx (new)
