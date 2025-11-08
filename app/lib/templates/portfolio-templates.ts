import { GeneratedPageData } from '../../types';
import { generateContactFormScript } from '../form-generator';

type SkillGroup = { category: string; items: string[] };
type ProjectEntry = {
  title: string;
  timeline: string;
  description: string;
  summary?: string;
  role?: string;
  team?: string;
  outcome?: string;
  image?: string;
  name?: string;
};
type TestimonialEntry = { name: string; role: string; quote: string; rating?: number };
type FaqEntry = { question: string; answer: string };

const DEFAULT_OBJECTIVE = 'To apply classroom learning, real-world projects, and community leadership towards crafting inclusive, high-impact digital experiences.';
const DEFAULT_ABOUT = 'I am a self-driven student who thrives at the intersection of technology, design, and community building. From hackathon podium finishes to mentoring juniors, I enjoy solving problems that make everyday life easier and more delightful.';

const DEFAULT_SKILLS: SkillGroup[] = [
  { category: 'Frontend', items: ['HTML5', 'CSS3', 'TypeScript', 'React', 'Next.js'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'MongoDB', 'REST APIs'] },
  { category: 'Tools', items: ['Git & GitHub', 'Figma', 'Notion', 'Jira'] },
  { category: 'Soft Skills', items: ['Team Leadership', 'Public Speaking', 'Design Thinking', 'Mentoring'] }
];

const DEFAULT_ACHIEVEMENTS: string[] = [
  'Winner, Smart India Hackathon 2024 (Campus edition) for AI-powered attendance monitor',
  'Built “Campus Connect” student portal adopted by 3 clubs with 1,500+ active users',
  'AWS Cloud Practitioner Certified • Google UX Design Certificate in progress',
  'Student Head, Developer Student Club – onboarded 230+ members in 6 months'
];

const DEFAULT_PROJECTS: ProjectEntry[] = [
  {
    title: 'EcoRoute Logistics Optimizer',
    timeline: 'Jan 2025 – Mar 2025',
    description: 'Built a route optimisation dashboard with live traffic overlays and emission tracking using Leaflet.js and MongoDB aggregation pipelines.'
  },
  {
    title: 'SkillSpark Learning Hub',
    timeline: 'Aug 2024 – Sep 2024',
    description: 'Designed a collaborative micro-learning platform for peer mentoring with adaptive playlists and Notion integration.'
  },
  {
    title: 'CampusCare Mobile App',
    timeline: 'Dec 2023 – Feb 2024',
    description: 'Led a team of four to ship a mental-wellness check-in app; integrated anonymous journaling, campus helplines, and weekly resilience challenges.'
  }
];

const DEFAULT_TESTIMONIALS: TestimonialEntry[] = [
  {
    name: 'Faculty Mentor',
    role: 'Professor, Computer Science',
    quote: 'Delivers consistently and elevates every team. Brings structure, empathy, and crisp documentation to all projects.',
    rating: 5
  },
  {
    name: 'Hackathon Partner',
    role: 'Product Designer',
    quote: 'Balances design vision with reliable engineering. Calm under pressure, and always mentors others.',
    rating: 5
  }
];

const DEFAULT_FAQ: FaqEntry[] = [
  { question: 'Where are you based?', answer: 'Currently in Bengaluru, India. Open to remote or hybrid roles.' },
  { question: 'What kind of roles interest you?', answer: 'Product engineering, UX engineering, or PM internships blending research with execution.' },
  { question: 'How soon can you join?', answer: 'Available for internships from June 2025 and open to part-time freelance engagements now.' }
];

const DEFAULT_CONTACT_FIELDS = ['Full Name', 'Email', 'Phone', 'Portfolio / LinkedIn', 'Message'];

function safeText(value: string | undefined | null, fallback: string): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function ensureArray<T>(value: unknown, fallback: T[]): T[] {
  if (Array.isArray(value) && value.length) {
    return value as T[];
  }
  return fallback;
}

function normaliseSkillGroups(value: unknown): SkillGroup[] {
  const groups = ensureArray<SkillGroup>(value, DEFAULT_SKILLS);
  return groups.map(group => {
    if (!isRecord(group)) return { category: 'General', items: [] };
    const category = safeText(group.category as string, 'General');
    const items = Array.isArray(group.items) && group.items.length ? group.items.map(item => `${item}`.trim()).filter(Boolean) : [];
    return { category, items };
  }).filter(group => group.items.length);
}

function normaliseProjects(value: unknown): ProjectEntry[] {
  const projects = ensureArray<ProjectEntry>(value, DEFAULT_PROJECTS);
  return projects.map(project => {
    if (!isRecord(project)) return DEFAULT_PROJECTS[0];
    const title = safeText((project.title as string) || (project.name as string), 'Untitled Project');
    const timeline = safeText(project.timeline as string, '2024');
    const description = safeText((project.description as string) || (project.summary as string), 'Shipped an end-to-end solution with measurable outcomes.');
    return {
      title,
      timeline,
      description,
      summary: safeText(project.summary as string, ''),
      role: safeText(project.role as string, ''),
      team: safeText(project.team as string, ''),
      outcome: safeText(project.outcome as string, ''),
      image: safeText(project.image as string, '')
    };
  });
}

function normaliseTestimonials(value: unknown): TestimonialEntry[] {
  const testimonials = ensureArray<TestimonialEntry>(value, DEFAULT_TESTIMONIALS);
  return testimonials.map(testimonial => {
    if (!isRecord(testimonial)) return DEFAULT_TESTIMONIALS[0];
    return {
      name: safeText(testimonial.name as string, 'Anonymous'),
      role: safeText(testimonial.role as string, 'Mentor'),
      quote: safeText(testimonial.quote as string, 'Inspiring collaborator and dependable teammate.'),
      rating: typeof testimonial.rating === 'number' && testimonial.rating > 0 ? testimonial.rating : 5
    };
  });
}

function normaliseFaq(value: unknown): FaqEntry[] {
  const faq = ensureArray<FaqEntry>(value, DEFAULT_FAQ);
  return faq.map(entry => {
    if (!isRecord(entry)) return DEFAULT_FAQ[0];
    return {
      question: safeText(entry.question as string, DEFAULT_FAQ[0].question),
      answer: safeText(entry.answer as string, DEFAULT_FAQ[0].answer)
    };
  });
}

function getDescriptions(pics: string[], picDescriptions?: string[]) {
  if (picDescriptions && picDescriptions.length === pics.length) {
    return picDescriptions;
  }
  if (picDescriptions && picDescriptions.length) {
    return pics.map((_, index) => picDescriptions[index] || `Project image ${index + 1}`);
  }
  return pics.map((_, index) => `Project image ${index + 1}`);
}

function resolveInputType(field: string): 'email' | 'tel' | 'textarea' | 'text' | 'number' {
  const lower = field.toLowerCase();
  if (lower.includes('email')) return 'email';
  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('contact')) return 'tel';
  if (lower.includes('message') || lower.includes('notes') || lower.includes('detail')) return 'textarea';
  if (lower.includes('team') || lower.includes('people') || lower.includes('size')) return 'number';
  return 'text';
}

function renderField(field: string, themeColor: string, variant: 'light' | 'dark' = 'light'): string {
  const type = resolveInputType(field);
  const baseName = field.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'field';
  const focus = `focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`;
  const labelClass = variant === 'dark' ? 'text-sm font-medium text-slate-200' : 'text-sm font-medium text-gray-700';
  const inputClass = variant === 'dark'
    ? `mt-1 w-full px-4 py-2.5 border border-slate-700/60 rounded-2xl bg-slate-900/50 text-white placeholder-slate-400 ${focus}`
    : `mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-2xl bg-white text-gray-900 placeholder-gray-400 ${focus}`;

  if (type === 'textarea') {
    return `<label class="${labelClass}">${field}<textarea name="${baseName}" rows="4" required class="${inputClass} resize-y"></textarea></label>`;
  }

  const min = type === 'number' ? ' min="0"' : '';
  return `<label class="${labelClass}">${field}<input type="${type}" name="${baseName}"${min} required class="${inputClass}"></label>`;
}

function starRating(rating: number): string {
  const count = Math.max(1, Math.min(5, Math.round(rating)));
  return '★'.repeat(count);
}

function getWebsiteSlug(data: GeneratedPageData): string {
  return typeof data.slug === 'string' ? data.slug : '';
}

export function generatePortfolioShowcaseLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections, instagram } = data;

  const descriptions = getDescriptions(pics, picDescriptions);
  const objective = safeText(sections?.callToAction, DEFAULT_OBJECTIVE);
  const about = safeText(sections?.about, DEFAULT_ABOUT);
  const skillGroups = normaliseSkillGroups(isRecord(sections) ? (sections as Record<string, unknown>).skills : undefined);
  const achievements = ensureArray<string>(sections?.features, DEFAULT_ACHIEVEMENTS);
  const projects = normaliseProjects(isRecord(sections) ? sections.services : undefined);
  const testimonials = normaliseTestimonials(sections?.testimonials);
  const faqList = normaliseFaq(sections?.faq);
  const fields = ensureArray<string>(contact_fields, DEFAULT_CONTACT_FIELDS);
  const formScript = generateContactFormScript();
  const websiteSlug = getWebsiteSlug(data);
  const location = safeText(isRecord(sections) ? (sections as Record<string, unknown>).location as string : '', 'Bengaluru, India');
  const emailFallback = safeText(data.instagram ? `${data.instagram}@example.com` : '', 'you@example.com');
  const skillBadges = skillGroups.flatMap(group => group.items);
  const focusAreas = safeText(isRecord(sections) ? (sections as Record<string, unknown>).focus as string : '', 'Product engineering • UX systems • Data-informed storytelling');
  const preferredRoles = safeText(isRecord(sections) ? (sections as Record<string, unknown>).roles as string : '', 'Product engineering intern • UX engineer • Technical PM');
  const availability = safeText(isRecord(sections) ? (sections as Record<string, unknown>).availability as string : '', 'Available for internships from June 2025');
  const academicHighlight = safeText(isRecord(sections) ? (sections as Record<string, unknown>).gpa as string : '', '');
  const recruiterHighlights = achievements.slice(0, Math.min(achievements.length, 3));

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.badge{box-shadow:0 8px 30px -12px rgba(67,56,202,0.45)}.timeline::before{content:'';position:absolute;inset:0 50%;width:2px;background:linear-gradient(to bottom,rgba(67,56,202,0.25),rgba(99,102,241,0.45));opacity:0.6}@media(max-width:768px){.timeline::before{left:12px}}</style></head><body class="bg-white text-gray-900">
<header class="bg-gradient-to-br from-${theme_color}-600 via-${theme_color}-500 to-${theme_color}-700 text-white">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
    <span class="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 text-sm tracking-wide">Portfolio • Student Edition</span>
    <h1 class="mt-6 text-4xl sm:text-6xl font-bold leading-tight">${title}</h1>
    <p class="mt-4 max-w-2xl text-lg sm:text-xl opacity-90">${safeText(tagline, 'Emerging technologist crafting products that feel human, inclusive, and scalable.')}</p>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white/15 rounded-2xl p-5"><p class="text-sm uppercase tracking-[0.2em] opacity-70">Objective</p><p class="mt-2 text-base sm:text-lg leading-relaxed">${objective}</p></div>
      <div class="bg-white/15 rounded-2xl p-5"><p class="text-sm uppercase tracking-[0.2em] opacity-70">Email</p><p class="mt-2 text-base sm:text-lg break-all">${emailFallback}</p></div>
      <div class="bg-white/15 rounded-2xl p-5"><p class="text-sm uppercase tracking-[0.2em] opacity-70">Location</p><p class="mt-2 text-base sm:text-lg">${location}</p></div>
    </div>
  </div>
</header>

<main class="max-w-6xl mx-auto px-4 sm:px-6">
  <section class="py-12 sm:py-16">
    <div class="flex flex-col lg:flex-row gap-10">
      <div class="lg:w-2/3 bg-${theme_color}-50 border border-${theme_color}-100 rounded-3xl p-8 shadow-xl">
        <h2 class="text-3xl font-semibold text-${theme_color}-900">About Me</h2>
        <p class="mt-4 text-gray-700 leading-relaxed">${about}</p>
      </div>
      <aside class="lg:w-1/3 bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-6">
        <div>
          <h3 class="text-2xl font-semibold text-gray-900">Recruiter Snapshot</h3>
          <div class="mt-4 space-y-4 text-sm text-gray-700">
            <div>
              <p class="uppercase text-xs tracking-[0.28em] text-${theme_color}-600">Focus areas</p>
              <p class="mt-1 font-medium text-gray-900">${focusAreas}</p>
            </div>
            <div>
              <p class="uppercase text-xs tracking-[0.28em] text-${theme_color}-600">Preferred roles</p>
              <p class="mt-1 font-medium text-gray-900">${preferredRoles}</p>
            </div>
            <div class="grid grid-cols-1 gap-2 text-sm">
              <p><span class="font-semibold text-gray-900">Availability:</span> ${availability}</p>
              <p><span class="font-semibold text-gray-900">Location:</span> ${location}</p>
              <p><span class="font-semibold text-gray-900">Contact:</span> ${emailFallback}</p>
            </div>
          </div>
        </div>
        ${recruiterHighlights.length ? `<div>
          <p class="uppercase text-xs tracking-[0.28em] text-${theme_color}-600">Highlights</p>
          <ul class="mt-3 space-y-2 text-sm text-gray-700">
            ${recruiterHighlights.map(highlight => `<li class="flex items-start gap-2"><span class="mt-1 text-${theme_color}-500">•</span><span>${highlight}</span></li>`).join('')}
          </ul>
        </div>` : ''}
        ${academicHighlight ? `<p class="text-sm text-gray-700"><span class="font-semibold text-gray-900">Academic:</span> ${academicHighlight}</p>` : ''}
        <div class="pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-[0.28em]">Skill stack</h4>
          <div class="mt-3 flex flex-wrap gap-2">
            ${skillBadges.slice(0, 18).map(skill => `<span class="badge px-3 py-1.5 text-sm rounded-full bg-${theme_color}-100 text-${theme_color}-800 border border-${theme_color}-200">${skill}</span>`).join('')}
          </div>
        </div>
      </aside>
    </div>
  </section>

  <section class="py-12 sm:py-16">
    <h2 class="text-3xl font-semibold text-gray-900">Highlighted Projects</h2>
    <div class="mt-8 relative">
      <div class="timeline absolute hidden md:block"></div>
      <div class="space-y-8 relative">
        ${projects.map(project => `<article class="bg-white border border-gray-200 rounded-3xl p-6 shadow-md flex flex-col md:flex-row gap-6">
          <div class="md:w-1/3">
            <p class="text-sm uppercase tracking-wide text-${theme_color}-700">${project.timeline}</p>
            <h3 class="mt-2 text-xl font-semibold text-gray-900">${project.title}</h3>
          </div>
          <div class="md:flex-1 text-gray-700 leading-relaxed">
            ${project.description}
            ${project.role || project.team ? `<p class="mt-3 text-sm text-gray-600">${[project.role ? `Role: ${project.role}` : '', project.team ? `Team: ${project.team}` : ''].filter(Boolean).join(' • ')}</p>` : ''}
            ${project.summary || project.outcome ? `<ul class="mt-3 space-y-2 text-sm text-gray-600 list-disc ml-5">
              ${[project.summary, project.outcome].filter(Boolean).map(item => `<li>${item}</li>`).join('')}
            </ul>` : ''}
          </div>
        </article>`).join('')}
      </div>
    </div>
  </section>

  <section class="py-12 sm:py-16">
    <h2 class="text-3xl font-semibold text-gray-900">Achievements & Leadership</h2>
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
      ${achievements.map(item => `<div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-start gap-4">
        <span class="text-${theme_color}-600 text-2xl">🏅</span>
        <p class="text-gray-700">${item}</p>
      </div>`).join('')}
    </div>
  </section>

  ${pics.length ? `<section class="py-12 sm:py-16">
    <h2 class="text-3xl font-semibold text-gray-900">Gallery</h2>
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${pics.map((url, index) => `<figure class="group rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
        <img src="${url}" alt="${descriptions[index]}" loading="lazy" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='https://picsum.photos/900/600?random=${index}'">
        <figcaption class="px-5 py-4 bg-white text-sm text-gray-600 border-t">${descriptions[index]}</figcaption>
      </figure>`).join('')}
    </div>
  </section>` : ''}

  <section class="py-12 sm:py-16">
    <h2 class="text-3xl font-semibold text-gray-900">Testimonials</h2>
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${testimonials.map(testimonial => `<div class="bg-white border border-gray-200 rounded-3xl p-6 shadow-md flex flex-col gap-3">
        <div class="text-yellow-400">${starRating(testimonial.rating || 5)}</div>
        <p class="text-gray-700 italic">"${testimonial.quote}"</p>
        <div>
          <p class="text-base font-semibold text-${theme_color}-800">${testimonial.name}</p>
          <p class="text-sm text-gray-500">${testimonial.role}</p>
        </div>
      </div>`).join('')}
    </div>
  </section>

  <section class="py-12 sm:py-16">
    <h2 class="text-3xl font-semibold text-gray-900">FAQs</h2>
    <div class="mt-6 space-y-4">
      ${faqList.map(item => `<div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 class="text-lg font-semibold text-${theme_color}-800">${item.question}</h3>
        <p class="mt-2 text-gray-700">${item.answer}</p>
      </div>`).join('')}
    </div>
  </section>

  <section class="py-12 sm:py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div class="bg-${theme_color}-600 text-white rounded-3xl p-8 shadow-xl">
        <h2 class="text-3xl font-semibold">Let’s collaborate</h2>
        <p class="mt-4 text-${theme_color}-100">I’m currently available for internships, part-time product gigs, and research collaborations. Drop a message and I will respond within 24 hours.</p>
        ${instagram ? `<a href="https://instagram.com/${instagram}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-white/20 text-white">Follow updates @${instagram}</a>` : ''}
      </div>
      <form class="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-5" onsubmit="submitContactForm(event)">
        <input type="hidden" name="websiteSlug" value="${websiteSlug}">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${fields.map(field => renderField(field, theme_color, 'light')).join('')}
        </div>
        <button type="submit" class="w-full py-3 rounded-2xl bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Send message</button>
      </form>
    </div>
  </section>
</main>

<footer class="bg-gray-50 border-t border-gray-200 text-center py-6">
  <p class="text-gray-700">© 2025 ${title}. All rights reserved. | Made with <span class="text-red-500">❤</span> by <a href="https://vaaniweb.com" class="text-${theme_color}-700 font-semibold" target="_blank" rel="noopener">VaaniWeb</a></p>
</footer>
</body></html>`;
}

export function generatePortfolioCaseStudyLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;

  const descriptions = getDescriptions(pics, picDescriptions);
  const about = safeText(sections?.about, DEFAULT_ABOUT);
  const objective = safeText(sections?.callToAction, DEFAULT_OBJECTIVE);
  const achievements = ensureArray<string>(sections?.features, DEFAULT_ACHIEVEMENTS);
  const projects = normaliseProjects(isRecord(sections) ? sections.services : undefined);
  const fields = ensureArray<string>(contact_fields, DEFAULT_CONTACT_FIELDS);
  const formScript = generateContactFormScript();
  const websiteSlug = getWebsiteSlug(data);
  const phone = safeText(isRecord(sections) ? (sections as Record<string, unknown>).phone as string : '', '+91-98765-43210');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>body{-webkit-font-smoothing:antialiased}</style></head><body class="bg-white text-gray-900">
<header class="bg-gradient-to-r from-${theme_color}-700 to-${theme_color}-500 text-white">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
    <p class="uppercase tracking-[0.3em] text-sm text-white/80">Student Portfolio</p>
    <h1 class="mt-4 text-4xl sm:text-6xl font-bold">${title}</h1>
    <p class="mt-4 text-lg sm:text-xl max-w-2xl opacity-90">${safeText(tagline, 'Designing delightful human-centered journeys while scaling backend reliability and analytics insights.')}</p>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white/10 rounded-2xl p-5"><h2 class="text-sm uppercase tracking-widest opacity-70">Objective</h2><p class="mt-2 text-base leading-relaxed">${objective}</p></div>
      <div class="bg-white/10 rounded-2xl p-5"><h2 class="text-sm uppercase tracking-widest opacity-70">Email</h2><p class="mt-2 text-base">${safeText(data.instagram ? `${data.instagram}@mail.com` : '', 'you@example.com')}</p></div>
      <div class="bg-white/10 rounded-2xl p-5"><h2 class="text-sm uppercase tracking-widest opacity-70">Phone</h2><p class="mt-2 text-base">${phone}</p></div>
    </div>
  </div>
</header>

<main class="max-w-6xl mx-auto px-4 sm:px-6">
  <section class="-mt-12 relative z-10">
    <div class="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 sm:p-10">
      <h2 class="text-3xl font-semibold text-${theme_color}-800">Who am I?</h2>
      <p class="mt-4 text-gray-700 leading-relaxed">${about}</p>
    </div>
  </section>

  <section class="py-12 sm:py-16">
    <h2 class="text-3xl font-semibold text-gray-900">Impact Snapshots</h2>
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
      ${achievements.map(achievement => `<div class="bg-white border border-gray-200 rounded-3xl p-6 shadow-md flex items-start gap-4">
        <span class="text-${theme_color}-500 text-3xl">✨</span>
        <p class="text-gray-700">${achievement}</p>
      </div>`).join('')}
    </div>
  </section>

  <section class="py-12 sm:py-16">
    <h2 class="text-3xl font-semibold text-gray-900">Case Studies</h2>
    <div class="mt-8 space-y-10">
      ${projects.map((project, index) => `<article class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div class="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden">
          <img src="${project.image || pics[index] || pics[0] || 'https://picsum.photos/1200/800'}" alt="${descriptions[index] || project.title}" loading="lazy" class="w-full h-72 object-cover" onerror="this.src='https://picsum.photos/1200/800?random=${index}'">
        </div>
        <div>
          <p class="text-sm uppercase tracking-widest text-${theme_color}-600">${project.timeline}</p>
          <h3 class="mt-2 text-2xl font-semibold text-gray-900">${project.title}</h3>
          <p class="mt-3 text-gray-700 leading-relaxed">${project.description}</p>
          <ul class="mt-4 space-y-2 text-gray-600 list-disc ml-5">
            ${project.role ? `<li>Role: ${project.role}</li>` : ''}
            ${project.team ? `<li>Team: ${project.team}</li>` : ''}
            ${project.outcome ? `<li>Outcome: ${project.outcome}</li>` : ''}
          </ul>
        </div>
      </article>`).join('')}
    </div>
  </section>

  <section class="py-12 sm:py-16">
    <h2 class="text-3xl font-semibold text-gray-900">Reach out</h2>
    <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div class="bg-${theme_color}-50 border border-${theme_color}-100 rounded-3xl p-8 shadow-xl">
        <h3 class="text-2xl font-semibold text-${theme_color}-900">Let’s build together</h3>
        <p class="mt-3 text-gray-700">Whether you’re hiring, researching, or exploring community partnerships—reach out. I’ll respond within 24 hours with relevant work samples.</p>
      </div>
      <form class="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-5" onsubmit="submitContactForm(event)">
        <input type="hidden" name="websiteSlug" value="${websiteSlug}">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${fields.map(field => renderField(field, theme_color, 'light')).join('')}
        </div>
        <button type="submit" class="w-full py-3 rounded-2xl bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Send message</button>
      </form>
    </div>
  </section>
</main>

<footer class="bg-gray-50 border-t border-gray-200 text-center py-6">
  <p class="text-gray-700">© 2025 ${title}. Crafted with <span class="text-red-500">❤</span> by <a href="https://vaaniweb.com" class="text-${theme_color}-700 font-semibold" target="_blank" rel="noopener">VaaniWeb</a></p>
</footer>
</body></html>`;
}

export function generatePortfolioMinimalMasonryLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;

  const descriptions = getDescriptions(pics, picDescriptions);
  const objective = safeText(sections?.callToAction, DEFAULT_OBJECTIVE);
  const skillGroups = normaliseSkillGroups(isRecord(sections) ? (sections as Record<string, unknown>).skills : undefined);
  const fields = ensureArray<string>(contact_fields, DEFAULT_CONTACT_FIELDS);
  const formScript = generateContactFormScript();
  const websiteSlug = getWebsiteSlug(data);

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>.masonry{column-gap:1.25rem}.masonry>*{break-inside:avoid;padding-bottom:1rem}@media(min-width:1024px){.masonry{column-count:2}}@media(min-width:1280px){.masonry{column-count:3}}</style></head><body class="bg-gray-50 text-gray-900">
<main class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
  <section class="bg-${theme_color}-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
    <p class="uppercase tracking-[0.4em] text-xs text-white/80">Student Portfolio</p>
    <h1 class="mt-4 text-4xl sm:text-5xl font-bold">${title}</h1>
    <p class="mt-3 text-lg sm:text-xl text-white/90">${safeText(tagline, 'Curious learner documenting the journey of building products, communities, and impact.')}</p>
    <div class="mt-6 bg-white/15 rounded-2xl px-5 py-4 text-sm leading-relaxed">${objective}</div>
  </section>

  <section class="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
    <aside class="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-md">
      <h2 class="text-2xl font-semibold text-gray-900">Skills & Tools</h2>
      <div class="mt-4 space-y-4">
        ${skillGroups.map(group => `<div>
          <p class="text-sm uppercase tracking-wide text-${theme_color}-600">${group.category}</p>
          <p class="mt-2 text-gray-700">${group.items.join(', ')}</p>
        </div>`).join('')}
      </div>
      <form class="mt-6 space-y-3" onsubmit="submitContactForm(event)">
        <input type="hidden" name="websiteSlug" value="${websiteSlug}">
        ${fields.slice(0, 4).map(field => renderField(field, theme_color, 'light')).join('')}
        <button type="submit" class="w-full py-3 rounded-xl bg-${theme_color}-600 text-white font-semibold">Connect</button>
      </form>
    </aside>
    <section class="lg:col-span-8">
      <div class="masonry">
        ${pics.map((url, index) => `<figure class="bg-white border border-gray-200 rounded-3xl shadow-md overflow-hidden">
          <img src="${url}" alt="${descriptions[index] || title}" loading="lazy" class="w-full object-cover" onerror="this.src='https://picsum.photos/900/600?random=${index}'">
          <figcaption class="px-4 py-3 text-sm text-gray-600">${descriptions[index] || title}</figcaption>
        </figure>`).join('')}
      </div>
    </section>
  </section>
</main>

<footer class="bg-white border-t border-gray-200 text-center py-6 mt-10">
  <p class="text-gray-700">© 2025 ${title}. Crafted with <span class="text-red-500">❤</span> by <a href="https://vaaniweb.com" class="text-${theme_color}-700 font-semibold" target="_blank" rel="noopener">VaaniWeb</a></p>
</footer>
</body></html>`;
}
