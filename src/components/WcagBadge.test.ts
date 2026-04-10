import { describe, expect, it } from 'vitest';

import { getWcagLevel } from './WcagBadge';

describe('getWcagLevel', () => {
  it('returns AAA for ratio >= 7', () => {
    expect(getWcagLevel(7)).toBe('AAA');
    expect(getWcagLevel(21)).toBe('AAA');
    expect(getWcagLevel(7.01)).toBe('AAA');
  });

  it('returns AA for ratio >= 4.5 and < 7', () => {
    expect(getWcagLevel(4.5)).toBe('AA');
    expect(getWcagLevel(6.99)).toBe('AA');
    expect(getWcagLevel(5)).toBe('AA');
  });

  it('returns Fail for ratio < 4.5', () => {
    expect(getWcagLevel(4.49)).toBe('Fail');
    expect(getWcagLevel(1)).toBe('Fail');
    expect(getWcagLevel(3)).toBe('Fail');
  });
});
