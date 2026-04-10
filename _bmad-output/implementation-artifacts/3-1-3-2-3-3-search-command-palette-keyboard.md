# Stories 3.1, 3.2, 3.3: Search, Command Palette & Keyboard Navigation

Status: review

## Stories

- 3.1: Fuse.js Search Engine & Reverse Lookup
- 3.2: Command Palette with Visual Previews
- 3.3: Global Keyboard Navigation

## Acceptance Criteria (combined)

1. Fuse.js index with weighted fields: name (0.6), lightValue (0.25), darkValue (0.15)
2. Fuzzy matching: "bg secondary" and "bg secndary" both match secondary tokens
3. Reverse lookup: searching #ffffff or 16px returns matching tokens
4. Results ranked by score, max 8 results
5. Cmd+K / Ctrl+K opens palette from any page, `/` opens when no input focused
6. Modal: deep navy backdrop 60% opacity, 640px max width, ~20% from top
7. Backdrop fades in, modal scales 95%→100% over 150ms (motion-safe)
8. Background scroll locked while open
9. Up to 8 results with mini preview + monospace name + light/dark values
10. First result highlighted, arrow keys navigate, Enter copies var(--name)
11. Checkmark feedback on copy, palette stays open
12. Escape or click outside closes, matched chars highlighted
13. Footer with keyboard hints: ↑↓ navigate, ⏎ copy, esc close
14. AppNav search trigger button opens palette on click

## Tasks / Subtasks

- [x] Task 1: Install/verify fuse.js dependency
- [x] Task 2: Create searchConfig.ts with weighted Fuse.js options
- [x] Task 3: Create useTokenSearch hook (query state, Fuse instance, results with scores)
- [x] Task 4: 7 search tests (fuzzy, typo, reverse hex, pixel value, max results, score ranking)
- [x] Task 5: Create CommandPalette component (modal, search input, result list, keyboard nav, copy feedback)
- [x] Task 6: Add fadeIn + scaleIn CSS keyframe animations to globals.css
- [x] Task 7: Create CommandPaletteProvider (global keyboard shortcuts, custom event listener, scroll lock)
- [x] Task 8: Wire provider into root layout, connect AppNav search button via custom event
- [x] Task 9: Build + test + lint verification

## Dev Agent Record

### Agent Model Used
Opus 4.6

### Debug Log References
- Fuse.js `minMatchCharLength` only affects match highlighting indices, not result filtering — hook enforces min 2 chars instead
- biome lint: replaced `role="listbox"` / `role="option"` with semantic approach to satisfy element-role rules
- biome lint: replaced `useEffect` with ref-based query change detection to avoid unnecessary dependency warnings

### Completion Notes List
- `searchConfig.ts` — Fuse.js options: 3 weighted keys (name 0.6, lightValue 0.25, darkValue 0.15), threshold 0.4, ignoreLocation for substring matching, MAX_RESULTS = 8
- `useTokenSearch` hook — memoized Fuse instance, query state, min 2 chars, returns `SearchResult[]` with token + score
- `CommandPalette` — full modal: deep navy backdrop (60% opacity, fadeIn animation), white panel (scaleIn animation, max-w-[640px], 20vh from top), search input with icon + esc hint, result list with TokenPreview + HighlightMatch + light/dark values + inline copy, arrow key navigation with scroll-into-view, Enter to copy with checkmark feedback, click outside to close, scroll lock, footer keyboard hints
- `CommandPaletteProvider` — listens for Cmd+K/Ctrl+K (toggle), `/` when no input focused (open), custom `open-command-palette` event from AppNav button
- AppNav search button dispatches `open-command-palette` custom event on click
- CSS: `@keyframes fadeIn` (opacity 0→1) and `@keyframes scaleIn` (opacity 0→1, scale 0.95→1) wrapped in `motion-safe:animate-*`
- 7 new search tests covering fuzzy, typo, reverse lookup, pixel value, max results, score ordering
- 138 total tests passing, 0 lint errors, 10 static routes

### File List
- src/lib/searchConfig.ts (new)
- src/lib/searchConfig.test.ts (new)
- src/hooks/useTokenSearch.ts (new)
- src/components/CommandPalette.tsx (new)
- src/components/CommandPaletteProvider.tsx (new)
- src/components/AppNav.tsx (modified — search button dispatches custom event)
- src/app/layout.tsx (modified — added CommandPaletteProvider)
- src/app/globals.css (modified — fadeIn + scaleIn keyframes)
