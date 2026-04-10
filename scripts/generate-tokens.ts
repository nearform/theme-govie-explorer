import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { categorize } from '@/lib/pipeline/categorize';
import { parseCss } from '@/lib/pipeline/parseCss';
import {
  validateCssStructure,
  validatePackageAvailable,
  validateTokenCount,
} from '@/lib/pipeline/validate';
import { computeContrastPairs } from '@/lib/pipeline/wcag';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');

function fatal(message: string): never {
  console.error(`\n❌ PIPELINE FAILED: ${message}\n`);
  process.exit(1);
}

function run(): void {
  const startTime = performance.now();

  console.log('🔧 Token generation pipeline starting...\n');

  const pkgCheck = validatePackageAvailable();
  if (!pkgCheck.valid) {
    fatal(pkgCheck.error ?? '@ogcio/theme-govie is not available.');
  }
  console.log('  ✓ @ogcio/theme-govie package found');

  const require = createRequire(import.meta.url);
  const lightCssPath = require.resolve('@ogcio/theme-govie/light.css');
  const darkCssPath = require.resolve('@ogcio/theme-govie/dark.css');

  const lightCss = readFileSync(lightCssPath, 'utf8');
  const darkCss = readFileSync(darkCssPath, 'utf8');

  const structureCheck = validateCssStructure(lightCss, darkCss);
  if (!structureCheck.valid) {
    fatal(structureCheck.error ?? 'CSS structure is unrecognizable.');
  }
  console.log('  ✓ CSS structure validated');

  const rawTokens = parseCss();
  const tokens = categorize(rawTokens);
  console.log(`  ✓ Parsed ${tokens.length} tokens`);

  const countCheck = validateTokenCount(tokens.length);
  if (!countCheck.valid) {
    fatal(countCheck.error ?? 'Token count validation failed.');
  }
  if (countCheck.warning) {
    console.warn(`  ⚠ ${countCheck.warning}`);
  }

  const categoryBreakdown: Record<string, number> = {};
  for (const token of tokens) {
    categoryBreakdown[token.category] = (categoryBreakdown[token.category] ?? 0) + 1;
  }
  console.log('  ✓ Categories:', JSON.stringify(categoryBreakdown));

  const contrastPairMap = computeContrastPairs(tokens);

  let totalPairs = 0;
  for (const pairs of contrastPairMap.values()) {
    totalPairs += pairs.length;
  }
  console.log(
    `  ✓ Computed ${totalPairs} contrast pairs for ${contrastPairMap.size} color tokens`
  );

  mkdirSync(DATA_DIR, { recursive: true });

  writeFileSync(
    join(DATA_DIR, 'tokens.json'),
    JSON.stringify(tokens, null, 2),
    'utf8'
  );

  const contrastMatrixObj: Record<string, unknown> = {};
  for (const [name, pairs] of contrastPairMap) {
    contrastMatrixObj[name] = pairs;
  }
  writeFileSync(
    join(DATA_DIR, 'contrastMatrix.json'),
    JSON.stringify(contrastMatrixObj, null, 2),
    'utf8'
  );

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

  console.log(`\n✅ Pipeline complete in ${elapsed}s`);
  console.log(`   → src/data/tokens.json (${tokens.length} tokens)`);
  console.log(
    `   → src/data/contrastMatrix.json (${contrastPairMap.size} entries)`
  );
}

run();
