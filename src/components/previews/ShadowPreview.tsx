interface ShadowPreviewProps {
  value: string;
  size: 'small' | 'large';
}

export function ShadowPreview({ value, size }: ShadowPreviewProps) {
  const dimension = size === 'small' ? 36 : 160;

  return (
    <div
      className="shrink-0 rounded-lg bg-white"
      style={{ width: dimension, height: dimension, boxShadow: value }}
      aria-hidden="true"
    />
  );
}
