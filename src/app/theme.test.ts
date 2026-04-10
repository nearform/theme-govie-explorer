import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const BRAND_COLORS = {
  '--color-nf-deep-navy': '#000e38',
  '--color-nf-green': '#00e6a4',
  '--color-nf-dark-green': '#07a06f',
  '--color-nf-light-green': '#ccfaed',
  '--color-nf-purple': '#9966ff',
  '--color-nf-light-purple': '#dfccff',
  '--color-nf-blue': '#478bff',
  '--color-nf-light-blue': '#d6e6ff',
  '--color-nf-grey': '#d9d9d9',
  '--color-nf-light-grey': '#f4f8fa',
  '--color-nf-deep-grey': '#444450',
  '--color-nf-muted-grey': '#727783',
} as const;

describe('globals.css NearForm brand theme', () => {
  const cssPath = path.resolve(__dirname, 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  it('should import tailwindcss', () => {
    expect(css).toContain('@import "tailwindcss"');
  });

  it('should contain @theme directive', () => {
    expect(css).toContain('@theme');
  });

  it('should define all 12 NearForm brand colors', () => {
    for (const [token, hex] of Object.entries(BRAND_COLORS)) {
      expect(css).toContain(token);
      expect(css).toContain(hex);
    }
  });

  it('should configure font families', () => {
    expect(css).toContain('--font-heading');
    expect(css).toContain('--font-sans');
    expect(css).toContain('--font-mono');
  });

  it('should apply antialiased rendering on body', () => {
    expect(css).toContain('-webkit-font-smoothing: antialiased');
    expect(css).toContain('-moz-osx-font-smoothing: grayscale');
  });

  it('should set heading letter spacing', () => {
    expect(css).toContain('-0.01em');
  });
});

describe('layout.tsx font configuration', () => {
  const layoutPath = path.resolve(__dirname, 'layout.tsx');
  const layout = fs.readFileSync(layoutPath, 'utf-8');

  it('should import Bitter and Inter from next/font/google', () => {
    expect(layout).toContain('Bitter');
    expect(layout).toContain('Inter');
    expect(layout).toContain('next/font/google');
  });

  it('should configure font CSS variables', () => {
    expect(layout).toContain('--font-bitter');
    expect(layout).toContain('--font-inter');
  });

  it('should apply font variables to html element', () => {
    expect(layout).toContain('bitter.variable');
    expect(layout).toContain('inter.variable');
  });
});
