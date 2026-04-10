import { describe, expect, it } from 'vitest';

import { addPrefix, buildTokenPermalink, getTokenFromSearchParams, stripPrefix } from './tokenUrl';

describe('stripPrefix', () => {
  it('removes leading -- from token names', () => {
    expect(stripPrefix('--gieds-color-blue-500')).toBe('gieds-color-blue-500');
  });

  it('leaves names without -- unchanged', () => {
    expect(stripPrefix('gieds-color-blue-500')).toBe('gieds-color-blue-500');
  });
});

describe('addPrefix', () => {
  it('adds -- to names without it', () => {
    expect(addPrefix('gieds-color-blue-500')).toBe('--gieds-color-blue-500');
  });

  it('does not double-prefix', () => {
    expect(addPrefix('--gieds-color-blue-500')).toBe('--gieds-color-blue-500');
  });
});

describe('buildTokenPermalink', () => {
  it('builds a permalink URL for a color token', () => {
    const result = buildTokenPermalink('colors', '--gieds-color-blue-500');
    expect(result).toBe('/colors?token=gieds-color-blue-500');
  });

  it('encodes special characters', () => {
    const result = buildTokenPermalink('colors', '--gieds-color-bg+special');
    expect(result).toContain('token=');
    expect(result).not.toContain('+');
  });
});

describe('getTokenFromSearchParams', () => {
  it('returns null when no token param exists', () => {
    const params = new URLSearchParams('');
    expect(getTokenFromSearchParams(params)).toBeNull();
  });

  it('returns the full token name with -- prefix', () => {
    const params = new URLSearchParams('token=gieds-color-blue-500');
    expect(getTokenFromSearchParams(params)).toBe('--gieds-color-blue-500');
  });

  it('round-trips with buildTokenPermalink', () => {
    const name = '--gieds-color-primary-300';
    const url = buildTokenPermalink('colors', name);
    const queryString = url.split('?')[1];
    const params = new URLSearchParams(queryString);
    expect(getTokenFromSearchParams(params)).toBe(name);
  });
});
