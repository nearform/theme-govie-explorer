'use client';

import { useMemo, useState } from 'react';

import type { Token } from '@/types/token';

import { ColorSwatch } from './ColorSwatch';

interface BackgroundPickerProps {
  tokens: Token[];
  selected: Token | null;
  onSelect: (token: Token) => void;
}

export function BackgroundPicker({
  tokens,
  selected,
  onSelect,
}: BackgroundPickerProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return tokens;
    const lower = query.toLowerCase();
    return tokens.filter((t) => t.name.toLowerCase().includes(lower));
  }, [tokens, query]);

  return (
    <div className="relative">
      <label
        htmlFor="bg-picker"
        className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-wide text-nf-muted-grey"
      >
        Background token
      </label>

      <div className="flex items-center gap-3">
        {selected && (
          <ColorSwatch
            lightValue={selected.lightValue}
            darkValue={selected.darkValue}
            size="small"
          />
        )}
        <div className="relative flex-1">
          <input
            id="bg-picker"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={
              selected
                ? selected.name.replace(/^--/, '')
                : 'Search background token…'
            }
            className="w-full rounded-lg border border-nf-grey bg-white px-3 py-2.5 font-mono text-sm text-nf-deep-navy placeholder:text-nf-muted-grey/50 focus:border-nf-green focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2"
            aria-label="Search background token"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-nf-muted-grey hover:text-nf-deep-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {isOpen && filtered.length > 0 && (
        <>
          {/* Backdrop to close dropdown */}
          <button
            type="button"
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-label="Close dropdown"
            tabIndex={-1}
          />
          <div
            id="bg-picker-list"
            className="absolute left-0 right-0 z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-nf-grey bg-white shadow-lg"
          >
            {filtered.slice(0, 50).map((token) => (
              <button
                key={token.name}
                type="button"
                onClick={() => {
                  onSelect(token);
                  setQuery('');
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-nf-light-green focus:outline-none focus-visible:bg-nf-light-green ${
                  selected?.name === token.name ? 'bg-nf-light-green' : ''
                }`}
              >
                <ColorSwatch
                  lightValue={token.lightValue}
                  darkValue={token.darkValue}
                  size="mini"
                />
                <span className="min-w-0 truncate font-mono text-xs text-nf-deep-navy">
                  {token.name.replace(/^--/, '')}
                </span>
                <span className="ml-auto shrink-0 font-mono text-[10px] text-nf-muted-grey">
                  {token.lightValue}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
