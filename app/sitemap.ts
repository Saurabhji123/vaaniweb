import type { MetadataRoute } from 'next'
import clientPromise from '@/app/lib/mongodb'

const rawBaseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'https://vaaniweb.com'
const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl

const staticPaths = ['/', '/about', '/services', '/pricing', '/feed', '/login', '/register']

function createEntry(url: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']): MetadataRoute.Sitemap[number] {
  return {
    url,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = []
  const seen = new Set<string>()

  const addUrl = (entry: MetadataRoute.Sitemap[number]) => {
    if (seen.has(entry.url)) {
      return
    }
    seen.add(entry.url)
    urls.push(entry)
  }

  staticPaths.forEach((path, index) => {
    const priority = index === 0 ? 1 : 0.7
    addUrl(createEntry(`${baseUrl}${path}`, priority, index === 0 ? 'daily' : 'weekly'))
  })

  try {
    const client = await clientPromise
    const db = client.db('vaaniweb')
    const documents = await db
      .collection('pages')
      .find(
        { slug: { $exists: true, $ne: '' } },
        { projection: { slug: 1, updatedAt: 1, createdAt: 1 } }
      )
      .limit(5000)
      .toArray()

    documents.forEach((page) => {
      const slug = typeof page.slug === 'string' ? page.slug.trim() : ''
      if (!slug) {
        return
      }

      const timestamp = page.updatedAt ?? page.createdAt ?? new Date()
      addUrl({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(timestamp),
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    })
  } catch (error) {
    console.error('[sitemap] Failed to build dynamic entries', error)
  }

  return urls
}
