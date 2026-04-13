'use client';

import { useFocusTrap } from '@/hooks/useFocusTrap';
import { SHORTCUT_MAP } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsOverlay({ isOpen, onClose }: KeyboardShortcutsOverlayProps) {
  const trapRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === '?') {
          e.preventDefault();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="fixed inset-0 bg-nf-deep-navy/40 motion-safe:animate-[fadeIn_100ms_ease-out]"
        aria-hidden="true"
      />

      <div
        ref={trapRef}
        className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl motion-safe:animate-[scaleIn_150ms_ease-out]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg text-nf-deep-navy">Keyboard Shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-nf-muted-grey hover:text-nf-deep-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green"
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

        <dl className="space-y-2">
          {SHORTCUT_MAP.map((entry) => (
            <div key={entry.label} className="flex items-center justify-between py-1.5">
              <dt className="text-sm text-nf-deep-grey">{entry.label}</dt>
              <dd className="flex gap-1.5">
                {entry.keys.map((key) => (
                  <kbd
                    key={key}
                    className="rounded bg-nf-light-grey px-2 py-0.5 font-mono text-xs text-nf-deep-grey"
                  >
                    {key}
                  </kbd>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-center text-xs text-nf-muted-grey">
          Press <kbd className="rounded bg-nf-light-grey px-1 py-0.5 font-mono text-[11px]">?</kbd>{' '}
          or <kbd className="rounded bg-nf-light-grey px-1 py-0.5 font-mono text-[11px]">Esc</kbd>{' '}
          to close
        </p>
      </div>
    </div>
  );
}
