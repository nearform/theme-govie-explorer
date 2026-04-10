import { describe, expect, it } from 'vitest';

import { validateCssStructure, validatePackageAvailable, validateTokenCount } from './validate';

describe('validateTokenCount', () => {
  it('returns valid for count within expected range', () => {
    const result = validateTokenCount(664);
    expect(result.valid).toBe(true);
    expect(result.warning).toBeUndefined();
    expect(result.error).toBeUndefined();
  });

  it('returns valid with warning for count below range', () => {
    const result = validateTokenCount(200);
    expect(result.valid).toBe(true);
    expect(result.warning).toBeDefined();
    expect(result.warning).toContain('200');
    expect(result.warning).toContain('outside the expected range');
  });

  it('returns valid with warning for count above range', () => {
    const result = validateTokenCount(1200);
    expect(result.valid).toBe(true);
    expect(result.warning).toBeDefined();
    expect(result.warning).toContain('1200');
  });

  it('returns invalid for zero tokens', () => {
    const result = validateTokenCount(0);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('0 tokens');
  });

  it('accepts boundary values', () => {
    expect(validateTokenCount(500).valid).toBe(true);
    expect(validateTokenCount(500).warning).toBeUndefined();
    expect(validateTokenCount(800).valid).toBe(true);
    expect(validateTokenCount(800).warning).toBeUndefined();
  });

  it('warns just outside boundaries', () => {
    expect(validateTokenCount(499).warning).toBeDefined();
    expect(validateTokenCount(801).warning).toBeDefined();
  });
});

describe('validateCssStructure', () => {
  const validLight = '[data-theme="govie-light"] { --gieds-color-white: #fff; }';
  const validDark = '[data-theme="govie-dark"] { --gieds-color-white: #fff; }';

  it('returns valid for correct structure', () => {
    const result = validateCssStructure(validLight, validDark);
    expect(result.valid).toBe(true);
  });

  it('returns invalid for empty light CSS', () => {
    const result = validateCssStructure('', validDark);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('light.css');
  });

  it('returns invalid for empty dark CSS', () => {
    const result = validateCssStructure(validLight, '');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('dark.css');
  });

  it('returns invalid for missing light theme selector', () => {
    const result = validateCssStructure(':root { --x: 1; }', validDark);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('govie-light');
  });

  it('returns invalid for missing dark theme selector', () => {
    const result = validateCssStructure(validLight, ':root { --x: 1; }');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('govie-dark');
  });

  it('returns invalid for whitespace-only CSS', () => {
    const result = validateCssStructure('   \n\t  ', validDark);
    expect(result.valid).toBe(false);
  });
});

describe('validatePackageAvailable', () => {
  it('returns valid when @ogcio/theme-govie is installed', () => {
    const result = validatePackageAvailable();
    expect(result.valid).toBe(true);
  });
});
