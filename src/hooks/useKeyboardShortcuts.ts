'use client';

import { useEffect, useState } from 'react';

interface ShortcutEntry {
  keys: string[];
  label: string;
}

export const SHORTCUT_MAP: ShortcutEntry[] = [
  { keys: ['⌘K', 'Ctrl+K'], label: 'Open search palette' },
  { keys: ['/'], label: 'Open search palette (when not in input)' },
  { keys: ['↑', '↓'], label: 'Navigate results / token list' },
  { keys: ['⏎'], label: 'Go to token detail / confirm' },
  { keys: ['Esc'], label: 'Close palette / deselect' },
  { keys: ['?'], label: 'Toggle keyboard shortcuts' },
];

export function useKeyboardShortcuts() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('open-command-palette'));
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setShowOverlay((prev) => !prev);
        return;
      }
    }

    function handleToggle() {
      setShowOverlay((prev) => !prev);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('toggle-keyboard-shortcuts', handleToggle);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('toggle-keyboard-shortcuts', handleToggle);
    };
  }, []);

  return { showOverlay, setShowOverlay };
}
