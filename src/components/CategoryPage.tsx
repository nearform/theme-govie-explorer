'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getTokenFromSearchParams } from '@/lib/tokenUrl';
import type { Token } from '@/types/token';

import { CategoryChips } from './CategoryChips';
import { EmptyState } from './EmptyState';
import { FilterInput } from './FilterInput';
import { SplitPanel } from './SplitPanel';
import { TokenDetail } from './TokenDetail';
import { TokenListItem } from './TokenListItem';

interface TokenGroup {
  label: string;
  tokens: Token[];
}

interface CategoryPageProps {
  category: string;
  groups: TokenGroup[];
}

export function CategoryPage({ category, groups }: CategoryPageProps) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Token | null>(null);
  const [filter, setFilter] = useState('');
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const allTokens = useMemo(() => groups.flatMap((g) => g.tokens), [groups]);
  const groupLabels = useMemo(() => groups.map((g) => g.label), [groups]);

  const permalinkToken = useMemo(() => getTokenFromSearchParams(searchParams), [searchParams]);

  useEffect(() => {
    if (!permalinkToken) return;
    const match = allTokens.find((t) => t.name === permalinkToken);
    if (match) {
      setSelected(match);
      setShowMobileDetail(true);
    }
  }, [permalinkToken, allTokens]);

  const handleSelect = useCallback((token: Token) => {
    setSelected(token);
    setShowMobileDetail(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowMobileDetail(false);
  }, []);

  const filteredGroups = useMemo(() => {
    let result = groups;
    if (activeChip) {
      result = result.filter((g) => g.label === activeChip);
    }
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      result = result
        .map((group) => ({
          ...group,
          tokens: group.tokens.filter((t) => t.name.toLowerCase().includes(lowerFilter)),
        }))
        .filter((group) => group.tokens.length > 0);
    }
    return result;
  }, [groups, filter, activeChip]);

  const totalFiltered = filteredGroups.reduce((sum, g) => sum + g.tokens.length, 0);

  return (
    <SplitPanel
      showDetail={showMobileDetail}
      onCloseDetail={handleCloseDetail}
      list={
        <div className="flex h-full flex-col">
          <FilterInput value={filter} onChange={setFilter} placeholder={`Filter ${category}…`} />
          <CategoryChips labels={groupLabels} activeLabel={activeChip} onSelect={setActiveChip} />
          {totalFiltered === 0 && filter ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <p className="text-sm text-nf-muted-grey">
                No tokens match &lsquo;{filter}&rsquo; in {category}
              </p>
              <button
                type="button"
                onClick={() => setFilter('')}
                className="mt-2 min-h-[44px] text-xs text-nf-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <nav aria-label={`${category} tokens`} className="flex-1 overflow-y-auto">
              {filteredGroups.map((group) => (
                <section key={group.label} aria-label={group.label}>
                  <h3 className="sticky top-0 z-10 border-b border-nf-grey/50 bg-white/95 px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-nf-muted-grey backdrop-blur-sm">
                    {group.label}
                    <span className="ml-2 font-mono font-normal text-nf-muted-grey/60">
                      {group.tokens.length}
                    </span>
                  </h3>
                  {group.tokens.map((token) => (
                    <TokenListItem
                      key={token.name}
                      token={token}
                      isSelected={selected?.name === token.name}
                      onSelect={handleSelect}
                      filterQuery={filter}
                    />
                  ))}
                </section>
              ))}
            </nav>
          )}
        </div>
      }
      detail={
        selected ? (
          <TokenDetail token={selected} category={category} />
        ) : (
          <EmptyState
            message="Select a token to see details"
            hint="Press ⌘K to search across all tokens"
          />
        )
      }
    />
  );
}
