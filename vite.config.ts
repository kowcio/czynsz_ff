import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { readFileSync } from 'fs'
// import { viteStaticCopy } from 'vite-plugin-static-copy'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8')) || ''
console.log(packageJson.version)
console.log(packageJson)
// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    manifest: 'manifest.json',
  },
  plugins: [
    vue(),
    vueDevTools(),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: 'manifest.json', // or wherever your manifest is
    //       dest: '.', // copies to the root of dist/
    //     },
    //   ],
    // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
