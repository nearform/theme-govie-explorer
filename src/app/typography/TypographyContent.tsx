'use client';

import { CategoryPage } from '@/components/CategoryPage';
import { groupByCategory } from '@/lib/groupTokens';
import type { Token } from '@/types/token';

import tokenData from '@/data/tokens.json';

const groups = groupByCategory(tokenData as Token[], 'typography');

export function TypographyContent() {
  return <CategoryPage category="typography" groups={groups} />;
}
