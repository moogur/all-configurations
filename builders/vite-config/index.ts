import { readFileSync } from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import viteImagemin from 'vite-plugin-imagemin';
import { ProxyOptions, UserConfig } from 'vite';

const currentDirname = process.env['PWD'];
const tsconfig = JSON.parse(readFileSync(path.resolve(currentDirname, 'tsconfig.json'), 'utf8'));

const alias = Object.entries(tsconfig.compilerOptions.paths ?? {}).reduce<Array<{ replacement: string; find: string }>>(
  (accumulator, [key, value]) => {
    const preparedKey = key.split('/')[0] ?? '';
    const preparedValue = value[0] ?? '';
    const preparedPath = path.resolve(currentDirname, preparedValue.replace(/(\*|index.ts)?$/, ''));

    if (accumulator.every((item) => item.replacement !== preparedPath)) {
      accumulator.push({ find: preparedKey, replacement: preparedPath });
    }

    return accumulator;
  },
  [{ find: '@fonts', replacement: path.resolve(currentDirname, 'assets/fonts') }],
);

const build = {
  outDir: './dist',
  sourcemap: false,
  rollupOptions: {
    output: {
      manualChunks: (filePath: string) => {
        if (/node_modules/.test(filePath)) {
          const libraryName = filePath.split('node_modules/')[1]?.split('/')[0]?.replace('@', '');
          if (libraryName === 'vue' || libraryName === 'vue-router') return `lib.vue`;

          return 'lib.other';
        }

        return 'app';
      },
      assetFileNames: ({ name }: { name?: string }) => {
        switch (true) {
          case /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name ?? ''): {
            return `images/[name].[hash][extname]`;
          }

          case /\.css$/i.test(name ?? ''): {
            return `styles/[name].[hash][extname]`;
          }

          case /\.(ttf|otf|woff|woff2)$/i.test(name ?? ''): {
            return `fonts/[name][extname]`;
          }

          default: {
            return `assets/[name].[hash][extname]`;
          }
        }
      },
      chunkFileNames: 'js/[name].[hash].js',
      entryFileNames: 'js/[name].[hash].js',
    },
  },
};

const css = {
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@shared/styles/variables/scss.scss";@import "@shared/styles/mixins/index.scss";`,
    },
  },
};

export function getConfig({ mode, proxy }: { mode: string; proxy: Record<string, string | ProxyOptions> }): UserConfig {
  switch (mode) {
    case 'analyze': {
      return {
        root: currentDirname,
        css,
        plugins: [
          vue(),
          createHtmlPlugin({ template: './public/index-dev.html' }),
          visualizer({
            template: 'treemap', // treemap, sunburst, network
            title: 'Visualize packages size',
            open: true,
            gzipSize: true,
            brotliSize: true,
            filename: './node_modules/.cache/visualizer/stats.html',
          }),
        ],
        build,
        resolve: { alias },
      };
    }

    case 'production': {
      return {
        root: currentDirname,
        css,
        plugins: [
          vue(),
          viteImagemin({
            gifsicle: {
              optimizationLevel: 7,
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 7,
            },
            mozjpeg: {
              quality: 20,
            },
            pngquant: {
              quality: [0.8, 0.9],
              speed: 4,
            },
            svgo: {
              plugins: [
                {
                  name: 'removeViewBox',
                },
                {
                  name: 'removeEmptyAttrs',
                  active: false,
                },
              ],
            },
          }),
          createHtmlPlugin({
            minify: true,
            entry: '/src/main.ts',
            template: './public/index.html',
            inject: {
              data: {
                lang: 'en',
                title: 'Admin panel',
                favicon: '/vite.svg',
                faviconType: 'image/svg+xml',
              },
            },
          }),
          viteCompression({
            algorithm: 'gzip',
            ext: '.gz',
            filter: /\.(js|json|css|html|svg)$/i,
            deleteOriginFile: false,
            threshold: 512,
            compressionOptions: {
              params: {
                [zlib.constants.GZIP]: 9,
              },
            },
          }),
          viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
            filter: /\.(js|json|css|html|svg)$/i,
            deleteOriginFile: false,
            threshold: 512,
            compressionOptions: {
              params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
              },
            },
          }),
        ],
        build,
        preview: { port: 3001 },
        resolve: { alias },
      };
    }

    default: {
      return {
        root: currentDirname,
        css,
        plugins: [vue(), createHtmlPlugin({ template: '/index-dev.html' })],
        build: { sourcemap: true },
        server: {
          port: 3000,
          proxy,
        },
        resolve: { alias },
      };
    }
  }
}
