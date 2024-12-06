import commonjsResolve from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { name, peerDependencies, version } from './package.json';

const MODULES_MAP: Record<string, string> = {
  react: 'React',
};

const getGlobals = (modules: string[]) =>
  Object.fromEntries(modules.map(module => [module, MODULES_MAP[module]]));

const moduleNames = Object.keys(peerDependencies);
const outDir = 'dist';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  console.debug(`\nBuild "${name}-${version}" (${mode})\n`);

  return {
    plugins: [
      react(),
      dts({
        tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
        include: path.resolve(__dirname, 'src'),
        insertTypesEntry: true,
        outDir: path.resolve(__dirname, outDir, 'types'),
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir,
      copyPublicDir: false,
      minify: isProd,
      lib: {
        entry: path.resolve(__dirname, 'src', 'index.ts'),
        name,
        formats: ['cjs', 'umd'],
        fileName: format =>
          `${format}/${name}.${mode}${isProd ? '.min' : ''}.js`,
      },
      rollupOptions: {
        external: moduleNames,
        output: {
          globals: {
            ...getGlobals(moduleNames),
          },
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
