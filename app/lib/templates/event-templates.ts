import { GeneratedPageData } from '../../types';
import { generateContactFormScript } from '../form-generator';

type Metric = { label: string; value: string };
type Testimonial = { name: string; role: string; quote: string; rating?: number };
type PassTier = { name: string; perks: string[] };
type SectionsRecord = Record<string, unknown> | undefined;

function asArray<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? (value as T[]) : undefined;
}

function sanitizeThemeColor(raw?: string): string {
  if (!raw) return 'indigo';
  const cleaned = raw.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
  return cleaned || 'indigo';
}

function normalizeFeatureList(value: unknown, fallback: string[]): string[] {
  const list = asArray<unknown>(value);
  if (!list) return fallback;

  const normalized = list
    .map((item) => {
      if (!item) return undefined;
      if (typeof item === 'string') {
        const trimmed = item.trim();
        return trimmed.length ? trimmed : undefined;
      }
      if (typeof item === 'object') {
        const source = item as Record<string, unknown>;
        const textCandidate =
          source.description ||
          source.summary ||
          source.detail ||
          source.feature ||
          source.value ||
          source.title;
        if (typeof textCandidate === 'string') {
          const trimmed = textCandidate.trim();
          if (trimmed.length) return trimmed;
        }
      }
      return undefined;
    })
    .filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);

  return normalized.length ? normalized : fallback;
}

type ScheduleItem = { title: string; description: string };

function normalizeSchedule(value: unknown, fallback: ScheduleItem[]): ScheduleItem[] {
  const list = asArray<unknown>(value);
  if (!list) return fallback;

  const normalized = list
    .map((slot, index) => {
      if (!slot) return undefined;
      if (typeof slot === 'string') {
        const trimmed = slot.trim();
        if (!trimmed) return undefined;
        return { title: `Session ${index + 1}`, description: trimmed };
      }
      if (typeof slot === 'object') {
        const source = slot as Record<string, unknown>;
        const rawTitle =
          source.title ||
          source.name ||
          source.heading ||
          source.label ||
          source.summary;
        const rawDescription =
          source.description ||
          source.summary ||
          source.detail ||
          source.outcome ||
          source.body;

        const title = typeof rawTitle === 'string' && rawTitle.trim().length ? rawTitle.trim() : `Session ${index + 1}`;
        const description =
          typeof rawDescription === 'string' && rawDescription.trim().length
            ? rawDescription.trim()
            : 'Live experience highlight.';

        if (!title && !description) return undefined;
        return { title, description };
      }
      return undefined;
    })
    .filter((item): item is ScheduleItem => Boolean(item));

  return normalized.length ? normalized : fallback;
}

function normalizeTestimonials(value: unknown, fallback: Testimonial[]): Testimonial[] {
  const list = asArray<unknown>(value);
  if (!list) return fallback;

  const normalized = list
    .map<Testimonial | undefined>((item, index) => {
      if (!item) return undefined;
      if (typeof item === 'string') {
        const quote = item.trim();
        if (!quote) return undefined;
        return { name: `Attendee ${index + 1}`, role: 'Festival Guest', quote, rating: 5 };
      }
      if (typeof item === 'object') {
        const source = item as Record<string, unknown>;
        const quote = source.quote || source.feedback || source.testimonial || source.comment;
        if (typeof quote !== 'string' || !quote.trim()) return undefined;
        const name = typeof source.name === 'string' && source.name.trim().length ? source.name.trim() : `Attendee ${index + 1}`;
        const role = typeof source.role === 'string' && source.role.trim().length ? source.role.trim() : 'Community Partner';
        const rating = typeof source.rating === 'number' ? Math.min(5, Math.max(1, Math.round(source.rating))) : 5;
        return { name, role, quote: quote.trim(), rating };
      }
      return undefined;
    })
    .filter((item): item is Testimonial => item !== undefined);

  return normalized.length ? normalized : fallback;
}

function normalizeMetrics(value: unknown, fallback: Metric[]): Metric[] {
  const list = asArray<unknown>(value);
  if (!list) return fallback;

  const normalized = list
    .map((item, index) => {
      if (!item) return undefined;
      if (typeof item === 'string') {
        const [label, rawValue] = item.split(/[:|-]/);
        const value = rawValue ? rawValue.trim() : item.trim();
        if (!value) return undefined;
        return { label: label?.trim() || `Metric ${index + 1}`, value };
      }
      if (typeof item === 'object') {
        const source = item as Record<string, unknown>;
        const label =
          (typeof source.label === 'string' && source.label.trim()) ||
          (typeof source.name === 'string' && source.name.trim()) ||
          (typeof source.title === 'string' && source.title.trim()) ||
          `Metric ${index + 1}`;
        const value =
          (typeof source.value === 'string' && source.value.trim()) ||
          (typeof source.total === 'string' && source.total.trim()) ||
          (typeof source.count === 'string' && source.count.trim()) ||
          (typeof source.value === 'number' && source.value.toString()) ||
          (typeof source.total === 'number' && source.total.toString()) ||
          (typeof source.count === 'number' && source.count.toString()) ||
          '';
        if (!value) return undefined;
        return { label, value };
      }
      return undefined;
    })
    .filter((item): item is Metric => Boolean(item));

  return normalized.length ? normalized : fallback;
}

function normalizePartners(value: unknown, fallback: string[]): string[] {
  const list = asArray<unknown>(value);
  if (!list) return fallback;

  const normalized = list
    .map((item) => {
      if (!item) return '';
      if (typeof item === 'string') return item.trim();
      if (typeof item === 'object') {
        const source = item as Record<string, unknown>;
        const name = source.name || source.title || source.label;
        if (typeof name === 'string') return name.trim();
      }
      return '';
    })
    .filter(Boolean) as string[];

  return normalized.length ? normalized : fallback;
}

function normalizePasses(value: unknown, fallback: PassTier[]): PassTier[] {
  const list = asArray<unknown>(value);
  if (!list) return fallback;

  const normalized = list
    .map((item, index) => {
      if (!item) return undefined;
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (!trimmed) return undefined;
        return { name: trimmed, perks: [] };
      }
      if (typeof item === 'object') {
        const source = item as Record<string, unknown>;
        const name =
          (typeof source.name === 'string' && source.name.trim()) ||
          (typeof source.title === 'string' && source.title.trim()) ||
          `Pass ${index + 1}`;
        const perksSource = source.perks || source.benefits || source.includes;
        const perksList = asArray<unknown>(perksSource);
        const perks = perksList
          ? (perksList
              .map((perk) => {
                if (!perk) return '';
                if (typeof perk === 'string') return perk.trim();
                if (typeof perk === 'object') {
                  const perkSource = perk as Record<string, unknown>;
                  const detail =
                    perkSource.description ||
                    perkSource.summary ||
                    perkSource.detail ||
                    perkSource.title;
                  if (typeof detail === 'string') return detail.trim();
                }
                return '';
              })
              .filter(Boolean) as string[])
          : [];
        return { name, perks };
      }
      return undefined;
    })
    .filter((item): item is PassTier => Boolean(item));

  return normalized.length ? normalized : fallback;
}

const DEFAULT_EVENT_FEATURES: string[] = [
  'Hyperloop Main Stage with surprise headline drops, live VJ sets, and synced pyrotechnics',
  'Creator Lab: 24/7 filming bays, podcast booths, and AI-assisted editing corners',
  'Immersive XR playground with AR city quests, VR rhythm games, and volumetric capture',
  'Arena of Champions: Valorant, FC24, and retro arcade showdowns with pro shoutcasters',
  'Slow food street curated by campus founders, featuring 30+ pop-ups and global pairings',
  'Impact Alley bringing climate-tech founders, NGOs, and alumni mentors under one roof',
  'Sunset collaboration hour with indie artists, spoken-word jams, and live art walls',
  'Afterburn silent disco, neon bowling lanes, and midnight ramen pop-up till 02:00 AM',
  'Mindful reset mornings: rooftop yoga, breathwork labs, and specialty coffee cupping'
];

const DEFAULT_EVENT_SCHEDULE: Array<{ title: string; description: string }> = [
  { title: 'Gate Crash + Check-in Carnival', description: 'QR scan lanes, festival bands, welcome tunnel DJs, and early-bird merch drops.' },
  { title: 'Future Vision Keynote', description: 'Festival directors unveil this year’s narrative, announce impact goals, and spotlight ambassadors.' },
  { title: 'Creator Lab Sprints', description: 'Rotating workshops across reels mastery, beat production, AI storytelling, and UX lightning jams.' },
  { title: 'Showcase Battles & Demo Day', description: 'Startup finale, dance showdown, beatbox league, and the innovation leaderboard reveal.' },
  { title: 'Golden Hour Collaborations', description: 'Open-mic mashups, club crossovers, live murals, and pop-up talks with surprise mentors.' },
  { title: 'Afterburn Party', description: 'Silent disco channels, neon bowling, midnight ramen, and acoustic sessions till 02:00 AM.' }
];

const DEFAULT_EVENT_METRICS: Metric[] = [
  { label: 'Attendees', value: '25,000+' },
  { label: 'Stages & Zones', value: '12' },
  { label: 'Workshops', value: '45' },
  { label: 'Partner Brands', value: '65' }
];

const DEFAULT_EVENT_PARTNERS = ['YouTube NextUp', 'Adobe Express', 'Spotify India', 'AWS Educate', 'Meta Spark'];

const DEFAULT_EVENT_TESTIMONIALS: Testimonial[] = [
  { name: 'Ritika Sharma', role: 'Marketing Lead, Northwave Studios', quote: 'The production, storytelling, and ease of collaboration made this the most effective youth partnership we have executed all year.', rating: 5 },
  { name: 'Aditya Rao', role: 'President, Aurora Cultural Collective', quote: 'Every zone pulsed with energy and thoughtful programming. Volunteer crew, comms, and safety protocols were flawless.', rating: 5 },
  { name: 'Priya Menon', role: 'Head of Community, IndieJam', quote: 'Students left with mentors, deals, and new collaborators. Workshops ran on time and blended strategy with action.', rating: 5 }
];

const DEFAULT_EVENT_CONTACT_FIELDS = ['Full Name', 'Email', 'Phone', 'Organisation / College', 'Pass Type', 'Team Size', 'Message'];

const DEFAULT_EVENT_PASSES: PassTier[] = [
  { name: 'Creator Lab Pass', perks: ['24/7 studio access', 'Mentor hours', 'Equipment priority'] },
  { name: 'Leadership Summit Pass', perks: ['Reserved seating', 'CXO luncheon', 'Meet-the-speaker lounge'] },
  { name: 'All Access Squad', perks: ['Team discounts', 'Backstage tour', 'VIP merch kit'] }
];

function getSectionValue<T>(sections: SectionsRecord, key: string, fallback: T): T {
  if (sections && typeof sections[key] !== 'undefined' && sections[key] !== null) {
    return sections[key] as T;
  }
  return fallback;
}

function getDescriptions(pics: string[], picDescriptions?: string[]) {
  if (picDescriptions && picDescriptions.length === pics.length) return picDescriptions;
  if (picDescriptions && picDescriptions.length) {
    return pics.map((_, index) => picDescriptions[index] || `Event image ${index + 1}`);
  }
  return pics.map((_, index) => `Event image ${index + 1}`);
}

function resolveInputType(field: string): 'email' | 'tel' | 'textarea' | 'number' | 'text' {
  const lower = field.toLowerCase();
  if (lower.includes('email')) return 'email';
  if (lower.includes('phone') || lower.includes('mobile')) return 'tel';
  if (lower.includes('message') || lower.includes('note') || lower.includes('requirement') || lower.includes('query')) return 'textarea';
  if (lower.includes('team') || lower.includes('people') || lower.includes('attendee') || lower.includes('count') || lower.includes('size')) return 'number';
  return 'text';
}

function renderFormField(field: string, themeColor: string, variant: 'light' | 'dark'): string {
  const type = resolveInputType(field);
  const nameAttr = field.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'field';
  const focusRing = `focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`;
  const labelClass = variant === 'dark' ? 'text-xs uppercase tracking-[0.3em] text-slate-200' : 'text-sm font-medium text-gray-700';
  const inputClass = variant === 'dark'
    ? `mt-2 w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-white placeholder-slate-400 ${focusRing}`
    : `mt-2 w-full px-4 py-3 rounded-2xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 ${focusRing}`;

  if (type === 'textarea') {
    return `<label class="${labelClass}">${field}<textarea name="${nameAttr}" rows="4" required class="${inputClass} resize-y"></textarea></label>`;
  }

  const minAttr = type === 'number' ? ' min="0"' : '';
  return `<label class="${labelClass}">${field}<input name="${nameAttr}" type="${type}"${minAttr} required class="${inputClass}"></label>`;
}

function countdownScript(fallbackDays = 7): string {
  const target = new Date(Date.now() + fallbackDays * 24 * 60 * 60 * 1000);
  return `
  (function(){
    const el = document.getElementById('countdown');
    if(!el) return;
    const attr = el.getAttribute('data-deadline');
    const target = attr ? new Date(attr) : new Date(${target.getFullYear()}, ${target.getMonth()}, ${target.getDate()}, 18, 0, 0);
    function pad(value){ return value < 10 ? '0' + value : '' + value; }
    function update(){
      const diff = target.getTime() - Date.now();
      if (diff <= 0){ el.textContent = 'Event live'; return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      el.textContent = days + 'd ' + pad(hours) + 'h ' + pad(minutes) + 'm';
    }
    update();
    setInterval(update, 60000);
  })();
  `;
}

function renderMetricCards(metrics: Metric[], themeColor: string): string {
  return metrics.map(metric => `<div class="rounded-3xl border border-white/15 bg-white/10 p-5 text-center">
    <p class="text-2xl font-bold">${metric.value}</p>
    <p class="mt-2 text-xs uppercase tracking-[0.35em] text-${themeColor}-100">${metric.label}</p>
  </div>`).join('');
}

function renderSummitMetricCards(metrics: Metric[], themeColor: string): string {
  return metrics.map(metric => `<div class="rounded-3xl border border-${themeColor}-100 bg-white p-5">
    <p class="text-2xl font-bold text-${themeColor}-900">${metric.value}</p>
    <p class="mt-2 text-xs uppercase tracking-[0.35em] text-${themeColor}-600">${metric.label}</p>
  </div>`).join('');
}

function renderTestimonials(testimonials: Testimonial[], themeColor: string, variant: 'light' | 'dark'): string {
  const starColor = variant === 'dark' ? 'text-yellow-300' : 'text-yellow-400';
  const baseText = variant === 'dark' ? 'text-white/85' : 'text-slate-700';
  const roleText = variant === 'dark' ? `text-${themeColor}-100` : 'text-gray-500';
  return testimonials.map(testimonial => `<blockquote class="rounded-3xl border ${variant === 'dark' ? 'border-white/15 glass' : `border-${themeColor}-100 bg-white shadow-sm`} p-6">
    <div class="${starColor}">${'★'.repeat(testimonial.rating || 5)}</div>
    <p class="mt-4 ${baseText} leading-relaxed">"${testimonial.quote}"</p>
    <footer class="mt-4 text-xs ${roleText} font-semibold">${testimonial.name} • ${testimonial.role}</footer>
  </blockquote>`).join('');
}

// Neon Night layout
export function generateEventNeonLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;
  const themeColor = sanitizeThemeColor(theme_color);
  const descriptions = getDescriptions(pics, picDescriptions);
  const features = normalizeFeatureList(sections?.features, DEFAULT_EVENT_FEATURES);
  const schedule = normalizeSchedule(sections?.services, DEFAULT_EVENT_SCHEDULE);
  const testimonials = normalizeTestimonials(sections?.testimonials, DEFAULT_EVENT_TESTIMONIALS);
  const metrics = normalizeMetrics((sections as SectionsRecord)?.metrics, DEFAULT_EVENT_METRICS);
  const partners = normalizePartners((sections as SectionsRecord)?.partners, DEFAULT_EVENT_PARTNERS);
  const passes = normalizePasses((sections as SectionsRecord)?.passes, DEFAULT_EVENT_PASSES);
  const fields = contact_fields?.length ? contact_fields : DEFAULT_EVENT_CONTACT_FIELDS;
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>
    body{background:#040014;color:#e0e7ff;-webkit-font-smoothing:antialiased}
    .glass{backdrop-filter:blur(14px);background:rgba(14,14,45,.55)}
    .glow{text-shadow:0 0 16px rgba(255,255,255,.7),0 0 42px rgba(99,102,241,.45)}
  </style></head><body>
  <header class="relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,.4),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,.35),transparent_45%),radial-gradient(circle_at_50%_95%,rgba(16,185,129,.35),transparent_45%)]"></div>
    <div class="absolute inset-0 opacity-20">${pics[0] ? `<img src="${pics[0]}" alt="${descriptions[0]}" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'">` : ''}</div>
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
      <span class="inline-flex items-center gap-2 glass border border-white/20 px-4 py-2 rounded-full text-xs uppercase tracking-[0.4em]">Campus mega fest</span>
      <h1 class="mt-6 text-5xl sm:text-[4.5rem] font-black glow">${title}</h1>
      <p class="mt-5 text-lg sm:text-2xl text-${themeColor}-100 max-w-3xl mx-auto leading-relaxed">${tagline}</p>
      <div class="mt-6 flex flex-wrap justify-center gap-3 text-xs text-white/80">
        <span class="px-4 py-2 glass rounded-full border border-white/15">${sections?.date || '26 – 28 July 2025'}</span>
        <span class="px-4 py-2 glass rounded-full border border-white/15">${sections?.location || 'Hyperloop Arena, Bengaluru'}</span>
        <span class="px-4 py-2 glass rounded-full border border-white/15">${sections?.cta || '48 Hours · 12 Zones · 25K+ Creators'}</span>
      </div>
      <div id="countdown" class="mt-6 inline-flex items-center px-6 py-2 rounded-full glass border border-white/20 text-${themeColor}-100" data-deadline="">Counting down…</div>
      <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        ${renderMetricCards(metrics, themeColor)}
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 sm:px-6">
    <section class="py-12 sm:py-16">
      <h2 class="text-3xl sm:text-4xl font-bold text-white">What’s lighting up the fest</h2>
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${features.map((feature, index) => `<article class="glass border border-white/15 rounded-3xl p-6">
          <div class="text-2xl">${['🎇','🎧','🎮','🎤','🍜','🌱','🎨','🌃','🌅'][index % 9]}</div>
          <p class="mt-3 text-white/85 leading-relaxed text-sm">${feature}</p>
        </article>`).join('')}
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <h2 class="text-3xl font-bold text-white">Energy reels</h2>
          <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            ${pics.slice(1, 7).map((url, index) => `<figure class="relative overflow-hidden rounded-2xl border border-white/10">
              <img src="${url}" alt="${descriptions[index + 1] || descriptions[0]}" class="w-full h-48 object-cover transition duration-500 hover:scale-110" loading="lazy" onerror="this.src='https://picsum.photos/600/400?random=${index + 2}'">
              <figcaption class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-end p-3 text-xs">${descriptions[index + 1] || descriptions[0]}</figcaption>
            </figure>`).join('')}
          </div>
        </div>
        <aside class="glass rounded-3xl p-6 border border-white/15">
          <h3 class="text-2xl font-semibold text-white">Drop-by-drop schedule</h3>
          <ul class="mt-4 space-y-4 text-sm text-white/80">
            ${schedule.map((slot, index) => `<li class="border-l-4 border-${themeColor}-300 pl-4">
              <p class="text-xs uppercase tracking-[0.35em] text-${themeColor}-200">${(10 + index)}:00</p>
              <p class="mt-1 font-semibold text-white">${slot.title}</p>
              <p class="text-white/70 leading-relaxed">${slot.description}</p>
            </li>`).join('')}
          </ul>
        </aside>
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <div class="glass rounded-3xl border border-white/15 p-8">
        <h2 class="text-3xl font-bold text-white">Partner roster</h2>
        <div class="mt-4 flex flex-wrap gap-3 text-sm text-${themeColor}-100">
          ${partners.map(partner => `<span class="px-4 py-2 rounded-full border border-white/20 bg-white/10">${partner}</span>`).join('')}
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
      ${renderTestimonials(testimonials, themeColor, 'dark')}
    </section>

    <section class="py-12 sm:py-16">
      <h2 class="text-3xl font-bold text-white">Pass lineup</h2>
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/85">
        ${passes.map(pass => `<article class="glass rounded-3xl border border-white/15 p-6">
          <h3 class="text-xl font-semibold text-white">${pass.name}</h3>
          <ul class="mt-3 space-y-2 text-white/75">
            ${(pass.perks || []).map((perk: string) => `<li>• ${perk}</li>`).join('')}
          </ul>
        </article>`).join('')}
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <form class="glass border border-white/15 p-8 rounded-3xl" onsubmit="submitContactForm(event)">
        <input type="hidden" name="websiteSlug" value="${websiteSlug}">
        <h2 class="text-3xl font-bold text-white">Register / RSVP</h2>
        <p class="mt-2 text-sm text-${themeColor}-100">Secure priority access, limited mentor hours, and backstage tours.</p>
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${fields.map(field => renderFormField(field, themeColor, 'dark')).join('')}
        </div>
        <button type="submit" class="mt-6 w-full py-3 rounded-2xl bg-${themeColor}-500 hover:bg-${themeColor}-400 text-white font-semibold">Get passes</button>
      </form>
    </section>
  </main>

  <footer class="border-t border-white/10 text-center py-6 text-white/70 text-xs">
    © 2025 ${title}. Powered by <a href="https://vaaniweb.com" class="text-${themeColor}-200" target="_blank" rel="noopener">VaaniWeb</a>
  </footer>
  <script>${countdownScript(7)}</script>
</body></html>`;
}

// Executive summit layout
export function generateEventElegantLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;
  const themeColor = sanitizeThemeColor(theme_color);
  const descriptions = getDescriptions(pics, picDescriptions);
  const features = normalizeFeatureList(sections?.features, DEFAULT_EVENT_FEATURES);
  const schedule = normalizeSchedule(sections?.services, DEFAULT_EVENT_SCHEDULE);
  const testimonials = normalizeTestimonials(sections?.testimonials, DEFAULT_EVENT_TESTIMONIALS);
  const metrics = normalizeMetrics((sections as SectionsRecord)?.metrics, DEFAULT_EVENT_METRICS);
  const partners = normalizePartners((sections as SectionsRecord)?.partners, DEFAULT_EVENT_PARTNERS);
  const fields = contact_fields?.length ? contact_fields : DEFAULT_EVENT_CONTACT_FIELDS;
  const sectionData = sections as SectionsRecord;
  const location = getSectionValue(sectionData, 'location', 'Innovation District Convention Hall');
  const date = getSectionValue(sectionData, 'date', '18 August 2025');
  const heroStats = getSectionValue(sectionData, 'cta', '500 delegates · 40 speakers · 12 masterclasses');
  const deadline = getSectionValue(sectionData, 'deadline', '');
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>body{background:#f8fafc;color:#0f172a;-webkit-font-smoothing:antialiased}.card-shadow{box-shadow:0 30px 70px -40px rgba(30,64,175,.3);}</style></head><body>
  <header class="bg-gradient-to-b from-${themeColor}-50 via-white to-white border-b border-${themeColor}-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
      <span class="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-${themeColor}-200 text-${themeColor}-700 uppercase tracking-[0.35em] text-xs">Leadership summit</span>
      <h1 class="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight text-${themeColor}-900">${title}</h1>
      <p class="mt-4 text-lg sm:text-2xl text-${themeColor}-700 max-w-3xl mx-auto leading-relaxed">${tagline}</p>
      <div class="mt-6 flex flex-wrap justify-center gap-3 text-xs text-${themeColor}-800">
        <span class="px-3 py-1.5 bg-white border border-${themeColor}-200 rounded-full">${date}</span>
        <span class="px-3 py-1.5 bg-white border border-${themeColor}-200 rounded-full">${location}</span>
        <span class="px-3 py-1.5 bg-white border border-${themeColor}-200 rounded-full">${heroStats}</span>
      </div>
      <div id="countdown" class="mt-6 inline-flex items-center px-5 py-2 rounded-full border border-${themeColor}-200 text-${themeColor}-800" data-deadline="${deadline}">Countdown loading…</div>
      <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        ${renderSummitMetricCards(metrics, themeColor)}
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6">
    <section class="py-12 sm:py-16">
      <h2 class="text-3xl sm:text-4xl font-bold text-${themeColor}-900">Speakers & facilitators</h2>
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${pics.slice(0, 6).map((url, index) => `<article class="rounded-3xl border border-${themeColor}-100 bg-white card-shadow overflow-hidden">
          <img src="${url}" alt="${descriptions[index]}" class="w-full h-64 object-cover" loading="lazy" onerror="this.src='https://picsum.photos/600/400?random=${index}'">
          <div class="p-6">
            <p class="text-lg font-semibold text-gray-900">${descriptions[index] || 'Keynote ' + (index + 1)}</p>
            <p class="text-sm text-gray-500">${['Impact Investor', 'Product Leader', 'Chief Futurist', 'Growth Strategist', 'Media Host', 'Design Exec'][index % 6]}</p>
            <p class="mt-3 text-sm text-gray-600 leading-relaxed">Guiding conversations on scaling, community, and resilient innovation.</p>
          </div>
        </article>`).join('')}
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <h2 class="text-3xl sm:text-4xl font-bold text-${themeColor}-900">Summit agenda</h2>
          <div class="mt-6 space-y-4">
            ${schedule.map((slot, index) => `<article class="flex gap-4 p-5 rounded-3xl border border-gray-200 bg-white">
                  <div class="flex-none w-20 text-${themeColor}-700 font-semibold">${(9 + index)}:00</div>
              <div>
                <p class="font-semibold text-gray-900">${slot.title}</p>
                <p class="text-gray-600 text-sm leading-relaxed">${slot.description}</p>
              </div>
            </article>`).join('')}
          </div>
        </div>
        <aside class="bg-${themeColor}-50 border border-${themeColor}-100 rounded-3xl p-6 lg:p-8">
          <h3 class="text-2xl font-semibold text-${themeColor}-900">Why decision-makers attend</h3>
          <ul class="mt-4 space-y-3 text-${themeColor}-800 text-sm">
            ${features.slice(0, 6).map(feature => `<li class="flex items-start gap-3"><span class="mt-1 text-${themeColor}-500">•</span><span>${feature}</span></li>`).join('')}
          </ul>
          <div class="mt-6">
            <h4 class="text-sm uppercase tracking-[0.35em] text-${themeColor}-600">Partners</h4>
            <div class="mt-3 flex flex-wrap gap-2 text-xs text-${themeColor}-700">
              ${partners.map(partner => `<span class="px-3 py-1.5 rounded-full bg-white border border-${themeColor}-200">${partner}</span>`).join('')}
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <div class="bg-${themeColor}-50 border border-${themeColor}-100 rounded-3xl p-8 sm:p-10">
        <h2 class="text-3xl font-bold text-${themeColor}-900">Voices from the community</h2>
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${renderTestimonials(testimonials, themeColor, 'light')}
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <form class="bg-white border border-${themeColor}-200 p-6 sm:p-8 rounded-3xl shadow-sm" onsubmit="submitContactForm(event)">
        <input type="hidden" name="websiteSlug" value="${websiteSlug}">
        <h2 class="text-3xl font-bold text-${themeColor}-900">Secure your delegate pass</h2>
        <p class="mt-2 text-sm text-gray-600">Priority access for CXOs, founders, and campus ambassadors. Group discounts available.</p>
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${fields.map(field => renderFormField(field, themeColor, 'light')).join('')}
        </div>
        <button type="submit" class="mt-6 w-full py-3 rounded-2xl bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-semibold">Book seat</button>
      </form>
    </section>
  </main>

  <footer class="bg-${themeColor}-50 border-t border-${themeColor}-100 text-center py-6 text-${themeColor}-900 text-xs">
    © 2025 ${title}. Powered by <a href="https://vaaniweb.com" class="font-semibold text-${themeColor}-800" target="_blank" rel="noopener">VaaniWeb</a>
  </footer>
  <script>${countdownScript(10)}</script>
</body></html>`;
}

// Campus carnival layout
export function generateEventCampusCarnivalLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;
  const themeColor = sanitizeThemeColor(theme_color);
  const descriptions = getDescriptions(pics, picDescriptions);
  const features = normalizeFeatureList(sections?.features, DEFAULT_EVENT_FEATURES);
  const schedule = normalizeSchedule(sections?.services, DEFAULT_EVENT_SCHEDULE);
  const partners = normalizePartners((sections as SectionsRecord)?.partners, DEFAULT_EVENT_PARTNERS);
  const metrics = normalizeMetrics((sections as SectionsRecord)?.metrics, DEFAULT_EVENT_METRICS);
  const fields = contact_fields?.length ? contact_fields : DEFAULT_EVENT_CONTACT_FIELDS;
  const sectionData = sections as SectionsRecord;
  const location = getSectionValue(sectionData, 'location', 'Campus Lawns + Auditorium');
  const date = getSectionValue(sectionData, 'date', '29 – 31 August 2025');
  const deadline = getSectionValue(sectionData, 'deadline', '');
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  const zones = features.slice(0, 6).map((feature, index) => ({
    name: feature.split(':')[0].slice(0, 32) || `Zone ${index + 1}`,
    blurb: feature,
    icon: ['🎮', '🎨', '🎤', '⚽', '📷', '🍔'][index % 6]
  }));

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>body{background:#ffffff;color:#0f172a;-webkit-font-smoothing:antialiased}.mesh{background:radial-gradient(circle at 20% 10%,rgba(79,70,229,.18),transparent 40%),radial-gradient(circle at 80% 0%,rgba(236,72,153,.16),transparent 40%),radial-gradient(circle at 50% 100%,rgba(16,185,129,.18),transparent 45%)}</style></head><body>
  <header class="mesh border-b border-${themeColor}-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
      <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-${themeColor}-200 text-${themeColor}-700 uppercase tracking-[0.35em] text-xs">Campus carnival</span>
      <h1 class="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-${themeColor}-900">${title}</h1>
      <p class="mt-4 text-lg sm:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">${tagline}</p>
      <div class="mt-5 flex flex-wrap justify-center gap-3 text-xs text-${themeColor}-800">
        <span class="px-3 py-1.5 bg-white border border-${themeColor}-200 rounded-full">${date}</span>
        <span class="px-3 py-1.5 bg-white border border-${themeColor}-200 rounded-full">${location}</span>
      </div>
      <div id="countdown" class="mt-6 inline-flex items-center px-5 py-2 rounded-full border border-${themeColor}-200 text-${themeColor}-800" data-deadline="${deadline}">Starts in…</div>
      <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        ${renderSummitMetricCards(metrics, themeColor)}
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6">
    <section class="py-12 sm:py-16">
      <h2 class="text-3xl font-bold text-${themeColor}-900">Zones & experiences</h2>
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${zones.map(zone => `<article class="rounded-3xl border border-${themeColor}-100 bg-${themeColor}-50 p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="text-3xl">${zone.icon}</span>
            <h3 class="text-xl font-semibold text-${themeColor}-900">${zone.name}</h3>
          </div>
          <p class="mt-3 text-sm text-gray-700 leading-relaxed">${zone.blurb}</p>
        </article>`).join('')}
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <h2 class="text-3xl font-bold text-${themeColor}-900">Highlights in motion</h2>
      <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        ${pics.slice(0, 8).map((url, index) => `<figure class="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
          <img src="${url}" alt="${descriptions[index] || title}" class="w-full h-48 object-cover hover:scale-110 transition" loading="lazy" onerror="this.src='https://picsum.photos/600/400?random=${index}'">
        </figure>`).join('')}
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <h2 class="text-3xl font-bold text-${themeColor}-900">Festival schedule</h2>
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        ${schedule.slice(0, 8).map((slot, index) => `<article class="rounded-3xl border border-gray-200 p-6 bg-white shadow-sm">
          <p class="text-${themeColor}-700 text-xs uppercase tracking-[0.3em]">Day ${Math.floor(index / 4) + 1} · ${(11 + (index % 4) * 2)}:00</p>
          <p class="mt-2 font-semibold text-gray-900">${slot.title}</p>
          <p class="text-gray-600 text-sm leading-relaxed">${slot.description}</p>
        </article>`).join('')}
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <div class="bg-${themeColor}-50 border border-${themeColor}-100 rounded-3xl p-8 sm:p-10">
        <h2 class="text-3xl font-bold text-${themeColor}-900">Why the campus shows up</h2>
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${features.slice(0, 6).map((feature, index) => `<article class="rounded-3xl border border-${themeColor}-100 bg-white p-6 shadow-sm">
            <span class="text-${themeColor}-600 text-2xl">${['🏆','🧠','🎉','🤝','📣','🌱'][index % 6]}</span>
            <p class="mt-3 text-sm text-gray-700 leading-relaxed">${feature}</p>
          </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <div class="bg-white border border-${themeColor}-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 class="text-3xl font-bold text-${themeColor}-900">Partners & collaborators</h2>
        <div class="mt-4 flex flex-wrap gap-3 text-sm text-${themeColor}-800">
          ${partners.map(partner => `<span class="px-4 py-2 rounded-full border border-${themeColor}-200 bg-${themeColor}-50">${partner}</span>`).join('')}
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <form class="bg-white border border-${themeColor}-200 p-6 sm:p-8 rounded-3xl shadow-sm" onsubmit="submitContactForm(event)">
        <input type="hidden" name="websiteSlug" value="${websiteSlug}">
        <h2 class="text-3xl font-bold text-${themeColor}-900">Volunteer / squad registration</h2>
        <p class="mt-2 text-sm text-gray-600">Register clubs, class cohorts, or volunteer pods to unlock backstage walkthroughs and merch drops.</p>
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${fields.map(field => renderFormField(field, themeColor, 'light')).join('')}
        </div>
        <button type="submit" class="mt-6 w-full py-3 rounded-2xl bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-semibold">Submit squad</button>
      </form>
    </section>
  </main>

  <footer class="bg-${themeColor}-50 border-t border-${themeColor}-100 text-center py-6 text-${themeColor}-900 text-xs">
    © 2025 ${title}. Powered by <a href="https://vaaniweb.com" class="font-semibold text-${themeColor}-800" target="_blank" rel="noopener">VaaniWeb</a>
  </footer>
  <script>${countdownScript(5)}</script>
</body></html>`;
}

const EVENT_TEMPLATES = [
  {
    name: 'Neon Night Extravaganza',
    description: 'High-energy campus festival with immersive zones, creator labs, and late-night showcases.',
    generate: generateEventNeonLayout
  },
  {
    name: 'Executive Summit Showcase',
    description: 'Elegant leadership summit featuring curated speakers, masterclasses, and executive networking.',
    generate: generateEventElegantLayout
  },
  {
    name: 'Campus Carnival Weekender',
    description: 'Multi-zone college carnival covering gaming arenas, art markets, food streets, and volunteer drives.',
    generate: generateEventCampusCarnivalLayout
  }
];

export default EVENT_TEMPLATES;
