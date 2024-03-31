import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      name: 'AppInput',
      fileName: 'appInput',
    },
    rollupOptions: {
      output: {
        entryFileNames: 'appInput.js',
        manualChunks: undefined,
      },
    },
  },
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  }
})
