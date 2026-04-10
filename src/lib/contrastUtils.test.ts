import { describe, expect, it } from 'vitest';

import {
  filterPairs,
  findSemanticPairing,
  getColorTokenMap,
} from './contrastUtils';

import type { ContrastPair, Token } from '@/types/token';

const makePair = (against: string, ratio: number): ContrastPair => ({
  against,
  ratio,
  meetsAA: ratio >= 4.5,
  meetsAAA: ratio >= 7,
});

describe('findSemanticPairing', () => {
  it('matches -bg with -text counterpart', () => {
    const fgNames = [
      '--gieds-color-warning-text',
      '--gieds-color-primary-500',
    ];
    expect(findSemanticPairing('--gieds-color-warning-bg', fgNames)).toBe(
      '--gieds-color-warning-text'
    );
  });

  it('matches -bg with -fg counterpart', () => {
    const fgNames = ['--gieds-color-info-fg', '--gieds-color-primary-500'];
    expect(findSemanticPairing('--gieds-color-info-bg', fgNames)).toBe(
      '--gieds-color-info-fg'
    );
  });

  it('returns null when no semantic pair exists', () => {
    const fgNames = ['--gieds-color-primary-500'];
    expect(findSemanticPairing('--gieds-color-neutral-white', fgNames)).toBeNull();
  });
});

describe('filterPairs', () => {
  const pairs: ContrastPair[] = [
    makePair('--a', 8),
    makePair('--b', 5),
    makePair('--c', 2),
  ];

  it('returns all pairs for "all" filter', () => {
    expect(filterPairs(pairs, 'all')).toHaveLength(3);
  });

  it('returns only passing (AA+) pairs', () => {
    const result = filterPairs(pairs, 'passing');
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.meetsAA)).toBe(true);
  });

  it('returns only failing pairs', () => {
    const result = filterPairs(pairs, 'failing');
    expect(result).toHaveLength(1);
    expect(result[0].against).toBe('--c');
  });
});

describe('getColorTokenMap', () => {
  const tokens: Token[] = [
    { name: '--c1', category: 'color', lightValue: '#fff', darkValue: '#000', rawProperty: '--c1' },
    { name: '--s1', category: 'spacing', lightValue: '8px', darkValue: '8px', rawProperty: '--s1' },
    { name: '--c2', category: 'color', lightValue: '#ccc', darkValue: '#333', rawProperty: '--c2' },
  ];

  it('maps only color tokens by name', () => {
    const map = getColorTokenMap(tokens);
    expect(map.size).toBe(2);
    expect(map.has('--c1')).toBe(true);
    expect(map.has('--c2')).toBe(true);
    expect(map.has('--s1')).toBe(false);
  });
});
