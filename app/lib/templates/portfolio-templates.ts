import { GeneratedPageData } from '../../types';
import { generateContactFormScript } from '../form-generator';

const DEFAULT_OBJECTIVE = 'Secure a 2025 product engineering internship where I can blend human-centered design, full-stack development, and analytics to ship inclusive digital experiences.';
const DEFAULT_ABOUT = 'I am a student technologist obsessed with shipping polished products that solve real problems. Between lab research, community leadership, and hackathon podiums, I have learned how to turn ambiguous ideas into measurable outcomes. I love working with cross-functional teams, documenting decisions, and keeping projects shipping on time.';

const DEFAULT_SKILLS = [
  { category: 'Frontend Engineering', items: ['React', 'Next.js App Router', 'Tailwind CSS', 'TypeScript', 'Design Systems'] },
  { category: 'Backend & Cloud', items: ['Node.js', 'Express', 'MongoDB Atlas', 'REST APIs', 'Supabase'] },
  { category: 'AI & Data', items: ['Python', 'LangChain', 'Prompt Engineering', 'Pandas', 'Analytics Dashboards'] },
  { category: 'Team Strengths', items: ['Product Thinking', 'Workshop Facilitation', 'User Research', 'Technical Writing'] }
];

const DEFAULT_STATS = [
  { label: 'CGPA', value: '9.1 / 10' },
  { label: 'Projects Shipped', value: '12' },
  { label: 'Hackathon Podiums', value: '5' },
  { label: 'Students Mentored', value: '40+' }
];

const DEFAULT_ACHIEVEMENTS = [
  'Winner, Smart India Hackathon 2024 (Smart Campus category) for “EcoRoute” logistics optimizer.',
  'Student Head, Developer Student Club – grew membership from 45 to 230 with inclusive onboarding playbooks.',
  'Shortlisted for Google Generation Scholarship • AWS Cloud Practitioner Certified.',
  'Led campus “Zero Waste Fest” tech task force reducing single-use plastic by 68% in 3 days.'
];

const DEFAULT_PROJECTS = [
  {
    title: 'EcoRoute Logistics Optimizer',
    name: 'EcoRoute Logistics Optimizer',
    timeline: 'Jan 2025 – Mar 2025',
    summary: 'Designed a logistics cockpit for campus facilities, blending live IoT feeds with carbon tracking dashboards. Reduced shuttle idle time by 32%.',
    description: 'Designed a logistics cockpit for campus facilities, blending live IoT feeds with carbon tracking dashboards. Reduced shuttle idle time by 32%.',
    link: '#ecoroute-case',
    tools: ['Next.js', 'Leaflet.js', 'MongoDB Aggregations'],
    outcome: 'Now piloted with 3 campus departments.'
  },
  {
    title: 'SkillSpark Peer Learning Hub',
    name: 'SkillSpark Peer Learning Hub',
    timeline: 'Aug 2024 – Sep 2024',
    summary: 'Built a peer-to-peer mentoring marketplace with asynchronous lesson drops, playlist recommendations, and automated feedback loops.',
    description: 'Built a peer-to-peer mentoring marketplace with asynchronous lesson drops, playlist recommendations, and automated feedback loops.',
    link: '#skillspark',
    tools: ['React', 'Supabase', 'OpenAI APIs'],
    outcome: '1,600+ minutes of student-led sessions booked in beta.'
  },
  {
    title: 'CampusCare Wellbeing App',
    name: 'CampusCare Wellbeing App',
    timeline: 'Dec 2023 – Feb 2024',
    summary: 'Co-led a four-person team to ship daily wellbeing check-ins, anonymous journal prompts, and helpline integrations.',
    description: 'Co-led a four-person team to ship daily wellbeing check-ins, anonymous journal prompts, and helpline integrations.',
    link: '#campuscare',
    tools: ['React Native', 'Firebase', 'Figma'],
    outcome: 'Adopted by counselling cell; 78% weekly active retention.'
  }
];

const DEFAULT_EXPERIENCE = [
  {
    organisation: 'Product Incubator Lab',
    role: 'Student Product Engineer',
    period: 'May 2024 – Present',
    impact: [
      'Shipped scheduling intelligence platform used by 400+ students weekly.',
      'Documented design decisions and set up CI/CD pipelines to unblock a mixed-skill team.'
    ]
  },
  {
    organisation: 'SaaS Launchpad Collective',
    role: 'Product Design Intern',
    period: 'Jan 2024 – Apr 2024',
    impact: [
      'Led usability studies for an onboarding revamp that improved activation by 19%.',
      'Wrote product specs, user journeys, and developer handoff notes for freemium expansion.'
    ]
  },
  {
    organisation: 'Campus DevRel Guild',
    role: 'Community Lead',
    period: 'Aug 2023 – Dec 2023',
    impact: [
      'Hosted 18 peer-learning labs on TypeScript, Git, and design thinking.',
      'Launched mentorship pods pairing seniors and freshers with shared goals.'
    ]
  }
];

const DEFAULT_COURSEWORK = [
  'Human Computer Interaction – MITx MicroMasters (remote)',
  'Applied Machine Learning – Stanford Online (audit)',
  'Advanced Data Structures & Algorithms – University Core',
  'Product Management Studio – Campus Honors Cohort'
];

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Prof. Kavya Menon',
    role: 'Faculty Mentor, Product Lab',
    quote: 'Balances rigour with kindness. Turns vague problem statements into crisp execution roadmaps and keeps teams motivated.'
  },
  {
    name: 'Rohan Batra',
    role: 'Hackathon Teammate, EcoRoute',
    quote: 'Leads with clarity, defends the user, and still ships fast. Their documentation culture is a gold standard for student teams.'
  },
  {
    name: 'Neha Dhawan',
    role: 'Product Manager, SaaS Launchpad',
    quote: 'Joined as an intern and operated like a product owner by week two. Sharp instincts for prioritisation and stakeholder alignment.'
  }
];

const DEFAULT_FAQ = [
  { question: 'Where are you based?', answer: 'Currently in Bengaluru, India. Open to hybrid or remote-first internships and collaborations.' },
  { question: 'What roles excite you?', answer: 'Product engineering, UX engineering, or product management rotations that pair design thinking with measurable delivery.' },
  { question: 'Availability timeline?', answer: 'Available full-time from June 2025. Open to part-time consulting and research collaborations immediately.' },
  { question: 'How do you work?', answer: 'I set clear weekly rituals, document decisions, and communicate early. Love pairing with design, research, and GTM teams.' }
];

const DEFAULT_CONTACT_FIELDS = ['Full Name', 'Email', 'Organisation', 'Opportunity Type', 'Timeline', 'Message'];

const DEFAULT_CONTACT_NOTE = 'Share a short note about the role or collaboration, expected timeline, and how success will be measured. I usually reply in under 24 hours.';

const DEFAULT_LINKS = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/student-portfolio', icon: '🔗' },
  { label: 'GitHub', url: 'https://github.com/student-builder', icon: '💻' },
  { label: 'Behance', url: 'https://behance.net/student-design', icon: '🎨' }
];

function safeText(value: string | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value : fallback;
}

function ensureArray<T>(arrayLike: T[] | undefined, fallback: T[]): T[] {
  return arrayLike && arrayLike.length > 0 ? arrayLike : fallback;
}

function gatherSkillChips(skills: typeof DEFAULT_SKILLS): string[] {
  const chips: string[] = [];
  skills.forEach(group => chips.push(...group.items));
  return chips;
}

function getDescriptions(pics: string[], picDescriptions?: string[]) {
  if (picDescriptions && picDescriptions.length === pics.length) return picDescriptions;
  return pics.map((_, index) => picDescriptions?.[index] || `Project image ${index + 1}`);
}

function listFromArray(items: string[]): string {
  return items.map(item => `<li>${item}</li>`).join('');
}

export function generatePortfolioShowcaseLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections, instagram } = data;
  const descriptions = getDescriptions(pics, picDescriptions);
  const objective = safeText(sections?.callToAction, DEFAULT_OBJECTIVE);
  const about = safeText(sections?.about, DEFAULT_ABOUT);
  const skillGroups = ensureArray((sections as any)?.skills, DEFAULT_SKILLS);
  const achievements = ensureArray(sections?.features, DEFAULT_ACHIEVEMENTS);
  const projects = ensureArray((sections as any)?.services, DEFAULT_PROJECTS);
  const testimonials = ensureArray(sections?.testimonials, DEFAULT_TESTIMONIALS);
  const faqList = ensureArray(sections?.faq, DEFAULT_FAQ);
  const stats = ensureArray((sections as any)?.stats, DEFAULT_STATS);
  const experiences = ensureArray((sections as any)?.experience, DEFAULT_EXPERIENCE);
  const coursework = ensureArray((sections as any)?.coursework, DEFAULT_COURSEWORK);
  const links = ensureArray((sections as any)?.links, DEFAULT_LINKS);
  const fields = ensureArray(contact_fields, DEFAULT_CONTACT_FIELDS);
  const contactNote = safeText((sections as any)?.contactNote, DEFAULT_CONTACT_NOTE);
  const resumeUrl = safeText((sections as any)?.resumeUrl, '#');
  const availability = safeText((sections as any)?.availability, 'Open to Summer 2025 internships & product fellowships.');
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';
  const skillChips = gatherSkillChips(skillGroups);

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>
    body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:#f9fafb;color:#1f2937}
    .badge{box-shadow:0 10px 30px -15px rgba(79,70,229,0.45)}
    .timeline::before{content:'';position:absolute;left:calc(1rem + 2px);top:0;bottom:0;width:2px;background:linear-gradient(to bottom,rgba(79,70,229,.4),rgba(59,130,246,.2))}
    @media(min-width:768px){.timeline::before{left:50%;margin-left:-1px}}
  </style></head><body>
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <nav class="flex flex-wrap gap-3 text-sm text-gray-500 mb-6">
        <a href="#about" class="hover:text-${theme_color}-700 transition">About</a>
        <a href="#projects" class="hover:text-${theme_color}-700 transition">Projects</a>
        <a href="#experience" class="hover:text-${theme_color}-700 transition">Experience</a>
        <a href="#achievements" class="hover:text-${theme_color}-700 transition">Achievements</a>
        <a href="#gallery" class="hover:text-${theme_color}-700 transition">Gallery</a>
        <a href="#contact" class="hover:text-${theme_color}-700 transition">Contact</a>
      </nav>
      <span class="inline-flex items-center px-4 py-1 rounded-full bg-${theme_color}-100 text-${theme_color}-800 text-xs uppercase tracking-[0.4em]">Student Portfolio</span>
      <h1 class="mt-4 text-4xl sm:text-6xl font-bold text-${theme_color}-900">${title}</h1>
      <p class="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl">${safeText(tagline, 'Building equitable digital experiences that merge craft, code, and community impact.')}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div class="bg-${theme_color}-50 border border-${theme_color}-100 rounded-2xl p-4">
          <p class="text-xs uppercase tracking-[0.3em] text-${theme_color}-600">Objective</p>
          <p class="mt-2 text-sm sm:text-base text-${theme_color}-900 leading-relaxed">${objective}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-2xl p-4">
          <p class="text-xs uppercase tracking-[0.3em] text-gray-500">Availability</p>
          <p class="mt-2 text-sm text-gray-800 leading-relaxed">${availability}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-2xl p-4">
          <p class="text-xs uppercase tracking-[0.3em] text-gray-500">Email</p>
          <p class="mt-2 text-sm text-gray-800 break-words">${(sections as any)?.email || `${(instagram || 'student')}_portfolio@proton.me`}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-2xl p-4">
          <p class="text-xs uppercase tracking-[0.3em] text-gray-500">Location</p>
          <p class="mt-2 text-sm text-gray-800">${(sections as any)?.location || 'Bengaluru, India'}</p>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        ${stats.map(stat => `<div class="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
          <p class="text-2xl font-semibold text-${theme_color}-800">${stat.value}</p>
          <p class="mt-1 text-xs uppercase tracking-[0.35em] text-gray-500">${stat.label}</p>
        </div>`).join('')}
      </div>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="${resumeUrl}" class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-${theme_color}-600 text-white font-semibold hover:bg-${theme_color}-700 transition" target="_blank" rel="noopener">Download Résumé</a>
        ${links.map(link => `<a href="${link.url}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:border-${theme_color}-300 transition" target="_blank" rel="noopener">${link.icon ?? '🔗'} ${link.label}</a>`).join('')}
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 sm:px-6">
    <section id="about" class="py-12 sm:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article class="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <h2 class="text-3xl font-semibold text-${theme_color}-900">About</h2>
          <p class="mt-4 text-gray-700 leading-relaxed">${about}</p>
          <ul class="mt-6 space-y-3 text-sm text-gray-600">
            <li>• Loves distilling research insights into product guardrails.</li>
            <li>• Builds with accessibility and ethical data practices from day zero.</li>
            <li>• Enjoys mentoring, documenting, and scaling student communities.</li>
          </ul>
        </article>
        <aside class="lg:col-span-5 bg-${theme_color}-50 border border-${theme_color}-100 rounded-3xl p-8">
          <h3 class="text-2xl font-semibold text-${theme_color}-900">Skills & Tooling</h3>
          <div class="mt-4 space-y-4">
            ${skillGroups.map(group => `<div>
              <p class="text-xs uppercase tracking-[0.35em] text-${theme_color}-600">${group.category}</p>
              <p class="mt-2 text-sm text-gray-700">${group.items.join(', ')}</p>
            </div>`).join('')}
          </div>
        </aside>
      </div>
    </section>

    <section id="projects" class="py-12 sm:py-16 border-t border-gray-200">
      <h2 class="text-3xl font-semibold text-${theme_color}-900">Project Spotlights</h2>
      <div class="mt-8 space-y-8">
        ${projects.map(project => `<article class="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.35em] text-${theme_color}-600">${project.timeline || '2024'}</p>
              <h3 class="mt-2 text-2xl font-semibold text-gray-900">${project.title || project.name}</h3>
            </div>
            ${project.link ? `<a href="${project.link}" class="inline-flex items-center gap-2 text-${theme_color}-700 text-sm font-semibold" target="_blank" rel="noopener">View case study →</a>` : ''}
          </div>
          <p class="mt-4 text-gray-700 leading-relaxed">${project.description || project.summary || 'Documented full product lifecycle from discovery to launch.'}</p>
          <div class="mt-4 flex flex-wrap gap-2 text-xs text-${theme_color}-700 font-medium">
            ${(project.tools || []).map((tool: string) => `<span class="px-3 py-1 rounded-full bg-${theme_color}-100 border border-${theme_color}-200">${tool}</span>`).join('')}
          </div>
          <p class="mt-4 text-sm text-gray-600">Outcome: ${(project as any).outcome || 'Delivered measurable adoption uplift within 30 days.'}</p>
        </article>`).join('')}
      </div>
    </section>

    <section id="experience" class="py-12 sm:py-16 border-t border-gray-200">
      <h2 class="text-3xl font-semibold text-${theme_color}-900">Experience & Leadership</h2>
      <div class="mt-8 relative timeline">
        <div class="space-y-8">
          ${experiences.map((exp, index) => `<article class="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm relative md:w-[calc(50%-1.5rem)] md:${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}">
            <p class="text-xs uppercase tracking-[0.35em] text-${theme_color}-600">${exp.period || '2024'}</p>
            <h3 class="mt-2 text-xl font-semibold text-gray-900">${exp.role || 'Student Lead'}</h3>
            <p class="text-sm text-gray-600">${exp.organisation || 'Campus organisation'}</p>
            ${(exp.impact || []).length ? `<ul class="mt-4 text-sm text-gray-600 space-y-2 list-disc list-inside">${listFromArray(exp.impact as string[])}</ul>` : ''}
          </article>`).join('')}
        </div>
      </div>
    </section>

    <section id="achievements" class="py-12 sm:py-16 border-t border-gray-200">
      <h2 class="text-3xl font-semibold text-${theme_color}-900">Achievements & Impact</h2>
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        ${achievements.map(item => `<div class="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex gap-4">
          <span class="text-${theme_color}-600 text-2xl">🏅</span>
          <p class="text-sm text-gray-700 leading-relaxed">${item}</p>
        </div>`).join('')}
      </div>
    </section>

    ${pics.length ? `<section id="gallery" class="py-12 sm:py-16 border-t border-gray-200">
      <h2 class="text-3xl font-semibold text-${theme_color}-900">Gallery & Visual Explorations</h2>
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${pics.map((url, index) => `<figure class="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <img src="${url}" alt="${descriptions[index]}" loading="lazy" class="w-full h-60 object-cover" onerror="this.src='https://picsum.photos/900/600?random=${index}'">
          <figcaption class="px-5 py-3 text-xs text-gray-600 border-t">${descriptions[index]}</figcaption>
        </figure>`).join('')}
      </div>
    </section>` : ''}

    <section class="py-12 sm:py-16 border-t border-gray-200">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 class="text-3xl font-semibold text-${theme_color}-900">Testimonials</h2>
          <div class="mt-6 space-y-5">
            ${testimonials.map(testimonial => `<blockquote class="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <p class="text-sm text-gray-700 leading-relaxed">"${testimonial.quote}"</p>
              <footer class="mt-4 text-xs text-gray-500 font-semibold">${testimonial.name} • ${testimonial.role}</footer>
            </blockquote>`).join('')}
          </div>
        </div>
        <aside class="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h3 class="text-2xl font-semibold text-${theme_color}-900">Coursework & Certifications</h3>
          <ul class="mt-4 space-y-3 text-sm text-gray-700">
            ${coursework.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </aside>
      </div>
    </section>

    <section class="py-12 sm:py-16 border-t border-gray-200">
      <h2 class="text-3xl font-semibold text-${theme_color}-900">FAQs</h2>
      <div class="mt-6 space-y-4">
        ${faqList.map(item => `<article class="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-${theme_color}-900">${item.question}</h3>
          <p class="mt-2 text-sm text-gray-700 leading-relaxed">${item.answer}</p>
        </article>`).join('')}
      </div>
    </section>

    <section id="contact" class="py-12 sm:py-16 border-t border-gray-200">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <aside class="bg-${theme_color}-600 text-white rounded-3xl p-8 shadow-xl">
          <h2 class="text-3xl font-semibold">Let’s build something meaningful</h2>
          <p class="mt-4 text-${theme_color}-100 text-sm leading-relaxed">${contactNote}</p>
          ${instagram ? `<a href="https://instagram.com/${instagram}" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 mt-6 text-white text-sm" target="_blank" rel="noopener">Follow updates @${instagram}</a>` : ''}
        </aside>
        <form class="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm" onsubmit="submitContactForm(event)">
          <input type="hidden" name="websiteSlug" value="${websiteSlug}">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${fields.map(field => `<label class="text-sm font-medium text-gray-700">${field}
              <input type="${field.toLowerCase().includes('email') ? 'email' : field.toLowerCase().includes('phone') ? 'tel' : 'text'}" required class="mt-2 w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${theme_color}-500">
            </label>`).join('')}
          </div>
          <button type="submit" class="mt-6 w-full py-3 rounded-2xl bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Send message</button>
        </form>
      </div>
    </section>
  </main>

  <footer class="bg-white border-t border-gray-200 text-center py-6 text-sm text-gray-500">
    © 2025 ${title}. Crafted with <span class="text-red-500">❤</span> by <a href="https://vaaniweb.com" class="text-${theme_color}-700 font-semibold" target="_blank" rel="noopener">VaaniWeb</a>
  </footer>
  </body></html>`;
}

export function generatePortfolioCaseStudyLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;
  const descriptions = getDescriptions(pics, picDescriptions);
  const about = safeText(sections?.about, DEFAULT_ABOUT);
  const objective = safeText(sections?.callToAction, DEFAULT_OBJECTIVE);
  const achievements = ensureArray(sections?.features, DEFAULT_ACHIEVEMENTS);
  const projects = ensureArray((sections as any)?.services, DEFAULT_PROJECTS);
  const stats = ensureArray((sections as any)?.stats, DEFAULT_STATS);
  const experiences = ensureArray((sections as any)?.experience, DEFAULT_EXPERIENCE);
  const coursework = ensureArray((sections as any)?.coursework, DEFAULT_COURSEWORK);
  const testimonials = ensureArray(sections?.testimonials, DEFAULT_TESTIMONIALS);
  const fields = ensureArray(contact_fields, DEFAULT_CONTACT_FIELDS);
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>body{-webkit-font-smoothing:antialiased;background:#0f172a;color:#e2e8f0}</style></head><body>
  <header class="bg-gradient-to-br from-${theme_color}-800 via-${theme_color}-700 to-${theme_color}-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <p class="uppercase tracking-[0.4em] text-xs text-white/60">Student Case Study Portfolio</p>
      <h1 class="mt-4 text-4xl sm:text-6xl font-bold text-white">${title}</h1>
      <p class="mt-4 text-lg sm:text-xl text-${theme_color}-100 max-w-2xl leading-relaxed">${safeText(tagline, 'Product engineering student translating insights into resilient, high-ownership shipping culture.')}</p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        ${stats.map(stat => `<div class="bg-white/10 rounded-2xl p-4 text-center">
          <p class="text-2xl font-semibold text-white">${stat.value}</p>
          <p class="text-xs uppercase tracking-[0.35em] text-${theme_color}-100">${stat.label}</p>
        </div>`).join('')}
      </div>
      <div class="mt-8 bg-white/10 rounded-2xl p-5 max-w-3xl">
        <h2 class="text-sm uppercase tracking-[0.35em] text-${theme_color}-100">Objective</h2>
        <p class="mt-2 text-sm text-white leading-relaxed">${objective}</p>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
    <section class="bg-white rounded-3xl p-8 sm:p-10 shadow-xl text-gray-900">
      <h2 class="text-3xl font-semibold text-${theme_color}-800">Who I am</h2>
      <p class="mt-4 text-gray-700 leading-relaxed">${about}</p>
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <p class="font-semibold text-${theme_color}-700">Toolkit</p>
          <p class="mt-1">Next.js, React, TypeScript, Node.js, MongoDB, Supabase, LangChain</p>
        </div>
        <div>
          <p class="font-semibold text-${theme_color}-700">Superpowers</p>
          <p class="mt-1">Structured discovery, roadmap storytelling, async rituals, documentation</p>
        </div>
      </div>
    </section>

    <section class="mt-12 space-y-10">
      ${projects.map((project, index) => `<article class="bg-white rounded-3xl overflow-hidden shadow-xl text-gray-900">
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <div class="p-8">
            <p class="text-xs uppercase tracking-[0.35em] text-${theme_color}-600">${project.timeline || '2024'}</p>
            <h3 class="mt-3 text-3xl font-semibold text-gray-900">${project.title || project.name}</h3>
            <p class="mt-4 text-gray-700 leading-relaxed">${project.description || project.summary || 'Documented case study around building, launching, and iterating user-facing workflow.'}</p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Outcome: ${(project as any).outcome || 'Launched MVP with measurable adoption uplift.'}</li>
              <li>Team: ${(project as any).team || '4 collaborators across engineering, design, research.'}</li>
              <li>My Role: ${(project as any).role || 'Product Engineer & Facilitator'}</li>
            </ul>
            <div class="mt-4 flex flex-wrap gap-2 text-xs text-${theme_color}-700">
              ${(project.tools || []).map((tool: string) => `<span class="px-3 py-1 rounded-full bg-${theme_color}-100 border border-${theme_color}-200">${tool}</span>`).join('')}
            </div>
            ${project.link ? `<a href="${project.link}" class="mt-5 inline-flex items-center gap-2 text-${theme_color}-700 text-sm font-semibold" target="_blank" rel="noopener">Read full study →</a>` : ''}
          </div>
          <div class="relative">
            <img src="${pics[index] || pics[0] || 'https://picsum.photos/1200/800'}" alt="${descriptions[index] || project.title || 'Project visual'}" class="w-full h-full object-cover" loading="lazy" onerror="this.src='https://picsum.photos/1200/800?random=${index}'">
          </div>
        </div>
      </article>`).join('')}
    </section>

    <section class="mt-12 bg-white rounded-3xl p-8 sm:p-10 shadow-xl text-gray-900">
      <h2 class="text-3xl font-semibold text-${theme_color}-800">Experience Timeline</h2>
      <div class="mt-6 space-y-6">
        ${experiences.map(exp => `<article class="border border-gray-200 rounded-2xl p-6">
          <p class="text-xs uppercase tracking-[0.35em] text-${theme_color}-600">${exp.period || '2024'}</p>
          <h3 class="mt-2 text-xl font-semibold text-gray-900">${exp.role || 'Student Lead'}</h3>
          <p class="text-sm text-gray-600">${exp.organisation || 'Campus organisation'}</p>
          ${(exp.impact || []).length ? `<ul class="mt-4 space-y-2 text-sm text-gray-600 list-disc list-inside">${listFromArray(exp.impact as string[])}</ul>` : ''}
        </article>`).join('')}
      </div>
    </section>

    <section class="mt-12 bg-gradient-to-br from-${theme_color}-600 to-${theme_color}-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <h2 class="text-3xl font-semibold">Highlights & Awards</h2>
          <ul class="mt-4 space-y-3 text-sm text-white/90">
            ${achievements.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>
        <aside class="bg-white/10 rounded-2xl p-6">
          <h3 class="text-lg font-semibold">Coursework</h3>
          <ul class="mt-3 space-y-2 text-sm text-white/80">
            ${coursework.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </aside>
      </div>
    </section>

    <section class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-900">
      ${testimonials.map(testimonial => `<blockquote class="bg-white rounded-3xl p-6 shadow-xl border border-${theme_color}-100">
        <p class="text-sm text-gray-700 leading-relaxed">"${testimonial.quote}"</p>
        <footer class="mt-4 text-xs text-gray-500 font-semibold">${testimonial.name} • ${testimonial.role}</footer>
      </blockquote>`).join('')}
    </section>

    <section class="mt-12 bg-white rounded-3xl p-8 sm:p-10 shadow-xl text-gray-900">
      <h2 class="text-3xl font-semibold text-${theme_color}-800">Connect</h2>
      <p class="mt-2 text-sm text-gray-600">Drop a note about the opportunity, expected timeline, and what success looks like.</p>
      <form class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4" onsubmit="submitContactForm(event)">
        <input type="hidden" name="websiteSlug" value="${websiteSlug}">
        ${fields.map(field => `<label class="text-sm font-medium text-gray-700">${field}
          <input type="${field.toLowerCase().includes('email') ? 'email' : field.toLowerCase().includes('phone') ? 'tel' : 'text'}" required class="mt-2 w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${theme_color}-500">
        </label>`).join('')}
        <div class="sm:col-span-2">
          <button type="submit" class="w-full py-3 rounded-2xl bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Schedule a chat</button>
        </div>
      </form>
    </section>
  </main>

  <footer class="mt-12 text-center text-sm text-${theme_color}-100 pb-8">
    © 2025 ${title}. Crafted with care and coffee.
  </footer>
  </body></html>`;
}

export function generatePortfolioMinimalMasonryLayout(data: GeneratedPageData): string {
  const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;
  const descriptions = getDescriptions(pics, picDescriptions);
  const objective = safeText(sections?.callToAction, DEFAULT_OBJECTIVE);
  const skillGroups = ensureArray((sections as any)?.skills, DEFAULT_SKILLS);
  const stats = ensureArray((sections as any)?.stats, DEFAULT_STATS);
  const fields = ensureArray(contact_fields, DEFAULT_CONTACT_FIELDS);
  const achievements = ensureArray(sections?.features, DEFAULT_ACHIEVEMENTS);
  const formScript = generateContactFormScript();
  const websiteSlug = (data as any).slug || '';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>.masonry{column-gap:1.5rem}.masonry>*{break-inside:avoid;margin-bottom:1.5rem}body{background:#0e0f16;color:#f9fafc}</style></head><body>
  <main class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
    <section class="bg-${theme_color}-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
      <p class="uppercase tracking-[0.4em] text-xs text-white/70">Emerging technologist</p>
      <h1 class="mt-4 text-4xl sm:text-5xl font-bold">${title}</h1>
      <p class="mt-4 text-base sm:text-lg text-white/85 max-w-3xl leading-relaxed">${safeText(tagline, 'Documenting the journey of building user-first products, communities, and resilient systems.')}</p>
      <div class="mt-6 bg-white/10 rounded-2xl p-5 text-sm text-white/80">${objective}</div>
      <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        ${stats.map(stat => `<div class="bg-white/10 rounded-2xl p-4">
          <p class="text-2xl font-semibold text-white">${stat.value}</p>
          <p class="mt-2 text-xs uppercase tracking-[0.35em] text-white/70">${stat.label}</p>
        </div>`).join('')}
      </div>
    </section>

    <section class="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <aside class="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 text-gray-900 shadow-xl">
        <h2 class="text-2xl font-semibold text-${theme_color}-800">Skills & Focus Areas</h2>
        <div class="mt-5 space-y-4">
          ${skillGroups.map(group => `<div>
            <p class="text-xs uppercase tracking-[0.35em] text-${theme_color}-600">${group.category}</p>
            <p class="mt-2 text-sm text-gray-700">${group.items.join(', ')}</p>
          </div>`).join('')}
        </div>
        <div class="mt-6 border-t border-gray-200 pt-6">
          <h3 class="text-lg font-semibold text-${theme_color}-800">Highlights</h3>
          <ul class="mt-3 space-y-2 text-sm text-gray-600">
            ${achievements.slice(0, 3).map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>
        <form class="mt-6 space-y-3" onsubmit="submitContactForm(event)">
          <input type="hidden" name="websiteSlug" value="${websiteSlug}">
          ${fields.slice(0, 4).map(field => `<label class="text-sm font-medium text-gray-700">${field}
            <input type="${field.toLowerCase().includes('email') ? 'email' : field.toLowerCase().includes('phone') ? 'tel' : 'text'}" required class="mt-2 w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${theme_color}-500">
          </label>`).join('')}
          <button type="submit" class="w-full py-3 rounded-2xl bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Start a conversation</button>
        </form>
      </aside>
      <section class="lg:col-span-8">
        <div class="masonry">
          ${pics.map((url, index) => `<figure class="bg-white rounded-3xl shadow-xl overflow-hidden">
            <img src="${url}" alt="${descriptions[index] || title}" loading="lazy" class="w-full object-cover" onerror="this.src='https://picsum.photos/900/600?random=${index}'">
            <figcaption class="px-5 py-3 text-xs text-gray-600 border-t">${descriptions[index] || 'Project exploration'}</figcaption>
          </figure>`).join('')}
        </div>
      </section>
    </section>
  </main>

  <footer class="text-center text-xs text-white/70 py-6">
    © 2025 ${title}. Crafted with <span class="text-pink-400">❤</span> by <a href="https://vaaniweb.com" class="text-${theme_color}-300" target="_blank" rel="noopener">VaaniWeb</a>
  </footer>
  </body></html>`;
}
