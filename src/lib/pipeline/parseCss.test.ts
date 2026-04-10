import { describe, it, expect } from 'vitest';

import { parseCss, type RawToken } from './parseCss';

describe('parseCss', () => {
  let tokens: RawToken[];

  beforeAll(() => {
    tokens = parseCss();
  });

  it('extracts tokens from @ogcio/theme-govie CSS files', () => {
    expect(tokens.length).toBeGreaterThan(0);
  });

  it('extracts approximately 600-700 unique tokens', () => {
    expect(tokens.length).toBeGreaterThanOrEqual(600);
    expect(tokens.length).toBeLessThanOrEqual(800);
  });

  it('all tokens have the --gieds- prefix', () => {
    for (const token of tokens) {
      expect(token.name).toMatch(/^--gieds-/);
    }
  });

  it('every token has name, lightValue, darkValue, and rawProperty', () => {
    for (const token of tokens) {
      expect(token.name).toBeTruthy();
      expect(token.lightValue).toBeTruthy();
      expect(token.darkValue).toBeTruthy();
      expect(token.rawProperty).toBeTruthy();
    }
  });

  it('includes known color tokens', () => {
    const names = tokens.map((t) => t.name);
    expect(names).toContain('--gieds-color-neutral-white');
    expect(names).toContain('--gieds-color-neutral-black');
    expect(names).toContain('--gieds-color-gray-500');
  });

  it('includes known border tokens', () => {
    const names = tokens.map((t) => t.name);
    expect(names).toContain('--gieds-border-width-100');
    expect(names).toContain('--gieds-border-radius-full');
  });

  it('includes known typography tokens', () => {
    const names = tokens.map((t) => t.name);
    expect(names).toContain('--gieds-font-family-primary');
    expect(names).toContain('--gieds-font-size-300');
  });

  it('includes surface tokens', () => {
    const names = tokens.map((t) => t.name);
    expect(names).toContain('--gieds-surface-primary-default');
  });

  it('resolves var() references to concrete values', () => {
    const surface = tokens.find((t) => t.name === '--gieds-surface-primary-default');
    expect(surface).toBeDefined();
    expect(surface!.lightValue).not.toMatch(/^var\(/);
    expect(surface!.lightValue).toMatch(/^#[0-9a-fA-F]+$/);
  });

  it('correctly parses hex color values', () => {
    const white = tokens.find((t) => t.name === '--gieds-color-neutral-white');
    expect(white).toBeDefined();
    expect(white!.lightValue).toBe('#ffffff');
    expect(white!.darkValue).toBe('#ffffff');
  });

  it('produces no duplicate token names', () => {
    const names = tokens.map((t) => t.name);
    const unique = new Set(names);
    expect(names.length).toBe(unique.size);
  });

  it('handles tokens present in both themes', () => {
    const token = tokens.find((t) => t.name === '--gieds-border-width-100');
    expect(token).toBeDefined();
    expect(token!.lightValue).toBe('1px');
    expect(token!.darkValue).toBe('1px');
  });
});
