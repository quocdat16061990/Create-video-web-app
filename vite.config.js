import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Vite Configuration
 * Optimized for production builds with minification
 */
export default defineConfig({
  // Base public path
  base: './',
  
  // Build configuration
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for production (optional, set to false for smaller builds)
    sourcemap: false,
    
    // Minification (terser is built-in, or use 'esbuild' for faster builds)
    minify: 'esbuild', // Faster, or use 'terser' for more aggressive minification
    
    // Note: For terser options, you can use rollup-plugin-terser if needed
    // For now, using esbuild which is faster and built-in
    
    // CSS minification
    cssMinify: true,
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Rollup options
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // File naming
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          // Split vendor utilities
          if (id.includes('utils')) {
            return 'vendor-utils';
          }
          // Split API services
          if (id.includes('api')) {
            return 'vendor-api';
          }
          // Split modules
          if (id.includes('modules')) {
            return 'vendor-modules';
          }
          // Split config
          if (id.includes('config')) {
            return 'vendor-config';
          }
        }
      }
    },
    
    // Target browsers
    target: 'es2015',
    
    // Assets include
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
  },
  
  // Server configuration for dev
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      // Proxy Vertex AI (video) to avoid CORS in dev
      '/vertex': {
        target: 'https://us-central1-aiplatform.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vertex/, ''),
      },
    }
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    open: true
  },
  
  // CSS configuration
  css: {
    devSourcemap: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: []
  }
});

