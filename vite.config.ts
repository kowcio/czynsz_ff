import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { readFileSync } from 'fs'
// import { viteStaticCopy } from 'vite-plugin-static-copy'
import webExtension from 'vite-plugin-web-extension'
import copy from 'rollup-plugin-copy'
import { transformAssetUrls } from '@quasar/vite-plugin'
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8')) || ''
console.log(packageJson.version)
console.log(packageJson)
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: ['src/**/*.{vue,js}'],
      template: {
        transformAssetUrls,
        compilerOptions: {
          // isCustomElement: (tag) => tag.includes('ext-'),
        },
      },
    }),
    vueDevTools(),
    webExtension({ browser: 'firefox', printSummary: true }),
    copy({
      targets: [{ src: 'assets/*', dest: 'assets' }],
      hook: 'writeBundle',
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "quasar/dist/quasar.sass";',
      },
    },
  },
  base: './', //Base public path when served in development or production.

  build: {
    outDir: 'dist',
    minify: false,
    cssMinify: false,

    // manifest: 'manifest.json',
    assetsDir: 'js',
    // rollupOptions: {
    // input: {
    // popup: 'popup.html', // Entry for your popup UI
    // Add more entries as needed (e.g., options page)
    // },
    // Ensure all dependencies are bundled (not externalized)
    // external: [],
    // output: {
    // Prevent code splitting
    // manualChunks: undefined,
    // inlineDynamicImports: true,
    // },
    // },
    // lib: {
    //   entry: 'src/App.vue', // Entry point (can be a .js or .vue file)
    //   name: 'my-plugin', // Global name for UMD/IIFE
    //   formats: ['umd', 'es'],
    //   fileName: 'my-plugin', // Output file name
    // },

    // copy: [
    //   {
    //     src: 'src/assets',
    //     dest: 'dist/assets2',
    //   },
    // ],
  },

  resolve: {
    alias: {
      '@': './src',
    },
  },
})
