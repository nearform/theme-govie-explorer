import { describe, it, expect } from 'vitest';

import { parseHex, parseRgb, parseHsl, isColor } from './colorUtils';

describe('parseHex', () => {
  it('parses 6-digit hex', () => {
    expect(parseHex('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHex('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('parses 3-digit hex shorthand', () => {
    expect(parseHex('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex('#000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHex('#f00')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('parses 8-digit hex with alpha', () => {
    expect(parseHex('#ff0000ff')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('parses 4-digit hex with alpha', () => {
    expect(parseHex('#f00f')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('returns null for invalid hex', () => {
    expect(parseHex('#xyz')).toBeNull();
    expect(parseHex('#12')).toBeNull();
    expect(parseHex('not-hex')).toBeNull();
  });

  it('parses known theme-govie colors correctly', () => {
    expect(parseHex('#f7f7f8')).toEqual({ r: 247, g: 247, b: 248 });
    expect(parseHex('#0b0c0c')).toEqual({ r: 11, g: 12, b: 12 });
  });
});

describe('parseRgb', () => {
  it('parses rgb() notation', () => {
    expect(parseRgb('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseRgb('rgb(0, 128, 255)')).toEqual({ r: 0, g: 128, b: 255 });
  });

  it('parses rgba() notation', () => {
    expect(parseRgb('rgba(255, 0, 0, 0.5)')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('parses space-separated rgb()', () => {
    expect(parseRgb('rgb(255 0 0)')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('returns null for invalid input', () => {
    expect(parseRgb('not-rgb')).toBeNull();
    expect(parseRgb('#ffffff')).toBeNull();
  });
});

describe('parseHsl', () => {
  it('parses hsl() notation', () => {
    const red = parseHsl('hsl(0, 100%, 50%)');
    expect(red).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('parses achromatic hsl (gray)', () => {
    const gray = parseHsl('hsl(0, 0%, 50%)');
    expect(gray).toEqual({ r: 128, g: 128, b: 128 });
  });

  it('parses hsl for pure green', () => {
    const green = parseHsl('hsl(120, 100%, 50%)');
    expect(green).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('parses hsl for pure blue', () => {
    const blue = parseHsl('hsl(240, 100%, 50%)');
    expect(blue).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('parses hsla() notation', () => {
    const result = parseHsl('hsla(0, 100%, 50%, 0.5)');
    expect(result).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('returns null for invalid input', () => {
    expect(parseHsl('not-hsl')).toBeNull();
    expect(parseHsl('#ffffff')).toBeNull();
  });

  it('parses black and white', () => {
    expect(parseHsl('hsl(0, 0%, 0%)')).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHsl('hsl(0, 0%, 100%)')).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe('isColor', () => {
  it('detects hex colors', () => {
    expect(isColor('#ffffff')).toBe(true);
    expect(isColor('#fff')).toBe(true);
    expect(isColor('#ff0000ff')).toBe(true);
  });

  it('detects rgb() colors', () => {
    expect(isColor('rgb(255, 0, 0)')).toBe(true);
    expect(isColor('rgba(0, 0, 0, 0.5)')).toBe(true);
  });

  it('detects hsl() colors', () => {
    expect(isColor('hsl(0, 100%, 50%)')).toBe(true);
    expect(isColor('hsla(120, 50%, 50%, 1)')).toBe(true);
  });

  it('rejects non-color values', () => {
    expect(isColor('1px')).toBe(false);
    expect(isColor('16px')).toBe(false);
    expect(isColor('Lato, Arial, sans-serif')).toBe(false);
    expect(isColor('var(--gieds-color-gray-500)')).toBe(false);
    expect(isColor('0.875rem')).toBe(false);
    expect(isColor('400')).toBe(false);
    expect(isColor('9999px')).toBe(false);
  });
});
