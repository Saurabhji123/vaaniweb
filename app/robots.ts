import type { MetadataRoute } from 'next'

const rawBaseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'https://vaaniweb.com'
const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl

const disallowPaths = ['/api/', '/p/', '/profile', '/settings', '/test-form', '/debug/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowPaths,
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  }
}
