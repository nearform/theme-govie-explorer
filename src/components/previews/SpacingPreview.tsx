interface SpacingPreviewProps {
  value: string;
  size: 'small' | 'large';
}

function parsePixels(value: string): number | null {
  if (value.endsWith('px')) {
    const n = Number.parseFloat(value);
    return Number.isNaN(n) ? null : n;
  }
  if (value.endsWith('rem')) {
    const n = Number.parseFloat(value);
    return Number.isNaN(n) ? null : n * 16;
  }
  return null;
}

export function SpacingPreview({ value, size }: SpacingPreviewProps) {
  const px = parsePixels(value);
  if (px === null) return null;

  if (size === 'small') {
    const barWidth = Math.min(px, 120);
    return (
      <div className="flex h-9 w-[120px] shrink-0 items-center" aria-hidden="true">
        <div
          className="h-3 rounded-sm bg-nf-blue"
          style={{ width: Math.max(barWidth, 2) }}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[400px] flex-col items-start gap-2" aria-hidden="true">
      <div
        className="h-8 rounded bg-nf-blue"
        style={{ width: Math.min(px, 400) }}
      />
      <div className="flex w-full items-center gap-1">
        {Array.from({ length: Math.min(Math.ceil(px / 8), 50) }, (_, i) => (
          <div
            key={i}
            className="h-2 w-px bg-nf-muted-grey/40"
          />
        ))}
      </div>
      <p className="font-mono text-xs text-nf-muted-grey">{px}px</p>
    </div>
  );
}
