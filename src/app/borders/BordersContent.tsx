'use client';

import { CategoryPage } from '@/components/CategoryPage';
import tokenData from '@/data/tokens.json';
import { groupByCategory } from '@/lib/groupTokens';
import type { Token } from '@/types/token';

const groups = groupByCategory(tokenData as Token[], 'border');

export function BordersContent() {
  return <CategoryPage category="borders" groups={groups} />;
}
