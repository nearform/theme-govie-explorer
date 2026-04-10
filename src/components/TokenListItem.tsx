import type { Token } from '@/types/token';

import { CopyButton } from './CopyButton';
import { HighlightMatch } from './HighlightMatch';
import { TokenPreview } from './previews/TokenPreview';

interface TokenListItemProps {
  token: Token;
  isSelected: boolean;
  onSelect: (token: Token) => void;
  filterQuery?: string;
}

export function TokenListItem({
  token,
  isSelected,
  onSelect,
  filterQuery = '',
}: TokenListItemProps) {
  return (
    <div
      className={`group flex w-full items-center gap-3 px-4 py-2 motion-safe:transition-colors motion-safe:duration-100 ${
        isSelected ? 'bg-nf-light-green' : 'hover:bg-nf-light-grey'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(token)}
        className="flex min-h-[44px] min-w-0 flex-1 items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nf-green"
        aria-current={isSelected ? 'true' : undefined}
      >
        <TokenPreview token={token} size="small" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm leading-[1.4] text-nf-deep-navy">
            <HighlightMatch text={token.name} query={filterQuery} />
          </p>
          <p className="truncate font-mono text-xs leading-[1.4] text-nf-muted-grey">
            {token.lightValue}
          </p>
        </div>
      </button>
      <CopyButton value={`var(${token.name})`} variant="ghost" />
    </div>
  );
}
