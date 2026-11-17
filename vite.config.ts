import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VueCrudSchemas',
      fileName: (format) =>
        format === 'es' ? 'vue-crud-schemas.js' : 'vue-crud-schemas.umd.cjs',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
        },
      },
    },
  },
})
