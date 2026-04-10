import { ColorSwatch } from '@/components/ColorSwatch';
import { CopyButton } from '@/components/CopyButton';
import tokenData from '@/data/tokens.json';
import type { Token, TokenCategory } from '@/types/token';

const tokens = tokenData as Token[];

const CATEGORY_ORDER: TokenCategory[] = [
  'color',
  'spacing',
  'typography',
  'border',
  'shadow',
  'other',
];

const CATEGORY_LABELS: Record<TokenCategory, string> = {
  color: 'Colors',
  spacing: 'Spacing',
  typography: 'Typography',
  border: 'Borders',
  shadow: 'Shadows',
  other: 'Other',
};

function CompactPreview({ token }: { token: Token }) {
  if (token.category === 'color') {
    return (
      <ColorSwatch
        lightValue={token.lightValue}
        darkValue={token.darkValue}
        size="mini"
        className="shrink-0"
      />
    );
  }
  return null;
}

function CategorySection({ category, items }: { category: TokenCategory; items: Token[] }) {
  return (
    <section aria-label={CATEGORY_LABELS[category]}>
      <h2 className="sticky top-0 z-10 border-b border-nf-grey/50 bg-white/95 px-0 py-3 font-heading text-sm font-semibold uppercase tracking-wide text-nf-deep-navy backdrop-blur-sm">
        {CATEGORY_LABELS[category]}
        <span className="ml-2 font-mono font-normal text-nf-muted-grey">{items.length}</span>
      </h2>
      <div className="mt-2 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
        {items.map((token) => (
          <div
            key={token.name}
            className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-nf-light-grey"
          >
            <CompactPreview token={token} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-xs text-nf-deep-navy">{token.name}</p>
              <p className="truncate font-mono text-[10px] leading-[1.4] text-nf-muted-grey">
                {token.lightValue}
                {token.darkValue !== token.lightValue && (
                  <span className="ml-1 text-nf-muted-grey/50">/ {token.darkValue}</span>
                )}
              </p>
            </div>
            <CopyButton value={`var(${token.name})`} variant="ghost" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CheatsheetPage() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: tokens.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="text-[24px] font-heading leading-[1.2] tracking-[-0.01em] text-nf-deep-navy">
        Token Cheat Sheet
      </h1>
      <p className="mt-1 text-sm text-nf-muted-grey">
        {tokens.length} tokens across {grouped.length} categories — hover any row to copy
      </p>
      <div className="mt-6 space-y-6">
        {grouped.map((g) => (
          <CategorySection key={g.category} category={g.category} items={g.items} />
        ))}
      </div>
    </div>
  );
}
