'use client';

import { useState } from 'react';

import { ColorSwatch } from '@/components/ColorSwatch';
import { FilterInput } from '@/components/FilterInput';
import tokenData from '@/data/tokens.json';
import tokenUsage from '@/data/tokenUsage.json';
import { getStorybookUrl } from '@/lib/storybookLinks';
import type { Token, TokenCategory } from '@/types/token';

const tokens = tokenData as Token[];
const tokenMap = new Map(tokens.map((t) => [t.name, t]));

const CATEGORY_ROUTE: Record<string, string> = {
  color: 'colors',
  spacing: 'spacing',
  typography: 'typography',
  border: 'borders',
  shadow: 'shadows',
  other: 'colors',
};

const CATEGORY_LABELS: Record<TokenCategory, string> = {
  color: 'Colors',
  spacing: 'Spacing',
  typography: 'Typography',
  border: 'Borders',
  shadow: 'Shadows',
  other: 'Other',
};

const CATEGORY_ORDER: TokenCategory[] = [
  'color',
  'spacing',
  'typography',
  'border',
  'shadow',
  'other',
];

interface ComponentEntry {
  tokens: string[];
  categories: Record<string, string[]>;
}

const components = Object.entries(tokenUsage.byComponent as Record<string, ComponentEntry>).sort(
  ([a], [b]) => a.localeCompare(b),
);

function TokenPill({ name }: { name: string }) {
  const token = tokenMap.get(name);
  const cat = token?.category ?? 'other';
  const route = CATEGORY_ROUTE[cat] ?? 'colors';
  const tokenParam = name.replace(/^--/, '');

  return (
    <a
      href={`/${route}?token=${tokenParam}`}
      className="group inline-flex items-center gap-1 rounded-md bg-nf-light-grey px-2 py-0.5 text-[11px] font-mono text-nf-deep-navy hover:bg-nf-green/20 motion-safe:transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-1"
    >
      {token?.category === 'color' && (
        <ColorSwatch
          lightValue={token.lightValue}
          darkValue={token.darkValue}
          size="mini"
          className="!h-3 !w-3"
        />
      )}
      <span className="truncate max-w-[200px]">{name}</span>
    </a>
  );
}

function ComponentCard({ name, entry }: { name: string; entry: ComponentEntry }) {
  const [expanded, setExpanded] = useState(false);
  const totalTokens = entry.tokens.length;
  const categoriesWithTokens = CATEGORY_ORDER.filter(
    (cat) => (entry.categories[cat]?.length ?? 0) > 0,
  );

  return (
    <div className="rounded-lg border border-nf-grey/40 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-base text-nf-deep-navy">{name}</h2>
          {(() => {
            const url = getStorybookUrl(name);
            return url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-block text-xs text-nf-purple hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green"
              >
                Storybook docs ↗
              </a>
            ) : null;
          })()}
        </div>
        <span className="shrink-0 rounded-full bg-nf-light-green px-2 py-0.5 text-xs font-medium text-nf-dark-green">
          {totalTokens} tokens
        </span>
      </div>

      <div className="mt-3">
        <div className="flex flex-wrap gap-1">
          {categoriesWithTokens.map((cat) => (
            <span
              key={cat}
              className="rounded bg-nf-light-grey px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-nf-muted-grey"
            >
              {CATEGORY_LABELS[cat]} ({entry.categories[cat]?.length ?? 0})
            </span>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2">
          {categoriesWithTokens.map((cat) => (
            <div key={cat}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-nf-muted-grey">
                {CATEGORY_LABELS[cat]}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {(entry.categories[cat] ?? []).map((token) => (
                  <TokenPill key={token} name={token} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs text-nf-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2"
      >
        {expanded ? 'Collapse' : `Show ${totalTokens} tokens`}
      </button>
    </div>
  );
}

export function UsageContent() {
  const [filter, setFilter] = useState('');
  const lowerFilter = filter.toLowerCase();

  const filtered = filter
    ? components.filter(([name]) => name.toLowerCase().includes(lowerFilter))
    : components;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="text-[24px] font-heading leading-[1.2] tracking-[-0.01em] text-nf-deep-navy">
        Component Token Usage
      </h1>
      <p className="mt-1 text-sm text-nf-muted-grey">
        {components.length} components from{' '}
        <span className="font-mono">
          @ogcio/design-system-react@{tokenUsage.meta.packageVersion}
        </span>
        {' — '}
        {tokenUsage.meta.tokensReferenced} tokens referenced
      </p>

      <div className="mt-6">
        <FilterInput value={filter} onChange={setFilter} placeholder="Filter components…" />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-sm text-nf-muted-grey">No components match &ldquo;{filter}&rdquo;</p>
          <button
            type="button"
            onClick={() => setFilter('')}
            className="mt-2 text-xs text-nf-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(([name, entry]) => (
            <ComponentCard key={name} name={name} entry={entry as ComponentEntry} />
          ))}
        </div>
      )}
    </div>
  );
}
