---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# theme-govie-tokens - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for theme-govie-tokens, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: The system can parse CSS custom properties from the `theme-govie` package at build time and extract all design tokens
FR2: The system can categorize extracted tokens by type (color, spacing, typography, border, shadow, and other detected categories)
FR3: The system can pre-compute WCAG contrast ratios for all color token pairs at build time
FR4: The system can validate token extraction completeness at build time and warn if the token count deviates from expected range
FR5: Users can browse tokens organized by category through a visual category browser
FR6: Users can filter tokens using category chips/tags
FR7: Users can view tokens across multiple routes organized by category (colors, spacing, typography, borders, shadows, etc.)
FR8: Users can see visual representations of token values (color swatches, spacing scale visualizations, typography samples)
FR9: Users can see inline value decorators next to every token (visual preview of the value)
FR10: Users can view a dense cheat sheet of all tokens on a single screen
FR11: Users can search tokens by name or value using fuzzy matching
FR12: Users can perform reverse lookup — enter a raw value and find matching token name(s)
FR13: Users can open a command palette (Cmd+K) for keyboard-driven fuzzy search and navigation
FR14: Users can view token values in both light and dark themes simultaneously, side by side
FR15: Users can compare how any token resolves differently across themes
FR16: Users can view a WCAG contrast ratio matrix for color token pairs
FR17: Users can see AA and AAA compliance badges for each color pair in the matrix
FR18: Users can view suggested accessible pairings — WCAG-safe text/background combinations for any color token
FR19: Users can copy a token's CSS variable reference (`var(--token-name)`) to clipboard with one click
FR20: Users can generate and share a permalink to any specific token
FR21: Users can navigate directly to a specific token via a shared permalink URL
FR22: Users can navigate all core features using keyboard shortcuts without a mouse
FR23: Users can access the command palette from any screen via a keyboard shortcut
FR24: Users can navigate token lists using arrow keys and select with Enter
FR25: Users can access the application without login, installation, or build steps
FR26: Users can use all features offline after initial page load
FR27: The application can render with a neutral, clean UI that does not depend on the Gov.ie theme

### NonFunctional Requirements

NFR1: Initial page load (First Contentful Paint) completes in under 1 second on a modern desktop browser with broadband connection
NFR2: Time to Interactive is under 2 seconds — the app is usable (search, filter, copy) within 2 seconds of navigation
NFR3: Fuzzy search returns results within 100ms of keystroke for a token set of up to 500 tokens
NFR4: Command palette (Cmd+K) opens and is ready for input within 200ms
NFR5: Lighthouse Performance score of 90 or above on all routes
NFR6: Total JavaScript bundle size stays under 200KB gzipped (excluding static token data)
NFR7: The application meets WCAG 2.1 Level AA across all routes, with the actual conformance level (AA or AAA) displayed per criterion
NFR8: All interactive elements are reachable and operable via keyboard alone
NFR9: All visual token representations include text alternatives (token name + value visible alongside swatches)
NFR10: Focus indicators are visible on all interactive elements
NFR11: The UI respects `prefers-reduced-motion` and `prefers-color-scheme` user preferences
NFR12: Semantic HTML structure supports screen reader navigation with logical heading hierarchy and landmark regions
NFR13: The CSS token parser extracts tokens from the `theme-govie` package without manual intervention during the build
NFR14: Build fails with a clear error message if the `theme-govie` package is missing or the CSS file structure is unrecognizable
NFR15: Build completes in under 30 seconds including token extraction, WCAG contrast pre-computation, and static export

### Additional Requirements

- Architecture specifies `create-next-app` with `--ts --tailwind --eslint --app --src-dir --use-pnpm --empty` as the starter template — this defines Epic 1 Story 1
- Static export configuration: `output: 'export'` in `next.config.ts`
- PostCSS 8.5.8 as build-time CSS parser (build-time only dependency)
- Custom WCAG contrast computation (~30 lines, zero dependencies — no library)
- Fuse.js 7.1.0 for client-side fuzzy search (~25KB, fits within 200KB JS budget)
- Custom command palette implementation (not cmdk library — React 19/Next.js 16 compatibility issues)
- URL state + React built-ins for state management (no external state library)
- Vitest for unit testing focused on build-time pipeline (parser, WCAG, categorizer)
- Host-agnostic deployment — build produces `out/` directory deployable to any static host
- Project structure boundary: `src/lib/pipeline/` for build-time code, `src/app/` + `src/components/` + `src/hooks/` for client-side
- Token/ColorToken/ContrastPair TypeScript interfaces as the canonical data shape contract
- Pre-build script `scripts/generate-tokens.ts` that runs the pipeline and writes JSON to `src/data/`
- Tailwind CSS v4.2 with CSS-first `@theme` directives in `globals.css` (no `tailwind.config.js`)
- React 19.2, TypeScript 5.x, Node.js 20.9+ (LTS)
- `@/*` import alias for all internal imports — no relative `../` paths beyond `./` in same directory
- Co-located test files: `src/lib/pipeline/parseCss.test.ts` next to `parseCss.ts`
- Turbopack as default bundler (replaces Vite reference in PRD)
- **Required packages**: `@ogcio/design-system-react@1.34.0` and `@ogcio/theme-govie@1.21.4` — the design system React components and Gov.ie theme CSS source that the token pipeline parses

### UX Design Requirements

UX-DR1: Implement NearForm brand color system as Tailwind custom theme tokens — 12 color tokens: deep navy (#000e38), green (#00e6a4), dark green (#07a06f), light green (#ccfaed), purple (#9966ff), light purple (#dfccff), blue (#478bff), light blue (#d6e6ff), grey (#d9d9d9), light grey (#f4f8fa), deep grey (#444450), muted grey (#727783)
UX-DR2: Configure Bitter (serif) + Inter (sans-serif) font pairing with system monospace for token data display, including custom letter-spacing (-0.01em) on headings and antialiased rendering
UX-DR3: Implement the 7-level type scale: page title (28px Bitter), section title (21px Bitter), UI large (18px Inter), UI base (16px Inter), token name (14px monospace), token value (14px monospace), caption (12px Inter)
UX-DR4: Build CommandPalette component — deep navy overlay, Fuse.js fuzzy search, visual result previews with split light/dark mini swatches (32px), keyboard navigation (↑↓ Enter Escape /), max 8 visible results, stays open after copy, footer with keyboard hints
UX-DR5: Build SplitPanel layout component — 400px fixed left list panel + flexible right detail panel, 1px border divider, used on all category browse pages
UX-DR6: Build TokenListItem component with type-specific mini previews (36px): circle swatch for color, horizontal bar for spacing, "Aa" sample for typography, styled square for border, shadow square for shadow — plus monospace token name and secondary value text
UX-DR7: Build TokenDetail component — large preview (200px, type-specific: vertically-split swatch for color, ruler bar for spacing, "The quick brown fox" for typography, bordered square for border, shadow card for shadow) + monospace name (18px) + light/dark value boxes + prominent green copy button + permalink button
UX-DR8: Build ColorSwatch component with 4 size variants: mini (32px for command palette), small (36px for token list), large (200px for detail view), contrast (80px for contrast checker) — vertically split light/dark halves with 1px white divider, scaled border radius
UX-DR9: Build ContrastChecker page (/contrast) — background token picker at top with swatch + name + suggested semantic pairing, 4-5 column grid of ContrastCell components below, optional filter (all/passing/failing)
UX-DR10: Build ContrastCell component — background from selected token, "Aa" sample in text token color (18px bold), contrast ratio in monospace, WcagBadge, token name in small monospace, hover state (green border), click opens PairPopover
UX-DR11: Build WcagBadge component — 3 variants: AAA (light green #ccfaed bg, dark green #07a06f text), AA (light blue #d6e6ff bg, blue #478bff text), Fail (light red #ffeaea bg, red #cc3333 text) — inline pill, 10px font, 2px/8px padding
UX-DR12: Build CopyButton component — 3 variants: primary (green bg, prominent), ghost (no bg, appears on hover), inline (small icon only) — checkmark state swap for 1.5s on copy, aria-label updates between "Copy token value" and "Copied"
UX-DR13: Build EmptyState component — 4 contextual variants: no token selected ("Select a token to see details" + Cmd+K hint), no search results ("No tokens match '[query]'" + broader terms hint), no filter results (clear filter hint), no contrast background (select background hint) — all in Inter 14px muted grey
UX-DR14: Build LandingOverview page — category cards grid (3 columns desktop, 2 tablet, 1 mobile) with category icon/visual, name in Bitter serif, token count, and mini preview sample from each category
UX-DR15: Implement consistent focus ring pattern — `focus-visible:ring-2 ring-nf-green ring-offset-2` on ALL interactive elements with no exceptions, paired with `focus:outline-none`
UX-DR16: Implement global keyboard shortcut system — Cmd+K/Ctrl+K and `/` (open palette), Escape (close palette/deselect), ↑↓ (navigate results/list), Enter (copy/confirm), Tab (standard focus order)
UX-DR17: Implement skip-to-content link as first focusable element — visually hidden via `sr-only`, visible on focus via `focus:not-sr-only`, targets `#main-content`
UX-DR18: Implement `aria-live="polite"` regions for dynamic content: search result count ("5 results for [query]"), copy confirmation ("Copied [token-name] to clipboard"), detail panel content updates on token selection
UX-DR19: Wrap all animations in `motion-safe:` — copy checkmark, palette open/close fade+scale, hover transitions — users with prefers-reduced-motion see instant state changes
UX-DR20: Implement responsive Split Panel collapse — side-by-side at ≥1024px, stacked (list above detail) at 768-1023px, list-only with tap-to-full-screen-detail at <768px
UX-DR21: Implement URL state encoding: category via path (`/colors`), selected token via query (`?token=color-bg-secondary`), contrast pair via query (`?bg=color-warning-bg&fg=color-text-primary`), search via query (`?q=secondary`) — token names without `--` prefix in URLs
UX-DR22: Implement identical copy feedback everywhere — copy icon → green checkmark for 1.5s → revert, no toast/snackbar/modal, clipboard error shows "Copy failed" text for 2s
UX-DR23: Build AppNav component — deep navy background (#000e38), logo left, category links center-left (Inter 16px, 65% opacity default, white on hover, NearForm green when active), Cmd+K search trigger right
UX-DR24: Implement command palette overlay — deep navy at 60% opacity backdrop, centered modal (max 640px, ~20% from top), fade-in backdrop + scale from 95%→100% (150ms), scroll lock on background, focus trap
UX-DR25: Implement dark branded chrome (deep navy nav + command palette) with light content area (white #ffffff + light grey #f4f8fa alternating sections) hybrid design
UX-DR26: Build list filter input for category pages — simple substring match within current category, monospace token names, light purple (#dfccff) highlight on matched text, "×" clear button

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | Parse CSS custom properties at build time |
| FR2 | Epic 1 | Categorize tokens by type |
| FR3 | Epic 1 | Pre-compute WCAG contrast ratios |
| FR4 | Epic 1 | Validate token extraction completeness |
| FR5 | Epic 2 | Browse tokens by category |
| FR6 | Epic 2 | Filter tokens using category chips/tags |
| FR7 | Epic 2 | Multiple routes by category |
| FR8 | Epic 2 | Visual representations of token values |
| FR9 | Epic 2 | Inline value decorators |
| FR10 | Epic 2 | Dense cheat sheet view |
| FR11 | Epic 3 | Fuzzy search by name or value |
| FR12 | Epic 3 | Reverse lookup (value → token) |
| FR13 | Epic 3 | Command palette (Cmd+K) |
| FR14 | Epic 2 | Side-by-side light/dark theme display |
| FR15 | Epic 2 | Compare token values across themes |
| FR16 | Epic 4 | WCAG contrast ratio matrix |
| FR17 | Epic 4 | AA/AAA compliance badges |
| FR18 | Epic 4 | Accessible pairing suggestions |
| FR19 | Epic 2 | One-click copy to clipboard |
| FR20 | Epic 2 | Generate shareable permalink |
| FR21 | Epic 2 | Navigate via shared permalink |
| FR22 | Epic 3 | Keyboard navigation for all features |
| FR23 | Epic 3 | Command palette keyboard shortcut |
| FR24 | Epic 3 | Arrow key + Enter navigation |
| FR25 | Epic 1 | No login/install/build access |
| FR26 | Epic 1 | Offline after initial load |
| FR27 | Epic 1 | Neutral UI independent of Gov.ie theme |

## Epic List

### Epic 1: Foundation & Token Data Pipeline
The project is scaffolded with Next.js 16 static export, the build-time pipeline extracts all tokens from `@ogcio/theme-govie@1.21.4` CSS, categorizes them, pre-computes WCAG contrast data, validates completeness, and produces static JSON. The app shell with NearForm-branded navigation is in place and deployable as a zero-friction static site.
**FRs covered:** FR1, FR2, FR3, FR4, FR25, FR26, FR27

### Epic 2: Token Browsing, Visual Exploration & Sharing
Developers can browse tokens by category (colors, spacing, typography, borders, shadows) through a split-panel layout with visual previews, compare light/dark theme values side by side, copy token values to clipboard in one click, generate and share permalinks, and view a dense cheat sheet of all tokens.
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR10, FR14, FR15, FR19, FR20, FR21

### Epic 3: Search, Command Palette & Keyboard Navigation
Developers can find any token instantly via the Cmd+K command palette with fuzzy search and visual result previews, perform reverse lookup by pasting a raw value, and navigate the entire app using keyboard shortcuts without a mouse.
**FRs covered:** FR11, FR12, FR13, FR22, FR23, FR24

### Epic 4: WCAG Contrast Checker & Accessible Pairings
Developers can verify WCAG contrast compliance for any color token pair in a visual matrix, see AA/AAA ratings at a glance, and discover recommended accessible text/background combinations with suggested semantic pairings.
**FRs covered:** FR16, FR17, FR18

### Epic 5: Nice-to-Haves & Design System Integration
Post-MVP enhancements that connect the token explorer to the `@ogcio/design-system-react` component library, providing usage context and bridging the gap between raw design tokens and the React components that consume them.

### Epic 6: Deployment & CI/CD
Automated deployment pipeline that builds and publishes the static token explorer to a hosting platform via GitHub Actions, with an alternative Vercel configuration for teams preferring preview deployments per PR.
**FRs covered:** FR25 (extended — zero-friction access via live URL)

## Epic 1: Foundation & Token Data Pipeline

The project is scaffolded with Next.js 16 static export, the build-time pipeline extracts all tokens from `@ogcio/theme-govie@1.21.4` CSS, categorizes them, pre-computes WCAG contrast data, validates completeness, and produces static JSON. The app shell with NearForm-branded navigation is in place and deployable as a zero-friction static site.

### Story 1.1: Project Scaffolding, Design Tokens & Data Model

As a developer,
I want the project scaffolded with Next.js 16, Tailwind v4.2, NearForm brand theming, and canonical TypeScript interfaces,
So that all subsequent development has a consistent foundation and data contract.

**Acceptance Criteria:**

**Given** a fresh workspace
**When** the project is initialized with `create-next-app@latest --ts --tailwind --eslint --app --src-dir --use-pnpm --empty`
**Then** the project builds successfully with `output: 'export'` in `next.config.ts`
**And** `@ogcio/theme-govie@1.21.4`, `@ogcio/design-system-react@1.34.0`, `postcss`, `fuse.js`, and `vitest` are installed
**And** the directory structure matches the architecture spec (`src/lib/pipeline/`, `src/components/`, `src/hooks/`, `src/types/`, `src/data/`, `scripts/`)
**And** `src/types/token.ts` defines `Token`, `ColorToken`, `ContrastPair`, and `TokenCategory` interfaces per architecture
**And** `globals.css` configures Tailwind `@theme` with all 12 NearForm brand color tokens (UX-DR1)
**And** Bitter (serif) + Inter (sans-serif) fonts are configured with system monospace for token data (UX-DR2)
**And** the 7-level type scale is implemented (UX-DR3)
**And** `@/*` import alias is configured

### Story 1.2: CSS Token Parser & Categorizer

As a developer,
I want the build-time pipeline to parse CSS custom properties from theme-govie and categorize them by type,
So that all design tokens are accurately extracted and organized for the UI to consume.

**Acceptance Criteria:**

**Given** the `@ogcio/theme-govie` package is installed
**When** `parseCss.ts` processes the CSS theme files using PostCSS
**Then** all CSS custom properties are extracted as raw token objects
**And** `categorize.ts` classifies each token into one of: color, spacing, typography, border, shadow, or other
**And** each token carries its name, category, light value, dark value, and raw CSS property
**And** `colorUtils.ts` correctly parses hex, RGB, and HSL color formats
**And** co-located unit tests in `parseCss.test.ts` and `categorize.test.ts` verify extraction correctness and edge cases
**And** the parser handles complex CSS structures (`@layer`, `@media`, nested rules) without failing

### Story 1.3: WCAG Contrast Computation

As a developer,
I want the pipeline to pre-compute WCAG contrast ratios for all color token pairs,
So that the contrast checker has instant access to accessibility compliance data without runtime computation.

**Acceptance Criteria:**

**Given** a set of extracted color tokens with resolved hex values
**When** `wcag.ts` computes relative luminance and contrast ratios for all color pairs
**Then** each pair produces a `ContrastPair` with: token names, contrast ratio (1–21), `meetsAA` (≥4.5:1), and `meetsAAA` (≥7:1) flags
**And** the computation handles all supported color formats (hex, RGB, HSL)
**And** co-located unit tests in `wcag.test.ts` verify known contrast ratios and edge values (black/white = 21:1, identical colors = 1:1)
**And** the implementation is zero-dependency (~30 lines)

### Story 1.4: Token Pipeline Orchestration & Build Validation

As a developer,
I want a single pre-build script that runs the full pipeline and validates the output,
So that token data is always fresh, accurate, and the build fails clearly on errors.

**Acceptance Criteria:**

**Given** the CSS parser, categorizer, and WCAG computation are implemented
**When** `scripts/generate-tokens.ts` is executed
**Then** it reads theme-govie CSS, runs the full pipeline, and writes `tokens.json` and `contrastMatrix.json` to `src/data/`
**And** `validate.ts` checks the extracted token count and logs a warning if it deviates from the expected range
**And** the build fails with a clear, descriptive error message if `@ogcio/theme-govie` is missing or the CSS structure is unrecognizable (NFR14)
**And** co-located unit tests in `validate.test.ts` verify validation thresholds
**And** the full pipeline completes in under 30 seconds (NFR15)
**And** `pnpm generate-tokens` is a configured script in `package.json`

### Story 1.5: App Shell with NearForm-Branded Navigation

As a developer,
I want the app shell with navigation, route structure, and global accessibility patterns in place,
So that all category pages have a consistent branded frame and the app is deployable as a zero-friction static site.

**Acceptance Criteria:**

**Given** the project is scaffolded with NearForm theming
**When** the root `layout.tsx` renders
**Then** the AppNav component displays with deep navy background (#000e38), logo left, category links center-left, and Cmd+K search trigger right (UX-DR23)
**And** category links include: Colors, Spacing, Typography, Borders, Shadows, Contrast, Cheatsheet
**And** the active nav link shows in NearForm green, other links at 65% opacity, white on hover
**And** dark branded chrome (nav) + light content area (white/light grey alternating) hybrid design is visible (UX-DR25)
**And** a skip-to-content link is the first focusable element, visually hidden, visible on focus (UX-DR17)
**And** all interactive elements use `focus-visible:ring-2 ring-nf-green ring-offset-2` (UX-DR15)
**And** route pages exist as empty placeholders for `/colors`, `/spacing`, `/typography`, `/borders`, `/shadows`, `/contrast`, `/cheatsheet`
**And** the app loads without login, installation, or build steps (FR25)
**And** all functionality works offline after initial load — no runtime fetch calls (FR26)
**And** `pnpm build` produces a static `out/` directory

## Epic 2: Token Browsing, Visual Exploration & Sharing

Developers can browse tokens by category (colors, spacing, typography, borders, shadows) through a split-panel layout with visual previews, compare light/dark theme values side by side, copy token values to clipboard in one click, generate and share permalinks, and view a dense cheat sheet of all tokens.

### Story 2.1: Split Panel Layout & Color Token Browsing

As a developer,
I want to browse color tokens in a split-panel layout with visual swatches and side-by-side theme comparison,
So that I can scan the full color palette and visually confirm the right token before using it.

**Acceptance Criteria:**

**Given** the `/colors` route is loaded with token data from `tokens.json`
**When** the page renders
**Then** a SplitPanel layout displays with a 400px fixed left list panel and a flexible right detail panel (UX-DR5)
**And** the left panel shows all color tokens as TokenListItems with 36px split light/dark circle swatches, monospace token name, and hex value (UX-DR6)
**And** tokens are grouped by semantic intent (primary, secondary, warning, error, success, neutral) with section headers
**And** clicking a token in the list highlights it (light green background) and populates the right panel
**And** the right panel (TokenDetail) shows a 200px vertically-split swatch (left=light, right=dark), monospace name at 18px, light and dark value boxes, and action buttons (UX-DR7)
**And** the ColorSwatch component renders at all 4 size variants: mini (32px), small (36px), large (200px), contrast (80px) with 1px white divider (UX-DR8)
**And** when no token is selected, the right panel shows an empty state: "Select a token to see details" (UX-DR13)

### Story 2.2: Copy to Clipboard & Permalink Sharing

As a developer,
I want to copy a token's CSS variable to my clipboard in one click and share permalinks,
So that I can use tokens immediately in my code and share references with colleagues.

**Acceptance Criteria:**

**Given** a token is selected in the detail panel or visible in a list
**When** the user clicks the copy button
**Then** `var(--token-name)` is written to the clipboard via the Clipboard API
**And** the copy icon swaps to a green checkmark for 1.5 seconds, then reverts — no toast or snackbar (UX-DR22)
**And** the CopyButton component works in 3 variants: primary (green bg in detail panel), ghost (appears on hover in list), inline (small icon) (UX-DR12)
**And** if the Clipboard API fails, "Copy failed" text displays for 2 seconds instead of the checkmark
**And** `aria-label` updates from "Copy token value" to "Copied" during feedback state
**And** clicking the permalink button generates a URL with the token encoded (e.g., `/colors?token=color-bg-secondary`) and copies it to clipboard (UX-DR21)
**And** navigating to a permalink URL auto-selects the token in the list and populates the detail panel (FR21)
**And** URL state encodes category via path, selected token via query param, with token names sans `--` prefix

### Story 2.3: Spacing, Typography, Border & Shadow Token Pages

As a developer,
I want to browse spacing, typography, border, and shadow tokens with type-specific visual previews,
So that I can understand the full design system beyond colors and pick the right tokens for any property.

**Acceptance Criteria:**

**Given** the `/spacing` route is loaded
**When** the page renders
**Then** the SplitPanel displays spacing tokens with horizontal bar previews in the list (width proportional to value) and a large ruler bar visualization in the detail panel

**Given** the `/typography` route is loaded
**When** the page renders
**Then** the list shows "Aa" samples in each token's font/weight/size, and the detail panel shows "The quick brown fox" rendered in the token's style

**Given** the `/borders` route is loaded
**When** the page renders
**Then** the list shows small squares with the border style applied, and the detail panel shows a large square demonstrating the border on all sides

**Given** the `/shadows` route is loaded
**When** the page renders
**Then** the list shows small squares with the shadow applied, and the detail panel shows a large card demonstrating the shadow effect

**And** all category pages use the same SplitPanel layout, copy button, and permalink pattern from Story 2.1 and 2.2
**And** each token displays inline value decorators (pixel value, font family, shorthand) next to the visual preview (FR9)

### Story 2.4: Category Filtering & List Search

As a developer,
I want to filter tokens within a category page by typing in the list panel,
So that I can narrow down a large token list quickly without leaving the category view.

**Acceptance Criteria:**

**Given** a category page is loaded with tokens in the left panel
**When** the user types in the filter input at the top of the list
**Then** the list filters in real time using substring match on token names (UX-DR26)
**And** matched characters are highlighted in light purple (#dfccff)
**And** a "×" clear button appears in the filter input when text is present
**And** semantic group ordering is maintained in filtered results
**And** if no tokens match, an empty state displays: "No tokens match '[filter]' in [category]" with a "Clear filter" suggestion (UX-DR13)
**And** CategoryChips are available for sub-filtering within the category (FR6)

### Story 2.5: Landing Page & Cheat Sheet View

As a developer,
I want a landing page that orients me to the token system and a cheat sheet for dense reference,
So that I can understand the scope of available tokens at a glance and quickly scan everything on one screen.

**Acceptance Criteria:**

**Given** the user navigates to the root URL `/`
**When** the landing page renders
**Then** a LandingOverview displays category cards in a grid (3 columns desktop, 2 tablet, 1 mobile) (UX-DR14)
**And** each card shows a category icon/visual, name in Bitter serif, token count, and a mini preview sample
**And** clicking a category card navigates to the corresponding category page

**Given** the user navigates to `/cheatsheet`
**When** the page renders
**Then** a dense, single-screen overview of all tokens is displayed organized by category (FR10)
**And** each token shows its name, visual preview, and both theme values in a compact format
**And** the cheat sheet is screen-only (no special print styling)

### Story 2.6: Responsive Layout & Accessibility Polish

As a developer,
I want the browsing experience to adapt to tablet and mobile screens and meet WCAG 2.1 AA,
So that the tool is usable on smaller devices and accessible to all users.

**Acceptance Criteria:**

**Given** the browser viewport is ≥1024px
**When** the Split Panel renders
**Then** both panels display side by side (400px left + flexible right)

**Given** the viewport is 768–1023px
**When** the Split Panel renders
**Then** the layout stacks vertically — list above detail (UX-DR20)

**Given** the viewport is <768px
**When** the Split Panel renders
**Then** only the list view is shown, tapping a token navigates to a full-screen detail view

**And** all interactive elements on tablet/mobile have minimum 44×44px touch targets
**And** `aria-live="polite"` regions announce detail panel content changes on token selection (UX-DR18)
**And** all transitions (hover, selection) are wrapped in `motion-safe:` for prefers-reduced-motion users (UX-DR19)
**And** all visual token representations include text alternatives (token name + value visible alongside swatches) (NFR9)
**And** semantic HTML structure uses proper headings, landmarks, and list semantics (NFR12)

## Epic 3: Search, Command Palette & Keyboard Navigation

Developers can find any token instantly via the Cmd+K command palette with fuzzy search and visual result previews, perform reverse lookup by pasting a raw value, and navigate the entire app using keyboard shortcuts without a mouse.

### Story 3.1: Fuse.js Search Engine & Reverse Lookup

As a developer,
I want fuzzy search across all tokens by name or value, including reverse lookup,
So that I can find the right token whether I know its name, a partial name, or only a raw value like a hex code.

**Acceptance Criteria:**

**Given** the token data is loaded from `tokens.json`
**When** the `useTokenSearch` hook initializes
**Then** a Fuse.js index is built with weighted fields for token name, light value, and dark value per `searchConfig.ts`
**And** searching "bg secondary" matches `--color-bg-secondary` via fuzzy matching (FR11)
**And** searching "bg secndary" (typo) still returns the correct token
**And** searching `#f3f4f6` returns all tokens whose light or dark value matches that hex (reverse lookup, FR12)
**And** searching `16px` returns spacing/typography tokens with that resolved value
**And** results are ranked by best fuzzy match score, with the correct result in the top 3 for common queries
**And** search returns results within 100ms per keystroke for up to 500 tokens (NFR3)

### Story 3.2: Command Palette with Visual Previews

As a developer,
I want a Cmd+K command palette with visual token previews that lets me find and copy tokens without leaving the keyboard,
So that I can discover and use tokens in under 5 seconds without navigating to a category page.

**Acceptance Criteria:**

**Given** the user is on any page in the app
**When** the user presses Cmd+K, Ctrl+K, or `/` (when no input is focused)
**Then** the CommandPalette modal opens within 200ms (NFR4) with the text input focused (UX-DR4)
**And** the modal has a deep navy backdrop at 60% opacity, centered at max 640px width, ~20% from top (UX-DR24)
**And** the backdrop fades in and the modal scales from 95%→100% over 150ms (wrapped in `motion-safe:`)
**And** background page scroll is locked while the palette is open
**And** focus is trapped inside the modal until dismissed

**Given** the palette is open and the user types characters
**When** results are returned from Fuse.js
**Then** up to 8 results display, each showing: mini swatch (32px split light/dark) + token name (monospace) + light value + dark value
**And** the first result is highlighted by default
**And** non-color tokens show type-specific mini previews (spacing bar, "Aa" for typography)
**And** matched characters are highlighted in the token name
**And** if no results match, "No tokens match '[query]'" displays with a suggestion

**Given** a result is highlighted
**When** the user presses Enter
**Then** `var(--token-name)` is copied to clipboard with the same checkmark feedback as CopyButton
**And** the palette stays open for additional searches
**And** a footer displays keyboard hints: ↑↓ navigate, ⏎ copy, esc close

**Given** the palette is open
**When** the user presses Escape or clicks outside
**Then** the palette closes immediately and focus returns to the triggering element

### Story 3.3: Global Keyboard Navigation

As a developer,
I want to navigate all core features using keyboard shortcuts,
So that I can use the tool at full speed without reaching for my mouse.

**Acceptance Criteria:**

**Given** the user is on any page with no text input focused
**When** the user presses Cmd+K / Ctrl+K
**Then** the command palette opens (FR23)

**Given** no text input is focused
**When** the user presses `/`
**Then** the command palette opens

**Given** the command palette or a token list is active
**When** the user presses ↑ or ↓
**Then** the highlighted item moves up or down respectively (FR24)
**And** the highlighted item is visually distinct (subtle background highlight)

**Given** a token is highlighted in a list or command palette
**When** the user presses Enter
**Then** the token's value is copied (in palette) or the token is selected (in list)

**Given** the command palette is open or a token is selected
**When** the user presses Escape
**Then** the palette closes or the token deselects

**And** the `useKeyboardShortcuts` hook manages all global shortcuts without conflicting with browser defaults (FR22)
**And** all keyboard interactions are reachable via standard Tab focus order (NFR8)
**And** `aria-live="polite"` announces the search result count when results change (e.g., "5 results for 'primary'") (UX-DR18)
**And** a `?` keyboard shortcut overlay is available showing all shortcuts (UX-DR16)

## Epic 4: WCAG Contrast Checker & Accessible Pairings

Developers can verify WCAG contrast compliance for any color token pair in a visual matrix, see AA/AAA ratings at a glance, and discover recommended accessible text/background combinations with suggested semantic pairings.

### Story 4.1: Contrast Checker Page & Matrix Grid

As a developer,
I want to select a background color token and see all text tokens rated against it in a visual grid,
So that I can instantly verify which color combinations meet WCAG standards.

**Acceptance Criteria:**

**Given** the user navigates to `/contrast`
**When** the page renders
**Then** a background token picker displays at the top with a search/select input (UX-DR9)

**Given** no background token is selected
**When** the page renders
**Then** an empty state displays: "Select a background token to check contrast" with guidance to use the dropdown (UX-DR13)

**Given** the user selects a background token (e.g., `--color-warning-bg`)
**When** the grid populates
**Then** a 4–5 column grid of ContrastCell components appears below the picker (UX-DR9)
**And** each cell shows: the "Aa" text sample rendered in the cell's text token color on the selected background (18px bold), the computed contrast ratio in monospace, the text token name in small monospace (UX-DR10)
**And** cells are populated from pre-computed `contrastMatrix.json` data (FR16)
**And** a filter is available to show: all pairs, passing only (AA+), or failing only
**And** hovering a cell highlights it with a green border
**And** clicking a cell copies the text token's `var(--token-name)` to clipboard with checkmark feedback

**Given** the user changes the background token
**When** the grid updates
**Then** all cells re-render with the new background and recalculated display

### Story 4.2: WCAG Badges & Accessible Pairing Suggestions

As a developer,
I want to see clear AA/AAA/Fail badges on each contrast pair and get suggested semantic pairings,
So that I can choose accessible color combinations confidently and use the recommended pairings.

**Acceptance Criteria:**

**Given** a contrast grid is displayed
**When** each ContrastCell renders
**Then** a WcagBadge component displays the compliance level (UX-DR11):
- **AAA**: light green (#ccfaed) background, dark green (#07a06f) text — ratio ≥ 7:1
- **AA**: light blue (#d6e6ff) background, blue (#478bff) text — ratio ≥ 4.5:1
- **Fail**: light red (#ffeaea) background, red (#cc3333) text — ratio < 4.5:1
**And** badges are inline pills with 10px font and 2px/8px padding (FR17)
**And** badges include text labels (not color alone) for accessibility

**Given** a background token has a semantic pairing (e.g., `--color-warning-bg` pairs with `--color-warning-text`)
**When** the grid displays
**Then** the semantic pairing cell is visually highlighted (distinct from other cells) as the suggested combination (FR18)
**And** a "Suggested pairing" label is visible on the highlighted cell

**Given** the user clicks a contrast cell
**When** a PairPopover opens
**Then** it shows: both token names, the contrast ratio, the WCAG level, a "Copy pair" button, and a "Copy permalink" button
**And** the permalink encodes both tokens in the URL (e.g., `/contrast?bg=color-warning-bg&fg=color-warning-text`)
**And** navigating to a contrast permalink auto-selects the background and highlights the foreground cell

## Epic 5: Nice-to-Haves & Design System Integration

Post-MVP enhancements that connect the token explorer to the `@ogcio/design-system-react` component library, providing usage context and bridging the gap between raw design tokens and the React components that consume them.

### Story 5.1: Token Usage Mapping for design-system-react Components

As a developer,
I want to see which `@ogcio/design-system-react` components use each token,
So that I can understand the practical impact of a token and find the right component when I know the token (or vice versa).

**Acceptance Criteria:**

**Given** the build-time pipeline runs
**When** `scripts/generate-token-usage.ts` processes the `@ogcio/design-system-react` package
**Then** it scans `dist/styles.css` and all component JS files under `dist/` for references to `--gieds-*` CSS custom properties and `gi-*` utility classes
**And** it produces a `src/data/tokenUsage.json` mapping each token name to an array of component names that reference it
**And** it produces a reverse mapping from each component name to the tokens it uses

**Given** a token is selected in any category page's detail panel
**When** the TokenDetail component renders
**Then** a "Used by" section displays the list of `design-system-react` components that reference this token
**And** each component name links to the external Storybook documentation at `ds.services.gov.ie/storybook-react` (if available)

**Given** the user navigates to `/usage` (new route)
**When** the page renders
**Then** a searchable list of all `design-system-react` components is displayed
**And** clicking a component shows all tokens it uses, grouped by category (color, spacing, typography, border, shadow)
**And** clicking a token in the usage list navigates to that token's detail page in the appropriate category

**Given** the `@ogcio/design-system-react` package is updated to a new version
**When** the pipeline runs
**Then** the token usage mapping regenerates automatically, reflecting any changes in component-token relationships
**And** the build logs the number of components analyzed and tokens mapped

## Epic 6: Deployment & CI/CD

Automated deployment pipeline that builds and publishes the static token explorer to a hosting platform via GitHub Actions, ensuring every push to the main branch produces a live, up-to-date site with zero manual intervention.

### Story 6.1: GitHub Actions CI/CD Pipeline with GitHub Pages Deployment

As a developer,
I want an automated GitHub Actions workflow that builds and deploys the static site to GitHub Pages on every push to main,
So that the token explorer is always live and up-to-date without manual deployment steps.

**Acceptance Criteria:**

**Given** a push is made to the `main` branch
**When** the GitHub Actions workflow `deploy.yml` triggers
**Then** it installs dependencies with `npm ci`
**And** it runs `npm run generate-tokens` and `npm run generate-token-usage` to produce fresh token data
**And** it runs `npm run build` to produce the static `out/` directory
**And** it uploads the `out/` directory as a GitHub Pages artifact using `actions/upload-pages-artifact@v3`
**And** it deploys to GitHub Pages using `actions/deploy-pages@v4`
**And** the deployed site is accessible at the repository's GitHub Pages URL

**Given** the repository uses a subpath URL (e.g., `https://<org>.github.io/<repo>/`)
**When** `next.config.ts` is configured for GitHub Pages
**Then** `basePath` and `assetPrefix` are set to `/<repo-name>` conditionally via an environment variable (`GITHUB_PAGES=true`)
**And** the default development experience (`npm run dev`) is unaffected — no basePath applied locally

**Given** the workflow runs
**When** any step fails (install, generate, build, deploy)
**Then** the workflow fails with a clear error message identifying the failing step
**And** no partial deployment occurs — GitHub Pages retains the previous successful deployment

**Given** the workflow completes successfully
**When** the deployment finishes
**Then** the site is live within 2 minutes of the push
**And** the workflow run shows a green checkmark in the GitHub Actions UI

**And** the workflow uses Node.js 20 (matching the project requirement of Node.js 20.9+ LTS)
**And** the workflow uses `actions/configure-pages@v5` to enable GitHub Pages
**And** the workflow defines `permissions: pages: write, id-token: write, contents: read` for secure deployment
**And** the workflow includes a `concurrency` group to prevent overlapping deployments

### Story 6.2: Vercel Deployment Configuration

As a developer,
I want an alternative Vercel deployment configuration ready to use,
So that the team can deploy to Vercel with preview deployments per PR if GitHub Pages doesn't meet their needs.

**Acceptance Criteria:**

**Given** the repository is connected to Vercel
**When** a `vercel.json` configuration file exists in the project root
**Then** it specifies the build command as `npm run generate-tokens && npm run generate-token-usage && npm run build`
**And** it specifies the output directory as `out`
**And** it specifies the framework as `nextjs`

**Given** a pull request is opened against `main`
**When** Vercel detects the PR
**Then** a preview deployment is created automatically with a unique URL
**And** the preview reflects the PR branch's token data and UI changes

**Given** a push is made to `main`
**When** Vercel detects the push
**Then** a production deployment is triggered and the live site updates

**And** a `README.md` deployment section documents both deployment options (GitHub Pages and Vercel) with step-by-step instructions
**And** the `next.config.ts` `basePath` logic does not interfere with Vercel deployments (only applies when `GITHUB_PAGES=true`)
