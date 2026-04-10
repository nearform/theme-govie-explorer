import type { Token, TokenCategory } from '@/types/token';

export interface TokenGroup {
  label: string;
  tokens: Token[];
}

export function groupByCategory(tokens: Token[], category: TokenCategory): TokenGroup[] {
  const filtered = tokens.filter((t) => t.category === category);
  if (filtered.length === 0) return [];
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return [{ label: `All ${label}`, tokens: filtered }];
}

const COLOR_GROUP_RULES: Array<{
  pattern: RegExp;
  label: string;
}> = [
  { pattern: /^--gieds-color-(neutral|gray)-/, label: 'Neutral' },
  { pattern: /^--gieds-color-primary-/, label: 'Primary' },
  { pattern: /^--gieds-color-secondary-/, label: 'Secondary' },
  { pattern: /^--gieds-color-emerald-/, label: 'Emerald' },
  { pattern: /^--gieds-color-green-/, label: 'Green' },
  { pattern: /^--gieds-color-blue-/, label: 'Blue' },
  { pattern: /^--gieds-color-red-/, label: 'Red' },
  { pattern: /^--gieds-color-yellow-/, label: 'Yellow' },
  { pattern: /^--gieds-color-gold-/, label: 'Gold' },
  { pattern: /^--gieds-color-purple-/, label: 'Purple' },
  { pattern: /^--gieds-color-orange-/, label: 'Orange' },
  { pattern: /^--gieds-color-support-/, label: 'Support' },
  { pattern: /^--gieds-color-text-/, label: 'Text' },
  { pattern: /^--gieds-color-icon-/, label: 'Icon' },
  { pattern: /^--gieds-color-border-/, label: 'Border Color' },
  { pattern: /^--gieds-color-shadow-/, label: 'Shadow Color' },
  { pattern: /^--gieds-color-(surface|base|brand|utility)-/, label: 'System' },
  { pattern: /^--gieds-surface-/, label: 'Surface' },
];

export function groupColorTokens(tokens: Token[]): TokenGroup[] {
  const colorTokens = tokens.filter((t) => t.category === 'color');
  const groupMap = new Map<string, Token[]>();

  for (const token of colorTokens) {
    let matched = false;
    for (const rule of COLOR_GROUP_RULES) {
      if (rule.pattern.test(token.name)) {
        const existing = groupMap.get(rule.label) ?? [];
        existing.push(token);
        groupMap.set(rule.label, existing);
        matched = true;
        break;
      }
    }
    if (!matched) {
      const existing = groupMap.get('Other') ?? [];
      existing.push(token);
      groupMap.set('Other', existing);
    }
  }

  const groups: TokenGroup[] = [];
  for (const rule of COLOR_GROUP_RULES) {
    const tokens = groupMap.get(rule.label);
    if (tokens?.length) {
      groups.push({ label: rule.label, tokens });
    }
  }

  const other = groupMap.get('Other');
  if (other?.length) {
    groups.push({ label: 'Other', tokens: other });
  }

  return groups;
}
