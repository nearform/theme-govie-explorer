'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { CATEGORIES, TOKEN_PATHS, TokensDropdown } from './TokensDropdown';

const STANDALONE_LINKS = [
  { href: '/cheatsheet', label: 'Cheatsheet' },
  { href: '/usage', label: 'Usage' },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tokensExpanded, setTokensExpanded] = useState(() => TOKEN_PATHS.has(pathname));

  return (
    <nav className="relative bg-nf-deep-navy" aria-label="Main navigation">
      <div className="flex h-14 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="rounded font-heading text-[15px] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2 focus-visible:ring-offset-nf-deep-navy"
          >
            <span className="text-nf-green">Token</span> Explorer
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <TokensDropdown />

            {STANDALONE_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-md px-3 py-1.5 text-[13px] font-sans motion-safe:transition-colors motion-safe:duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2 focus-visible:ring-offset-nf-deep-navy ${
                    isActive
                      ? 'text-nf-green'
                      : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="hidden items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.08] px-3 py-1.5 text-[13px] text-white/40 motion-safe:transition-colors motion-safe:duration-150 hover:border-nf-green hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2 focus-visible:ring-offset-nf-deep-navy md:flex"
            aria-label="Search tokens (Cmd+K)"
          >
            Search tokens…
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-sans text-[11px]">⌘K</kbd>
          </button>

          <button
            type="button"
            onClick={() => document.dispatchEvent(new CustomEvent('toggle-keyboard-shortcuts'))}
            className="hidden items-center rounded-lg border border-white/[0.12] bg-white/[0.08] px-2 py-1.5 text-white/40 motion-safe:transition-colors motion-safe:duration-150 hover:border-nf-green hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2 focus-visible:ring-offset-nf-deep-navy md:flex"
            aria-label="Keyboard shortcuts (?)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm3 1.5a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5H6Zm3.25.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5H10a.75.75 0 0 1-.75-.75Zm4 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Zm3.75-.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5H17ZM6 9.5a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5H6Zm3.25.75A.75.75 0 0 1 10 9.5h.5a.75.75 0 0 1 0 1.5H10a.75.75 0 0 1-.75-.75Zm4 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Zm3.75-.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5H17ZM8 13a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H8Z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 px-4 pb-4 pt-2 md:hidden">
          {/* Collapsible Tokens group */}
          <button
            type="button"
            onClick={() => setTokensExpanded((v) => !v)}
            className={`flex w-full items-center justify-between min-h-[44px] rounded-md px-3 py-2.5 text-sm font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green ${
              TOKEN_PATHS.has(pathname)
                ? 'text-nf-green'
                : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
            }`}
            aria-expanded={tokensExpanded}
          >
            <span>Tokens</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-4 w-4 motion-safe:transition-transform motion-safe:duration-150 ${tokensExpanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {tokensExpanded && (
            <div className="ml-3 border-l border-white/10 pl-3">
              {CATEGORIES.map((cat) => {
                const isActive = pathname === cat.href;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between min-h-[44px] rounded-md px-3 py-2 text-sm font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green ${
                      isActive
                        ? 'text-nf-green'
                        : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{cat.label}</span>
                    <span className="font-mono text-[11px] text-white/30">{cat.count}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Standalone links */}
          {STANDALONE_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block min-h-[44px] rounded-md px-3 py-2.5 text-sm font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green ${
                  isActive
                    ? 'text-nf-green'
                    : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
