const esbuild = require('esbuild');

esbuild.context({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: false,
    outfile: 'dist/bundle.js',
    sourcemap: true,
}).then(ctx => {
    ctx.watch();
    console.log('watching...');
});