import { GeneratedPageData } from '../../types';
import { generateContactFormScript } from '../form-generator';

// Helper to safely get descriptions
function getDescriptions(pics: string[], picDescriptions?: string[]) {
  if (picDescriptions && picDescriptions.length === pics.length) return picDescriptions;
  return pics.map((_, i) => picDescriptions?.[i] || `Project image ${i + 1}`);
}

// 1) Showcase layout with filterable categories and hover captions
export function generatePortfolioShowcaseLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections, instagram } = data;
  const descriptions = getDescriptions(pics, picDescriptions);
  const about = sections?.about;
  const features = sections?.features || [];
  const testimonials = sections?.testimonials || [];
  const services = sections?.services || [];
  const faq = sections?.faq || [];
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  // Derive categories from services or fallback set
  const fallbackCats = ['Branding', 'Web', 'Mobile', 'Photography'];
  const categories = services.length > 0 ? services.map(s => s.title.split(' ')[0]) : fallbackCats;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.masonry{column-gap:1rem}.masonry>*{break-inside:avoid}@media(min-width:768px){.masonry{column-count:2;column-gap:1.25rem}}@media(min-width:1024px){.masonry{column-count:3;column-gap:1.5rem}}</style></head><body class="bg-white text-gray-900">
  <header class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-${theme_color}-50 via-white to-white"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight"><span class="bg-clip-text text-transparent bg-gradient-to-r from-${theme_color}-600 to-${theme_color}-800">${title}</span></h1>
      <p class="mt-4 text-lg sm:text-2xl text-gray-700 max-w-3xl">${tagline}</p>
    </div>
  </header>

  <section class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="flex flex-wrap items-center gap-3 sm:gap-4 py-4 sm:py-6 border-b border-gray-200">
      <button class="px-4 py-2 rounded-full bg-${theme_color}-600 text-white text-sm sm:text-base" data-filter="*">All</button>
      ${categories.map(cat => `<button class="px-4 py-2 rounded-full bg-gray-100 hover:bg-${theme_color}-100 text-gray-700 text-sm sm:text-base" data-filter="${cat.toLowerCase()}">${cat}</button>`).join('')}
    </div>
    <div id="grid" class="masonry py-6">
      ${pics.map((url, i) => {
        const cat = categories[i % categories.length]?.toLowerCase() || 'branding';
        const desc = descriptions[i] || title;
        return `<figure class="relative group mb-4 rounded-xl overflow-hidden shadow-lg border border-gray-100" data-category="${cat}">
          <img src="${url}" alt="${desc}" class="w-full object-cover" loading="lazy" onerror="this.src='https://picsum.photos/1200/800?random=${i}'">
          <figcaption class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end">
            <div class="p-4 text-white">
              <p class="text-sm uppercase tracking-widest text-${theme_color}-300">${cat}</p>
              <p class="text-base sm:text-lg font-semibold">${desc}</p>
            </div>
          </figcaption>
        </figure>`;
      }).join('')}
    </div>
  </section>

  ${about ? `<section class="max-w-5xl mx-auto px-4 sm:px-6 my-12">
    <div class="bg-${theme_color}-50 border border-${theme_color}-100 rounded-2xl p-6 sm:p-10">
      <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-${theme_color}-900">About</h2>
      <p class="text-gray-700 text-lg leading-relaxed">${about}</p>
    </div>
  </section>` : ''}

  ${features && features.length > 0 ? `<section class="max-w-7xl mx-auto px-4 sm:px-6 my-12">
    <h2 class="text-3xl sm:text-4xl font-bold mb-6">Capabilities</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      ${features.map((f, i) => `<div class="rounded-xl border border-gray-200 p-5 hover:border-${theme_color}-300 transition">
        <div class="text-${theme_color}-600 text-2xl mb-2">${['🎨','🧠','⚡','📈','🧩','🚀','🔒','🛠️','⏱️','🌟'][i % 10]}</div>
        <p class="font-medium text-gray-800">${f}</p>
      </div>`).join('')}
    </div>
  </section>` : ''}

  ${instagram ? `<section class="max-w-7xl mx-auto px-4 sm:px-6 my-12">
    <a class="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg" target="_blank" rel="noopener" href="https://instagram.com/${instagram}">
      <span class="mr-2">Follow @${instagram}</span> <span>→</span>
    </a>
  </section>` : ''}

  <section class="max-w-2xl mx-auto px-4 sm:px-6 my-12">
    <form class="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-lg" onsubmit="submitContactForm(event)">
      <input type="hidden" name="websiteSlug" value="${websiteSlug}">
      <h2 class="text-2xl sm:text-3xl font-bold mb-6">Let’s work together</h2>
      ${contact_fields.map(field => `<div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">${field}</label>
        <input type="${field.toLowerCase().includes('email') ? 'email' : field.toLowerCase().includes('phone') ? 'tel' : 'text'}" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${theme_color}-400">
      </div>`).join('')}
      <button type="submit" class="w-full py-3 rounded-lg bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Send</button>
    </form>
  </section>

  <footer class="mt-12 bg-gray-50 border-t border-gray-200 text-center py-6">
    <p class="text-gray-700">© 2025 ${title}. All rights reserved. | Made with <span class="text-red-500">❤</span> by <a href="https://vaaniweb.com" class="text-${theme_color}-700 font-semibold" target="_blank" rel="noopener">VaaniWeb</a></p>
  </footer>

  <script>
    // Simple filter logic
    const buttons = document.querySelectorAll('[data-filter]');
    const items = document.querySelectorAll('[data-category]');
    buttons.forEach(btn => btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter');
      buttons.forEach(b => b.classList.remove('bg-${theme_color}-600','text-white'));
      btn.classList.add('bg-${theme_color}-600','text-white');
      items.forEach(el => {
        const match = f === '*' || el.getAttribute('data-category') === f;
        el.classList.toggle('hidden', !match);
      });
    }));
  </script>
  </body></html>`;
}

// 2) Case study layout with alternating sections and metrics
export function generatePortfolioCaseStudyLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;
  const descriptions = getDescriptions(pics, picDescriptions);
  const about = sections?.about;
  const features = sections?.features || [];
  const testimonials = sections?.testimonials || [];
  const services = sections?.services || [];
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  const metrics = features.slice(0, 4).map((f, i) => ({
    label: f.split(':')[0].slice(0, 28) || `Metric ${i + 1}`,
    value: ['+120%','98%','24h','500+','A+','99.9%'][i % 6]
  }));

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}</head><body class="bg-white text-gray-900">
  <header class="bg-gradient-to-r from-${theme_color}-600 to-${theme_color}-700 text-white py-16 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <h1 class="text-4xl sm:text-6xl font-extrabold">${title}</h1>
      <p class="mt-4 text-lg sm:text-2xl opacity-90">${tagline}</p>
      ${metrics.length ? `<div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">${metrics.map(m => `<div class="bg-white/10 rounded-xl p-4 text-center"><div class="text-2xl sm:text-3xl font-extrabold">${m.value}</div><div class="text-xs sm:text-sm opacity-90">${m.label}</div></div>`).join('')}</div>` : ''}
    </div>
  </header>

  ${about ? `<section class="max-w-5xl mx-auto px-4 sm:px-6 -mt-8">
    <div class="bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-${theme_color}-100">
      <h2 class="text-2xl sm:text-3xl font-bold mb-4">Studio</h2>
      <p class="text-gray-700 text-lg leading-relaxed">${about}</p>
    </div>
  </section>` : ''}

  <section class="max-w-7xl mx-auto px-4 sm:px-6 my-12 space-y-10">
    ${pics.map((url, i) => {
      const reverse = i % 2 === 1;
      const desc = descriptions[i] || title;
      const service = services[i % (services.length || 1)];
      return `<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div class="${reverse ? 'lg:order-2' : ''}">
          <img src="${url}" alt="${desc}" class="w-full rounded-2xl shadow-lg border border-gray-200" loading="lazy" onerror="this.src='https://picsum.photos/1200/800?random=${i}'">
        </div>
        <div class="${reverse ? 'lg:order-1' : ''}">
          <h3 class="text-2xl sm:text-3xl font-bold mb-2">${service?.title || 'Case Study ' + (i + 1)}</h3>
          <p class="text-gray-600 mb-3">${service?.description || desc}</p>
          <ul class="list-disc ml-5 text-gray-700 space-y-1">
            <li>Goal: ${features[(i) % (features.length || 1)] || 'Deliver outstanding results'}</li>
            <li>Approach: ${features[(i+1) % (features.length || 1)] || 'Human-centered, data-informed'}</li>
            <li>Outcome: ${features[(i+2) % (features.length || 1)] || 'Measurable impact and delight'}</li>
          </ul>
        </div>
      </div>`;
    }).join('')}
  </section>

  ${testimonials && testimonials.length ? `<section class="max-w-7xl mx-auto px-4 sm:px-6 my-12">
    <div class="bg-gradient-to-r from-${theme_color}-50 to-${theme_color}-100 rounded-2xl border border-${theme_color}-200 p-6 sm:p-10">
      <h2 class="text-2xl sm:text-3xl font-bold mb-6">Client Voices</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${testimonials.map(t => `<div class="bg-white rounded-xl p-6 border border-${theme_color}-100 shadow">
          <div class="text-yellow-400 mb-2">${'★'.repeat(t.rating || 5)}</div>
          <p class="text-gray-700 italic">"${t.quote}"</p>
          <p class="mt-3 font-semibold text-${theme_color}-800">${t.name}</p>
          <p class="text-sm text-gray-500">${t.role}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>` : ''}

  <section class="max-w-2xl mx-auto px-4 sm:px-6 my-12">
    <form class="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-lg" onsubmit="submitContactForm(event)">
      <input type="hidden" name="websiteSlug" value="${websiteSlug}">
      <h2 class="text-2xl sm:text-3xl font-bold mb-6">Start a project</h2>
      ${contact_fields.map(field => `<div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">${field}</label>
        <input type="${field.toLowerCase().includes('email') ? 'email' : field.toLowerCase().includes('phone') ? 'tel' : 'text'}" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${theme_color}-400">
      </div>`).join('')}
      <button type="submit" class="w-full py-3 rounded-lg bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Request Proposal</button>
    </form>
  </section>

  <footer class="mt-12 bg-gray-50 border-t border-gray-200 text-center py-6">
    <p class="text-gray-700">© 2025 ${title}. All rights reserved. | Made with <span class="text-red-500">❤</span> by <a href="https://vaaniweb.com" class="text-${theme_color}-700 font-semibold" target="_blank" rel="noopener">VaaniWeb</a></p>
  </footer>
  </body></html>`;
}

// 3) Minimal grid with sticky sidebar and tags
export function generatePortfolioMinimalMasonryLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;
  const descriptions = getDescriptions(pics, picDescriptions);
  const features = sections?.features || [];
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>.masonry{column-gap:1rem}.masonry>*{break-inside:avoid}@media(min-width:1024px){.masonry{column-count:2;column-gap:1.25rem}}</style></head><body class="bg-white text-gray-900">
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
    <aside class="lg:col-span-4 lg:sticky lg:top-8 self-start bg-gray-50 border border-gray-200 rounded-2xl p-6">
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${title}</h1>
      <p class="mt-3 text-gray-700">${tagline}</p>
      ${features.length ? `<div class="mt-4 flex flex-wrap gap-2">${features.slice(0,8).map(f => `<span class="px-3 py-1 rounded-full bg-${theme_color}-50 text-${theme_color}-700 border border-${theme_color}-200 text-sm">${f.split(':')[0].slice(0,24)}</span>`).join('')}</div>` : ''}
      <form class="mt-6" onsubmit="submitContactForm(event)">
        <input type="hidden" name="websiteSlug" value="${websiteSlug}">
        ${contact_fields.slice(0,3).map(field => `<div class="mb-3"><label class="block text-sm text-gray-700 mb-1">${field}</label><input type="${field.toLowerCase().includes('email') ? 'email' : field.toLowerCase().includes('phone') ? 'tel' : 'text'}" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${theme_color}-400"></div>`).join('')}
        <button type="submit" class="w-full py-2.5 rounded-md bg-${theme_color}-600 text-white font-semibold">Contact</button>
      </form>
    </aside>
    <section class="lg:col-span-8">
      <div class="masonry">
        ${pics.map((url, i) => `<figure class="mb-4 rounded-xl overflow-hidden border border-gray-200">
          <img src="${url}" alt="${descriptions[i] || title}" class="w-full object-cover" loading="lazy" onerror="this.src='https://picsum.photos/1200/900?random=${i}'">
          <figcaption class="p-3 text-sm text-gray-600">${descriptions[i] || title}</figcaption>
        </figure>`).join('')}
      </div>
    </section>
  </main>
  <footer class="bg-gray-50 border-t border-gray-200 text-center py-6">
    <p class="text-gray-700">© 2025 ${title}. All rights reserved. | Made with <span class="text-red-500">❤</span> by <a href="https://vaaniweb.com" class="text-${theme_color}-700 font-semibold" target="_blank" rel="noopener">VaaniWeb</a></p>
  </footer>
  </body></html>`;
}
