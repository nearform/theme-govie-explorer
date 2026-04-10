import type { IFuseOptions } from 'fuse.js';

import type { Token } from '@/types/token';

export const SEARCH_OPTIONS: IFuseOptions<Token> = {
  keys: [
    { name: 'name', weight: 0.6 },
    { name: 'lightValue', weight: 0.25 },
    { name: 'darkValue', weight: 0.15 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
};

export const MAX_RESULTS = 8;
