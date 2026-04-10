import { describe, it, expect } from 'vitest';

import type { Token } from '@/types/token';

import {
  relativeLuminance,
  contrastRatio,
  checkContrast,
  computeContrastPairs,
  WCAG_AA_THRESHOLD,
  WCAG_AAA_THRESHOLD,
} from './wcag';

const BLACK = { r: 0, g: 0, b: 0 };
const WHITE = { r: 255, g: 255, b: 255 };
const RED = { r: 255, g: 0, b: 0 };
const GREEN = { r: 0, g: 128, b: 0 };
const BLUE = { r: 0, g: 0, b: 255 };

describe('relativeLuminance', () => {
  it('returns 0 for black', () => {
    expect(relativeLuminance(BLACK)).toBeCloseTo(0, 4);
  });

  it('returns 1 for white', () => {
    expect(relativeLuminance(WHITE)).toBeCloseTo(1, 4);
  });

  it('returns correct luminance for pure red', () => {
    expect(relativeLuminance(RED)).toBeCloseTo(0.2126, 3);
  });

  it('returns correct luminance for pure blue', () => {
    expect(relativeLuminance(BLUE)).toBeCloseTo(0.0722, 3);
  });

  it('returns value between 0 and 1 for mid-gray', () => {
    const gray = { r: 128, g: 128, b: 128 };
    const lum = relativeLuminance(gray);
    expect(lum).toBeGreaterThan(0);
    expect(lum).toBeLessThan(1);
  });
});

describe('contrastRatio', () => {
  it('returns 21 for black vs white', () => {
    const l1 = relativeLuminance(BLACK);
    const l2 = relativeLuminance(WHITE);
    expect(contrastRatio(l1, l2)).toBeCloseTo(21, 0);
  });

  it('returns 1 for identical luminances', () => {
    const l = relativeLuminance({ r: 100, g: 100, b: 100 });
    expect(contrastRatio(l, l)).toBeCloseTo(1, 4);
  });

  it('is symmetric (order does not matter)', () => {
    const l1 = relativeLuminance(RED);
    const l2 = relativeLuminance(BLUE);
    expect(contrastRatio(l1, l2)).toBeCloseTo(contrastRatio(l2, l1), 4);
  });

  it('always returns a value >= 1', () => {
    const l1 = relativeLuminance(GREEN);
    const l2 = relativeLuminance(BLUE);
    expect(contrastRatio(l1, l2)).toBeGreaterThanOrEqual(1);
  });
});

describe('checkContrast', () => {
  it('black/white = 21:1, meets AA and AAA', () => {
    const result = checkContrast(BLACK, WHITE);
    expect(result.ratio).toBe(21);
    expect(result.meetsAA).toBe(true);
    expect(result.meetsAAA).toBe(true);
  });

  it('identical colors = 1:1, fails AA and AAA', () => {
    const result = checkContrast(RED, RED);
    expect(result.ratio).toBe(1);
    expect(result.meetsAA).toBe(false);
    expect(result.meetsAAA).toBe(false);
  });

  it('rounds ratio to 2 decimal places', () => {
    const result = checkContrast(RED, BLUE);
    const decimalPlaces = result.ratio.toString().split('.')[1]?.length ?? 0;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });

  it('correctly identifies AA pass at boundary', () => {
    expect(WCAG_AA_THRESHOLD).toBe(4.5);
    const result = checkContrast(BLACK, WHITE);
    expect(result.ratio).toBeGreaterThanOrEqual(WCAG_AA_THRESHOLD);
    expect(result.meetsAA).toBe(true);
  });

  it('correctly identifies AAA pass at boundary', () => {
    expect(WCAG_AAA_THRESHOLD).toBe(7);
    const result = checkContrast(BLACK, WHITE);
    expect(result.ratio).toBeGreaterThanOrEqual(WCAG_AAA_THRESHOLD);
    expect(result.meetsAAA).toBe(true);
  });

  it('gray on white fails AAA but may pass AA', () => {
    const gray = { r: 118, g: 118, b: 118 };
    const result = checkContrast(gray, WHITE);
    expect(result.ratio).toBeGreaterThanOrEqual(WCAG_AA_THRESHOLD);
    expect(result.meetsAAA).toBe(false);
  });
});

describe('computeContrastPairs', () => {
  const makeToken = (name: string, lightValue: string): Token => ({
    name,
    category: 'color',
    lightValue,
    darkValue: lightValue,
    rawProperty: name,
  });

  it('computes pairs for resolvable color tokens', () => {
    const tokens: Token[] = [
      makeToken('--a', '#000000'),
      makeToken('--b', '#ffffff'),
    ];

    const pairMap = computeContrastPairs(tokens);
    expect(pairMap.size).toBe(2);

    const aPairs = pairMap.get('--a')!;
    expect(aPairs).toHaveLength(1);
    expect(aPairs[0].against).toBe('--b');
    expect(aPairs[0].ratio).toBe(21);
    expect(aPairs[0].meetsAA).toBe(true);
    expect(aPairs[0].meetsAAA).toBe(true);

    const bPairs = pairMap.get('--b')!;
    expect(bPairs).toHaveLength(1);
    expect(bPairs[0].against).toBe('--a');
    expect(bPairs[0].ratio).toBe(21);
  });

  it('skips tokens with var() references', () => {
    const tokens: Token[] = [
      makeToken('--a', '#000000'),
      makeToken('--b', 'var(--gieds-color-white)'),
      makeToken('--c', '#ffffff'),
    ];

    const pairMap = computeContrastPairs(tokens);
    expect(pairMap.size).toBe(2);
    expect(pairMap.has('--b')).toBe(false);
  });

  it('skips non-color category tokens', () => {
    const tokens: Token[] = [
      makeToken('--a', '#000000'),
      { name: '--border', category: 'border', lightValue: '1px', darkValue: '1px', rawProperty: '--border' },
      makeToken('--c', '#ffffff'),
    ];

    const pairMap = computeContrastPairs(tokens);
    expect(pairMap.size).toBe(2);
    expect(pairMap.has('--border')).toBe(false);
  });

  it('computes correct number of unique pairs (n*(n-1)/2 per direction)', () => {
    const tokens: Token[] = [
      makeToken('--a', '#000000'),
      makeToken('--b', '#ffffff'),
      makeToken('--c', '#ff0000'),
    ];

    const pairMap = computeContrastPairs(tokens);
    let totalPairs = 0;
    for (const pairs of pairMap.values()) {
      totalPairs += pairs.length;
    }
    expect(totalPairs).toBe(6);
  });

  it('returns empty map for zero resolvable color tokens', () => {
    const tokens: Token[] = [
      { name: '--a', category: 'color', lightValue: 'var(--ref)', darkValue: 'var(--ref)', rawProperty: '--a' },
    ];

    const pairMap = computeContrastPairs(tokens);
    expect(pairMap.size).toBe(0);
  });

  it('handles rgb() color values', () => {
    const tokens: Token[] = [
      makeToken('--a', 'rgb(0, 0, 0)'),
      makeToken('--b', 'rgb(255, 255, 255)'),
    ];

    const pairMap = computeContrastPairs(tokens);
    const aPairs = pairMap.get('--a')!;
    expect(aPairs[0].ratio).toBe(21);
  });

  it('handles hsl() color values', () => {
    const tokens: Token[] = [
      makeToken('--a', 'hsl(0, 0%, 0%)'),
      makeToken('--b', 'hsl(0, 0%, 100%)'),
    ];

    const pairMap = computeContrastPairs(tokens);
    const aPairs = pairMap.get('--a')!;
    expect(aPairs[0].ratio).toBe(21);
  });
});

describe('integration with actual theme-govie tokens', () => {
  it('computes contrast pairs from parsed tokens', async () => {
    const { parseCss } = await import('./parseCss');
    const { categorize } = await import('./categorize');

    const tokens = categorize(parseCss());
    const pairMap = computeContrastPairs(tokens);

    expect(pairMap.size).toBeGreaterThan(0);

    const whiteEntry = pairMap.get('--gieds-color-neutral-white');
    const blackEntry = pairMap.get('--gieds-color-neutral-black');

    expect(whiteEntry).toBeDefined();
    expect(blackEntry).toBeDefined();

    const whiteVsBlack = whiteEntry!.find(
      (p) => p.against === '--gieds-color-neutral-black'
    );
    expect(whiteVsBlack).toBeDefined();
    expect(whiteVsBlack!.ratio).toBe(21);
    expect(whiteVsBlack!.meetsAA).toBe(true);
    expect(whiteVsBlack!.meetsAAA).toBe(true);
  });
});
