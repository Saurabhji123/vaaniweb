import { GeneratedPageData } from '../../types';
import { generateContactFormScript } from '../form-generator';

const DEFAULT_EVENT_FEATURES: string[] = [
	'Glow-rave arena with UV visuals, live VJ sets, and surprise headline drops',
	'24/7 creator lab for reels, podcasts, and lightning design sprints',
	'Immersive XR playground powered by AR quests and VR motion rigs',
	'Campus esports colosseum featuring Valorant, FC24, and retro arcade throwdowns',
	'Street food rally with 30+ pop-ups curated by student entrepreneurs',
	'Sustainability alley with upcycled merch and climate action workshops',
	'Investor lounge for founders, mentors, and scouts to co-create deal flow',
	'Late-night jam pit with indie bands, spoken word, and cypher circles',
	'Sunrise wellness reset: rooftop yoga, breathwork, and slow coffee tastings'
];

const DEFAULT_EVENT_SCHEDULE: Array<{ title: string; description: string }> = [
	{ title: 'Gate crash + check-in carnival', description: 'QR code check-in, swag pick-up, and live DJ welcome tunnel running till 10:00 AM.' },
	{ title: 'Main stage kickoff & hype keynote', description: 'Festival directors unveil this year’s narrative, spotlight ambassadors, and drop the headliner names.' },
	{ title: 'Creator lab sprints', description: 'Niche tracks on short-form storytelling, beat production, AI-assisted visuals, and personal brand playbooks.' },
	{ title: 'Showcase battles & demo day', description: 'Startup pitches, dance offs, beatbox finals, fashion runway, and the student innovation leaderboard.' },
	{ title: 'Golden hour collabs', description: 'Open-mic mashups, cross-club performances, live art walls, and meet-the-artist sessions.' },
	{ title: 'Afterburn party & chill zone', description: 'Silent disco, neon bowling, midnight ramen pop-up, and acoustic wind-down till 2:00 AM.' }
];

const DEFAULT_EVENT_TESTIMONIALS: Array<{ name: string; role: string; quote: string; rating?: number }> = [
	{ name: 'Ritika Sharma', role: 'Marketing Lead, Northwave Studios', quote: 'The sonic staging, volunteer coordination, and storytelling made our brand the talk of campus for weeks. We closed two partnerships on-site.', rating: 5 },
	{ name: 'Aditya Rao', role: 'President, Aurora Cultural Collective', quote: 'Every zone pulsed with energy—from the jam pit to the VR lab. The production team turned raw ideas into pure festival magic.', rating: 5 },
	{ name: 'Priya Menon', role: 'Head of Community, IndieJam', quote: 'Workshops, showcases, and networking lounges flowed seamlessly. Students left with mentors, collaborators, and new offers.', rating: 5 }
];

const DEFAULT_EVENT_CONTACT_FIELDS: string[] = ['Full Name', 'Email', 'Phone', 'Organization / College', 'Pass Type', 'Team Size', 'Message'];

type SectionsRecord = Record<string, unknown> | undefined;

function getSectionValue<T>(sections: SectionsRecord, key: string, fallback: T): T {
	if (sections && typeof sections[key] !== 'undefined' && sections[key] !== null) {
		return sections[key] as T;
	}
	return fallback;
}

function getDescriptions(pics: string[], picDescriptions?: string[]) {
	if (picDescriptions && picDescriptions.length === pics.length) {
		return picDescriptions;
	}
	if (picDescriptions && picDescriptions.length) {
		return pics.map((_, index) => picDescriptions[index] || `Event image ${index + 1}`);
	}
	return pics.map((_, index) => `Event image ${index + 1}`);
}

function resolveInputType(field: string): 'email' | 'tel' | 'textarea' | 'number' | 'text' {
	const lower = field.toLowerCase();
	if (lower.includes('email')) return 'email';
	if (lower.includes('phone') || lower.includes('mobile') || lower.includes('contact')) return 'tel';
	if (lower.includes('message') || lower.includes('notes') || lower.includes('requirement') || lower.includes('query')) return 'textarea';
	if (lower.includes('team') || lower.includes('people') || lower.includes('attendee') || lower.includes('count') || lower.includes('size')) return 'number';
	return 'text';
}

function renderField(field: string, themeColor: string, variant: 'light' | 'dark' = 'light'): string {
	const type = resolveInputType(field);
	const nameAttr = field.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'field';
	const focusRing = `focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`;
	const labelClass = variant === 'dark' ? 'text-sm font-medium text-slate-200' : 'text-sm font-medium text-gray-700';
	const inputClass = variant === 'dark'
		? `mt-1 w-full px-4 py-2.5 border border-slate-700/60 rounded-2xl bg-slate-900/60 text-white placeholder-slate-400 ${focusRing}`
		: `mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-2xl bg-white text-gray-900 placeholder-gray-400 ${focusRing}`;

	if (type === 'textarea') {
		return `<label class="${labelClass}">${field}<textarea name="${nameAttr}" required rows="4" class="${inputClass} resize-y"></textarea></label>`;
	}

	const minAttr = type === 'number' ? ' min="0"' : '';
	return `<label class="${labelClass}">${field}<input name="${nameAttr}" type="${type}"${minAttr} required class="${inputClass}"></label>`;
}

function neonIcon(index: number): string {
	const icons = ['⚡', '🎧', '🚀', '🌈', '🔥', '🎉', '🎮', '🪩'];
	return icons[index % icons.length];
}

function countdownScript(fallbackDays = 7): string {
	return `
(function(){
	var el = document.getElementById('countdown');
	if(!el) return;
	var attr = el.getAttribute('data-deadline');
	var target = attr ? new Date(attr) : new Date(Date.now() + ${fallbackDays} * 86400000);
	var intervalId;
	function pad(value){
		return value < 10 ? '0' + value : '' + value;
	}
	function update(){
		var now = new Date();
		var diff = target.getTime() - now.getTime();
		if(diff <= 0){
			el.textContent = 'Event live';
			if(intervalId){ clearInterval(intervalId); }
			return;
		}
		var days = Math.floor(diff / 86400000);
		var hours = Math.floor((diff % 86400000) / 3600000);
		var minutes = Math.floor((diff % 3600000) / 60000);
		el.textContent = days + 'd ' + pad(hours) + 'h ' + pad(minutes) + 'm';
	}
	update();
	intervalId = setInterval(update, 60000);
})();
`.trim();
}

export function generateEventNeonLayout(data: GeneratedPageData): string {
	const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;

	const descriptions = getDescriptions(pics, picDescriptions);
	const features = sections?.features?.length ? sections.features : DEFAULT_EVENT_FEATURES;
	const schedule = sections?.services?.length ? sections.services : DEFAULT_EVENT_SCHEDULE;
	const testimonials = sections?.testimonials?.length ? sections.testimonials : DEFAULT_EVENT_TESTIMONIALS;
	const fields = contact_fields?.length ? contact_fields : DEFAULT_EVENT_CONTACT_FIELDS;
	const about = sections?.about || data.description || `Welcome to ${title}, where creativity takes the main stage.`;
	const heroCta = sections?.callToAction || 'Secure your passes before they sell out.';
	const sectionData = sections as SectionsRecord;
	const location = getSectionValue(sectionData, 'location', 'Techno Arena, City Convention Center');
	const date = getSectionValue(sectionData, 'date', '12 July 2025');
	const deadline = getSectionValue(sectionData, 'deadline', '');
	const formScript = generateContactFormScript();
	const websiteSlug = data.slug ?? '';

	return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>body{font-family:'Inter',sans-serif}.neon-border{box-shadow:0 0 28px rgba(129,140,248,0.45)}.glass-panel{background:rgba(15,23,42,0.65);backdrop-filter:blur(18px)}</style></head><body class="bg-slate-950 text-white">
<header class="relative overflow-hidden border-b border-${theme_color}-500/40">
	<div class="absolute inset-0 bg-gradient-to-br from-${theme_color}-600/30 via-purple-600/20 to-sky-500/20"></div>
	<div class="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
		<div class="flex flex-col gap-6 max-w-3xl">
			<span class="inline-flex items-center gap-2 w-max px-5 py-2 rounded-full bg-white/10 border border-white/20 uppercase tracking-[0.35em] text-xs">Student festival</span>
			<h1 class="text-4xl sm:text-6xl font-extrabold leading-tight text-white">${title}</h1>
			<p class="text-lg sm:text-2xl text-slate-200/90">${tagline}</p>
			<p class="text-sm sm:text-base text-slate-300/80">${about}</p>
			<div class="flex flex-wrap gap-3 text-sm text-slate-200/80">
				<span class="px-4 py-2 rounded-full bg-white/10 border border-${theme_color}-400/40">${location}</span>
				<span class="px-4 py-2 rounded-full bg-white/10 border border-${theme_color}-400/40">${date}</span>
				<span class="px-4 py-2 rounded-full bg-white/10 border border-${theme_color}-400/40">${heroCta}</span>
			</div>
			<div id="countdown" class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 border border-${theme_color}-400/40 text-sm" data-deadline="${deadline}">Loading countdown…</div>
		</div>
	</div>
	<div class="absolute -right-20 -bottom-20 sm:-right-10 sm:-bottom-10 w-64 sm:w-96 aspect-square rounded-full bg-${theme_color}-500/20 blur-3xl"></div>
</header>

<section class="max-w-6xl mx-auto px-5 sm:px-8 py-14">
	<h2 class="text-3xl sm:text-4xl font-bold mb-8 text-white">Why this night hits different</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
		${features.slice(0, 6).map((feature, index) => `<article class="glass-panel border border-white/10 rounded-3xl p-6 sm:p-7 flex flex-col gap-3 neon-border">
			<span class="text-3xl">${neonIcon(index)}</span>
			<p class="text-lg font-semibold text-white/90">${feature}</p>
		</article>`).join('')}
	</div>
</section>

<section class="max-w-6xl mx-auto px-5 sm:px-8 py-14">
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
		<div class="lg:col-span-2 space-y-5">
			<h2 class="text-3xl sm:text-4xl font-bold text-white">Line-up & flow</h2>
			${schedule.slice(0, 6).map((slot, index) => `<div class="glass-panel rounded-3xl p-6 border border-white/10 flex gap-5">
				<div class="flex-shrink-0 w-16 h-16 rounded-2xl bg-${theme_color}-500/20 flex items-center justify-center text-xl font-semibold text-${theme_color}-100">${index + 1}</div>
				<div class="space-y-2">
					<p class="text-lg font-semibold text-white/90">${slot.title || `Session ${index + 1}`}</p>
					<p class="text-sm text-slate-300/90">${slot.description || 'Details coming soon.'}</p>
				</div>
			</div>`).join('')}
		</div>
		<aside class="glass-panel rounded-3xl p-6 border border-white/10">
			<h3 class="text-2xl font-semibold mb-4 text-white">Crowd reactions</h3>
			<div class="space-y-4">
				${testimonials.slice(0, 3).map(testimonial => `<blockquote class="bg-black/30 border border-white/10 rounded-2xl p-4">
					<div class="text-yellow-300 text-sm mb-1">${'★'.repeat(testimonial.rating || 5)}</div>
					<p class="text-sm text-slate-200/90">"${testimonial.quote}"</p>
					<footer class="mt-3 text-xs text-slate-300/80">${testimonial.name} • ${testimonial.role}</footer>
				</blockquote>`).join('')}
			</div>
		</aside>
	</div>
</section>

<section class="max-w-6xl mx-auto px-5 sm:px-8 py-14">
	<h2 class="text-3xl sm:text-4xl font-bold mb-8 text-white">Festival snapshots</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
		${pics.slice(0, 6).map((url, index) => `<figure class="relative overflow-hidden rounded-3xl border border-white/10 aspect-video group">
			<img src="${url}" alt="${descriptions[index] || `Festival shot ${index + 1}`}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" onerror="this.src='https://picsum.photos/800/450?random=${index}'">
			<figcaption class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-sm text-white/80 p-4">${descriptions[index] || ''}</figcaption>
		</figure>`).join('')}
	</div>
</section>

<section class="max-w-3xl mx-auto px-5 sm:px-8 py-16">
	<form class="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5" onsubmit="submitContactForm(event)">
		<input type="hidden" name="websiteSlug" value="${websiteSlug}">
		<h3 class="text-2xl sm:text-3xl font-semibold text-white">Lock your crew in</h3>
		<p class="text-sm text-slate-300/80">Drop your details and our team will confirm passes, group perks, and backstage upgrades.</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			${fields.map(field => renderField(field, theme_color, 'dark')).join('')}
		</div>
		<button type="submit" class="w-full py-3 rounded-2xl bg-${theme_color}-500 hover:bg-${theme_color}-400 transition font-semibold text-white">Reserve spots</button>
	</form>
</section>

<footer class="border-t border-${theme_color}-500/30 py-6 text-center text-sm text-slate-300/80">
	© 2025 ${title}. Powered by <a href="https://vaaniweb.com" class="text-${theme_color}-200 font-semibold" target="_blank" rel="noopener">VaaniWeb</a>
</footer>
<script>${countdownScript(9)}</script>
</body></html>`;
}

export function generateEventElegantLayout(data: GeneratedPageData): string {
	const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;

	const descriptions = getDescriptions(pics, picDescriptions);
	const features = sections?.features?.length ? sections.features : DEFAULT_EVENT_FEATURES;
	const schedule = sections?.services?.length ? sections.services : DEFAULT_EVENT_SCHEDULE;
	const testimonials = sections?.testimonials?.length ? sections.testimonials : DEFAULT_EVENT_TESTIMONIALS;
	const fields = contact_fields?.length ? contact_fields : DEFAULT_EVENT_CONTACT_FIELDS;
	const sectionData = sections as SectionsRecord;
	const location = getSectionValue(sectionData, 'location', 'Convention Hall A, Innovation District');
	const date = getSectionValue(sectionData, 'date', '18 August 2025');
	const deadline = getSectionValue(sectionData, 'deadline', '');
	const stats = getSectionValue(sectionData, 'cta', '500+ delegates • 40 speakers • 12 workshops');
	const about = sections?.about || data.description || `An elevated summit curated by ${title}.`;
	const formScript = generateContactFormScript();
	const websiteSlug = data.slug ?? '';

	return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>body{font-family:'Manrope',sans-serif}.card-shadow{box-shadow:0 28px 60px -28px rgba(15,23,42,0.20)}</style></head><body class="bg-white text-slate-900">
<header class="bg-gradient-to-b from-${theme_color}-50 via-white to-white border-b border-${theme_color}-100">
	<div class="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
		<span class="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white border border-${theme_color}-200 text-${theme_color}-700 uppercase tracking-[0.35em] text-xs">Leadership summit</span>
		<h1 class="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight text-${theme_color}-900">${title}</h1>
		<p class="mt-4 text-lg sm:text-2xl text-${theme_color}-700 max-w-3xl mx-auto leading-relaxed">${tagline}</p>
		<p class="mt-4 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">${about}</p>
		<div class="mt-6 flex flex-wrap justify-center gap-3 text-sm text-${theme_color}-800">
			<span class="px-3 py-1.5 bg-${theme_color}-100 rounded-full">${location}</span>
			<span class="px-3 py-1.5 bg-${theme_color}-100 rounded-full">${date}</span>
			<span class="px-3 py-1.5 bg-${theme_color}-100 rounded-full">${stats}</span>
		</div>
		<div id="countdown" class="mt-6 inline-flex items-center px-5 py-2 rounded-full border border-${theme_color}-300 text-${theme_color}-800" data-deadline="${deadline}">Countdown loading…</div>
	</div>
</header>

<section class="max-w-7xl mx-auto px-5 sm:px-8 py-12">
	<h2 class="text-3xl sm:text-4xl font-bold mb-6 text-${theme_color}-900">Keynote roster</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		${pics.slice(0, 6).map((url, index) => `<article class="rounded-3xl border border-${theme_color}-100 card-shadow overflow-hidden bg-white">
			<img src="${url}" alt="${descriptions[index]}" class="w-full h-60 object-cover" loading="lazy" onerror="this.src='https://picsum.photos/600/400?random=${index}'">
			<div class="p-5">
				<p class="text-lg font-semibold text-slate-900">${descriptions[index] || 'Keynote ' + (index + 1)}</p>
				<p class="text-sm text-slate-500 mt-1">${['Impact Investor', 'Product Leader', 'Chief Futurist', 'Growth Strategist', 'Media Host', 'Design Exec'][index % 6]}</p>
			</div>
		</article>`).join('')}
	</div>
</section>

<section class="max-w-7xl mx-auto px-5 sm:px-8 py-10">
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<div class="lg:col-span-2">
			<h2 class="text-3xl sm:text-4xl font-bold mb-6 text-${theme_color}-900">Agenda at a glance</h2>
			<div class="space-y-4">
				${schedule.map((slot, index) => `<div class="flex gap-4 p-5 rounded-3xl border border-slate-200 bg-white">
					<div class="flex-none w-24 text-${theme_color}-700 font-semibold">${(9 + index)}:00</div>
					<div>
						<p class="font-semibold text-slate-900">${slot.title || `Session ${index + 1}`}</p>
						<p class="text-slate-600 text-sm leading-relaxed">${slot.description || 'Details coming soon.'}</p>
					</div>
				</div>`).join('')}
			</div>
		</div>
		<aside class="bg-${theme_color}-50 border border-${theme_color}-100 rounded-3xl p-6 lg:p-8">
			<h3 class="text-2xl font-semibold text-${theme_color}-900">Why leaders attend</h3>
			<ul class="mt-4 space-y-3 text-${theme_color}-800">
				${features.slice(0, 6).map(feature => `<li class="flex items-start gap-3"><span class="mt-1 text-${theme_color}-500">•</span><span>${feature}</span></li>`).join('')}
			</ul>
		</aside>
	</div>
</section>

<section class="max-w-7xl mx-auto px-5 sm:px-8 py-10">
	<h3 class="text-3xl font-bold text-${theme_color}-900 mb-6">Community voices</h3>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		${testimonials.map(testimonial => `<blockquote class="rounded-3xl border border-${theme_color}-100 bg-white p-6 shadow-sm">
			<div class="text-yellow-400 mb-2">${'★'.repeat(testimonial.rating || 5)}</div>
			<p class="text-slate-700 italic leading-relaxed">"${testimonial.quote}"</p>
			<footer class="mt-3">
				<p class="font-semibold text-${theme_color}-900">${testimonial.name}</p>
				<p class="text-sm text-slate-500">${testimonial.role}</p>
			</footer>
		</blockquote>`).join('')}
	</div>
</section>

<section class="max-w-3xl mx-auto px-5 sm:px-8 py-12">
	<form class="bg-white border border-${theme_color}-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-5" onsubmit="submitContactForm(event)">
		<input type="hidden" name="websiteSlug" value="${websiteSlug}">
		<h3 class="text-2xl font-semibold text-${theme_color}-900">Secure your delegate pass</h3>
		<p class="mt-2 text-sm text-slate-600">Priority access for CXOs, founders, and campus ambassadors. Group discounts available.</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			${fields.map(field => renderField(field, theme_color, 'light')).join('')}
		</div>
		<button type="submit" class="w-full py-3 rounded-2xl bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Book seat</button>
	</form>
</section>

<footer class="bg-${theme_color}-50 border-t border-${theme_color}-100 text-center py-6 text-sm text-${theme_color}-900">
	© 2025 ${title}. All rights reserved. | Crafted by <a href="https://vaaniweb.com" class="font-semibold text-${theme_color}-800" target="_blank" rel="noopener">VaaniWeb</a>
</footer>
<script>${countdownScript(10)}</script>
</body></html>`;
}

export function generateEventCampusCarnivalLayout(data: GeneratedPageData): string {
	const { title, tagline, theme_color, pics, picDescriptions, contact_fields, sections } = data;

	const descriptions = getDescriptions(pics, picDescriptions);
	const features = sections?.features?.length ? sections.features : DEFAULT_EVENT_FEATURES;
	const schedule = sections?.services?.length ? sections.services : DEFAULT_EVENT_SCHEDULE;
	const fields = contact_fields?.length ? contact_fields : DEFAULT_EVENT_CONTACT_FIELDS;
	const sectionData = sections as SectionsRecord;
	const location = getSectionValue(sectionData, 'location', 'All Campus Lawns + Auditorium');
	const date = getSectionValue(sectionData, 'date', '29–31 August 2025');
	const deadline = getSectionValue(sectionData, 'deadline', '');
	const formScript = generateContactFormScript();
	const websiteSlug = data.slug ?? '';

	const zones = features.slice(0, 6).map((feature, index) => ({
		name: feature.split(':')[0].slice(0, 32) || `Zone ${index + 1}`,
		icon: ['🎮', '🎨', '🎤', '⚽', '📷', '🍔'][index % 6],
		blurb: feature
	}));

	return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"><title>${title}</title><script src="https://cdn.tailwindcss.com"></script>${formScript}<style>.mesh{background:radial-gradient(ellipse_at_top_left,rgba(79,70,229,.18),transparent 35%),radial-gradient(ellipse_at_top_right,rgba(236,72,153,.16),transparent 40%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,.18),transparent 45%)}</style></head><body class="bg-white text-slate-900">
<header class="mesh border-b border-${theme_color}-200">
	<div class="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 text-center">
		<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-${theme_color}-300 text-${theme_color}-800 uppercase tracking-[0.3em] text-xs">Campus carnival</span>
		<h1 class="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-${theme_color}-900">${title}</h1>
		<p class="mt-4 text-lg sm:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed">${tagline}</p>
		<div class="mt-5 flex flex-wrap justify-center gap-3 text-sm text-${theme_color}-800">
			<span class="px-3 py-1.5 bg-white border border-${theme_color}-200 rounded-full">${location}</span>
			<span class="px-3 py-1.5 bg-white border border-${theme_color}-200 rounded-full">${date}</span>
		</div>
		<div id="countdown" class="mt-6 inline-flex items-center px-5 py-2 rounded-full border border-${theme_color}-200 text-${theme_color}-800" data-deadline="${deadline}">Starts in…</div>
	</div>
</header>

<section class="max-w-7xl mx-auto px-5 sm:px-8 py-10">
	<h2 class="text-3xl font-bold mb-5 text-${theme_color}-900">Zones & pop-ups</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
		${zones.map(zone => `<article class="rounded-3xl border border-${theme_color}-100 bg-${theme_color}-50 p-6 shadow-sm">
			<div class="flex items-center gap-3">
				<span class="text-3xl">${zone.icon}</span>
				<h3 class="text-xl font-semibold text-${theme_color}-900">${zone.name}</h3>
			</div>
			<p class="mt-3 text-sm text-slate-700 leading-relaxed">${zone.blurb}</p>
		</article>`).join('')}
	</div>
</section>

<section class="max-w-7xl mx-auto px-5 sm:px-8 py-8">
	<h2 class="text-3xl font-bold mb-5 text-${theme_color}-900">Campus highlights</h2>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		${pics.slice(0, 8).map((url, index) => `<figure class="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
			<img src="${url}" alt="${descriptions[index] || title}" class="w-full h-44 object-cover hover:scale-110 transition" loading="lazy" onerror="this.src='https://picsum.photos/600/400?random=${index}'">
		</figure>`).join('')}
	</div>
</section>

<section class="max-w-7xl mx-auto px-5 sm:px-8 py-10">
	<h2 class="text-3xl font-bold mb-5 text-${theme_color}-900">Festival schedule</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
		${schedule.slice(0, 8).map((slot, index) => `<div class="rounded-3xl border border-slate-200 p-6 bg-white shadow-sm">
			<p class="text-${theme_color}-700 text-sm uppercase tracking-[0.25em]">Day ${Math.floor(index / 4) + 1} · ${(11 + (index % 4) * 2)}:00</p>
			<p class="mt-2 font-semibold text-slate-900">${slot.title || `Stage slot ${index + 1}`}</p>
			<p class="text-slate-600 text-sm leading-relaxed">${slot.description || 'Details coming soon.'}</p>
		</div>`).join('')}
	</div>
</section>

<section class="max-w-7xl mx-auto px-5 sm:px-8 py-6">
	<div class="bg-${theme_color}-50 border border-${theme_color}-100 rounded-3xl p-6 sm:p-8">
		<h2 class="text-3xl font-bold text-${theme_color}-900 mb-5">Why the campus shows up</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
			${features.slice(0, 6).map((feature, index) => `<div class="rounded-3xl border border-${theme_color}-100 bg-white p-6 shadow-sm">
				<span class="text-${theme_color}-600 text-2xl">${['🏅', '🧠', '🎉', '🤝', '📣', '🌱'][index % 6]}</span>
				<p class="mt-3 text-sm text-slate-700 leading-relaxed">${feature}</p>
			</div>`).join('')}
		</div>
	</div>
</section>

<section class="max-w-3xl mx-auto px-5 sm:px-8 py-12">
	<form class="bg-white border border-${theme_color}-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-5" onsubmit="submitContactForm(event)">
		<input type="hidden" name="websiteSlug" value="${websiteSlug}">
		<h3 class="text-2xl font-semibold text-${theme_color}-900">Volunteer / squad registration</h3>
		<p class="mt-2 text-sm text-slate-600">Register clubs, class cohorts, or volunteer squads to unlock backstage access and merch drops.</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			${fields.map(field => renderField(field, theme_color, 'light')).join('')}
		</div>
		<button type="submit" class="mt-2 w-full py-3 rounded-2xl bg-${theme_color}-600 hover:bg-${theme_color}-700 text-white font-semibold">Submit squad</button>
	</form>
</section>

<footer class="bg-${theme_color}-50 border-t border-${theme_color}-100 text-center py-6 text-sm text-${theme_color}-900">
	© 2025 ${title}. All rights reserved. | Made with <span class="text-red-500">❤</span> by <a href="https://vaaniweb.com" class="font-semibold text-${theme_color}-800" target="_blank" rel="noopener">VaaniWeb</a>
</footer>
<script>${countdownScript(5)}</script>
</body></html>`;
}
