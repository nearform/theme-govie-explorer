'use client';

interface CategoryChipsProps {
  labels: string[];
  activeLabel: string | null;
  onSelect: (label: string | null) => void;
}

export function CategoryChips({ labels, activeLabel, onSelect }: CategoryChipsProps) {
  if (labels.length <= 1) return null;

  return (
    <fieldset
      className="flex flex-wrap gap-1.5 border-b border-nf-grey/50 px-4 py-2.5"
      aria-label="Filter by sub-category"
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full px-2.5 py-1 text-xs font-sans motion-safe:transition-colors motion-safe:duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green ${
          activeLabel === null
            ? 'bg-nf-deep-navy text-white'
            : 'bg-nf-light-grey text-nf-deep-grey hover:bg-nf-grey/50'
        }`}
      >
        All
      </button>
      {labels.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(activeLabel === label ? null : label)}
          className={`rounded-full px-2.5 py-1 text-xs font-sans motion-safe:transition-colors motion-safe:duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green ${
            activeLabel === label
              ? 'bg-nf-deep-navy text-white'
              : 'bg-nf-light-grey text-nf-deep-grey hover:bg-nf-grey/50'
          }`}
        >
          {label}
        </button>
      ))}
    </fieldset>
  );
}
