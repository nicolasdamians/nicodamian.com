// Lists every TODO(nico) left in the content. Exits 1 under STRICT_CONTENT=1 if any remain.
import { readdirSync, readFileSync } from 'node:fs';
const dir = new URL('../src/data/', import.meta.url);
let count = 0;
for (const file of readdirSync(dir)) {
  readFileSync(new URL(file, dir), 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const match = /todo\('([^']+)'\)/.exec(line);
      if (match) {
        count += 1;
        console.log(`src/data/${file}:${i + 1}  ${match[1]}`);
      }
    });
}
console.log(`${count} pending`);
if (count > 0 && process.env.STRICT_CONTENT === '1') process.exit(1);
