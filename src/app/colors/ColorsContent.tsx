'use client';

import { CategoryPage } from '@/components/CategoryPage';
import { groupColorTokens } from '@/lib/groupTokens';
import type { Token } from '@/types/token';

import tokenData from '@/data/tokens.json';

const groups = groupColorTokens(tokenData as Token[]);

export function ColorsContent() {
  return <CategoryPage category="colors" groups={groups} />;
}
