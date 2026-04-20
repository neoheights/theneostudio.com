import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about.html'),
        blog: path.resolve(__dirname, 'blog.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        projects: path.resolve(__dirname, 'projects.html'),
        retail: path.resolve(__dirname, 'retail.html'),
        services: path.resolve(__dirname, 'services.html'),
        workspaces: path.resolve(__dirname, 'workspaces.html'),
        'blog-posts/luxury-3bhk-interior-design': path.resolve(__dirname, 'blog-posts/luxury-3bhk-interior-design.html'),
        'blog-posts/modern-office-design-trends-2026': path.resolve(__dirname, 'blog-posts/modern-office-design-trends-2026.html'),
        'blog-posts/functional-kitchen-excellence': path.resolve(__dirname, 'blog-posts/functional-kitchen-excellence.html'),
        'blog-posts/bathroom-spa-transformation': path.resolve(__dirname, 'blog-posts/bathroom-spa-transformation.html'),
        'blog-posts/homeowners-renovation-questions': path.resolve(__dirname, 'blog-posts/homeowners-renovation-questions.html'),
        'blog-posts/living-room-entertaining': path.resolve(__dirname, 'blog-posts/living-room-entertaining.html'),
        'blog-posts/small-space-2bhk': path.resolve(__dirname, 'blog-posts/small-space-2bhk.html'),
        'blog-posts/kitchen-layouts-workflow': path.resolve(__dirname, 'blog-posts/kitchen-layouts-workflow.html'),
        'blog-posts/office-design-future-of-work': path.resolve(__dirname, 'blog-posts/office-design-future-of-work.html'),
        'blog-posts/sustainable-materials': path.resolve(__dirname, 'blog-posts/sustainable-materials.html'),
      },
    },
  },
})
