import Link from 'next/link';

import { ColorSwatch } from '@/components/ColorSwatch';
import type { Token } from '@/types/token';

import tokenData from '@/data/tokens.json';

const tokens = tokenData as Token[];

interface CategoryCard {
  label: string;
  href: string;
  count: number;
  description: string;
  preview: React.ReactNode;
}

function getCategoryCount(category: string): number {
  return tokens.filter((t) => t.category === category).length;
}

function getSampleColors(): Token[] {
  return tokens
    .filter((t) => t.category === 'color' && t.lightValue.startsWith('#'))
    .slice(0, 5);
}

const sampleColors = getSampleColors();

const categories: CategoryCard[] = [
  {
    label: 'Colors',
    href: '/colors',
    count: getCategoryCount('color'),
    description: 'Palette scales, text, icon, border, and surface colors with light/dark theme values',
    preview: (
      <div className="flex gap-1.5">
        {sampleColors.map((t) => (
          <ColorSwatch key={t.name} lightValue={t.lightValue} darkValue={t.darkValue} size="mini" />
        ))}
      </div>
    ),
  },
  {
    label: 'Spacing',
    href: '/spacing',
    count: getCategoryCount('spacing'),
    description: 'Size and spacing scale tokens for consistent layouts',
    preview: (
      <div className="flex items-end gap-1">
        {[8, 16, 24, 32, 48].map((w) => (
          <div key={w} className="rounded-sm bg-nf-blue" style={{ width: w / 2, height: 16 }} />
        ))}
      </div>
    ),
  },
  {
    label: 'Typography',
    href: '/typography',
    count: getCategoryCount('typography'),
    description: 'Font families, sizes, weights, line heights, and type scale shorthands',
    preview: (
      <div className="flex items-baseline gap-2 text-nf-deep-navy">
        <span className="text-xl font-bold">Aa</span>
        <span className="text-base">Aa</span>
        <span className="text-sm">Aa</span>
        <span className="text-xs">Aa</span>
      </div>
    ),
  },
  {
    label: 'Borders',
    href: '/borders',
    count: getCategoryCount('border'),
    description: 'Border widths and radius tokens for consistent component edges',
    preview: (
      <div className="flex gap-2">
        {[1, 2, 4].map((w) => (
          <div
            key={w}
            className="h-8 w-8"
            style={{ border: `${w}px solid #478bff`, borderRadius: 4 }}
          />
        ))}
      </div>
    ),
  },
  {
    label: 'Shadows',
    href: '/shadows',
    count: getCategoryCount('shadow'),
    description: 'Elevation shadow tokens from subtle to prominent',
    preview: (
      <div className="flex gap-2">
        {['0 1px 2px #0000000d', '0 4px 6px -1px #0000001a', '0 10px 15px -3px #0000001a'].map((s) => (
          <div key={s} className="h-8 w-8 rounded bg-white" style={{ boxShadow: s }} />
        ))}
      </div>
    ),
  },
  {
    label: 'Contrast',
    href: '/contrast',
    count: getCategoryCount('color'),
    description: 'WCAG AA/AAA contrast ratio checker for color token pairs',
    preview: (
      <div className="flex gap-1.5">
        <span className="rounded bg-nf-deep-navy px-2 py-0.5 text-xs font-semibold text-nf-green">AA</span>
        <span className="rounded bg-nf-deep-navy px-2 py-0.5 text-xs font-semibold text-yellow-400">AAA</span>
      </div>
    ),
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-16">
      <h1 className="text-[32px] font-heading leading-[1.2] tracking-[-0.01em] text-nf-deep-navy">
        Gov.ie Design Token Explorer
      </h1>
      <p className="mt-3 max-w-xl text-base leading-[1.6] text-nf-deep-grey">
        Browse, search, and inspect {tokens.length} design tokens from{' '}
        <code className="rounded bg-nf-light-grey px-1.5 py-0.5 font-mono text-sm">
          @ogcio/theme-govie
        </code>{' '}
        with visual previews, light/dark comparison, and WCAG contrast checking.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group rounded-xl border border-nf-grey/60 bg-white p-5 transition-all duration-150 hover:border-nf-green hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green focus-visible:ring-offset-2"
          >
            <div className="mb-3 min-h-[32px]">{cat.preview}</div>
            <h2 className="font-heading text-lg text-nf-deep-navy group-hover:text-nf-dark-green">
              {cat.label}
            </h2>
            <p className="mt-1 text-sm leading-[1.5] text-nf-muted-grey">
              {cat.description}
            </p>
            <p className="mt-3 font-mono text-xs text-nf-muted-grey/70">
              {cat.count} tokens
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
