import { afterEach, describe, expect, it, vi } from 'vitest';

describe('next.config', () => {
  const originalEnv = process.env.GITHUB_PAGES;

  afterEach(() => {
    vi.resetModules();
    if (originalEnv === undefined) {
      delete process.env.GITHUB_PAGES;
    } else {
      process.env.GITHUB_PAGES = originalEnv;
    }
  });

  it('sets output to export in all environments', async () => {
    delete process.env.GITHUB_PAGES;
    const { default: config } = await import('./next.config.ts');
    expect(config.output).toBe('export');
  });

  it('does not set basePath or assetPrefix without GITHUB_PAGES', async () => {
    delete process.env.GITHUB_PAGES;
    const { default: config } = await import('./next.config.ts');
    expect(config.basePath).toBeUndefined();
    expect(config.assetPrefix).toBeUndefined();
  });

  it('sets basePath and assetPrefix when GITHUB_PAGES is true', async () => {
    process.env.GITHUB_PAGES = 'true';
    const { default: config } = await import('./next.config.ts');
    expect(config.basePath).toBe('/theme-govie-explorer');
    expect(config.assetPrefix).toBe('/theme-govie-explorer/');
  });

  it('does not set basePath when GITHUB_PAGES is a non-true value', async () => {
    process.env.GITHUB_PAGES = 'false';
    const { default: config } = await import('./next.config.ts');
    expect(config.basePath).toBeUndefined();
    expect(config.assetPrefix).toBeUndefined();
  });
});
