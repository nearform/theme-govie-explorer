'use client';

import { useCallback, useRef, useState } from 'react';

import { buildTokenPermalink } from '@/lib/tokenUrl';

interface PermalinkButtonProps {
  category: string;
  tokenName: string;
}

type FeedbackState = 'idle' | 'copied' | 'error';

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? 'h-4 w-4'}
      aria-hidden="true"
    >
      <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
      <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? 'h-4 w-4'}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PermalinkButton({ category, tokenName }: PermalinkButtonProps) {
  const [state, setState] = useState<FeedbackState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleClick = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const path = buildTokenPermalink(category, tokenName);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const url = `${window.location.origin}${basePath}${path}`;

    try {
      await navigator.clipboard.writeText(url);
      setState('copied');
      timerRef.current = setTimeout(() => setState('idle'), 1500);
    } catch {
      setState('error');
      timerRef.current = setTimeout(() => setState('idle'), 2000);
    }
  }, [category, tokenName]);

  const ariaLabel = state === 'copied' ? 'Link copied' : 'Copy permalink';

  if (state === 'error') {
    return <span className="text-sm text-red-500">Copy failed</span>;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-1.5 rounded-lg border border-nf-grey px-3 py-2 text-sm text-nf-muted-grey transition-colors hover:border-nf-deep-navy hover:text-nf-deep-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2"
      aria-label={ariaLabel}
    >
      {state === 'copied' ? (
        <>
          <CheckIcon className="h-4 w-4 text-nf-dark-green" /> Linked
        </>
      ) : (
        <>
          <LinkIcon /> Permalink
        </>
      )}
    </button>
  );
}
