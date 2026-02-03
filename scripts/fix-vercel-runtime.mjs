import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const functionsDir = '.vercel/output/functions';

function fixRuntime(dir) {
  if (!existsSync(dir)) {
    console.log('Functions directory not found:', dir);
    return;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory() && entry.name.endsWith('.func')) {
      const configPath = join(fullPath, '.vc-config.json');

      if (existsSync(configPath)) {
        try {
          const config = JSON.parse(readFileSync(configPath, 'utf-8'));

          if (config.runtime === 'nodejs18.x') {
            config.runtime = 'nodejs20.x';
            writeFileSync(configPath, JSON.stringify(config, null, 2));
            console.log('Fixed runtime in:', configPath);
          }
        } catch (e) {
          console.error('Error processing:', configPath, e.message);
        }
      }
    } else if (entry.isDirectory()) {
      fixRuntime(fullPath);
    }
  }
}

console.log('Fixing Vercel function runtimes to nodejs20.x...');
fixRuntime(functionsDir);
console.log('Done!');
