import commonjsResolve from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { name, peerDependencies, version } from './package.json';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const moduleNames = Object.keys(peerDependencies);

  console.debug(`\nBuild "${name}-${version}" (${mode})\n`);

  return {
    plugins: [react(), dts({ include: ['src'], insertTypesEntry: true })],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      copyPublicDir: false,
      minify: isProd,
      lib: {
        entry: resolve(__dirname, 'src', 'index.ts'),
        name,
        formats: ['cjs', 'umd'],
        fileName: format =>
          `${format}/${name}.${mode}${isProd ? '.min' : ''}.js`,
      },
      rollupOptions: {
        external: moduleNames,
        output: {
          globals: { react: 'React' },
          exports: 'named',
        },
        plugins: [
          commonjsResolve(),
          nodeResolve({
            moduleDirectories: ['node_modules'],
            dedupe: moduleNames,
          }),
        ],
      },
      sourcemap: !isProd,
      emptyOutDir: false,
    },
  };
});
