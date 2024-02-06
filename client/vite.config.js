import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/server': {
        target: 'http://15.165.95.65:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, ''), // 수정된 부분
      },
    },
  },
  plugins: [react(), eslint()],
  base: '/',
  build: {
    minify: false,
    commonjsOptions: {
      ignoreDynamicRequires: true, // 동적 require를 무시할지 여부
      transformMixedEsModules: true, // 혼합된 ES 모듈을 변환할지 여부
    },
    outDir: 'dist'
  }
})
