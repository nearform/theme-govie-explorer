import { describe, it, expect } from 'vitest';
import type { Token, ColorToken, ContrastPair, TokenCategory } from '@/types/token';

describe('Token type definitions', () => {
  it('should allow creating a valid Token', () => {
    const token: Token = {
      name: '--color-bg-secondary',
      category: 'color',
      lightValue: '#ffffff',
      darkValue: '#000000',
      rawProperty: '--color-bg-secondary: #ffffff',
    };

    expect(token.name).toBe('--color-bg-secondary');
    expect(token.category).toBe('color');
    expect(token.lightValue).toBe('#ffffff');
    expect(token.darkValue).toBe('#000000');
    expect(token.rawProperty).toBe('--color-bg-secondary: #ffffff');
  });

  it('should allow all valid TokenCategory values', () => {
    const categories: TokenCategory[] = [
      'color',
      'spacing',
      'typography',
      'border',
      'shadow',
      'other',
    ];

    expect(categories).toHaveLength(6);
    expect(categories).toContain('color');
    expect(categories).toContain('spacing');
    expect(categories).toContain('typography');
    expect(categories).toContain('border');
    expect(categories).toContain('shadow');
    expect(categories).toContain('other');
  });

  it('should allow creating a valid ContrastPair', () => {
    const pair: ContrastPair = {
      against: '--color-text-primary',
      ratio: 4.5,
      meetsAA: true,
      meetsAAA: false,
    };

    expect(pair.against).toBe('--color-text-primary');
    expect(pair.ratio).toBe(4.5);
    expect(pair.meetsAA).toBe(true);
    expect(pair.meetsAAA).toBe(false);
  });

  it('should allow creating a valid ColorToken with contrastPairs', () => {
    const colorToken: ColorToken = {
      name: '--color-nf-green',
      category: 'color',
      lightValue: '#00e6a4',
      darkValue: '#00e6a4',
      rawProperty: '--color-nf-green: #00e6a4',
      contrastPairs: [
        {
          against: '--color-nf-deep-navy',
          ratio: 8.2,
          meetsAA: true,
          meetsAAA: true,
        },
      ],
    };

    expect(colorToken.category).toBe('color');
    expect(colorToken.contrastPairs).toHaveLength(1);
    expect(colorToken.contrastPairs[0].meetsAAA).toBe(true);
  });

  it('should allow ColorToken with empty contrastPairs', () => {
    const colorToken: ColorToken = {
      name: '--color-bg-primary',
      category: 'color',
      lightValue: '#fff',
      darkValue: '#000',
      rawProperty: '--color-bg-primary: #fff',
      contrastPairs: [],
    };

    expect(colorToken.contrastPairs).toHaveLength(0);
  });
});
