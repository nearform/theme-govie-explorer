# Story 6.1: GitHub Actions CI/CD Pipeline with GitHub Pages Deployment

Status: done

## Story

As a developer,
I want an automated GitHub Actions workflow that builds and deploys the static site to GitHub Pages on every push to main,
So that the token explorer is always live and up-to-date without manual deployment steps.

## Acceptance Criteria

1. A GitHub Actions workflow `.github/workflows/deploy.yml` triggers on every push to `main` and on `workflow_dispatch`
2. The workflow installs dependencies with `npm ci`, runs `npm run generate-tokens && npm run generate-token-usage`, then runs `npm run build` to produce the static `out/` directory
3. The workflow uploads `out/` as a GitHub Pages artifact via `actions/upload-pages-artifact@v3` and deploys via `actions/deploy-pages@v4`
4. `next.config.ts` conditionally sets `basePath` and `assetPrefix` to `/<repo-name>` when the `GITHUB_PAGES` environment variable is `true`, leaving local dev unaffected
5. The workflow sets the `GITHUB_PAGES=true` environment variable during build so the conditional basePath activates
6. The workflow uses Node.js 20, defines `permissions: contents: read, pages: write, id-token: write`, and includes a `concurrency` group to prevent overlapping deployments
7. A `.nojekyll` file exists in `public/` to prevent GitHub Pages from ignoring files starting with underscores (`_next/`)
8. If any workflow step fails, no partial deployment occurs — GitHub Pages retains the previous successful deployment
9. The deployed site is accessible at the repository's GitHub Pages URL and all routes (/, /colors, /spacing, /typography, /borders, /shadows, /contrast, /cheatsheet, /usage) load correctly

## Tasks / Subtasks

- [x] Task 1: Add `.nojekyll` to `public/` (AC: #7)
  - [x] Create an empty `public/.nojekyll` file
- [x] Task 2: Update `next.config.ts` with conditional `basePath` and `assetPrefix` (AC: #4, #5)
  - [x] Read `GITHUB_PAGES` env var
  - [x] When `GITHUB_PAGES=true`, set `basePath` to the repo name (e.g., `/theme-govie-tokens`) and `assetPrefix` to the same value with trailing slash
  - [x] When not set, leave basePath/assetPrefix undefined (current behavior)
  - [x] Ensure `output: 'export'` remains unchanged
  - [x] Write unit test verifying both code paths (with and without GITHUB_PAGES env var)
- [x] Task 3: Create `.github/workflows/deploy.yml` (AC: #1, #2, #3, #6, #8)
  - [x] Define `on: push: branches: ["main"]` and `workflow_dispatch`
  - [x] Set `permissions: contents: read, pages: write, id-token: write`
  - [x] Add `concurrency: group: "pages", cancel-in-progress: false`
  - [x] Build job: `actions/checkout@v4`, `actions/setup-node@v4` (node 20), `npm ci`, `actions/configure-pages@v5`, run generate-tokens, generate-token-usage, and build with `GITHUB_PAGES=true` env
  - [x] Build job: `actions/upload-pages-artifact@v3` with `path: ./out`
  - [x] Deploy job: depends on build, uses `actions/deploy-pages@v4`, outputs `page_url`
- [x] Task 4: Verify build succeeds with GITHUB_PAGES=true locally (AC: #9)
  - [x] Run `GITHUB_PAGES=true npm run build` locally and confirm `out/` contains correct asset paths
  - [x] Spot-check that HTML files reference `/<repo-name>/_next/` for assets

## Dev Notes

### next.config.ts Modification

The current config is minimal:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
};

export default nextConfig;
```

Update to:

```typescript
import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = '/theme-govie-tokens';

const nextConfig: NextConfig = {
  output: 'export',
  ...(isGitHubPages && {
    basePath: repoName,
    assetPrefix: `${repoName}/`,
  }),
};

export default nextConfig;
```

**CRITICAL:** The `repoName` must match the actual GitHub repository name. If the org/user deploys to a custom domain, `basePath` is unnecessary — but the conditional approach via `GITHUB_PAGES` env var handles both cases.

### .nojekyll File

GitHub Pages uses Jekyll by default, which ignores directories starting with `_`. Next.js outputs assets into `_next/`. An empty `.nojekyll` file in the root of the deployed site disables Jekyll processing.

Place it in `public/.nojekyll` so Next.js copies it to `out/.nojekyll` during build.

### GitHub Actions Workflow Structure

Two-job workflow (build → deploy) following the official GitHub Pages pattern:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - uses: actions/configure-pages@v5
      - run: npm run generate-tokens
      - run: npm run generate-token-usage
      - run: npm run build
        env:
          GITHUB_PAGES: "true"
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Key details:**
- `npm ci` (not `npm install`) for reproducible installs from lockfile
- `actions/configure-pages@v5` enables the Pages feature on the repo
- `GITHUB_PAGES=true` only on the build step so basePath activates
- `cancel-in-progress: false` prevents a second push from canceling an active deployment mid-flight
- The deploy job uses the `github-pages` environment, which GitHub provisions automatically

### Why npm (not pnpm)?

The `package.json` shows `"generate-tokens": "tsx scripts/generate-tokens.ts"` etc. The architecture doc mentions pnpm, but the repo currently uses npm (lockfile is `package-lock.json` based on the scaffolding). Use `npm ci` in the workflow. If the project switches to pnpm, update accordingly.

### Potential Issues

1. **Repository name mismatch:** The `repoName` constant in `next.config.ts` must match the GitHub repo name exactly. If the repo is hosted at `github.com/ogcio/theme-govie-tokens`, the basePath should be `/theme-govie-tokens`.

2. **Internal links:** Any `<a href="/">` or `<Link href="/colors">` in the app must use Next.js `Link` component, which automatically prepends `basePath`. Raw `<a>` tags with absolute paths will break on GitHub Pages. Verify no hardcoded paths exist.

3. **Generated data files:** `tokens.json`, `contrastMatrix.json`, and `tokenUsage.json` are gitignored (`/src/data/*.json`). The workflow generates them fresh in each run — this is correct and intentional.

4. **Custom domain alternative:** If the team later adds a custom domain (CNAME), `basePath` becomes unnecessary. The `GITHUB_PAGES` env var approach cleanly supports this: just don't set it, or set `basePath` to empty string.

### Architecture Compliance

**File locations:**
- `.github/workflows/deploy.yml` — GitHub Actions workflow (new)
- `next.config.ts` — Modified with conditional basePath
- `public/.nojekyll` — Empty file (new)

**No new runtime or build dependencies.** All GitHub Actions used are official first-party actions maintained by GitHub.

**Import style:** N/A — no new TypeScript modules.

**Testing:** The `next.config.ts` change is configuration, not logic. A local build with `GITHUB_PAGES=true npm run build` followed by inspecting `out/index.html` for correct asset paths serves as the verification step. Optionally, a unit test for the config export can validate both code paths.

### Previous Story Intelligence

From Story 5.1 (most recent completed story):
- Build pipeline: `npm run generate-tokens && npm run generate-token-usage && npm run build` — this exact sequence must be replicated in the workflow
- Generated data in `src/data/*.json` is gitignored — workflow must regenerate
- 11 routes confirmed: `/`, `/colors`, `/spacing`, `/typography`, `/borders`, `/shadows`, `/contrast`, `/cheatsheet`, `/usage` plus the root layout
- Build output is `out/` directory per `output: 'export'` in `next.config.ts`
- No `next/image` usage found — `images: { unoptimized: true }` is NOT needed

### Link Verification Checklist

After deployment, verify these links work with the basePath prefix:
- `/<repo>/` — Landing page
- `/<repo>/colors` — Color tokens
- `/<repo>/spacing` — Spacing tokens
- `/<repo>/typography` — Typography tokens
- `/<repo>/borders` — Border tokens
- `/<repo>/shadows` — Shadow tokens
- `/<repo>/contrast` — WCAG contrast checker
- `/<repo>/cheatsheet` — Cheat sheet
- `/<repo>/usage` — Component usage

### Anti-Patterns to Avoid

- Do NOT hardcode basePath without the environment variable guard — it will break local development (`npm run dev`)
- Do NOT use `peaceiris/actions-gh-pages` — the official `actions/deploy-pages@v4` is the recommended approach for GitHub-hosted Pages
- Do NOT add the `GITHUB_PAGES` variable to `.env` or `.env.local` — it should only be set in the CI workflow
- Do NOT skip `actions/configure-pages@v5` — it's required for the Pages deployment to work
- Do NOT set `cancel-in-progress: true` on the concurrency group — this can cause incomplete deployments if a second push happens during deploy
- Do NOT use `actions/upload-pages-artifact@v4` — v3 is the current stable version for this action
- Do NOT create a `gh-pages` branch — the workflow uses the newer artifact-based deployment, not branch-based

### What SUCCESS Looks Like

After this story is complete:
1. Pushing to `main` triggers an automated build and deploy to GitHub Pages
2. The site is live at `https://<org>.github.io/theme-govie-tokens/`
3. All 9 routes load correctly with proper asset paths
4. Local development (`npm run dev`) is unaffected — no basePath applied
5. The workflow handles failures gracefully — no partial deploys
6. A `workflow_dispatch` trigger allows manual re-deployment from the GitHub Actions UI

### Project Structure Notes

- `.github/workflows/` is a new top-level directory — standard location for GitHub Actions
- `public/.nojekyll` is a new empty file in the existing `public/` directory
- `next.config.ts` is the only modified source file
- No changes to `src/` code, components, or the build pipeline itself

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- [Source: _bmad-output/planning-artifacts/architecture.md#Development Workflow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Static Export Constraints]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.1]
- [Source: next.config.ts — current config to modify]
- [Source: package.json — build scripts to replicate in workflow]
- [Source: .gitignore — generated data files are gitignored, confirming workflow must regenerate]
- [Source: GitHub Docs — actions/deploy-pages@v4, actions/upload-pages-artifact@v3]
- [Source: _bmad-output/implementation-artifacts/5-1-token-usage-design-system-react.md — previous story learnings]

### Review Findings

- [x] [Review][Patch] Raw `<a href>` in UsageContent.tsx skips basePath — replaced with `next/link` Link component [`src/app/usage/UsageContent.tsx:59`]
- [x] [Review][Patch] PermalinkButton.tsx and PairPopover.tsx build URLs via `window.location.origin + path` without basePath — added `NEXT_PUBLIC_BASE_PATH` env via next.config.ts env option, used in URL construction [`src/components/PermalinkButton.tsx:55`, `src/components/PairPopover.tsx:48`, `next.config.ts`]
- [x] [Review][Defer] Hardcoded repoName in next.config.ts — rename/fork requires code change — deferred, acceptable for internal tool
- [x] [Review][Defer] Workflow uses `npm ci` but architecture doc mentions pnpm — deferred, verify lockfile exists before first deploy

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build with GITHUB_PAGES=true: 11 routes generated, assets correctly prefixed with `/theme-govie-tokens/`
- Build without GITHUB_PAGES: 11 routes generated, assets use root-relative paths (no prefix) — local dev unaffected
- `.nojekyll` confirmed present in `out/` after build
- 172/172 tests pass across 15 test files (4 new tests in `next.config.test.ts`)

### Completion Notes List

- Created `public/.nojekyll` — empty file copied to `out/.nojekyll` during build, disables Jekyll processing on GitHub Pages
- Updated `next.config.ts` with conditional `basePath`/`assetPrefix` via `GITHUB_PAGES` env var — no impact on local dev
- Created `.github/workflows/deploy.yml` — two-job workflow (build → deploy) using official GitHub Actions: checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v3, deploy-pages@v4
- Created `next.config.test.ts` with 4 unit tests covering: export output always present, no basePath without env var, basePath set with env var, non-true env var values ignored
- Full test suite: 172/172 pass, zero regressions
- Both build paths verified: with GITHUB_PAGES=true (prefixed assets) and without (root-relative assets)

### File List

- public/.nojekyll (new)
- next.config.ts (modified — conditional basePath/assetPrefix + NEXT_PUBLIC_BASE_PATH env)
- next.config.test.ts (new)
- .github/workflows/deploy.yml (new)
- src/app/usage/UsageContent.tsx (modified — replaced raw `<a>` with `next/link` Link for basePath support)
- src/components/PermalinkButton.tsx (modified — permalink URL includes basePath)
- src/components/PairPopover.tsx (modified — contrast permalink URL includes basePath)
