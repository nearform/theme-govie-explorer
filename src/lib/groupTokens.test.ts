import { describe, expect, it } from 'vitest';

import type { Token } from '@/types/token';

import { groupByCategory, groupColorTokens } from './groupTokens';

function makeToken(name: string, category: Token['category'] = 'color'): Token {
  return {
    name,
    category,
    lightValue: '#ff0000',
    darkValue: '#cc0000',
    rawProperty: name,
  };
}

describe('groupColorTokens', () => {
  it('filters to only color tokens', () => {
    const tokens = [
      makeToken('--gieds-color-neutral-100'),
      makeToken('--gieds-spacing-100', 'spacing'),
      makeToken('--gieds-font-body', 'typography'),
    ];
    const groups = groupColorTokens(tokens);
    const total = groups.reduce((sum, g) => sum + g.tokens.length, 0);
    expect(total).toBe(1);
  });

  it('groups neutral tokens', () => {
    const tokens = [makeToken('--gieds-color-neutral-100'), makeToken('--gieds-color-gray-200')];
    const groups = groupColorTokens(tokens);
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('Neutral');
    expect(groups[0].tokens).toHaveLength(2);
  });

  it('groups primary and secondary tokens separately', () => {
    const tokens = [
      makeToken('--gieds-color-primary-500'),
      makeToken('--gieds-color-secondary-700'),
    ];
    const groups = groupColorTokens(tokens);
    expect(groups.map((g) => g.label)).toEqual(['Primary', 'Secondary']);
  });

  it('groups support tokens', () => {
    const tokens = [
      makeToken('--gieds-color-support-error-bg'),
      makeToken('--gieds-color-support-warning-text'),
      makeToken('--gieds-color-support-success-icon'),
    ];
    const groups = groupColorTokens(tokens);
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('Support');
    expect(groups[0].tokens).toHaveLength(3);
  });

  it('groups text, icon, and border color tokens', () => {
    const tokens = [
      makeToken('--gieds-color-text-primary'),
      makeToken('--gieds-color-icon-primary'),
      makeToken('--gieds-color-border-primary'),
    ];
    const groups = groupColorTokens(tokens);
    expect(groups.map((g) => g.label)).toEqual(['Text', 'Icon', 'Border Color']);
  });

  it('puts surface tokens in Surface group', () => {
    const tokens = [makeToken('--gieds-surface-primary')];
    const groups = groupColorTokens(tokens);
    expect(groups[0].label).toBe('Surface');
  });

  it('puts unrecognized color tokens in Other', () => {
    const tokens = [makeToken('--gieds-color-unknown-foo')];
    const groups = groupColorTokens(tokens);
    expect(groups[0].label).toBe('Other');
  });

  it('preserves rule order for group output', () => {
    const tokens = [
      makeToken('--gieds-color-blue-500'),
      makeToken('--gieds-color-neutral-100'),
      makeToken('--gieds-color-primary-300'),
    ];
    const groups = groupColorTokens(tokens);
    expect(groups.map((g) => g.label)).toEqual(['Neutral', 'Primary', 'Blue']);
  });

  it('returns empty array for no color tokens', () => {
    const groups = groupColorTokens([]);
    expect(groups).toEqual([]);
  });

  it('groups all palette scales correctly', () => {
    const scales = ['blue', 'red', 'yellow', 'green', 'emerald', 'purple', 'gold'];
    const tokens = scales.map((s) => makeToken(`--gieds-color-${s}-500`));
    const groups = groupColorTokens(tokens);
    expect(groups.map((g) => g.label).sort()).toEqual(
      ['Blue', 'Emerald', 'Gold', 'Green', 'Purple', 'Red', 'Yellow'].sort(),
    );
  });

  it('groups actual token data correctly', async () => {
    const mod = await import('@/data/tokens.json');
    const allTokens = mod.default as Token[];
    const groups = groupColorTokens(allTokens);
    const total = groups.reduce((sum, g) => sum + g.tokens.length, 0);
    const colorCount = allTokens.filter((t) => t.category === 'color').length;
    expect(total).toBe(colorCount);
    expect(groups.length).toBeGreaterThanOrEqual(5);
  });
});

describe('groupByCategory', () => {
  it('filters to the specified category', () => {
    const tokens = [
      makeToken('--gieds-spacing-100', 'spacing'),
      makeToken('--gieds-color-blue-500', 'color'),
      makeToken('--gieds-spacing-200', 'spacing'),
    ];
    const groups = groupByCategory(tokens, 'spacing');
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('All Spacing');
    expect(groups[0].tokens).toHaveLength(2);
  });

  it('returns empty array when no tokens match', () => {
    const tokens = [makeToken('--gieds-color-blue-500', 'color')];
    expect(groupByCategory(tokens, 'spacing')).toEqual([]);
  });

  it('capitalizes the category label', () => {
    const tokens = [makeToken('--gieds-shadow-100', 'shadow')];
    const groups = groupByCategory(tokens, 'shadow');
    expect(groups[0].label).toBe('All Shadow');
  });

  it('works for all non-color categories', () => {
    const categories = ['spacing', 'typography', 'border', 'shadow'] as const;
    for (const cat of categories) {
      const tokens = [makeToken(`--gieds-${cat}-test`, cat)];
      const groups = groupByCategory(tokens, cat);
      expect(groups).toHaveLength(1);
    }
  });
});
