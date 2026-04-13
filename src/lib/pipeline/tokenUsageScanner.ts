import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

import postcss from 'postcss';

import { categorizeToken } from '@/lib/pipeline/categorize';
import type { TokenCategory } from '@/types/token';
import type { ComponentTokenEntry, TokenUsageData } from '@/types/tokenUsage';

const VAR_GIEDS_RE = /var\(--gieds-[a-zA-Z0-9-]+\)/g;
const GIEDS_TOKEN_RE = /--gieds-[a-zA-Z0-9-]+/g;
const GI_CLASS_RE = /\bgi-[a-zA-Z][a-zA-Z0-9-]*/g;

export function kebabToPascal(kebab: string): string {
  return kebab
    .split('-')
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('');
}

export function buildGiClassToTokenMap(css: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const root = postcss.parse(css);

  root.walkRules((rule) => {
    const selector = rule.selector;
    const giMatch = selector.match(/\.gi-[a-zA-Z][a-zA-Z0-9-]*/);
    if (!giMatch) return;

    const className = giMatch[0].slice(1);
    const tokens: string[] = [];

    rule.walkDecls((decl) => {
      const matches = decl.value.match(GIEDS_TOKEN_RE);
      if (matches) {
        for (const m of matches) {
          if (!tokens.includes(m)) tokens.push(m);
        }
      }
    });

    if (tokens.length > 0) {
      const existing = map.get(className) ?? [];
      for (const t of tokens) {
        if (!existing.includes(t)) existing.push(t);
      }
      map.set(className, existing);
    }
  });

  return map;
}

export function extractVarGiedsFromJs(jsContent: string): string[] {
  const matches = jsContent.match(VAR_GIEDS_RE);
  if (!matches) return [];
  const tokens = new Set<string>();
  for (const m of matches) {
    const inner = m.match(GIEDS_TOKEN_RE);
    if (inner) {
      for (const t of inner) tokens.add(t);
    }
  }
  return [...tokens];
}

export function extractGiClassesFromJs(jsContent: string): string[] {
  const matches = jsContent.match(GI_CLASS_RE);
  if (!matches) return [];
  return [...new Set(matches)];
}

export function resolveGiClassesToTokens(
  giClasses: string[],
  classMap: Map<string, string[]>,
): string[] {
  const tokens = new Set<string>();
  for (const cls of giClasses) {
    const mapped = classMap.get(cls);
    if (mapped) {
      for (const t of mapped) tokens.add(t);
    }
  }
  return [...tokens];
}

export function deriveComponentName(dirPath: string, distRoot: string): string {
  const rel = relative(distRoot, dirPath);
  const parts = rel.split('/');
  if (parts.length === 1) return kebabToPascal(parts[0]);
  return parts.map(kebabToPascal).join('/');
}

function collectJsFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectJsFiles(full));
    } else if (entry.endsWith('.js') && !entry.endsWith('.d.ts')) {
      results.push(full);
    }
  }
  return results;
}

const SKIP_DIRS = new Set(['icons', 'logos', 'i18n', 'hooks', 'common', 'primitives', 'utils']);
const SKIP_ROOT_FILES = new Set(['index.js', 'utilities.js', 'cn.js', 'constants.js']);

function isComponentDir(name: string): boolean {
  if (SKIP_DIRS.has(name)) return false;
  if (
    name.startsWith('index-') ||
    name.startsWith('lodash-') ||
    name.startsWith('i18n') ||
    name.startsWith('useTranslation') ||
    name.startsWith('clsx-')
  )
    return false;
  return true;
}

export function groupTokensByCategory(tokenNames: string[]): Record<TokenCategory, string[]> {
  const result: Record<TokenCategory, string[]> = {
    color: [],
    spacing: [],
    typography: [],
    border: [],
    shadow: [],
    other: [],
  };
  for (const name of tokenNames) {
    const cat = categorizeToken(name);
    result[cat].push(name);
  }
  return result;
}

export function scanPackage(distRoot: string): TokenUsageData {
  const stylesCssPath = join(distRoot, 'styles.css');
  const stylesCss = readFileSync(stylesCssPath, 'utf8');
  const giClassMap = buildGiClassToTokenMap(stylesCss);

  const componentTokens = new Map<string, Set<string>>();
  const entries = readdirSync(distRoot);

  for (const entry of entries) {
    const fullPath = join(distRoot, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && isComponentDir(entry)) {
      const compName = kebabToPascal(entry);
      const jsFiles = collectJsFiles(fullPath);
      const tokenSet = new Set<string>();

      for (const jsFile of jsFiles) {
        const content = readFileSync(jsFile, 'utf8');
        const directTokens = extractVarGiedsFromJs(content);
        for (const t of directTokens) tokenSet.add(t);

        const giClasses = extractGiClassesFromJs(content);
        const validGiClasses = giClasses.filter((c) => giClassMap.has(c));
        const resolvedTokens = resolveGiClassesToTokens(validGiClasses, giClassMap);
        for (const t of resolvedTokens) tokenSet.add(t);
      }

      if (tokenSet.size > 0) {
        componentTokens.set(compName, tokenSet);
      }
    }

    if (
      stat.isFile() &&
      entry.endsWith('.js') &&
      !SKIP_ROOT_FILES.has(entry) &&
      !entry.endsWith('.d.ts')
    ) {
      const name = basename(entry, '.js');
      if (
        name.startsWith('index-') ||
        name.startsWith('lodash-') ||
        name.startsWith('clsx-') ||
        name.startsWith('i18n') ||
        name.startsWith('useTranslation')
      )
        continue;
      const compName = kebabToPascal(name);
      const content = readFileSync(fullPath, 'utf8');
      const directTokens = extractVarGiedsFromJs(content);
      const giClasses = extractGiClassesFromJs(content);
      const validGiClasses = giClasses.filter((c) => giClassMap.has(c));
      const resolvedTokens = resolveGiClassesToTokens(validGiClasses, giClassMap);
      const allTokens = new Set([...directTokens, ...resolvedTokens]);

      if (allTokens.size > 0) {
        const existing = componentTokens.get(compName) ?? new Set();
        for (const t of allTokens) existing.add(t);
        componentTokens.set(compName, existing);
      }
    }
  }

  const byToken: Record<string, string[]> = {};
  const byComponent: Record<string, ComponentTokenEntry> = {};

  for (const [compName, tokenSet] of componentTokens) {
    const tokenArr = [...tokenSet].sort();
    byComponent[compName] = {
      tokens: tokenArr,
      categories: groupTokensByCategory(tokenArr),
    };

    for (const token of tokenArr) {
      if (!byToken[token]) byToken[token] = [];
      if (!byToken[token].includes(compName)) {
        byToken[token].push(compName);
      }
    }
  }

  for (const comps of Object.values(byToken)) {
    comps.sort();
  }

  return {
    byToken,
    byComponent,
    meta: {
      packageVersion: '',
      componentsAnalyzed: componentTokens.size,
      tokensReferenced: Object.keys(byToken).length,
      generatedAt: new Date().toISOString(),
    },
  };
}
