import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Builds resources/js into a single self-contained file (public/js/debugbar.js)
// that the PHP handler can inject into any page.
export default defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: {
        outDir: 'public/js',
        emptyOutDir: true,
        lib: {
            entry: 'resources/js/main.jsx',
            name: 'DiginetDebugbar',
            formats: ['iife'],
            fileName: () => 'debugbar.js',
        },
    },
});
