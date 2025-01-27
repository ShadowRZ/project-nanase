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
    // alias: [
    //   {
    //     find: '@hanekokoro-ui/styled-system',
    //     replacement: path.resolve(import.meta.dirname, 'styled-system'),
    //   },
    // ],
    alias: {
      '@hanekokoro-ui/styled-system': path.resolve(
        import.meta.dirname,
        'styled-system'
      ),
    },
  },
  optimizeDeps: {
    include: ['is-hotkey', 'lodash/debounce', 'lodash/throttle'],
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
        assetFileNames: ({ names }) =>
          names.includes('index.css')
            ? 'assets/project-nanase-[hash][extname]'
            : 'assets/[name]-[hash][extname]',
        entryFileNames: ({ name }) =>
          name === 'index'
            ? 'assets/project-nanase-[hash].js'
            : 'assets/[name]-[hash].js',
        chunkFileNames: ({ exports }) =>
          exports.includes('initRustCrypto')
            ? 'assets/project-nanase-rust-crypto-[hash].js'
            : 'assets/[name]-[hash].js',
      },
    },
  },
});
