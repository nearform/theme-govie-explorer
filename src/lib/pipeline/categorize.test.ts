import { describe, it, expect } from 'vitest';

import type { RawToken } from './parseCss';
import { parseCss } from './parseCss';
import { categorize, categorizeToken } from './categorize';

describe('categorizeToken', () => {
  it('classifies --gieds-color-* as color', () => {
    expect(categorizeToken('--gieds-color-gray-500')).toBe('color');
    expect(categorizeToken('--gieds-color-neutral-white')).toBe('color');
    expect(categorizeToken('--gieds-color-text-tone-primary-fill-default')).toBe('color');
  });

  it('classifies --gieds-color-border-* as color (not border)', () => {
    expect(categorizeToken('--gieds-color-border-default')).toBe('color');
  });

  it('classifies --gieds-color-shadow-* as color (not shadow)', () => {
    expect(categorizeToken('--gieds-color-shadow-default')).toBe('color');
  });

  it('classifies --gieds-surface-* as color', () => {
    expect(categorizeToken('--gieds-surface-primary-default')).toBe('color');
    expect(categorizeToken('--gieds-surface-neutral-hover')).toBe('color');
  });

  it('classifies --gieds-border-width-* as border', () => {
    expect(categorizeToken('--gieds-border-width-100')).toBe('border');
    expect(categorizeToken('--gieds-border-width-800')).toBe('border');
  });

  it('classifies --gieds-border-radius-* as border', () => {
    expect(categorizeToken('--gieds-border-radius-100')).toBe('border');
    expect(categorizeToken('--gieds-border-radius-full')).toBe('border');
  });

  it('classifies --gieds-font-* as typography', () => {
    expect(categorizeToken('--gieds-font-family-primary')).toBe('typography');
    expect(categorizeToken('--gieds-font-size-300')).toBe('typography');
    expect(categorizeToken('--gieds-font-weight-700')).toBe('typography');
    expect(categorizeToken('--gieds-font-line-height-1000')).toBe('typography');
    expect(categorizeToken('--gieds-font-letter-spacing-300')).toBe('typography');
  });

  it('classifies --gieds-type-scale-* as typography', () => {
    expect(categorizeToken('--gieds-type-scale-heading-bold-700')).toBe('typography');
    expect(categorizeToken('--gieds-type-scale-text-200')).toBe('typography');
    expect(categorizeToken('--gieds-type-scale-heading-regular-100')).toBe('typography');
  });

  it('classifies --gieds-typography-* as typography', () => {
    expect(categorizeToken('--gieds-typography-default-heading-xl')).toBe('typography');
    expect(categorizeToken('--gieds-typography-xs-text-sm')).toBe('typography');
  });

  it('classifies --gieds-spacing-* as spacing', () => {
    expect(categorizeToken('--gieds-spacing-100')).toBe('spacing');
  });

  it('classifies --gieds-space-* as spacing', () => {
    expect(categorizeToken('--gieds-space-0')).toBe('spacing');
    expect(categorizeToken('--gieds-space-4')).toBe('spacing');
  });

  it('classifies --gieds-size-* as spacing', () => {
    expect(categorizeToken('--gieds-size-sm')).toBe('spacing');
    expect(categorizeToken('--gieds-size-xl')).toBe('spacing');
  });

  it('classifies --gieds-shadow-* as shadow', () => {
    expect(categorizeToken('--gieds-shadow-100')).toBe('shadow');
    expect(categorizeToken('--gieds-shadow-600')).toBe('shadow');
  });

  it('classifies unrecognized prefixes as other', () => {
    expect(categorizeToken('--gieds-unknown-thing')).toBe('other');
    expect(categorizeToken('--custom-prop')).toBe('other');
  });
});

describe('categorize (integration with parseCss)', () => {
  it('categorizes all tokens from actual theme-govie CSS', () => {
    const raw = parseCss();
    const tokens = categorize(raw);

    expect(tokens.length).toBe(raw.length);

    for (const token of tokens) {
      expect(['color', 'spacing', 'typography', 'border', 'shadow', 'other']).toContain(
        token.category
      );
    }
  });

  it('produces color tokens from theme-govie', () => {
    const tokens = categorize(parseCss());
    const colorTokens = tokens.filter((t) => t.category === 'color');
    expect(colorTokens.length).toBeGreaterThan(100);
  });

  it('produces border tokens from theme-govie', () => {
    const tokens = categorize(parseCss());
    const borderTokens = tokens.filter((t) => t.category === 'border');
    expect(borderTokens.length).toBeGreaterThan(0);
  });

  it('produces typography tokens from theme-govie', () => {
    const tokens = categorize(parseCss());
    const typoTokens = tokens.filter((t) => t.category === 'typography');
    expect(typoTokens.length).toBeGreaterThan(0);
  });

  it('preserves all token fields through categorization', () => {
    const raw: RawToken[] = [
      {
        name: '--gieds-color-gray-500',
        lightValue: '#828893',
        darkValue: '#828893',
        rawProperty: '--gieds-color-gray-500',
      },
    ];

    const tokens = categorize(raw);
    expect(tokens[0]).toEqual({
      name: '--gieds-color-gray-500',
      category: 'color',
      lightValue: '#828893',
      darkValue: '#828893',
      rawProperty: '--gieds-color-gray-500',
    });
  });

  it('every category has at least one token from actual CSS', () => {
    const tokens = categorize(parseCss());
    const categories = new Set(tokens.map((t) => t.category));

    expect(categories.has('color')).toBe(true);
    expect(categories.has('border')).toBe(true);
    expect(categories.has('typography')).toBe(true);
    expect(categories.has('spacing')).toBe(true);
    expect(categories.has('shadow')).toBe(true);
  });

  it('produces spacing tokens from theme-govie', () => {
    const tokens = categorize(parseCss());
    const spacingTokens = tokens.filter((t) => t.category === 'spacing');
    expect(spacingTokens.length).toBeGreaterThan(0);
  });

  it('produces shadow tokens from theme-govie', () => {
    const tokens = categorize(parseCss());
    const shadowTokens = tokens.filter((t) => t.category === 'shadow');
    expect(shadowTokens.length).toBeGreaterThan(0);
  });
});
