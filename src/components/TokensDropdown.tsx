'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import tokenData from '@/data/tokens.json';
import type { Token, TokenCategory } from '@/types/token';

const tokens = tokenData as Token[];

interface CategoryDef {
  key: TokenCategory;
  href: string;
  label: string;
  count: number;
  icon: React.ReactNode;
}

function countByCategory(cat: TokenCategory): number {
  return tokens.filter((t) => t.category === cat).length;
}

const SWATCH_COLORS = ['#012E1F', '#FFB81C', '#339966', '#125690', '#AF2E30'];

function ColorsIcon() {
  return (
    <div className="flex gap-0.5">
      {SWATCH_COLORS.map((c) => (
        <span key={c} className="block h-4 w-2 rounded-sm" style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}

function SpacingIcon() {
  return (
    <div className="flex flex-col gap-1">
      <span className="block h-1 w-8 rounded-full bg-nf-green/70" />
      <span className="block h-1 w-5 rounded-full bg-nf-green/50" />
      <span className="block h-1 w-3 rounded-full bg-nf-green/30" />
    </div>
  );
}

function TypographyIcon() {
  return <span className="block font-heading text-lg leading-none text-white/80">Aa</span>;
}

function BordersIcon() {
  return <span className="block h-5 w-8 rounded-md border-2 border-dashed border-white/40" />;
}

function ShadowsIcon() {
  return (
    <span className="block h-5 w-8 rounded-md bg-white/20 shadow-[2px_2px_6px_rgba(0,0,0,0.4)]" />
  );
}

function ContrastIcon() {
  return (
    <div className="flex h-5 w-8 overflow-hidden rounded-md">
      <span className="block w-1/2 bg-white" />
      <span className="block w-1/2 bg-nf-deep-navy" />
    </div>
  );
}

const CATEGORIES: CategoryDef[] = [
  {
    key: 'color',
    href: '/colors',
    label: 'Colors',
    count: countByCategory('color'),
    icon: <ColorsIcon />,
  },
  {
    key: 'spacing',
    href: '/spacing',
    label: 'Spacing',
    count: countByCategory('spacing'),
    icon: <SpacingIcon />,
  },
  {
    key: 'typography',
    href: '/typography',
    label: 'Typography',
    count: countByCategory('typography'),
    icon: <TypographyIcon />,
  },
  {
    key: 'border',
    href: '/borders',
    label: 'Borders',
    count: countByCategory('border'),
    icon: <BordersIcon />,
  },
  {
    key: 'shadow',
    href: '/shadows',
    label: 'Shadows',
    count: countByCategory('shadow'),
    icon: <ShadowsIcon />,
  },
  {
    key: 'other',
    href: '/contrast',
    label: 'Contrast',
    count: countByCategory('other'),
    icon: <ContrastIcon />,
  },
];

const TOKEN_PATHS = new Set(CATEGORIES.map((c) => c.href));

export function TokensDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);

  const isTokenPage = TOKEN_PATHS.has(pathname);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    }
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, close]);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      setOpen(false);
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const firstLink = menuRef.current.querySelector('a');
    firstLink?.focus();
  }, [open]);

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    const links = menuRef.current?.querySelectorAll('a');
    if (!links?.length) return;

    const current = document.activeElement as HTMLElement;
    const idx = Array.from(links).indexOf(current as HTMLAnchorElement);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      links[(idx + 1) % links.length].focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      links[(idx - 1 + links.length) % links.length].focus();
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-sans motion-safe:transition-colors motion-safe:duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2 focus-visible:ring-offset-nf-deep-navy ${
          isTokenPage ? 'text-nf-green' : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
        }`}
      >
        Tokens
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-3.5 w-3.5 motion-safe:transition-transform motion-safe:duration-150 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          onKeyDown={handleMenuKeyDown}
          className="absolute left-0 top-full z-50 mt-2"
        >
          {/* Desktop mega-menu (lg+) */}
          <div className="hidden w-[540px] rounded-xl border border-white/10 bg-nf-deep-navy/95 p-4 shadow-2xl backdrop-blur-xl lg:block">
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = pathname === cat.href;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    role="menuitem"
                    className={`group flex items-center gap-3 rounded-lg px-3 py-3 motion-safe:transition-all motion-safe:duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green ${
                      isActive
                        ? 'border-l-2 border-nf-green bg-white/[0.08]'
                        : 'border-l-2 border-transparent hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`block text-[13px] font-medium leading-tight ${isActive ? 'text-nf-green' : 'text-white group-hover:text-white'}`}
                      >
                        {cat.label}
                      </span>
                      <span className="block font-mono text-[10px] leading-tight text-white/40">
                        {cat.count} tokens
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Tablet/small desktop simple list (<lg) */}
          <div className="w-48 rounded-lg border border-white/10 bg-nf-deep-navy/95 py-1.5 shadow-xl backdrop-blur-xl lg:hidden">
            {CATEGORIES.map((cat) => {
              const isActive = pathname === cat.href;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  role="menuitem"
                  className={`flex items-center justify-between gap-4 px-4 py-2 text-sm motion-safe:transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nf-green ${
                    isActive
                      ? 'text-nf-green'
                      : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="font-mono text-[11px] text-white/30">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export { CATEGORIES, TOKEN_PATHS };
