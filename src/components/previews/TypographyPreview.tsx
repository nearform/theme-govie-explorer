interface TypographyPreviewProps {
  value: string;
  tokenName: string;
  size: 'small' | 'large';
}

const FONT_SHORTHAND_RE = /^(\d+)\s+([\d.]+(?:rem|em|px))(?:\/([\d.]+(?:rem|em|px)?))?\s+(.+)$/;

function parseFontShorthand(value: string): React.CSSProperties | null {
  const match = FONT_SHORTHAND_RE.exec(value);
  if (!match) return null;

  return {
    fontWeight: match[1],
    fontSize: match[2],
    lineHeight: match[3] ?? 'normal',
    fontFamily: match[4],
  };
}

function buildStyle(value: string, tokenName: string): React.CSSProperties {
  const shorthand = parseFontShorthand(value);
  if (shorthand) return shorthand;

  const style: React.CSSProperties = {};
  const name = tokenName.toLowerCase();

  if (name.includes('font-family')) {
    style.fontFamily = value;
  } else if (name.includes('font-size') || name.includes('type-scale')) {
    style.fontSize = value;
  } else if (name.includes('font-weight')) {
    style.fontWeight = value;
  } else if (name.includes('line-height')) {
    style.lineHeight = value;
  } else if (name.includes('letter-spacing')) {
    style.letterSpacing = value;
  } else {
    style.fontSize = value;
  }

  return style;
}

export function TypographyPreview({ value, tokenName, size }: TypographyPreviewProps) {
  const style = buildStyle(value, tokenName);

  if (size === 'small') {
    const smallStyle: React.CSSProperties = {
      ...style,
      fontSize: style.fontSize ? `clamp(12px, ${style.fontSize}, 24px)` : '14px',
    };

    return (
      <span
        className="shrink-0 leading-none text-nf-deep-navy"
        style={smallStyle}
        aria-hidden="true"
      >
        Aa
      </span>
    );
  }

  return (
    <div className="w-full max-w-[500px]" aria-hidden="true">
      <p className="text-nf-deep-navy" style={style}>
        The quick brown fox jumps over the lazy dog
      </p>
    </div>
  );
}
