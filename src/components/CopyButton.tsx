'use client';

import { useCallback, useRef, useState } from 'react';

type CopyVariant = 'primary' | 'ghost' | 'inline';

interface CopyButtonProps {
  value: string;
  variant?: CopyVariant;
  label?: string;
}

const VARIANT_CLASSES: Record<CopyVariant, { idle: string; wrapper: string }> = {
  primary: {
    idle: 'rounded-lg bg-nf-green px-4 py-2 text-sm font-semibold text-nf-deep-navy shadow-sm transition-colors hover:bg-nf-dark-green focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2',
    wrapper: '',
  },
  ghost: {
    idle: 'rounded-md p-1.5 text-nf-muted-grey opacity-0 transition-all group-hover:opacity-100 hover:bg-nf-light-grey hover:text-nf-deep-navy focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-nf-green',
    wrapper: '',
  },
  inline: {
    idle: 'rounded p-1 text-nf-muted-grey transition-colors hover:text-nf-deep-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green',
    wrapper: 'inline-flex',
  },
};

const FEEDBACK_DURATION = 1500;
const ERROR_DURATION = 2000;

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? 'h-4 w-4'}
      aria-hidden="true"
    >
      <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
      <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
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

type FeedbackState = 'idle' | 'copied' | 'error';

export function CopyButton({ value, variant = 'primary', label }: CopyButtonProps) {
  const [state, setState] = useState<FeedbackState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleCopy = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
      timerRef.current = setTimeout(() => setState('idle'), FEEDBACK_DURATION);
    } catch {
      setState('error');
      timerRef.current = setTimeout(() => setState('idle'), ERROR_DURATION);
    }
  }, [value]);

  const config = VARIANT_CLASSES[variant];
  const ariaLabel = state === 'copied' ? 'Copied' : 'Copy token value';

  if (state === 'error') {
    return <span className={`${config.wrapper} text-sm text-red-500`}>Copy failed</span>;
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${config.wrapper} ${config.idle} ${state === 'copied' ? 'text-nf-dark-green' : ''}`}
      aria-label={ariaLabel}
    >
      {variant === 'primary' ? (
        state === 'copied' ? (
          <span className="flex items-center gap-1.5">
            <CheckIcon /> Copied
          </span>
        ) : (
          (label ?? `Copy var(${value.includes('var(') ? value.slice(4, -1) : value})`)
        )
      ) : state === 'copied' ? (
        <CheckIcon className="h-4 w-4 text-nf-dark-green" />
      ) : (
        <CopyIcon />
      )}
    </button>
  );
}
