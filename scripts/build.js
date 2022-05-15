const { build } = require('esbuild')

build({
  entryPoints: {
    console: 'src/console/index.tsx',
    content: 'src/content/index.ts',
    background: 'src/background/index.ts',
  },
  outdir: './dist',
  bundle: true,
  sourcemap: 'external',
  platform: 'browser',
})
