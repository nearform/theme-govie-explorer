'use client';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

import { KeyboardShortcutsOverlay } from './KeyboardShortcutsOverlay';

export function KeyboardShortcutsProvider() {
  const { showOverlay, setShowOverlay } = useKeyboardShortcuts();

  return (
    <KeyboardShortcutsOverlay isOpen={showOverlay} onClose={() => setShowOverlay(false)} />
  );
}
