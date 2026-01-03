
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // استخدام base النسبي لضمان عمل الموقع سواء كان في المجلد الرئيسي أو فرعي على GitHub
  base: './',
  build: {
    outDir: 'dist',
  }
});
