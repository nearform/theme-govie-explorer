const SIZE_CONFIG = {
  mini: { dimension: 32, radius: 'rounded-md' },
  small: { dimension: 36, radius: 'rounded-lg' },
  large: { dimension: 200, radius: 'rounded-2xl' },
  contrast: { dimension: 80, radius: 'rounded-xl' },
} as const;

type SwatchSize = keyof typeof SIZE_CONFIG;

interface ColorSwatchProps {
  lightValue: string;
  darkValue: string;
  size: SwatchSize;
  className?: string;
}

export function ColorSwatch({ lightValue, darkValue, size, className = '' }: ColorSwatchProps) {
  const { dimension, radius } = SIZE_CONFIG[size];

  return (
    <div
      className={`relative overflow-hidden ${radius} ${className}`}
      style={{ width: dimension, height: dimension }}
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 left-0 w-1/2" style={{ backgroundColor: lightValue }} />
      <div className="absolute inset-y-0 right-0 w-1/2" style={{ backgroundColor: darkValue }} />
      <div className="absolute inset-y-0 left-1/2 w-px bg-white" />
    </div>
  );
}
