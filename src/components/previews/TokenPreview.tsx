import type { Token } from '@/types/token';

import { ColorSwatch } from '../ColorSwatch';
import { BorderPreview } from './BorderPreview';
import { ShadowPreview } from './ShadowPreview';
import { SpacingPreview } from './SpacingPreview';
import { TypographyPreview } from './TypographyPreview';

interface TokenPreviewProps {
  token: Token;
  size: 'small' | 'large';
}

export function TokenPreview({ token, size }: TokenPreviewProps) {
  switch (token.category) {
    case 'color':
      return (
        <ColorSwatch
          lightValue={token.lightValue}
          darkValue={token.darkValue}
          size={size === 'small' ? 'small' : 'large'}
          className={size === 'large' ? 'shadow-lg' : 'shrink-0'}
        />
      );
    case 'spacing':
      return <SpacingPreview value={token.lightValue} size={size} />;
    case 'typography':
      return <TypographyPreview value={token.lightValue} tokenName={token.name} size={size} />;
    case 'border':
      return <BorderPreview value={token.lightValue} tokenName={token.name} size={size} />;
    case 'shadow':
      return <ShadowPreview value={token.lightValue} size={size} />;
    case 'other':
      return null;
  }
}
