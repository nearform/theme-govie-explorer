import { createRequire } from 'module';

const MIN_EXPECTED_TOKENS = 500;
const MAX_EXPECTED_TOKENS = 800;

export interface ValidationResult {
  valid: boolean;
  warning?: string;
  error?: string;
}

export function validateTokenCount(count: number): ValidationResult {
  if (count === 0) {
    return {
      valid: false,
      error: `Token extraction produced 0 tokens. The CSS files may be empty or have an unrecognizable structure.`,
    };
  }

  if (count < MIN_EXPECTED_TOKENS || count > MAX_EXPECTED_TOKENS) {
    return {
      valid: true,
      warning: `Token count ${count} is outside the expected range (${MIN_EXPECTED_TOKENS}–${MAX_EXPECTED_TOKENS}). This may indicate a change in the theme-govie package.`,
    };
  }

  return { valid: true };
}

export function validateCssStructure(
  lightCss: string,
  darkCss: string
): ValidationResult {
  if (!lightCss.trim()) {
    return { valid: false, error: 'light.css is empty or could not be read.' };
  }

  if (!darkCss.trim()) {
    return { valid: false, error: 'dark.css is empty or could not be read.' };
  }

  const hasLightTheme = lightCss.includes('[data-theme="govie-light"]');
  const hasDarkTheme = darkCss.includes('[data-theme="govie-dark"]');

  if (!hasLightTheme) {
    return {
      valid: false,
      error: `light.css does not contain [data-theme="govie-light"] selector. The CSS structure is unrecognizable.`,
    };
  }

  if (!hasDarkTheme) {
    return {
      valid: false,
      error: `dark.css does not contain [data-theme="govie-dark"] selector. The CSS structure is unrecognizable.`,
    };
  }

  return { valid: true };
}

export function validatePackageAvailable(): ValidationResult {
  try {
    const require = createRequire(import.meta.url);
    require.resolve('@ogcio/theme-govie/light.css');
    require.resolve('@ogcio/theme-govie/dark.css');
    return { valid: true };
  } catch {
    return {
      valid: false,
      error: `@ogcio/theme-govie package is not installed or its CSS files are not accessible. Run: pnpm add @ogcio/theme-govie@1.21.4`,
    };
  }
}
