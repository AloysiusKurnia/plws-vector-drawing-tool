const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: false,
    outfile: 'dist/bundle.js',
    sourcemap: true,
    
});