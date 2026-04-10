import type { Token, TokenCategory } from '@/types/token';

import type { RawToken } from './parseCss';

const CATEGORY_RULES: Array<{ prefix: string; category: TokenCategory }> = [
  { prefix: '--gieds-border-width-', category: 'border' },
  { prefix: '--gieds-border-radius-', category: 'border' },
  { prefix: '--gieds-font-', category: 'typography' },
  { prefix: '--gieds-type-scale-', category: 'typography' },
  { prefix: '--gieds-typography-', category: 'typography' },
  { prefix: '--gieds-spacing-', category: 'spacing' },
  { prefix: '--gieds-space-', category: 'spacing' },
  { prefix: '--gieds-size-', category: 'spacing' },
  { prefix: '--gieds-shadow-', category: 'shadow' },
  { prefix: '--gieds-color-', category: 'color' },
  { prefix: '--gieds-surface-', category: 'color' },
];

export function categorizeToken(name: string): TokenCategory {
  for (const rule of CATEGORY_RULES) {
    if (name.startsWith(rule.prefix)) {
      return rule.category;
    }
  }
  return 'other';
}

export function categorize(rawTokens: RawToken[]): Token[] {
  return rawTokens.map((raw) => ({
    name: raw.name,
    category: categorizeToken(raw.name),
    lightValue: raw.lightValue,
    darkValue: raw.darkValue,
    rawProperty: raw.rawProperty,
  }));
}
