'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useTokenSearch } from '@/hooks/useTokenSearch';
import { buildTokenPermalink, categoryToRoute } from '@/lib/tokenUrl';
import type { Token } from '@/types/token';

import { CopyButton } from './CopyButton';
import { HighlightMatch } from './HighlightMatch';
import { TokenPreview } from './previews/TokenPreview';

interface CommandPaletteProps {
  tokens: Token[];
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ tokens, isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { query, setQuery, results } = useTokenSearch(tokens);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen, setQuery]);

  const prevQueryRef = useRef(query);
  if (prevQueryRef.current !== query) {
    prevQueryRef.current = query;
    setActiveIndex(0);
  }

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navigateToToken = useCallback(
    (token: Token) => {
      const route = categoryToRoute(token.category);
      const permalink = buildTokenPermalink(route, token.name);
      onClose();
      router.push(permalink);
    },
    [onClose, router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        navigateToToken(results[activeIndex].token);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [results, activeIndex, navigateToToken, onClose],
  );

  useEffect(() => {
    const active = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center pt-[20vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Search tokens"
    >
      <div
        className="fixed inset-0 bg-nf-deep-navy/60 motion-safe:animate-[fadeIn_150ms_ease-out]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-fit max-h-[60vh] w-full max-w-[640px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl motion-safe:animate-[scaleIn_150ms_ease-out]">
        <div className="flex items-center border-b border-nf-grey px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 shrink-0 text-nf-muted-grey"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tokens…"
            className="w-full bg-transparent px-3 py-3.5 font-mono text-sm text-nf-deep-navy placeholder:text-nf-muted-grey/50 focus:outline-none"
            aria-label="Search tokens"
            aria-activedescendant={results[activeIndex] ? `palette-item-${activeIndex}` : undefined}
          />
          <kbd className="shrink-0 rounded bg-nf-light-grey px-1.5 py-0.5 font-mono text-[11px] text-nf-muted-grey">
            esc
          </kbd>
        </div>

        {query.length >= 2 && (
          <div ref={listRef} className="flex-1 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-nf-muted-grey">
                No tokens match &lsquo;{query}&rsquo;
              </div>
            ) : (
              results.map(({ token }, i) => (
                <div
                  key={token.name}
                  id={`palette-item-${i}`}
                  data-active={i === activeIndex || undefined}
                  className={`flex w-full items-center ${
                    i === activeIndex ? 'bg-nf-light-green' : 'hover:bg-nf-light-grey'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => navigateToToken(token)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5 text-left focus:outline-none"
                    aria-label={`Go to ${token.name}`}
                  >
                    <TokenPreview token={token} size="small" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-sm text-nf-deep-navy">
                        <HighlightMatch text={token.name} query={query} />
                      </p>
                      <div className="flex gap-3 font-mono text-xs text-nf-muted-grey">
                        <span className="truncate">{token.lightValue}</span>
                        {token.darkValue !== token.lightValue && (
                          <span className="truncate text-nf-muted-grey/50">{token.darkValue}</span>
                        )}
                      </div>
                    </div>
                  </button>
                  <div className="shrink-0 pr-4">
                    <CopyButton value={`var(${token.name})`} variant="inline" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex items-center gap-4 border-t border-nf-grey/50 px-4 py-2 text-[11px] text-nf-muted-grey/60">
          <span>
            <kbd className="rounded bg-nf-light-grey px-1 py-0.5 font-mono">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="rounded bg-nf-light-grey px-1 py-0.5 font-mono">⏎</kbd> go to detail
          </span>
          <span>
            <kbd className="rounded bg-nf-light-grey px-1 py-0.5 font-mono">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
