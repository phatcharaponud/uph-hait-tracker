#!/usr/bin/env node
/**
 * Validates src/data/items.ts against docs/HAIT_structure.md (TMI reference).
 *
 * NOTE: as of v1.1 the app's checklist follows the Excel action plan, which
 * uses a different numbering scheme (e.g. 1.1, 1.2) than the TMI reference
 * structure (1.1.1, 1.1.2). This script is kept for manual coverage checks
 * against the TMI doc and is NOT run in CI.
 *
 * Fails (exit 1) when:
 *   - an item ID in the code is not in the doc
 *   - an item ID in the doc has no row in the code
 *   - catId disagrees with the ID prefix
 *
 * Run: `npm run validate:checklist`
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const MD_PATH = resolve(ROOT, 'docs/HAIT_structure.md');
const ITEMS_PATH = resolve(ROOT, 'src/data/items.ts');

function extractExpectedIds(md) {
  const lines = md.split('\n');
  const bulletIds = new Set();
  const headingIds = new Set();

  for (const line of lines) {
    const bullet = line.match(/^\s*-\s+(\d+(?:\.\d+)+)(?:[\s.:)]|$)/);
    if (bullet) bulletIds.add(bullet[1]);

    const heading = line.match(/^#{2,4}\s+(?:หมวดที่\s+\d+|)[^\n]*?(\d+(?:\.\d+)+)\s/);
    // Prefer a dedicated pattern for sub-section headings like "### 3.3 ..."
    const subHeading = line.match(/^#{3,4}\s+(\d+(?:\.\d+)+)\s/);
    if (subHeading) headingIds.add(subHeading[1]);
    else if (heading && !/หมวดที่/.test(line)) headingIds.add(heading[1]);
  }

  // A heading is only a leaf item if no bullet ID extends it.
  const expected = new Set(bulletIds);
  for (const h of headingIds) {
    const hasChildBullet = [...bulletIds].some((b) => b.startsWith(`${h}.`));
    if (!hasChildBullet) expected.add(h);
  }

  // Also remove headings that are only parents (covered by bullets).
  for (const h of headingIds) {
    const hasChildBullet = [...bulletIds].some((b) => b.startsWith(`${h}.`));
    if (hasChildBullet) expected.delete(h);
  }

  return expected;
}

function extractItemsTs(ts) {
  const items = [];
  const regex = /\{\s*id:\s*['"]([^'"]+)['"]\s*,\s*catId:\s*(\d+)/g;
  let m;
  while ((m = regex.exec(ts)) !== null) {
    items.push({ id: m[1], catId: Number(m[2]) });
  }
  return items;
}

function main() {
  const md = readFileSync(MD_PATH, 'utf8');
  const ts = readFileSync(ITEMS_PATH, 'utf8');

  const expected = extractExpectedIds(md);
  const actual = extractItemsTs(ts);
  const actualIds = new Set(actual.map((i) => i.id));

  const missing = [...expected].filter((id) => !actualIds.has(id)).sort();
  const extra = [...actualIds].filter((id) => !expected.has(id)).sort();

  const catMismatch = actual.filter((i) => {
    const expectedCat = Number(i.id.split('.')[0]);
    return i.catId !== expectedCat;
  });

  const problems = [];
  if (missing.length) problems.push(`Missing from items.ts (${missing.length}): ${missing.join(', ')}`);
  if (extra.length) problems.push(`Not in HAIT_structure.md (${extra.length}): ${extra.join(', ')}`);
  if (catMismatch.length) {
    problems.push(
      `catId mismatch (${catMismatch.length}): ${catMismatch
        .map((i) => `${i.id}→catId=${i.catId}`)
        .join(', ')}`
    );
  }

  console.log(`Expected items in doc: ${expected.size}`);
  console.log(`Items in code:         ${actualIds.size}`);

  if (problems.length) {
    console.error('\nChecklist validation failed:');
    for (const p of problems) console.error('  - ' + p);
    process.exit(1);
  }

  console.log('OK — items.ts matches HAIT_structure.md');
}

main();
