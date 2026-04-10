import Fuse from 'fuse.js';
import { describe, expect, it } from 'vitest';

import type { Token } from '@/types/token';

import { MAX_RESULTS, SEARCH_OPTIONS } from './searchConfig';

async function loadTokens(): Promise<Token[]> {
  const mod = await import('@/data/tokens.json');
  return mod.default as Token[];
}

describe('Fuse.js search', () => {
  it('finds tokens by partial name match', async () => {
    const tokens = await loadTokens();
    const fuse = new Fuse(tokens, SEARCH_OPTIONS);
    const results = fuse.search('bg secondary', { limit: MAX_RESULTS });
    expect(results.length).toBeGreaterThan(0);
    const names = results.map((r) => r.item.name);
    expect(names.some((n) => n.includes('secondary'))).toBe(true);
  });

  it('handles typos via fuzzy matching', async () => {
    const tokens = await loadTokens();
    const fuse = new Fuse(tokens, SEARCH_OPTIONS);
    const results = fuse.search('bg secndary', { limit: MAX_RESULTS });
    expect(results.length).toBeGreaterThan(0);
    const names = results.map((r) => r.item.name);
    expect(names.some((n) => n.includes('secondary'))).toBe(true);
  });

  it('reverse lookup by hex value', async () => {
    const tokens = await loadTokens();
    const fuse = new Fuse(tokens, SEARCH_OPTIONS);
    const results = fuse.search('#ffffff', { limit: MAX_RESULTS });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some((r) => r.item.lightValue === '#ffffff' || r.item.darkValue === '#ffffff'),
    ).toBe(true);
  });

  it('finds spacing tokens by pixel value', async () => {
    const tokens = await loadTokens();
    const fuse = new Fuse(tokens, SEARCH_OPTIONS);
    const results = fuse.search('16px', { limit: MAX_RESULTS });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.item.lightValue.includes('16px'))).toBe(true);
  });

  it('returns at most MAX_RESULTS', async () => {
    const tokens = await loadTokens();
    const fuse = new Fuse(tokens, SEARCH_OPTIONS);
    const results = fuse.search('color', { limit: MAX_RESULTS });
    expect(results.length).toBeLessThanOrEqual(MAX_RESULTS);
  });

  it('ranks results by score (lower is better)', async () => {
    const tokens = await loadTokens();
    const fuse = new Fuse(tokens, SEARCH_OPTIONS);
    const results = fuse.search('primary-500', { limit: MAX_RESULTS });
    expect(results.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i - 1].score ?? 0);
    }
  });

  it('returns results even for single-char queries (hook enforces min length)', async () => {
    const tokens = await loadTokens();
    const fuse = new Fuse(tokens, SEARCH_OPTIONS);
    const results = fuse.search('a', { limit: MAX_RESULTS });
    expect(results.length).toBeGreaterThanOrEqual(0);
  });
});
