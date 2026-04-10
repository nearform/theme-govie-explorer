'use client';

import { CopyButton } from './CopyButton';
import { WcagBadge } from './WcagBadge';

interface ContrastCellProps {
  bgValue: string;
  fgName: string;
  fgValue: string;
  ratio: number;
  isSuggested?: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
}

export function ContrastCell({
  bgValue,
  fgName,
  fgValue,
  ratio,
  isSuggested = false,
  isHighlighted = false,
  onClick,
}: ContrastCellProps) {
  return (
    <div
      className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 motion-safe:transition-colors ${
        isHighlighted
          ? 'border-nf-green ring-2 ring-nf-green/30'
          : isSuggested
            ? 'border-nf-green/50'
            : 'border-transparent hover:border-nf-green'
      }`}
      style={{ backgroundColor: bgValue }}
    >
      {isSuggested && (
        <span className="absolute -top-2.5 left-3 rounded-full bg-nf-dark-green px-2 py-0.5 text-[10px] font-semibold text-white">
          Suggested
        </span>
      )}

      <button
        type="button"
        onClick={onClick}
        className="flex w-full flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2"
        aria-label={`Contrast pair: ${fgName} on background, ratio ${ratio.toFixed(2)}:1`}
      >
        <span className="text-lg font-bold leading-tight" style={{ color: fgValue }}>
          Aa
        </span>
        <span className="font-mono text-xs" style={{ color: fgValue }}>
          {ratio.toFixed(2)}:1
        </span>
        <WcagBadge ratio={ratio} />
        <span
          className="truncate font-mono text-[10px] leading-tight opacity-70"
          style={{ color: fgValue }}
        >
          {fgName.replace(/^--/, '')}
        </span>
      </button>

      <div className="absolute right-1.5 top-1.5 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity">
        <CopyButton value={`var(${fgName})`} variant="inline" />
      </div>
    </div>
  );
}
