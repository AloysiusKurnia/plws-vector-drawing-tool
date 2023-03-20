const esbuild = require('esbuild');
const { minify } = require('terser');
const fs = require('fs').promises;

(async function () {
    await esbuild.build({
        entryPoints: ['src/index.ts'],
        bundle: true,
        minify: false,
        outfile: 'dist/bundle.js',
        sourcemap: true,
    });
    console.log(`Built dist/bundle.js`);
    const fileString = await fs.readFile('dist/bundle.js', 'utf8');
    const minifyResult = await minify(fileString, {
        mangle: {
            properties: {
                keep_quoted: true,
            },
        }
    });
    await fs.writeFile('dist/bundle.min.js', minifyResult.code);
    console.log(`Built dist/bundle.min.js`);
})();