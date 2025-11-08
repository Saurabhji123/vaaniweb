import type { MetadataRoute } from 'next'

const rawBaseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'https://vaaniweb.com'
const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl

const staticPaths: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}> = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/about', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/feed', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/login', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/register', priority: 0.3, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
