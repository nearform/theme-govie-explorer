interface BorderPreviewProps {
  value: string;
  tokenName: string;
  size: 'small' | 'large';
}

function buildStyle(value: string, tokenName: string): React.CSSProperties {
  const name = tokenName.toLowerCase();

  if (name.includes('border-radius')) {
    return { borderRadius: value, border: '2px solid #478bff' };
  }
  if (name.includes('border-width')) {
    return { borderWidth: value, borderStyle: 'solid', borderColor: '#478bff' };
  }
  return { border: `${value} solid #478bff` };
}

export function BorderPreview({
  value,
  tokenName,
  size,
}: BorderPreviewProps) {
  const style = buildStyle(value, tokenName);
  const dimension = size === 'small' ? 36 : 160;

  return (
    <div
      className="shrink-0 bg-white"
      style={{ width: dimension, height: dimension, ...style }}
      aria-hidden="true"
    />
  );
}
