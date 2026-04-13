<div align="center">

# Gov.ie Design Token Explorer

**Find the right token in under 10 seconds. Not 10 minutes.**

Browse, search, and inspect **664 design tokens** from [`@ogcio/theme-govie`](https://www.npmjs.com/package/@ogcio/theme-govie) — with visual previews, light/dark comparison, and built-in WCAG contrast checking.

[**Colors**](#colors) · [**Spacing**](#spacing) · [**Typography**](#typography) · [**Borders**](#borders) · [**Shadows**](#shadows) · [**Contrast**](#contrast-checker) · [**Cheat Sheet**](#cheat-sheet)

</div>

---

## Why This Exists

Developers on the Gov.ie project were discovering tokens by asking designers, grepping CSS files, or digging through Figma. That's slow, error-prone, and breaks flow.

This tool parses tokens **directly from the CSS source of truth** at build time and presents them through an interactive interface — so the right token is always one search away.

> Zero login. Zero setup. Zero backend. Just a URL.

## What You Get

| Feature | What it does |
|---|---|
| **Fuzzy Search** | Find tokens by name *or* value — type `#1A5632` and get `--color-primary-dark` |
| **Command Palette** | `⌘K` opens keyboard-driven search from any page |
| **Light / Dark Side-by-Side** | Every token shows both theme values simultaneously — no toggling |
| **WCAG Contrast Matrix** | Pre-computed AA/AAA badges for every color pair |
| **Accessible Pairing Suggestions** | See which text colors are safe on any background |
| **Visual Previews** | Color swatches, spacing scales, typography samples, shadow elevations |
| **One-Click Copy** | Copies `var(--token-name)` to your clipboard instantly |
| **Permalinks** | Share a link to any token — paste it in a PR for WCAG evidence |
| **Keyboard-First** | Navigate everything without touching a mouse |
| **Component Usage** | See which `@ogcio/design-system-react` components reference each token |

## Routes

| Path | Description |
|---|---|
| `/` | Landing — category overview with token counts and visual previews |
| `/colors` | Full color palette with swatches, light/dark values, and search |
| `/spacing` | Spacing scale with visual size indicators |
| `/typography` | Font families, sizes, weights, and line heights |
| `/borders` | Border widths and radius tokens |
| `/shadows` | Elevation tokens with rendered shadow previews |
| `/contrast` | WCAG contrast ratio matrix for all color pairs |
| `/cheatsheet` | Dense, scannable overview of every token |
| `/usage` | Token-to-component cross-reference from the design system |

## Quick Start

```bash
# Install dependencies
npm install

# Generate token data from @ogcio/theme-govie CSS
npm run generate-tokens

# Generate component usage data from @ogcio/design-system-react
npm run generate-token-usage

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start exploring.

### Production Build

```bash
npm run build
```

Outputs a fully static site to `out/` — deploy it anywhere (S3, GitHub Pages, Netlify, any CDN).

## How It Works

```
@ogcio/theme-govie (CSS)
        │
        ▼
┌──────────────────────┐
│  Build-Time Pipeline │
│                      │
│  Parse CSS ──────────┤
│  Categorize tokens   │
│  Compute WCAG pairs  │
│  Validate counts     │
└──────────┬───────────┘
           │
           ▼
    tokens.json          ← 664 tokens with light + dark values
    contrastMatrix.json  ← pre-computed WCAG ratios
    tokenUsage.json      ← component cross-references
           │
           ▼
┌──────────────────────┐
│   Next.js Static     │
│   Export (out/)       │
│                      │
│   Fuzzy search       │
│   Category browsers  │
│   Contrast checker   │
│   Command palette    │
└──────────────────────┘
```

All token data is frozen at build time. No runtime API calls, no backend, works offline after first load.

## Token Categories

| Category | Count | Examples |
|---|---|---|
| **Color** | 433 | Palette scales, text, backgrounds, borders, semantic (warning, error, success) |
| **Typography** | 119 | Font families, sizes, weights, line heights, type scale shorthands |
| **Spacing** | 53 | Size and spacing scale for consistent layouts |
| **Border** | 15 | Widths, radii |
| **Shadow** | 6 | Elevation levels from subtle to prominent |
| **Other** | 38 | Miscellaneous tokens |

## Tech Stack

| Layer | Choice |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, static export) |
| **UI** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Search** | [Fuse.js](https://www.fusejs.io/) |
| **Fonts** | [Bitter](https://fonts.google.com/specimen/Bitter) (headings) + [Inter](https://fonts.google.com/specimen/Inter) (body) |
| **Lint / Format** | [Biome](https://biomejs.dev/) |
| **Tests** | [Vitest](https://vitest.dev/) |
| **Language** | TypeScript (strict) |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build static site to `out/` |
| `npm run generate-tokens` | Parse `@ogcio/theme-govie` CSS → `tokens.json` + `contrastMatrix.json` |
| `npm run generate-token-usage` | Scan `@ogcio/design-system-react` → `tokenUsage.json` |
| `npm run lint` | Check with Biome |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format with Biome |
| `npm run test` | Run tests with Vitest |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing — category overview
│   ├── colors/           # Color token browser
│   ├── spacing/          # Spacing scale browser
│   ├── typography/       # Typography token browser
│   ├── borders/          # Border token browser
│   ├── shadows/          # Shadow token browser
│   ├── contrast/         # WCAG contrast matrix
│   ├── cheatsheet/       # Dense token overview
│   └── usage/            # Component usage cross-reference
├── components/           # Reusable UI components
├── data/                 # Generated JSON (tokens, contrast, usage)
├── lib/                  # Token pipeline (parse, categorize, WCAG)
└── types/                # TypeScript type definitions
scripts/
├── generate-tokens.ts    # CSS → token JSON pipeline
└── generate-token-usage.ts  # Component usage scanner
```

## Requirements

- **Node.js** ≥ 20
- **npm** ≥ 10

## License

Internal tool — NearForm / OGCIO.
