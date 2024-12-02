import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// Import devtools from 'solid-devtools/vite';
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
  // optimizeDeps: {
  //   esbuildOptions: {
  //     alias: {
  //       '@shadowrz/hanekokoro-ui/styled-system/*': path.resolve(
  //         import.meta.dirname,
  //         'styled-system'
  //       ),
  //     },
  //   },
  // },
  plugins: [
    /*
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    icons({ compiler: 'solid' }),
    tsconfigPaths({ root: './' }),
  ],
  server: {
    port: 4000,
  },
  build: {
    target: 'es2022',
  },
});
