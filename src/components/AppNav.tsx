'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/colors', label: 'Colors' },
  { href: '/spacing', label: 'Spacing' },
  { href: '/typography', label: 'Typography' },
  { href: '/borders', label: 'Borders' },
  { href: '/shadows', label: 'Shadows' },
  { href: '/contrast', label: 'Contrast' },
  { href: '/cheatsheet', label: 'Cheatsheet' },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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

          <div className="hidden gap-1 md:flex">
            {NAV_LINKS.map(({ href, label }) => {
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
          {NAV_LINKS.map(({ href, label }) => {
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
