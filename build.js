import { build } from 'esbuild';
// import { minify } from 'terser';
import { watch } from 'fs/promises';

async function buildFile() {
    await build({
        entryPoints: ['src/index.ts'],
        bundle: true,
        minify: false,
        outfile: 'dist/bundle.js',
        sourcemap: true,
    });
    console.log(`Built dist/bundle.js`);
}

async function watchFile() {
    const watcher = watch('src/', { recursive: true });
    console.log(`Watching...`);

    for await (const change of watcher) {
        console.log(`Change detected: ${change.filename}`);
        await buildFile();
        // Debounce
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function main() {
    if (process.argv.includes('--watch')) {
        watchFile();
    } else {
        await buildFile();
    }
}

main();