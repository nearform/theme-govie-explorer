'use client';

import { useCallback, useEffect, useState } from 'react';
import tokenData from '@/data/tokens.json';
import type { Token } from '@/types/token';
import { CommandPalette } from './CommandPalette';

const tokens = tokenData as Token[];

export function CommandPaletteProvider() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (
        e.key === '/' &&
        !isOpen &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        open();
      }
    }

    function handleCustomOpen() {
      open();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('open-command-palette', handleCustomOpen);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen, open]);

  return <CommandPalette tokens={tokens} isOpen={isOpen} onClose={close} />;
}
