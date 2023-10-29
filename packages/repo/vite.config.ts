import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts()
  ],
  resolve: {
    alias: {
      '@huajs-repo': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },

  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'huajsRepo',
      // the proper extensions will be added
      fileName: 'huajs-repo',
      formats: ["es", "cjs", "umd", "iife"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['pinia'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          pinia: 'pinia'
        },
      },
    },
  },
})