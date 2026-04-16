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
        'blog-luxury-3bhk': path.resolve(__dirname, 'blog-posts/luxury-3bhk-interior-design.html'),
        'blog-office-2026': path.resolve(__dirname, 'blog-posts/modern-office-design-trends-2026.html'),
        'blog-kitchen': path.resolve(__dirname, 'blog-posts/functional-kitchen-excellence.html'),
        'blog-bathroom': path.resolve(__dirname, 'blog-posts/bathroom-spa-transformation.html'),
        'blog-renovation': path.resolve(__dirname, 'blog-posts/homeowners-renovation-questions.html'),
        'blog-living-room': path.resolve(__dirname, 'blog-posts/living-room-entertaining.html'),
        'blog-2bhk': path.resolve(__dirname, 'blog-posts/small-space-2bhk.html'),
        'blog-kitchen-layouts': path.resolve(__dirname, 'blog-posts/kitchen-layouts-workflow.html'),
        'blog-office-future': path.resolve(__dirname, 'blog-posts/office-design-future-of-work.html'),
        'blog-sustainable': path.resolve(__dirname, 'blog-posts/sustainable-materials.html'),
      },
    },
  },
})
