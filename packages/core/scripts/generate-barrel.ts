import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, '../src');
const indexPath = path.join(srcDir, 'index.ts');

function collectExports(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const exports: string[] = [];

  for (const entry of entries) {
    if (entry.name === 'index.ts') continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(srcDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      exports.push(...collectExports(fullPath));
    } else if (entry.name.endsWith('.ts')) {
      const withoutExt = relativePath.replace(/\.ts$/, '');
      exports.push(`export * from './${withoutExt}';`);
    }
  }

  return exports;
}

const exports = collectExports(srcDir);
fs.writeFileSync(indexPath, exports.join('\n') + '\n');

console.log(`✅ Gerado index.ts com ${exports.length} exports.`);
