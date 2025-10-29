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
    
    // Inject centralized form script first (if not already present)
    if (!html.includes('function submitContactForm')) {
      console.log('⚠️ Old template detected, injecting new form script');
      
      const modernFormScript = `<script>
async function submitContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  const btnText = btn.textContent;
  
  btn.disabled = true;
  btn.textContent = '⏳ Sending...';
  btn.classList.add('opacity-75');
  
  const formData = {};
  const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
  inputs.forEach(input => {
    const fieldName = input.labels && input.labels[0] ? input.labels[0].textContent : (input.name || input.id || 'Field');
    formData[fieldName] = input.value;
  });
  
  const slugInput = form.querySelector('input[name="websiteSlug"]');
  const slug = slugInput ? slugInput.value : window.location.pathname.split('/').filter(Boolean).pop();
  
  console.log('🔍 Submitting:', { slug, formData });
  
  try {
    const res = await fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteSlug: slug, formData })
    });
    
    const data = await res.json();
    console.log('📨 Response:', data);
    
    if (res.ok) {
      form.reset();
      alert('✅ Success! Your message has been sent!');
    } else {
      alert('❌ ' + (data.error || data.message || 'Failed to send'));
    }
  } catch (err) {
    console.error('� Error:', err);
    alert('❌ Network error. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = btnText;
    btn.classList.remove('opacity-75');
  }
}
</script>`;
      
      // Inject before </head>
      html = html.replace('</head>', modernFormScript + '</head>');
    }
    
    // Inject hidden input with slug if not present
    if (!html.includes('name="websiteSlug"')) {
      console.log('📝 Injecting slug into HTML form:', page.slug || slug);
      
      // Find all forms with submitContactForm and inject hidden input
      const formPattern = /<form([^>]*onsubmit="submitContactForm\(event\)"[^>]*)>/gi;
      html = html.replace(formPattern, (match: string) => {
        return `${match}<input type="hidden" name="websiteSlug" value="${page.slug || slug}">`;
      });
      
      console.log('✅ Slug injected successfully');
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
