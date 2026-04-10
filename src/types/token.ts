export type TokenCategory = 'color' | 'spacing' | 'typography' | 'border' | 'shadow' | 'other';

export interface Token {
  name: string;
  category: TokenCategory;
  lightValue: string;
  darkValue: string;
  rawProperty: string;
}

export interface ColorToken extends Token {
  category: 'color';
  contrastPairs: ContrastPair[];
}

export interface ContrastPair {
  against: string;
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
}
