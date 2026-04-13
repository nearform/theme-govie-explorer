import tokenUsage from '@/data/tokenUsage.json';
import { getStorybookUrl } from '@/lib/storybookLinks';
import type { Token } from '@/types/token';

import { CopyButton } from './CopyButton';
import { PermalinkButton } from './PermalinkButton';
import { TokenPreview } from './previews/TokenPreview';

interface TokenDetailProps {
  token: Token;
  category: string;
}

export function TokenDetail({ token, category }: TokenDetailProps) {
  const cssVar = `var(${token.name})`;
  const usedBy = (tokenUsage.byToken as Record<string, string[]>)[token.name] ?? [];

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <TokenPreview token={token} size="large" />

      <h2 className="mt-6 font-mono text-lg leading-[1.4] text-nf-deep-navy">{token.name}</h2>

      <div className="mt-4 flex gap-3">
        <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
          <p className="text-xs text-nf-muted-grey">Light</p>
          <p className="font-mono text-sm text-nf-deep-navy">{token.lightValue}</p>
        </div>
        <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
          <p className="text-xs text-nf-muted-grey">Dark</p>
          <p className="font-mono text-sm text-nf-deep-navy">{token.darkValue}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <CopyButton value={cssVar} variant="primary" />
        <PermalinkButton category={category} tokenName={token.name} />
      </div>

      <div className="mt-6 w-full max-w-md">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-nf-muted-grey">
          Used by
        </h3>
        {usedBy.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {usedBy.map((comp) => {
              const url = getStorybookUrl(comp);
              return url ? (
                <a
                  key={comp}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-nf-light-purple px-2.5 py-0.5 text-xs font-medium text-nf-purple hover:bg-nf-purple hover:text-white motion-safe:transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2"
                >
                  {comp}
                </a>
              ) : (
                <span
                  key={comp}
                  className="rounded-full bg-nf-light-grey px-2.5 py-0.5 text-xs font-medium text-nf-deep-grey"
                >
                  {comp}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-xs text-nf-muted-grey">Not directly used by any component</p>
        )}
      </div>
    </div>
  );
}
