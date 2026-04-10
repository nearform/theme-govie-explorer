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

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <TokenPreview token={token} size="large" />

      <h2 className="mt-6 font-mono text-lg leading-[1.4] text-nf-deep-navy">
        {token.name}
      </h2>

      <div className="mt-4 flex gap-3">
        <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
          <p className="text-xs text-nf-muted-grey">Light</p>
          <p className="font-mono text-sm text-nf-deep-navy">
            {token.lightValue}
          </p>
        </div>
        <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
          <p className="text-xs text-nf-muted-grey">Dark</p>
          <p className="font-mono text-sm text-nf-deep-navy">
            {token.darkValue}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <CopyButton value={cssVar} variant="primary" />
        <PermalinkButton category={category} tokenName={token.name} />
      </div>
    </div>
  );
}
