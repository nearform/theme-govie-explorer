import type { TokenCategory } from '@/types/token';

const CATEGORY_ROUTES: Record<TokenCategory, string> = {
  color: 'colors',
  spacing: 'spacing',
  typography: 'typography',
  border: 'borders',
  shadow: 'shadows',
  other: 'cheatsheet',
};

export function categoryToRoute(category: TokenCategory): string {
  return CATEGORY_ROUTES[category];
}

export function stripPrefix(name: string): string {
  return name.replace(/^--/, '');
}

export function addPrefix(name: string): string {
  return name.startsWith('--') ? name : `--${name}`;
}

export function buildTokenPermalink(category: string, tokenName: string): string {
  const stripped = stripPrefix(tokenName);
  return `/${category}?token=${encodeURIComponent(stripped)}`;
}

export function getTokenFromSearchParams(searchParams: URLSearchParams): string | null {
  const raw = searchParams.get('token');
  if (!raw) return null;
  return addPrefix(decodeURIComponent(raw));
}
