'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { BackgroundPicker } from '@/components/BackgroundPicker';
import { ContrastCell } from '@/components/ContrastCell';
import { EmptyState } from '@/components/EmptyState';
import { PairPopover } from '@/components/PairPopover';
import type { ContrastFilter } from '@/lib/contrastUtils';
import {
  filterPairs,
  findSemanticPairing,
  getColorTokenMap,
} from '@/lib/contrastUtils';
import type { ContrastPair, Token } from '@/types/token';

import contrastData from '@/data/contrastMatrix.json';
import tokenData from '@/data/tokens.json';

const contrastMatrix = contrastData as Record<string, ContrastPair[]>;
const allTokens = tokenData as Token[];
const colorTokens = allTokens.filter((t) => t.category === 'color');
const tokenMap = getColorTokenMap(allTokens);

const FILTER_OPTIONS: { value: ContrastFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'passing', label: 'AA+' },
  { value: 'failing', label: 'Failing' },
];

export function ContrastContent() {
  const searchParams = useSearchParams();
  const [bgToken, setBgToken] = useState<Token | null>(null);
  const [filter, setFilter] = useState<ContrastFilter>('all');
  const [popover, setPopover] = useState<{
    fgName: string;
    pair: ContrastPair;
  } | null>(null);
  const [highlightedFg, setHighlightedFg] = useState<string | null>(null);

  useEffect(() => {
    const bgParam = searchParams.get('bg');
    const fgParam = searchParams.get('fg');
    if (bgParam) {
      const bgName = bgParam.startsWith('--') ? bgParam : `--${bgParam}`;
      const match = tokenMap.get(bgName);
      if (match) setBgToken(match);
    }
    if (fgParam) {
      const fgName = fgParam.startsWith('--') ? fgParam : `--${fgParam}`;
      setHighlightedFg(fgName);
    }
  }, [searchParams]);

  const pairs = useMemo(() => {
    if (!bgToken) return [];
    return contrastMatrix[bgToken.name] ?? [];
  }, [bgToken]);

  const filteredPairs = useMemo(
    () => filterPairs(pairs, filter),
    [pairs, filter]
  );

  const semanticFg = useMemo(() => {
    if (!bgToken) return null;
    return findSemanticPairing(
      bgToken.name,
      pairs.map((p) => p.against)
    );
  }, [bgToken, pairs]);

  const handleCellClick = useCallback(
    (fgName: string, pair: ContrastPair) => {
      setPopover({ fgName, pair });
    },
    []
  );

  const handleSelectBg = useCallback((token: Token) => {
    setBgToken(token);
    setHighlightedFg(null);
    setPopover(null);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-heading text-[28px] leading-[1.2] tracking-[-0.01em] text-nf-deep-navy">
        Contrast Checker
      </h1>
      <p className="mt-1 text-base text-nf-muted-grey">
        Select a background token to check WCAG contrast against all color
        tokens.
      </p>

      <div className="mt-6 max-w-md">
        <BackgroundPicker
          tokens={colorTokens}
          selected={bgToken}
          onSelect={handleSelectBg}
        />
      </div>

      {!bgToken ? (
        <div className="mt-16">
          <EmptyState
            message="Select a background token to check contrast"
            hint="Use the dropdown above to pick a background color"
          />
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-nf-muted-grey">
              Filter
            </span>
            <div className="flex gap-1 rounded-lg bg-nf-light-grey p-0.5">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilter(opt.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green ${
                    filter === opt.value
                      ? 'bg-white text-nf-deep-navy shadow-sm'
                      : 'text-nf-muted-grey hover:text-nf-deep-navy'
                  }`}
                  aria-pressed={filter === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="ml-auto font-mono text-xs text-nf-muted-grey">
              {filteredPairs.length} pair{filteredPairs.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredPairs.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                message={`No ${filter === 'passing' ? 'passing' : 'failing'} pairs for this background`}
                hint="Try a different filter or background token"
              />
            </div>
          ) : (
            <div
              className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              aria-live="polite"
            >
              {filteredPairs.map((pair) => {
                const fgToken = tokenMap.get(pair.against);
                if (!fgToken) return null;
                return (
                  <ContrastCell
                    key={pair.against}
                    bgValue={bgToken.lightValue}
                    fgName={pair.against}
                    fgValue={fgToken.lightValue}
                    ratio={pair.ratio}
                    isSuggested={pair.against === semanticFg}
                    isHighlighted={pair.against === highlightedFg}
                    onClick={() => handleCellClick(pair.against, pair)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {popover && bgToken && (
        <PairPopover
          bgName={bgToken.name}
          bgValue={bgToken.lightValue}
          fgName={popover.fgName}
          fgValue={tokenMap.get(popover.fgName)?.lightValue ?? '#000'}
          ratio={popover.pair.ratio}
          onClose={() => setPopover(null)}
        />
      )}
    </div>
  );
}
