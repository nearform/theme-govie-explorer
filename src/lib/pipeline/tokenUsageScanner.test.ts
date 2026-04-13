import { describe, expect, it } from 'vitest';

import {
  buildGiClassToTokenMap,
  extractGiClassesFromJs,
  extractVarGiedsFromJs,
  groupTokensByCategory,
  kebabToPascal,
  resolveGiClassesToTokens,
} from './tokenUsageScanner';

describe('kebabToPascal', () => {
  it('converts single-word kebab to PascalCase', () => {
    expect(kebabToPascal('alert')).toBe('Alert');
  });

  it('converts multi-word kebab to PascalCase', () => {
    expect(kebabToPascal('cookie-banner')).toBe('CookieBanner');
  });

  it('converts longer kebab strings', () => {
    expect(kebabToPascal('text-input')).toBe('TextInput');
    expect(kebabToPascal('progress-stepper')).toBe('ProgressStepper');
    expect(kebabToPascal('input-radio-group')).toBe('InputRadioGroup');
  });
});

describe('extractVarGiedsFromJs', () => {
  it('extracts var(--gieds-*) references from JS content', () => {
    const js = `className: "gi-grow md:gi-max-w-[calc(100%_-_var(--gieds-space-80))]"`;
    expect(extractVarGiedsFromJs(js)).toEqual(['--gieds-space-80']);
  });

  it('extracts multiple var references', () => {
    const js = `style: "color: var(--gieds-color-text-primary); padding: var(--gieds-space-40)"`;
    const result = extractVarGiedsFromJs(js);
    expect(result).toContain('--gieds-color-text-primary');
    expect(result).toContain('--gieds-space-40');
  });

  it('returns empty array when no matches', () => {
    expect(extractVarGiedsFromJs('const x = 42;')).toEqual([]);
  });

  it('deduplicates identical references', () => {
    const js = `var(--gieds-space-80) var(--gieds-space-80)`;
    expect(extractVarGiedsFromJs(js)).toEqual(['--gieds-space-80']);
  });
});

describe('extractGiClassesFromJs', () => {
  it('extracts gi-* class names from JS content', () => {
    const js = `"gi-bg-color-surface-intent-info-default gi-border-color-border-intent-info-subtle"`;
    const result = extractGiClassesFromJs(js);
    expect(result).toContain('gi-bg-color-surface-intent-info-default');
    expect(result).toContain('gi-border-color-border-intent-info-subtle');
  });

  it('returns empty array when no gi classes', () => {
    expect(extractGiClassesFromJs('const x = "hello world";')).toEqual([]);
  });

  it('deduplicates identical classes', () => {
    const js = `"gi-flex gi-flex gi-flex"`;
    const result = extractGiClassesFromJs(js);
    expect(result).toEqual(['gi-flex']);
  });

  it('does not match partial gi- without letter after dash', () => {
    expect(extractGiClassesFromJs('"gi-"')).toEqual([]);
  });
});

describe('buildGiClassToTokenMap', () => {
  it('maps gi-* classes to --gieds-* tokens from CSS', () => {
    const css = `.gi-bg-color-surface-intent-info-default{background-color:var(--gieds-color-surface-intent-info-default)}`;
    const map = buildGiClassToTokenMap(css);
    expect(map.get('gi-bg-color-surface-intent-info-default')).toEqual([
      '--gieds-color-surface-intent-info-default',
    ]);
  });

  it('handles multiple tokens in one rule', () => {
    const css = `.gi-shadow-custom{box-shadow:0 1px var(--gieds-shadow-sm),0 4px var(--gieds-shadow-md)}`;
    const map = buildGiClassToTokenMap(css);
    const tokens = map.get('gi-shadow-custom');
    expect(tokens).toContain('--gieds-shadow-sm');
    expect(tokens).toContain('--gieds-shadow-md');
  });

  it('ignores rules without gi-* selectors', () => {
    const css = `.some-class{color:var(--gieds-color-text-primary)}`;
    const map = buildGiClassToTokenMap(css);
    expect(map.size).toBe(0);
  });

  it('ignores gi-* rules without --gieds-* tokens', () => {
    const css = `.gi-flex{display:flex}`;
    const map = buildGiClassToTokenMap(css);
    expect(map.size).toBe(0);
  });
});

describe('resolveGiClassesToTokens', () => {
  it('resolves known gi-* classes to tokens', () => {
    const classMap = new Map<string, string[]>();
    classMap.set('gi-bg-primary', ['--gieds-color-primary']);
    classMap.set('gi-text-sm', ['--gieds-font-size-sm']);

    const result = resolveGiClassesToTokens(['gi-bg-primary', 'gi-text-sm'], classMap);
    expect(result).toContain('--gieds-color-primary');
    expect(result).toContain('--gieds-font-size-sm');
  });

  it('ignores unknown classes', () => {
    const classMap = new Map<string, string[]>();
    classMap.set('gi-bg-primary', ['--gieds-color-primary']);

    const result = resolveGiClassesToTokens(['gi-bg-primary', 'gi-unknown'], classMap);
    expect(result).toEqual(['--gieds-color-primary']);
  });

  it('deduplicates tokens from multiple classes', () => {
    const classMap = new Map<string, string[]>();
    classMap.set('gi-bg-a', ['--gieds-color-x']);
    classMap.set('gi-bg-b', ['--gieds-color-x']);

    const result = resolveGiClassesToTokens(['gi-bg-a', 'gi-bg-b'], classMap);
    expect(result).toEqual(['--gieds-color-x']);
  });
});

describe('groupTokensByCategory', () => {
  it('groups tokens by their category', () => {
    const tokens = [
      '--gieds-color-text-primary',
      '--gieds-border-width-100',
      '--gieds-font-size-sm',
      '--gieds-space-40',
      '--gieds-shadow-sm',
      '--gieds-something-other',
    ];
    const result = groupTokensByCategory(tokens);
    expect(result.color).toContain('--gieds-color-text-primary');
    expect(result.border).toContain('--gieds-border-width-100');
    expect(result.typography).toContain('--gieds-font-size-sm');
    expect(result.spacing).toContain('--gieds-space-40');
    expect(result.shadow).toContain('--gieds-shadow-sm');
    expect(result.other).toContain('--gieds-something-other');
  });

  it('returns empty arrays for missing categories', () => {
    const result = groupTokensByCategory(['--gieds-color-red']);
    expect(result.spacing).toEqual([]);
    expect(result.border).toEqual([]);
  });
});
