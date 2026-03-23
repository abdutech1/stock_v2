import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jemo Boutique Management',
    short_name: 'Jemo POS',
    description: 'Manage stock, sales, employees and reports',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc', 
    theme_color: '#0f172a',      
    icons: [
     {
        src: '/icon.png', 
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png', 
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}