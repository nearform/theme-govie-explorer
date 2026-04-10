import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import postcss from 'postcss';

export interface RawToken {
  name: string;
  lightValue: string;
  darkValue: string;
  rawProperty: string;
}

function extractCustomProperties(css: string, from: string): Record<string, string> {
  const root = postcss.parse(css, { from });
  const props: Record<string, string> = {};

  root.walkDecls(/^--/, (decl) => {
    props[decl.prop] = decl.value;
  });

  return props;
}

function resolveCssPath(subpath: string): string {
  const require = createRequire(import.meta.url);
  return require.resolve(`@ogcio/theme-govie/${subpath}`);
}

const MAX_RESOLVE_DEPTH = 10;

function resolveValue(value: string, props: Record<string, string>, depth = 0): string {
  if (depth > MAX_RESOLVE_DEPTH || !value.includes('var(')) return value;

  return value.replace(
    /var\(([^,)]+)(?:,\s*([^)]+))?\)/g,
    (_match, ref: string, fallback: string | undefined) => {
      const refName = ref.trim();
      const resolved = props[refName];
      if (resolved !== undefined) {
        return resolveValue(resolved, props, depth + 1);
      }
      if (fallback !== undefined) {
        return resolveValue(fallback.trim(), props, depth + 1);
      }
      return _match;
    },
  );
}

export function parseCss(): RawToken[] {
  const lightCssPath = resolveCssPath('light.css');
  const darkCssPath = resolveCssPath('dark.css');

  const lightCss = readFileSync(lightCssPath, 'utf8');
  const darkCss = readFileSync(darkCssPath, 'utf8');

  const lightProps = extractCustomProperties(lightCss, lightCssPath);
  const darkProps = extractCustomProperties(darkCss, darkCssPath);

  const allNames = new Set([...Object.keys(lightProps), ...Object.keys(darkProps)]);

  const tokens: RawToken[] = [];

  for (const name of allNames) {
    const rawLight = lightProps[name] ?? darkProps[name] ?? '';
    const rawDark = darkProps[name] ?? lightProps[name] ?? '';

    tokens.push({
      name,
      lightValue: resolveValue(rawLight, lightProps),
      darkValue: resolveValue(rawDark, darkProps),
      rawProperty: name,
    });
  }

  return tokens;
}
