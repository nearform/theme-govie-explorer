'use client';

import { useCallback, useRef, useState } from 'react';

import { getWcagLevel, WcagBadge } from './WcagBadge';

interface PairPopoverProps {
  bgName: string;
  bgValue: string;
  fgName: string;
  fgValue: string;
  ratio: number;
  onClose: () => void;
}

type FeedbackState = 'idle' | 'pair' | 'link';

export function PairPopover({
  bgName,
  bgValue,
  fgName,
  fgValue,
  ratio,
  onClose,
}: PairPopoverProps) {
  const [copied, setCopied] = useState<FeedbackState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const flash = useCallback((state: FeedbackState) => {
    setCopied(state);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied('idle'), 1500);
  }, []);

  const copyPair = useCallback(async () => {
    const text = `background: var(${bgName});\ncolor: var(${fgName});`;
    try {
      await navigator.clipboard.writeText(text);
      flash('pair');
    } catch {
      /* clipboard unavailable */
    }
  }, [bgName, fgName, flash]);

  const copyPermalink = useCallback(async () => {
    const bg = bgName.replace(/^--/, '');
    const fg = fgName.replace(/^--/, '');
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const url = `${window.location.origin}${basePath}/contrast?bg=${encodeURIComponent(bg)}&fg=${encodeURIComponent(fg)}`;
    try {
      await navigator.clipboard.writeText(url);
      flash('link');
    } catch {
      /* clipboard unavailable */
    }
  }, [bgName, fgName, flash]);

  const level = getWcagLevel(ratio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="fixed inset-0 bg-nf-deep-navy/40 motion-safe:animate-[fadeIn_150ms_ease-out]"
        onClick={onClose}
        aria-label="Close popover"
      />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl motion-safe:animate-[scaleIn_150ms_ease-out]">
        <div
          className="mb-4 flex items-center justify-center rounded-lg p-6"
          style={{ backgroundColor: bgValue }}
        >
          <span className="text-3xl font-bold" style={{ color: fgValue }}>
            Aa
          </span>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-lg font-semibold text-nf-deep-navy">
            {ratio.toFixed(2)}:1
          </span>
          <WcagBadge ratio={ratio} />
          <span className="text-xs text-nf-muted-grey">WCAG {level}</span>
        </div>

        <div className="mb-4 space-y-1 font-mono text-xs text-nf-muted-grey">
          <p>
            <span className="text-nf-deep-navy/60">bg:</span> {bgName.replace(/^--/, '')}
          </p>
          <p>
            <span className="text-nf-deep-navy/60">fg:</span> {fgName.replace(/^--/, '')}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={copyPair}
            className="flex-1 rounded-lg bg-nf-green px-3 py-2 text-sm font-semibold text-nf-deep-navy transition-colors hover:bg-nf-dark-green focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2"
          >
            {copied === 'pair' ? '✓ Copied' : 'Copy pair'}
          </button>
          <button
            type="button"
            onClick={copyPermalink}
            className="flex-1 rounded-lg border border-nf-grey px-3 py-2 text-sm text-nf-muted-grey transition-colors hover:border-nf-deep-navy hover:text-nf-deep-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2"
          >
            {copied === 'link' ? '✓ Linked' : 'Copy permalink'}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-nf-muted-grey hover:text-nf-deep-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
