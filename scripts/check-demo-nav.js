#!/usr/bin/env node
// check-demo-nav.js — Verifies demo page HTML contains expected navigation

import { readFileSync } from 'fs';

const DEMO_PAGE = './dist/demo/test-prototype/index.html';

let html;
try {
  html = readFileSync(DEMO_PAGE, 'utf8');
} catch {
  console.error(`FAIL: Cannot read ${DEMO_PAGE} — run 'npm run build' first`);
  process.exit(1);
}

const checks = [
  { test: html.includes('Demo Preview'), desc: 'Demo banner present' },
  { test: html.includes('cdn.tailwindcss.com'), desc: 'Tailwind CDN loaded' },
  { test: html.includes('PrototypeRenderer') || html.includes('Quaitrix'), desc: 'Content rendered' },
];

let passed = 0;
for (const { test, desc } of checks) {
  if (test) {
    console.log(`✓ ${desc}`);
    passed++;
  } else {
    console.error(`✗ ${desc} — NOT FOUND`);
  }
}

console.log(`\n${passed}/${checks.length} checks passed`);
process.exit(passed === checks.length ? 0 : 1);
