import { GeneratedPageData } from '../../types';
import { generateContactFormScript } from '../form-generator';

function getDescriptions(pics: string[], picDescriptions?: string[]) {
  if (picDescriptions && picDescriptions.length === pics.length) return picDescriptions;
  return pics.map((_, i) => picDescriptions?.[i] || `Event image ${i + 1}`);
}

function countdownScript(fallbackDays = 7) {
  const target = new Date(Date.now() + fallbackDays * 24 * 60 * 60 * 1000);
  return `
  (function(){
    const el = document.getElementById('countdown');
    if(!el) return;
    const t = el.getAttribute('data-deadline');
    const target = t ? new Date(t) : new Date(${target.getFullYear()}, ${target.getMonth()}, ${target.getDate()}, 18, 0, 0);
    function update(){
      const now = new Date();
      let diff = target.getTime() - now.getTime();
      if (diff < 0) diff = 0;
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      const s = Math.floor((diff%60000)/1000);
      el.textContent = d + "d " + h + "h " + m + "m " + s + "s";
    }
    update();
    setInterval(update, 1000);
  })();
  `;
}

// 1) Neon Night (youthful, high-energy)
export function generateEventNeonLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;
  const descriptions = getDescriptions(pics, picDescriptions);
  const features = sections?.features || [];
  const services = sections?.services || [];
  const testimonials = sections?.testimonials || [];
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>body{-webkit-font-smoothing:antialiased}.glow{text-shadow:0 0 8px rgba(255,255,255,.5),0 0 16px rgba(99,102,241,.35)} .glass{backdrop-filter: blur(10px); background: rgba(255,255,255,0.08)}</style></head><body class="bg-black text-white">
  <header class="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,.5),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,.5),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,.5),transparent_40%)]"></div>
    <div class="relative z-10 text-center px-6 py-16">
      <h1 class="text-5xl sm:text-7xl font-extrabold glow">${title}</h1>
      <p class="mt-4 text-xl sm:text-2xl text-${theme_color}-200 max-w-3xl mx-auto">${tagline}</p>
      <div id="countdown" class="mt-6 inline-block px-5 py-2 rounded-full glass border border-white/20" data-deadline="">
        Loading countdown...
      </div>
    </div>
    <div class="absolute inset-0 -z-10 opacity-20">${pics[0] ? `<img src="${pics[0]}" alt="${descriptions[0]}" class="w-full h-full object-cover" onerror="this.style.display='none'">` : ''}</div>
  </header>

  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <h2 class="text-3xl sm:text-4xl font-bold mb-4">Highlights</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${features.slice(0,9).map((f,i)=>`<div class="glass rounded-2xl p-5 border border-white/10">
        <div class="text-2xl mb-2">${['🎵','🎤','🎭','🎮','🎨','🏆','🔥','🎧','📸'][i%9]}</div>
        <p class="text-white/90">${f}</p>
      </div>`).join('')}
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <h3 class="text-2xl font-bold mb-3">Gallery</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          ${pics.slice(1).map((u,i)=>`<div class="overflow-hidden rounded-xl border border-white/10"><img src="${u}" alt="${descriptions[i+1]}" class="w-full h-44 object-cover hover:scale-110 transition" loading="lazy" onerror="this.src='https://picsum.photos/600/400?random=${i+1}'"></div>`).join('')}
        </div>
      </div>
      <aside class="lg:col-span-1">
        <h3 class="text-2xl font-bold mb-3">Schedule</h3>
        <ul class="space-y-3">
          ${services.slice(0,6).map((s,i)=>`<li class="glass rounded-xl p-4 border border-white/10"><div class="text-sm text-${theme_color}-200">${(15+i)}:00</div><div class="font-semibold">${s.title}</div><div class="text-white/80 text-sm">${s.description}</div></li>`).join('')}
        </ul>
      </aside>
    </div>
  </section>

  <section class="max-w-2xl mx-auto px-4 sm:px-6 py-10">
    <form class="glass border border-white/10 p-6 rounded-2xl" onsubmit="submitContactForm(event)">
      <input type="hidden" name="websiteSlug" value="${websiteSlug}">
      <h3 class="text-2xl font-bold mb-4">Register / RSVP</h3>
      ${contact_fields.map(f=>`<div class="mb-3"><label class="block text-sm mb-1 text-white/80">${f}</label><input type="${f.toLowerCase().includes('email')?'email':f.toLowerCase().includes('phone')?'tel':'text'}" required class="w-full px-3 py-2 rounded-md bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-${theme_color}-400"></div>`).join('')}
      <button type="submit" class="w-full py-3 rounded-lg bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Get Pass</button>
    </form>
  </section>

  <footer class="border-t border-white/10 text-center py-6 text-white/80">
    © 2025 ${title}. All rights reserved. | Made with <span class="text-red-400">❤</span> by <a href="https://vaaniweb.com" class="text-${theme_color}-300" target="_blank" rel="noopener">VaaniWeb</a>
  </footer>

  <script>${countdownScript(7)}</script>
</body></html>`;
}

// 2) Elegant Summit (speakers + agenda)
export function generateEventElegantLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;
  const descriptions = getDescriptions(pics, picDescriptions);
  const features = sections?.features || [];
  const services = sections?.services || [];
  const testimonials = sections?.testimonials || [];
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}</head><body class="bg-white text-gray-900">
  <header class="bg-gradient-to-b from-${theme_color}-50 to-white border-b border-${theme_color}-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-${theme_color}-900">${title}</h1>
      <p class="mt-4 text-lg sm:text-2xl text-${theme_color}-700">${tagline}</p>
      <div id="countdown" class="mt-5 inline-flex items-center px-4 py-2 rounded-full border border-${theme_color}-200 text-${theme_color}-800" data-deadline="">Countdown loading…</div>
    </div>
  </header>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    <h2 class="text-3xl sm:text-4xl font-bold mb-6">Speakers</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${pics.slice(0,6).map((u,i)=>`<div class="rounded-2xl border border-${theme_color}-100 p-5 shadow-sm">
        <img src="${u}" alt="${descriptions[i]}" class="w-full h-56 object-cover rounded-xl mb-3" loading="lazy" onerror="this.src='https://picsum.photos/600/400?random=${i}'">
        <div class="font-semibold text-gray-900">${descriptions[i] || 'Keynote ' + (i+1)}</div>
        <div class="text-sm text-gray-500">${['Founder','Professor','Designer','Engineer','Artist','Coach'][i%6]}</div>
      </div>`).join('')}
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
    <h2 class="text-3xl sm:text-4xl font-bold mb-6">Agenda</h2>
    <div class="space-y-3">
      ${services.slice(0,7).map((s,i)=>`<div class="flex items-start gap-4 p-4 rounded-xl border border-gray-200">
        <div class="flex-none w-20 text-${theme_color}-700 font-semibold">${(10+i)}:00</div>
        <div>
          <div class="font-semibold">${s.title}</div>
          <div class="text-gray-600 text-sm">${s.description}</div>
        </div>
      </div>`).join('')}
    </div>
  </section>

  <section class="max-w-2xl mx-auto px-4 sm:px-6 py-10">
    <form class="bg-white border border-${theme_color}-200 p-6 rounded-2xl shadow-sm" onsubmit="submitContactForm(event)">
      <input type="hidden" name="websiteSlug" value="${websiteSlug}">
      <h3 class="text-2xl font-bold mb-4">Get Tickets</h3>
      ${contact_fields.map(f=>`<div class="mb-3"><label class="block text-sm font-medium mb-1 text-gray-700">${f}</label><input type="${f.toLowerCase().includes('email')?'email':f.toLowerCase().includes('phone')?'tel':'text'}" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${theme_color}-400"></div>`).join('')}
      <button type="submit" class="w-full py-3 rounded-lg bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Book Now</button>
    </form>
  </section>

  <footer class="bg-${theme_color}-50 border-t border-${theme_color}-100 text-center py-6">
    <p class="text-${theme_color}-900">© 2025 ${title}. All rights reserved. | Made with <span class="text-red-500">❤</span> by <a href="https://vaaniweb.com" class="font-semibold text-${theme_color}-800" target="_blank" rel="noopener">VaaniWeb</a></p>
  </footer>
  <script>${countdownScript(10)}</script>
</body></html>`;
}

// 3) Campus Carnival (multi-zone events)
export function generateEventCampusCarnivalLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;
  const descriptions = getDescriptions(pics, picDescriptions);
  const features = sections?.features || [];
  const services = sections?.services || [];
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  const zones = features.slice(0,6).map((f,i)=>({name: f.split(':')[0].slice(0,24) || `Zone ${i+1}`, icon: ['🎮','🎨','🎤','⚽','📷','🍔'][i%6]}));

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>.mesh{background: radial-gradient(ellipse at 20% 10%, rgba(79,70,229,.15), transparent 35%), radial-gradient(ellipse at 80% 0%, rgba(236,72,153,.15), transparent 35%), radial-gradient(ellipse at 50% 100%, rgba(16,185,129,.15), transparent 35%)}</style></head><body class="bg-white text-gray-900">
  <header class="mesh">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-${theme_color}-900">${title}</h1>
      <p class="mt-3 text-lg sm:text-2xl text-gray-700">${tagline}</p>
      <div id="countdown" class="mt-5 inline-flex items-center px-4 py-2 rounded-full border border-${theme_color}-200 text-${theme_color}-800" data-deadline="">Starts in…</div>
    </div>
  </header>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <h2 class="text-3xl font-bold mb-4">Zones</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      ${zones.map((z,i)=>`<div class="rounded-2xl border border-${theme_color}-200 p-5 bg-${theme_color}-50">
        <div class="text-3xl mb-2">${z.icon}</div>
        <div class="font-semibold">${z.name}</div>
        <div class="text-sm text-gray-600">Fun activities and competitions</div>
      </div>`).join('')}
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
    <h2 class="text-3xl font-bold mb-4">Highlights</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      ${pics.slice(0,8).map((u,i)=>`<div class="overflow-hidden rounded-xl border border-gray-200"><img src="${u}" alt="${descriptions[i]}" class="w-full h-44 object-cover hover:scale-110 transition" loading="lazy" onerror="this.src='https://picsum.photos/600/400?random=${i}'"></div>`).join('')}
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <h2 class="text-3xl font-bold mb-4">Schedule</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${services.slice(0,8).map((s,i)=>`<div class="rounded-2xl border border-gray-200 p-5">
        <div class="text-${theme_color}-700 font-semibold">Day ${Math.floor(i/4)+1} • ${(12+(i%4)*2)}:00</div>
        <div class="font-semibold">${s.title}</div>
        <div class="text-gray-600 text-sm">${s.description}</div>
      </div>`).join('')}
    </div>
  </section>

  <section class="max-w-2xl mx-auto px-4 sm:px-6 py-10">
    <form class="bg-white border border-${theme_color}-200 p-6 rounded-2xl shadow-sm" onsubmit="submitContactForm(event)">
      <input type="hidden" name="websiteSlug" value="${websiteSlug}">
      <h3 class="text-2xl font-bold mb-4">Volunteer / Register</h3>
      ${contact_fields.map(f=>`<div class="mb-3"><label class="block text-sm font-medium mb-1 text-gray-700">${f}</label><input type="${f.toLowerCase().includes('email')?'email':f.toLowerCase().includes('phone')?'tel':'text'}" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${theme_color}-400"></div>`).join('')}
      <button type="submit" class="w-full py-3 rounded-lg bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Submit</button>
    </form>
  </section>

  <footer class="bg-${theme_color}-50 border-t border-${theme_color}-100 text-center py-6">
    <p class="text-${theme_color}-900">© 2025 ${title}. All rights reserved. | Made with <span class="text-red-500">❤</span> by <a href="https://vaaniweb.com" class="font-semibold text-${theme_color}-800" target="_blank" rel="noopener">VaaniWeb</a></p>
  </footer>
  <script>${countdownScript(5)}</script>
</body></html>`;
}
