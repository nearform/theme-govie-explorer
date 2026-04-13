import type { Metadata } from 'next';
import { Bitter, Inter } from 'next/font/google';

import { AppNav } from '@/components/AppNav';
import { CommandPaletteProvider } from '@/components/CommandPaletteProvider';
import { KeyboardShortcutsProvider } from '@/components/KeyboardShortcutsProvider';

import './globals.css';

const bitter = Bitter({
  subsets: ['latin'],
  variable: '--font-bitter',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gov.ie Design Token Explorer',
  description: 'Browse, search, and inspect Gov.ie design tokens with WCAG contrast checking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bitter.variable} ${inter.variable}`}>
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-nf-green focus:px-4 focus:py-2 focus:text-nf-deep-navy focus:font-semibold focus:shadow-lg"
        >
          Skip to content
        </a>
        <AppNav />
        <CommandPaletteProvider />
        <KeyboardShortcutsProvider />
        <main id="main-content" className="min-h-[calc(100vh-56px)] bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
