import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

import { MAX_RESULTS, SEARCH_OPTIONS } from '@/lib/searchConfig';
import type { Token } from '@/types/token';

export interface SearchResult {
  token: Token;
  score: number;
}

export function useTokenSearch(tokens: Token[]) {
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => new Fuse(tokens, SEARCH_OPTIONS), [tokens]);

  const results: SearchResult[] = useMemo(() => {
    if (!query || query.length < 2) return [];
    return fuse.search(query, { limit: MAX_RESULTS }).map((r) => ({
      token: r.item,
      score: r.score ?? 1,
    }));
  }, [fuse, query]);

  return { query, setQuery, results };
}
