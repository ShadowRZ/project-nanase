import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';
import icons from 'unplugin-icons/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

export default defineConfig({
  appType: 'spa',
  base: '/project-nanase/',
  resolve: {
    alias: [
      {
        find: '@shadowrz/hanekokoro-ui/styled-system',
        replacement: path.resolve(import.meta.dirname, 'styled-system'),
      },
    ],
  },
  plugins: [
    solidPlugin(),
    icons({ compiler: 'solid' }),
    tsconfigPaths({ root: './' }),
    VitePWA({
      srcDir: 'src',
      filename: 'sw.ts',
      strategies: 'injectManifest',
      injectManifest: {
        minify: false,
        enableWorkboxModulesLogs: true,
        rollupFormat: 'iife',
        maximumFileSizeToCacheInBytes: 10_000_000,
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ],
  server: {
    port: 4000,
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes('matrix-js-sdk/lib/rust-crypto') ||
            id.includes('@matrix-org/matrix-sdk-crypto-wasm')
          )
            return 'project-nanase-rust-crypto';
          return 'project-nanase';
        },
      },
    },
  },
});
