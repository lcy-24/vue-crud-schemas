import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 部署在子路径下，使用相对路径
  base: './',
  build: {
    // 构建产物直接输出到仓库根目录的 docs/，用于 GitHub Pages
    outDir: '../docs',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // 直接引用本地库源码，playground 实时反映库的最新实现
      'vue-crud-schemas': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
})
