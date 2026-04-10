type WcagLevel = 'AAA' | 'AA' | 'Fail';

interface WcagBadgeProps {
  ratio: number;
  className?: string;
}

const LEVEL_STYLES: Record<WcagLevel, string> = {
  AAA: 'bg-nf-light-green text-nf-dark-green',
  AA: 'bg-nf-light-blue text-nf-blue',
  Fail: 'bg-[#ffeaea] text-[#cc3333]',
};

export function getWcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'Fail';
}

export function WcagBadge({ ratio, className = '' }: WcagBadgeProps) {
  const level = getWcagLevel(ratio);
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold leading-tight ${LEVEL_STYLES[level]} ${className}`}
    >
      {level}
    </span>
  );
}
