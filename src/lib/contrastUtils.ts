import type { ContrastPair, Token } from '@/types/token';

export type ContrastFilter = 'all' | 'passing' | 'failing';

/**
 * Detect the semantic foreground counterpart for a background token.
 * e.g. --gieds-color-warning-bg → --gieds-color-warning-text
 */
export function findSemanticPairing(bgName: string, fgNames: string[]): string | null {
  const stripped = bgName.replace(/^--/, '');

  const textCounterpart = stripped.replace(/-bg$/, '-text');
  const match = fgNames.find((n) => n.replace(/^--/, '') === textCounterpart);
  if (match) return match;

  const fgCounterpart = stripped.replace(/-bg$/, '-fg');
  const match2 = fgNames.find((n) => n.replace(/^--/, '') === fgCounterpart);
  if (match2) return match2;

  return null;
}

export function filterPairs(pairs: ContrastPair[], filter: ContrastFilter): ContrastPair[] {
  switch (filter) {
    case 'all':
      return pairs;
    case 'passing':
      return pairs.filter((p) => p.meetsAA);
    case 'failing':
      return pairs.filter((p) => !p.meetsAA);
  }
}

export function getColorTokenMap(tokens: Token[]): Map<string, Token> {
  const map = new Map<string, Token>();
  for (const t of tokens) {
    if (t.category === 'color') map.set(t.name, t);
  }
  return map;
}
