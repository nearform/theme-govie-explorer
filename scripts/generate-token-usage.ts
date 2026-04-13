import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { scanPackage } from '@/lib/pipeline/tokenUsageScanner';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');

function fatal(message: string): never {
  console.error(`\n❌ TOKEN USAGE SCAN FAILED: ${message}\n`);
  process.exit(1);
}

function run(): void {
  const startTime = performance.now();

  console.log('🔍 Token usage scanner starting...\n');

  const require = createRequire(import.meta.url);

  let pkgJsonPath: string;
  try {
    pkgJsonPath = require.resolve('@ogcio/design-system-react/package.json');
  } catch {
    try {
      const indexPath = require.resolve('@ogcio/design-system-react');
      pkgJsonPath = join(dirname(indexPath), '..', 'package.json');
    } catch {
      fatal('@ogcio/design-system-react is not installed. Run `pnpm install` first.');
    }
  }

  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
  const packageVersion = pkgJson.version ?? 'unknown';
  const distRoot = join(dirname(pkgJsonPath), 'dist');

  console.log(`  ✓ Found @ogcio/design-system-react@${packageVersion}`);
  console.log(`  ✓ Scanning ${distRoot}\n`);

  const result = scanPackage(distRoot);
  result.meta.packageVersion = packageVersion;

  mkdirSync(DATA_DIR, { recursive: true });

  writeFileSync(join(DATA_DIR, 'tokenUsage.json'), JSON.stringify(result, null, 2), 'utf8');

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

  console.log(`\n✅ Token usage scan complete in ${elapsed}s`);
  console.log(`   → ${result.meta.componentsAnalyzed} components analyzed`);
  console.log(`   → ${result.meta.tokensReferenced} unique tokens referenced`);
  console.log(`   → src/data/tokenUsage.json written`);
}

run();
