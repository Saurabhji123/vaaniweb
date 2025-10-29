import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export const runtime = 'nodejs';

/**
 * Dynamic slug-based page serving
 * Handles URLs like: vaaniweb.com/united-university
 * Falls back to UUID if slug not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    console.log('📄 Fetching page for slug:', slug);

    const client = await clientPromise;
    const db = client.db('vaaniweb');
    
    // Try to find page by slug first
    let page = await db.collection('pages').findOne({ slug });
    
    // Fallback: Try to find by UUID (for backward compatibility)
    if (!page) {
      console.log('🔄 Slug not found, trying as UUID...');
      page = await db.collection('pages').findOne({ _id: slug as any });
    }

    if (!page) {
      console.error('❌ Page not found for slug:', slug);
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Page Not Found - VaaniWeb</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gradient-to-br from-purple-500 via-pink-500 to-red-400 min-h-screen flex items-center justify-center">
          <div class="text-center bg-white/20 backdrop-blur-md rounded-2xl p-12 max-w-md">
            <h1 class="text-6xl font-bold text-white mb-4">404</h1>
            <p class="text-2xl text-white mb-6">Page Not Found</p>
            <p class="text-white mb-8">The page "${slug}" does not exist.</p>
            <a href="/" class="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition shadow-xl">
              Go to Homepage
            </a>
          </div>
        </body>
        </html>`,
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    console.log('✅ Page found, serving HTML');
    
    // CRITICAL FIX: Inject slug into HTML for form submissions
    let html = page.html || '';
    
    // Check if slug is already embedded
    if (!html.includes('name="websiteSlug"')) {
      console.log('📝 Injecting slug into HTML form for:', slug);
      
      // Find all forms with submitContactForm and inject hidden input
      const formPattern = /<form([^>]*onsubmit="submitContactForm\(event\)"[^>]*)>/g;
      const forms = html.match(formPattern);
      
      if (forms && forms.length > 0) {
        console.log(`📋 Found ${forms.length} form(s) to inject slug`);
        
        // Inject slug right after form opening tag
        html = html.replace(
          formPattern,
          `<form$1><input type="hidden" name="websiteSlug" value="${page.slug || slug}">`
        );
        
        console.log('✅ Slug injected successfully');
      } else {
        console.log('⚠️ No forms found in HTML');
      }
    } else {
      console.log('✅ Slug already present in HTML');
    }
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching page:', error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Error - VaaniWeb</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gradient-to-br from-purple-500 via-pink-500 to-red-400 min-h-screen flex items-center justify-center">
        <div class="text-center bg-white/20 backdrop-blur-md rounded-2xl p-12 max-w-md">
          <h1 class="text-4xl font-bold text-white mb-4">Error Loading Page</h1>
          <p class="text-white mb-8">${error.message}</p>
          <a href="/" class="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition shadow-xl">
            Go to Homepage
          </a>
        </div>
      </body>
      </html>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}
