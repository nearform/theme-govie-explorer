import { parseHex, parseHsl, parseRgb, type RGB } from '@/lib/colorUtils';
import type { ContrastPair, Token } from '@/types/token';

export const WCAG_AA_THRESHOLD = 4.5;
export const WCAG_AAA_THRESHOLD = 7;

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(rgb: RGB): number {
  return (
    0.2126 * linearize(rgb.r) +
    0.7152 * linearize(rgb.g) +
    0.0722 * linearize(rgb.b)
  );
}

export function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function checkContrast(
  color1: RGB,
  color2: RGB
): { ratio: number; meetsAA: boolean; meetsAAA: boolean } {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const ratio = contrastRatio(l1, l2);

  return {
    ratio: Math.round(ratio * 100) / 100,
    meetsAA: ratio >= WCAG_AA_THRESHOLD,
    meetsAAA: ratio >= WCAG_AAA_THRESHOLD,
  };
}

function parseColor(value: string): RGB | null {
  return parseHex(value) ?? parseRgb(value) ?? parseHsl(value);
}

export function computeContrastPairs(
  tokens: Token[]
): Map<string, ContrastPair[]> {
  const colorTokens = tokens.filter((t) => t.category === 'color');

  const resolved: Array<{ name: string; rgb: RGB }> = [];
  for (const token of colorTokens) {
    const rgb = parseColor(token.lightValue);
    if (rgb) {
      resolved.push({ name: token.name, rgb });
    }
  }

  const pairMap = new Map<string, ContrastPair[]>();
  for (const { name } of resolved) {
    pairMap.set(name, []);
  }

  for (let i = 0; i < resolved.length; i++) {
    for (let j = i + 1; j < resolved.length; j++) {
      const result = checkContrast(resolved[i].rgb, resolved[j].rgb);
      const iPairs = pairMap.get(resolved[i].name);
      const jPairs = pairMap.get(resolved[j].name);

      if (iPairs) {
        iPairs.push({ against: resolved[j].name, ...result });
      }
      if (jPairs) {
        jPairs.push({ against: resolved[i].name, ...result });
      }
    }
  }

  return pairMap;
}
