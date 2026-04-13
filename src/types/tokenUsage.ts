import type { TokenCategory } from './token';

export interface ComponentTokenEntry {
  tokens: string[];
  categories: Record<TokenCategory, string[]>;
}

export interface TokenUsageMeta {
  packageVersion: string;
  componentsAnalyzed: number;
  tokensReferenced: number;
  generatedAt: string;
}

export interface TokenUsageData {
  byToken: Record<string, string[]>;
  byComponent: Record<string, ComponentTokenEntry>;
  meta: TokenUsageMeta;
}
