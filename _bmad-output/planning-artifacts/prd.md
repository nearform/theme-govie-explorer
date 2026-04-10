---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments:
  - '_bmad-output/brainstorming/brainstorming-session-2026-04-10-1640.md'
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 0
classification:
  projectType: web_app
  domain: developer_tool
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - theme-govie-tokens

**Author:** Matteo
**Date:** 2026-04-10

## Executive Summary

Gov.ie Design System Token Explorer is a static web application that gives NearForm developers a single, authoritative reference for the Gov.ie design system's CSS tokens. Today, developers discover tokens by asking designers or inspecting Figma files — both error-prone and slow. This tool eliminates that friction by parsing tokens directly from the CSS source of truth and presenting them through a rich, interactive interface with fuzzy search, reverse lookup, command palette, live-rendered previews, and side-by-side light/dark theme comparison.

The application is built with Next.js 16 (static export), Vite, and Tailwind. It requires no backend, no authentication, and no setup — a zero-friction static site that complements the existing Storybook at ds.services.gov.ie.

### What Makes This Special

This is not a passive token catalog. Three properties elevate it into a daily-use design system companion:

1. **Triple-layer discovery** — fuzzy search by name, reverse lookup by value, and a command palette for keyboard-driven navigation ensure developers find the right token regardless of what they know about it.
2. **Built-in WCAG tooling** — a contrast checker matrix and accessible pairing suggestions turn accessibility compliance from a post-hoc audit into an integrated selection aid.
3. **Neutral, distraction-free UI** — the explorer uses its own clean interface so token previews stand out clearly, and the tool isn't visually coupled to a specific theme version.

## Project Classification

- **Type:** Web application (static SPA, Next.js 16 static export)
- **Domain:** Developer tooling (design system companion)
- **Complexity:** Low — no backend, no auth, no compliance requirements; complexity is concentrated in UX/interaction design and WCAG accessibility as a product feature
- **Context:** Greenfield
- **Primary audience:** NearForm developers (Gov.ie contractors)

## Success Criteria

### User Success

- A developer finds and copies the correct token in **under 10 seconds** from opening the tool
- Color and spacing tokens — the primary sources of confusion — are presented with enough visual context (swatches, scale visualization, side-by-side themes) that the right choice is obvious without designer input
- Developers stop asking "which color token is this?" in Slack/Teams — the tool answers it faster than a colleague can

### Business Success

- Organic adoption by NearForm Gov.ie developers — the tool is used when needed, not mandated
- Reduction in design-to-dev token miscommunication (fewer "wrong token" bugs in code review)
- The tool becomes the de facto reference that developers bookmark and return to, replacing Figma token lookups

### Technical Success

- Static site with no perceptible load delay (see NFR1–NFR6 for specific targets)
- Token parsing at build time produces a complete, accurate representation of the CSS source file
- Works offline after first load (static assets, no runtime dependencies)
- Accessible: the tool itself meets WCAG 2.1 AA (see NFR7–NFR12 for specific criteria)

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Token discovery time | < 10 seconds from page load to copied value |
| Token accuracy | 100% parity with CSS source file (automated build-time validation) |
| Lighthouse performance | 90+ |
| WCAG compliance | 2.1 AA (self-assessed) |
| Zero-setup access | No login, no install, no build — just a URL |

## User Journeys

### Journey 1: Liam — "I need this token, now"

**Who:** Liam is a senior NearForm frontend developer, three months into a Gov.ie project. He's implementing a card component and the design spec says "use the secondary background color."

**Opening Scene:** Liam is mid-flow in VS Code. He knows the token exists but can't remember the exact variable name. Previously he'd open Figma, search for the color, hope the hex value is current, then grep the CSS file. That takes 2-3 minutes and breaks his focus.

**Rising Action:** He hits his bookmark for the Token Explorer. Presses Cmd+K, types "secondary background." The fuzzy search matches `--color-bg-secondary` instantly. He sees the swatch rendered in both light and dark themes side by side — confirms it's the right one visually.

**Climax:** One click copies `var(--color-bg-secondary)` to his clipboard. Total time: 4 seconds.

**Resolution:** Liam never opened Figma. He didn't message a designer. He stayed in flow and the token is guaranteed correct because it's parsed from the source CSS file.

**Capabilities revealed:** Fuzzy search, command palette, side-by-side theme preview, one-click copy with format options, token accuracy from CSS source.

---

### Journey 2: Aoife — "What spacing options do I have?"

**Who:** Aoife is a mid-level NearForm developer starting a new page layout. She knows the design system has a spacing scale but doesn't know the full range of values.

**Opening Scene:** Aoife needs to set consistent padding and margins for a new section. She vaguely remembers `--space-4` and `--space-8` but doesn't know the full scale or naming convention.

**Rising Action:** She opens the Token Explorer and filters by "Spacing" using the category chips. The visual browser shows the entire spacing scale laid out — small swatches visualizing each step from `--space-1` through `--space-16`, with pixel values displayed inline.

**Climax:** She spots that the scale uses a consistent 4px base. She picks `--space-6` for inner padding and `--space-10` for section gaps, copies both, and now understands the system well enough that she won't need to look this up again.

**Resolution:** Aoife learned the spacing system in 30 seconds. No guessing, no asking, no reading documentation. The visual scale made the pattern self-evident.

**Capabilities revealed:** Category filtering, visual scale browser, inline value decorators, educational "learn by browsing" experience.

---

### Journey 3: Ravi — "Will this color combination pass WCAG?"

**Who:** Ravi is a NearForm developer building a notification banner. He wants to use a yellow background with dark text and needs to verify the combination meets WCAG AA contrast requirements.

**Opening Scene:** Ravi has picked `--color-warning-bg` and `--color-text-primary` but isn't confident the contrast ratio is sufficient. He's been burned before — a previous PR was rejected because a color pair failed accessibility review.

**Rising Action:** He opens the contrast checker, selects the warning background token. The tool shows a pre-computed matrix of all text colors against that background, with AA and AAA badges. He immediately sees that `--color-text-primary` passes AAA.

**Climax:** But he also notices the tool's accessible pairing suggestions — it recommends `--color-warning-text` as the semantic pairing designed specifically for this background. It passes AAA and is the intended combination.

**Resolution:** Ravi uses the semantic pairing instead of his ad-hoc choice. The banner is accessible by design, not by accident. He copies the permalink and pastes it in the PR description as evidence of WCAG compliance.

**Capabilities revealed:** WCAG contrast checker matrix, AA/AAA badges, accessible pairing suggestions, permalinks as communication tool.

---

### Journey 4: Niamh — "I just joined, what tokens are there?"

**Who:** Niamh is a junior developer who started on the Gov.ie project this week. She's done React before but never worked with a design token system.

**Opening Scene:** Niamh's onboarding doc says "use design system tokens for all styling." She doesn't know what that means concretely — how many tokens are there? How are they organized? What's the naming convention?

**Rising Action:** She opens the Token Explorer. The landing page shows token categories — colors, spacing, typography, borders, shadows — as a visual overview. She clicks into the color category and sees tokens grouped by semantic intent: primary, secondary, warning, error, success.

**Climax:** Each token is shown with a swatch, its CSS variable name, and its resolved value in both themes. The naming convention clicks: `--color-{intent}-{element}`. She gets it.

**Resolution:** After 5 minutes of browsing, Niamh understands the token vocabulary, naming conventions, and available options. She starts her first component confidently. When she's unsure about a specific token later, she uses Cmd+K to find it in seconds.

**Capabilities revealed:** Visual category browser, semantic grouping, side-by-side theme values, self-teaching UX.

---

### Journey 5: Siobhán — "Can you check this token?"

**Who:** Siobhán is a Gov.ie designer working in Figma. She doesn't write code, but she needs to verify that the color she specified in her design matches an actual token.

**Opening Scene:** Siobhán is reviewing a Figma mockup with a developer and they disagree on whether `#1A5632` is a valid token value. She's not going to open a CSS file.

**Rising Action:** The developer sends her a permalink to the Token Explorer's reverse lookup. She pastes `#1A5632` into the search bar. The tool instantly maps it to `--color-primary-dark` and shows it rendered in both themes.

**Climax:** She confirms the token exists, sees its name and semantic intent, and notices it's part of the primary color scale. She bookmarks the explorer — it's faster than searching Figma's own token library.

**Resolution:** Siobhán starts using the Token Explorer as her go-to reference for verifying token values before handoff. Communication with developers improves because they now share a common, accurate reference. Permalinks become the standard way to reference tokens in design-dev conversations.

**Capabilities revealed:** Reverse lookup, permalinks as collaboration tool, designer-friendly visual interface, bridge between design and development workflows.

---

### Journey Requirements Summary

| Capability | Journeys |
|---|---|
| Fuzzy search + command palette | Liam, Niamh |
| Category filtering + visual browser | Aoife, Niamh |
| Side-by-side theme preview | Liam, Aoife |
| One-click copy with format options | Liam, Aoife |
| WCAG contrast checker + pairing suggestions | Ravi |
| Reverse lookup (value → token) | Siobhán |
| Permalinks | Ravi, Siobhán |
| Semantic grouping + visual overview | Niamh |
| Inline value decorators | Aoife |
| Keyboard-first navigation | Liam, Niamh |
| Neutral, clean UI | All |
| Zero friction (no setup) | All |

## Web App Specific Requirements

### Project-Type Overview

Static single-page application with client-side routing, built with Next.js 16 (static export). Multiple routes organize tokens by category (e.g., `/colors`, `/spacing`, `/typography`) to avoid a cramped single-page layout. All token data is extracted at build time from the CSS theme files in the `theme-govie` package — no runtime data fetching.

### Technical Architecture Considerations

**Application Type:** SPA with static export — client-side routing via Next.js App Router, pre-rendered at build time, deployed as static files.

**Build-Time Token Pipeline:**
- Parse CSS theme files from the `theme-govie` package during the Next.js build step
- Extract all CSS custom properties (variables), categorize by type (color, spacing, typography, border, shadow, etc.)
- Pre-compute WCAG contrast ratios for all color token pairs
- Generate static JSON data that the client-side app consumes
- Token data is frozen at build time — no runtime CSS parsing

**Routing Structure:**
- Landing page with category overview and token summary
- Category pages: `/colors`, `/spacing`, `/typography`, `/borders`, `/shadows`, etc.
- WCAG contrast checker as a dedicated route
- Cheat sheet view as a dedicated route
- All routes are statically generated — no server-side rendering at runtime

### Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |

No IE11, no legacy mobile browsers, no embedded webviews.

### Responsive Design

Desktop-first — this is a developer working tool used alongside an IDE. Responsive down to tablet for quick reference use, but optimized for wide screens where developers work.

### Performance Targets

See NFR1–NFR6 for specific, measurable performance criteria. Static export means no server response time — performance is purely about asset size and client-side rendering speed.

### SEO Strategy

Not applicable. Internal developer tool — no public indexing needed. `noindex` meta tag acceptable.

### Accessibility

See NFR7–NFR12 for specific WCAG 2.1 criteria. Key architectural decision: display the actual conformance level (AA or AAA) per criterion so the team always knows where the tool stands. The tool's own UI must meet at minimum AA; the contrast checker feature reports both AA and AAA for Gov.ie token pairs.

### Implementation Considerations

- **No backend dependency** — the entire app is static files servable from any CDN or file host
- **Offline-capable** — once loaded, all functionality works without network (static assets, no API calls)
- **Build-time coupling** — token accuracy depends on the build pipeline correctly parsing the `theme-govie` CSS. This is the single most critical technical path
- **Next.js 16 static export constraints** — no API routes, no server components at runtime, no ISR. All data must be available at build time

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP — deliver the minimum toolset that makes token discovery faster than asking a designer or searching Figma. Every feature must earn its place in a two-day solo build.

**Resource Requirements:** Single developer (Matteo), ~2 days. Next.js 16, Tailwind, static export. No design resources — the UI is a clean, functional developer tool.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Liam (quick token lookup) — fully supported
- Aoife (category exploration) — fully supported
- Ravi (WCAG contrast check) — fully supported
- Niamh (onboarding browse) — supported via category browser (no God View)
- Siobhán (designer reference) — supported via reverse lookup + permalinks

**Must-Have Capabilities:**

| Feature | Justification |
|---------|--------------|
| Build-time CSS token extraction | Foundation — everything depends on this |
| Categorized token display | Core browsing experience (color, spacing, typography, borders, shadows) |
| Visual category browser | Swatches, scale visualizations, inline value decorators |
| Filter-driven navigation | Chips/tags filtering, no sidebar tree |
| Fuzzy search | Bidirectional — by token name or value |
| Reverse lookup | Paste a value, get the token name(s) |
| Command palette (Cmd+K) | Keyboard-first fuzzy navigation |
| Side-by-side light/dark themes | Always visible, no toggling |
| One-click copy (CSS var) | Single format — `var(--token-name)` to clipboard |
| WCAG contrast checker | Pre-computed matrix for color pairs, AA/AAA badges |
| Accessible pairing suggestions | WCAG-safe text/background combinations |
| Permalink per token | Shareable URL fragment |
| Keyboard-first navigation | Shortcuts for all actions |
| Token cheat sheet view | Dense overview of all tokens — screen-only |

**Deferred from original MVP scope:**
- Multi-format copy/export (Tailwind, SCSS, JSON) → Phase 2
- Palette export → Phase 2
- "God View" landing page → Phase 2

### Post-MVP Features

**Phase 2 (Growth):**
- Multi-format copy (Tailwind, SCSS, JSON, raw value)
- Palette export (CSS/Tailwind/SCSS/JSON file download)
- "God View" — sample Gov.ie page rendered with all tokens
- Token intent labels (human-readable purpose)
- Token relationship graph (visual hierarchy, scales)
- Related tokens recommendations
- Color blindness simulation
- Typography browser with custom preview text
- Token validation / lint warnings — flag semantic misuse of tokens

**Phase 3 (Expansion):**
- Multi-mode interface (Reference / Explorer / Assistant modes)
- Problem-driven discovery — describe what you're building, get a scoped token set
- Usage map per token (component references)
- Interactive examples (sliders, drag, resize)
- Natural language token finder
- Component appearance customizer
- CSS/React code generator
- Theme builder / white-label generator
- Token changelog / version diff
- Design system health dashboard

### Risk Mitigation Strategy

**Technical Risks:**
- *CSS parser breaking on structure changes* — Low risk. Token names follow stable conventions. Mitigation: parser should be defensive (skip unparseable properties, log warnings) rather than failing hard. Add a build-time validation step that counts extracted tokens and flags if the count drops unexpectedly.
- *Next.js 16 static export limitations* — Low risk. No server features needed. All data is build-time JSON.

**Market Risks:**
- *Developers don't adopt it* — Low risk for MVP. The audience is small (NearForm Gov.ie team), the tool is free and zero-friction. If it's faster than Figma, it wins. No formal rollout needed — share the URL.

**Resource Risks:**
- *Two-day timeline is tight* — Mitigated by aggressive MVP scope. The deferred features (multi-format export, God View, palette export) buy back significant time. If time runs short, the cheat sheet view and accessible pairing suggestions are the first candidates to defer.

## Functional Requirements

### Token Data Pipeline

- **FR1:** The system can parse CSS custom properties from the `theme-govie` package at build time and extract all design tokens
- **FR2:** The system can categorize extracted tokens by type (color, spacing, typography, border, shadow, and other detected categories)
- **FR3:** The system can pre-compute WCAG contrast ratios for all color token pairs at build time
- **FR4:** The system can validate token extraction completeness at build time and warn if the token count deviates from expected range

### Token Browsing & Navigation

- **FR5:** Users can browse tokens organized by category through a visual category browser
- **FR6:** Users can filter tokens using category chips/tags
- **FR7:** Users can view tokens across multiple routes organized by category (colors, spacing, typography, borders, shadows, etc.)
- **FR8:** Users can see visual representations of token values (color swatches, spacing scale visualizations, typography samples)
- **FR9:** Users can see inline value decorators next to every token (visual preview of the value)
- **FR10:** Users can view a dense cheat sheet of all tokens on a single screen

### Search & Discovery

- **FR11:** Users can search tokens by name or value using fuzzy matching
- **FR12:** Users can perform reverse lookup — enter a raw value and find matching token name(s)
- **FR13:** Users can open a command palette (Cmd+K) for keyboard-driven fuzzy search and navigation

### Theme Comparison

- **FR14:** Users can view token values in both light and dark themes simultaneously, side by side
- **FR15:** Users can compare how any token resolves differently across themes

### Accessibility Tooling

- **FR16:** Users can view a WCAG contrast ratio matrix for color token pairs
- **FR17:** Users can see AA and AAA compliance badges for each color pair in the matrix
- **FR18:** Users can view suggested accessible pairings — WCAG-safe text/background combinations for any color token

### Copy & Share

- **FR19:** Users can copy a token's CSS variable reference (`var(--token-name)`) to clipboard with one click
- **FR20:** Users can generate and share a permalink to any specific token
- **FR21:** Users can navigate directly to a specific token via a shared permalink URL

### Keyboard Interaction

- **FR22:** Users can navigate all core features using keyboard shortcuts without a mouse
- **FR23:** Users can access the command palette from any screen via a keyboard shortcut
- **FR24:** Users can navigate token lists using arrow keys and select with Enter

### Application Shell

- **FR25:** Users can access the application without login, installation, or build steps
- **FR26:** Users can use all features offline after initial page load
- **FR27:** The application can render with a neutral, clean UI that does not depend on the Gov.ie theme

## Non-Functional Requirements

### Performance

- **NFR1:** Initial page load (First Contentful Paint) completes in under 1 second on a modern desktop browser with broadband connection
- **NFR2:** Time to Interactive is under 2 seconds — the app is usable (search, filter, copy) within 2 seconds of navigation
- **NFR3:** Fuzzy search returns results within 100ms of keystroke for a token set of up to 500 tokens
- **NFR4:** Command palette (Cmd+K) opens and is ready for input within 200ms
- **NFR5:** Lighthouse Performance score of 90 or above on all routes
- **NFR6:** Total JavaScript bundle size stays under 200KB gzipped (excluding static token data)

### Accessibility

- **NFR7:** The application meets WCAG 2.1 Level AA across all routes, with the actual conformance level (AA or AAA) displayed per criterion
- **NFR8:** All interactive elements are reachable and operable via keyboard alone
- **NFR9:** All visual token representations include text alternatives (token name + value visible alongside swatches)
- **NFR10:** Focus indicators are visible on all interactive elements
- **NFR11:** The UI respects `prefers-reduced-motion` and `prefers-color-scheme` user preferences
- **NFR12:** Semantic HTML structure supports screen reader navigation with logical heading hierarchy and landmark regions

### Build-Time Integration

- **NFR13:** The CSS token parser extracts tokens from the `theme-govie` package without manual intervention during the build
- **NFR14:** Build fails with a clear error message if the `theme-govie` package is missing or the CSS file structure is unrecognizable
- **NFR15:** Build completes in under 30 seconds including token extraction, WCAG contrast pre-computation, and static export
