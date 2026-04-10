import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('import alias @/* configuration', () => {
  it('should have @/* path alias in tsconfig.json', () => {
    const tsconfig = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../tsconfig.json'), 'utf-8'),
    );
    expect(tsconfig.compilerOptions.paths).toHaveProperty('@/*');
    expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['./src/*']);
  });

  it('should resolve @/types/token at runtime', async () => {
    const tokenModule = await import('@/types/token');
    expect(tokenModule).toBeDefined();
  });
});
