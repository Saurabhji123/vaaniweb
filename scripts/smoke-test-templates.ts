import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { generatePortfolioShowcaseLayout } from '@/app/lib/templates/portfolio-templates';
import { generateEventNeonLayout } from '@/app/lib/templates/event-templates';
import { GeneratedPageData } from '@/app/types';

const portfolioData: GeneratedPageData = {
  title: 'Ananya Gupta',
  tagline: 'Product Engineer • UX Systems • Community Builder',
  theme_color: 'purple',
  pics: [
    'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80'
  ],
  contact_fields: ['Full Name', 'Email', 'Portfolio Link', 'Message'],
  slug: 'ananya-gupta',
  sections: {
    about: 'I craft thoughtful product experiences at the intersection of design systems and applied ML. I love leading student engineering teams and mentoring early founders.',
    features: [
      'Winner, Smart India Hackathon 2024 (Campus finals)',
      'Led “CampusCare” mental wellness app adopted by 3 clubs',
      'AWS Cloud Practitioner • Global Ambassador, Major League Hacking'
    ],
    callToAction: 'Let’s collaborate on high-impact products and inclusive tech communities.',
    services: [
      {
        title: 'EcoRoute Logistics Optimizer',
        description: 'Designed telemetry dashboards and ML-based route ranking. Reduced delivery miles by 17% across pilot fleet.',
        timeline: 'Jan 2025 – Mar 2025',
        role: 'Product Engineer',
        team: '4 members',
        outcome: 'Adopted by logistics partner covering 35+ routes'
      },
      {
        title: 'SkillSpark Learning Hub',
        description: 'Built peer-to-peer mentoring flow with adaptive playlists, launching inside university LMS.',
        timeline: 'Sep 2024 – Nov 2024',
        role: 'Product Owner'
      }
    ],
    testimonials: [
      {
        name: 'Dr. Ramesh Iyer',
        role: 'Professor, Computer Science',
        quote: 'Balances research depth with practical delivery. Ananya’s teams consistently top project showcases.'
      }
    ],
    faq: [
      { question: 'Preferred internship duration?', answer: '10-12 weeks during the summer of 2025 with flexibility for remote collaboration.' }
    ],
    skills: [
      { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
      { category: 'Backend', items: ['Node.js', 'MongoDB', 'Python'] },
      { category: 'Product', items: ['Roadmapping', 'Design systems', 'User research'] }
    ],
    focus: 'Product engineering • UX systems • Data-informed roadmaps',
    roles: 'Product engineering intern • UX engineer • Technical PM',
    availability: 'Available June 2025',
    gpa: 'CGPA 8.7 / 10',
    location: 'Bengaluru, India'
  }
};

const eventData: GeneratedPageData = {
  title: 'Campus Innovation Summit 2025',
  tagline: 'Where product leaders, founders, and student innovators co-create the next wave of experiences.',
  theme_color: 'indigo',
  pics: [
    'https://images.unsplash.com/photo-1518609571773-39b7d303a82c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
  ],
  contact_fields: ['Full Name', 'Email', 'Organization', 'Pass Type', 'Message'],
  slug: 'campus-innovation-summit',
  sections: {
    about: 'The premier student-led conference spotlighting product strategy, design, AI, and startup execution across campuses in India.',
    callToAction: 'Secure your delegate pass before we hit capacity.',
    features: [
      'Flagship keynote theatre featuring product, design, and AI leaders.',
      'Hands-on labs on journey mapping, analytics, and rapid prototyping.',
      'Career studio with portfolio reviews and recruiter meet-ups.'
    ],
    services: [
      { title: 'Arrival & accreditation', description: 'Dedicated delegate lounges, sponsor walk-throughs, and curated welcome kits.' },
      { title: 'Masterclasses', description: 'Parallel tracks covering AI productisation, growth analytics, and UX leadership.' }
    ],
    testimonials: [
      { name: 'Ritika Sharma', role: 'Marketing Lead, Northwave Studios', quote: 'Our lounge stayed booked throughout the day. Brilliant production and delegate mix.' }
    ],
    deadline: '2025-07-10T09:00:00.000+05:30',
    location: 'Innovation Centre, Bengaluru',
    date: '12 July 2025'
  }
};

const portfolioHtml = generatePortfolioShowcaseLayout(portfolioData);
const eventHtml = generateEventNeonLayout(eventData);

const outputDir = join(process.cwd(), '.next', 'smoke');
const portfolioPath = join(outputDir, 'portfolio-showcase.html');
const eventPath = join(outputDir, 'event-neon.html');

mkdirSync(outputDir, { recursive: true });

writeFileSync(portfolioPath, portfolioHtml, 'utf8');
writeFileSync(eventPath, eventHtml, 'utf8');

console.log('Generated portfolio showcase preview →', portfolioPath);
console.log('Generated event neon preview →', eventPath);

console.log('Portfolio HTML length:', portfolioHtml.length);
console.log('Event HTML length:', eventHtml.length);
