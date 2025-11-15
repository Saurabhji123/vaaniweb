import { Resend } from 'resend';

type SendEmailOptions = {
	to: string;
	subject: string;
	html: string;
};

type SendEmailResult = {
	success: boolean;
	data?: unknown;
	error?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);
const SUPPORT_EMAIL = 'support@vaaniweb.com';
const DEFAULT_PREVIEW_TEXT = 'Bring your next website to life in minutes with VaaniWeb.';

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<SendEmailResult> {
	if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
		console.error('[email] RESEND_API_KEY not configured');
		return { success: false, error: 'Email service not configured' };
	}

	try {
		const response = await resend.emails.send({
			from: 'VaaniWeb <noreply@vaaniweb.com>',
			to: [to],
			subject,
			html,
			replyTo: SUPPORT_EMAIL,
		});

		return { success: true, data: response };
	} catch (error) {
		const typedError = error as { response?: { body?: unknown }; message?: string } | undefined;
		const rawMessage = typedError?.response?.body ?? typedError?.message ?? 'Unknown error';
		const message = typeof rawMessage === 'string' ? rawMessage : JSON.stringify(rawMessage);

		console.error('[email] send failed', message);
		return { success: false, error: message };
	}
}

function escapeHtml(value: string | undefined | null): string {
	if (!value) {
		return '';
	}

	return value.replace(/[&<>"']/g, (char) => {
		switch (char) {
			case '&':
				return '&amp;';
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '"':
				return '&quot;';
			case '\'':
				return '&#39;';
			default:
				return char;
		}
	});
}

const EMAIL_BASE_STYLES = `
:root { color-scheme: only light; supported-color-schemes: light; }
* { box-sizing: border-box; }
body { margin: 0; padding: 0; background: #050013; font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e0e7ff; }
a { color: inherit; }
.email-wrapper { width: 100%; background: #050013; padding: 24px 16px; }
.email-container { max-width: 640px; margin: 0 auto; background: #0f0a28; border-radius: 28px; overflow: hidden; border: 1px solid rgba(129, 140, 248, 0.25); box-shadow: 0 30px 70px rgba(20, 10, 60, 0.55); }
.brand-header { background:
	radial-gradient(circle at 18% 18%, rgba(99, 102, 241, 0.48), transparent 52%),
	radial-gradient(circle at 82% 12%, rgba(236, 72, 153, 0.35), transparent 58%),
	linear-gradient(135deg, rgba(12, 6, 40, 0.94), rgba(10, 6, 32, 0.88));
  padding: 44px 36px 32px;
  text-align: center;
  color: #f8fafc;
}
.brand-logo { width: 56px; height: 56px; margin: 0 auto 16px; display: block; }
.brand-name { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: 0.4px; }
.brand-headline { margin: 14px 0 0; font-size: 24px; font-weight: 700; }
.brand-tagline { margin: 14px auto 0; max-width: 380px; font-size: 16px; line-height: 1.6; opacity: 0.92; }
.email-content { padding: 38px 42px; background: rgba(14, 10, 36, 0.9); }
.body-text { margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #c7d2fe; }
.callout { margin: 28px 0; padding: 24px 26px; background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(139, 92, 246, 0.28); border-radius: 20px; text-align: center; backdrop-filter: blur(12px); }
.callout-label { margin: 0 0 8px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #a855f7; font-weight: 700; }
.callout-meta { margin: 12px 0 0; font-size: 13px; color: #e0e7ff; opacity: 0.75; }
.otp-code { font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #f8fafc; font-family: 'Roboto Mono', 'Courier New', monospace; }
.primary-button { display: inline-block; padding: 16px 38px; background: linear-gradient(135deg, #6366f1, #ec4899); color: #ffffff !important; font-weight: 700; font-size: 16px; text-decoration: none; border-radius: 999px; box-shadow: 0 18px 34px rgba(99, 102, 241, 0.35); }
.info-card { margin: 0 0 20px; padding: 20px 22px; border-radius: 18px; background: rgba(39, 26, 79, 0.7); color: #c7d2fe; border: 1px solid rgba(99, 102, 241, 0.2); text-align: left; }
.info-card-title { margin: 0 0 12px; font-weight: 700; color: #f5f3ff; }
.list { margin: 0 0 18px; padding-left: 20px; color: #e0e7ff; font-size: 15px; }
.list-item { margin-bottom: 10px; line-height: 1.6; }
.meta-text { font-size: 14px; color: #cbd5f5; margin: 20px 0; line-height: 1.6; }
.preview { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; mso-hide: all; }
.footer { padding: 34px 42px; background: rgba(12, 7, 34, 0.96); text-align: center; border-top: 1px solid rgba(129, 140, 248, 0.22); }
.footer-text { margin: 0 0 12px; font-size: 14px; color: #cbd5f5; }
.footer-text a { color: inherit; text-decoration: underline; }
.footer-meta { margin: 0; font-size: 12px; color: #94a3ff; line-height: 1.6; }

@media only screen and (max-width: 600px) {
	.email-wrapper { padding: 18px 12px; }
	.email-container { border-radius: 22px; }
	.brand-header { padding: 34px 24px 24px; }
	.brand-logo { width: 48px; height: 48px; }
	.brand-name { font-size: 26px; }
	.brand-headline { font-size: 22px; }
	.brand-tagline { font-size: 14px; }
	.email-content { padding: 30px 24px; }
	.body-text { font-size: 15px; }
	.callout { padding: 22px 18px; }
	.otp-code { font-size: 30px; letter-spacing: 10px; }
	.primary-button { width: 100%; padding: 16px 24px; font-size: 15px; }
	.footer { padding: 28px 22px; }
}
`;

const BRAND_LOGO_SVG = `
<svg class="brand-logo" width="52" height="52" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
	<defs>
		<linearGradient id="vaaniweb-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" stop-color="#f5f3ff" stop-opacity="0.8" />
			<stop offset="100%" stop-color="#ede9fe" stop-opacity="0.2" />
		</linearGradient>
	</defs>
	<rect width="56" height="56" rx="16" fill="url(#vaaniweb-logo-gradient)" />
	<rect x="22" y="16" width="12" height="18" rx="6" fill="#ffffff" />
	<path d="M18 33c0 3 2.3 5.3 5.2 5.8V40m9.6-1.2c2.9-.5 5.2-2.8 5.2-5.8M23.2 40h9.6m-9.6 0v2h9.6v-2" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`;

interface EmailTemplateOptions {
	previewText?: string;
	heroTitle: string;
	heroSubtitle?: string;
	bodyContent: string;
	footerContent?: string;
}

function renderEmailTemplate({
	previewText,
	heroTitle,
	heroSubtitle,
	bodyContent,
	footerContent,
}: EmailTemplateOptions): string {
	const year = new Date().getFullYear();
	const preview = escapeHtml(previewText ?? DEFAULT_PREVIEW_TEXT);
	const safeHeroTitle = escapeHtml(heroTitle);
	const safeSubtitle = escapeHtml(heroSubtitle ?? 'Design, launch, and share investor-ready pages in seconds.');

	const resolvedFooter =
		footerContent ??
		`
			<p class="footer-text">Need help? Email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
			<p class="footer-meta">&copy; ${year} VaaniWeb. Crafted for founders, creators, and teams.</p>
		`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="color-scheme" content="light" />
	<meta name="supported-color-schemes" content="light" />
	<title>${safeHeroTitle}</title>
	<style>${EMAIL_BASE_STYLES}</style>
</head>
<body>
	<span class="preview">${preview}</span>
	<div class="email-wrapper">
		<div class="email-container">
			<header class="brand-header">
				${BRAND_LOGO_SVG}
				<p class="brand-name">VaaniWeb</p>
				<p class="brand-headline">${safeHeroTitle}</p>
				<p class="brand-tagline">${safeSubtitle}</p>
			</header>
			<main class="email-content">
				${bodyContent}
			</main>
			<footer class="footer">
				${resolvedFooter}
			</footer>
		</div>
	</div>
</body>
</html>`;
}

function getRootUrl(): string {
	const value = process.env.NEXT_PUBLIC_ROOT_URL?.trim();
	return value && value.length > 0 ? value : 'https://vaaniweb.com';
}

function renderPrimaryButton(label: string, href: string): string {
	const safeLabel = escapeHtml(label);
	const safeHref = escapeHtml(href);
	return `<a class="primary-button" href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`;
}

export function generateOTP(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string, name: string = 'there'): Promise<SendEmailResult> {
	const safeName = escapeHtml(name || 'there');
	const safeOtp = escapeHtml(otp);

	const html = renderEmailTemplate({
		previewText: `Your VaaniWeb verification code is ${safeOtp}.`,
		heroTitle: 'Verify your email',
		heroSubtitle: `Hi ${safeName}, enter this one-time passcode to continue.`,
		bodyContent: `
			<p class="body-text">Use the code below within the next 10 minutes to verify your email address and continue setting up your account.</p>
			<div class="callout">
				<p class="callout-label">Your OTP</p>
				<p class="otp-code">${safeOtp}</p>
				<p class="callout-meta">Do not share this code with anyone, including the VaaniWeb team.</p>
			</div>
			<p class="meta-text" style="text-align: center;">If you did not request this, you can safely ignore this message.</p>
		`,
	});

	return sendEmail({
		to: email,
		subject: 'Your VaaniWeb verification code',
		html,
	});
}

export async function sendWelcomeEmail(email: string, name: string = 'there'): Promise<SendEmailResult> {
	const safeName = escapeHtml(name || 'there');
	const dashboardUrl = getRootUrl();

	const html = renderEmailTemplate({
		previewText: `Welcome ${safeName}, your AI builder is ready!`,
		heroTitle: 'Welcome to VaaniWeb',
		heroSubtitle: `Hi ${safeName}, let's build something remarkable together.`,
		bodyContent: `
			<p class="body-text">Your new AI website studio is ready. Describe your brand in your own words and VaaniWeb will design, build, and publish polished pages in minutes.</p>
			<div class="info-card">
				<p class="info-card-title">Quick start checklist</p>
				<ul class="list">
					<li class="list-item"><strong>Speak your vision:</strong> Share your business story, services, and tone.</li>
					<li class="list-item"><strong>Pick a template:</strong> Explore 20+ premium layouts tuned for conversions.</li>
					<li class="list-item"><strong>Launch instantly:</strong> Publish to the web with one click - hosting included.</li>
				</ul>
			</div>
			<div class="callout">
				<p class="callout-label">Ready when you are</p>
				${renderPrimaryButton('Open your dashboard', dashboardUrl)}
				<p class="callout-meta">Need inspiration? Browse the template gallery once you sign in.</p>
			</div>
		`,
	});

	return sendEmail({
		to: email,
		subject: "Welcome to VaaniWeb - let's build your next site",
		html,
	});
}

export async function sendGoogleWelcomeEmail(email: string, name: string): Promise<SendEmailResult> {
	const safeName = escapeHtml(name || 'there');
	const dashboardUrl = getRootUrl();

	const html = renderEmailTemplate({
		previewText: `${safeName}, your Google sign-in is complete.`,
		heroTitle: 'You are in with Google',
		heroSubtitle: `Hi ${safeName}, your Google account is now linked to VaaniWeb.`,
		bodyContent: `
			<p class="body-text">Thanks for signing in with Google. Your workspace is ready and synced - no passwords to manage.</p>
			<div class="info-card">
				<p class="info-card-title">What to explore next</p>
				<ul class="list">
					<li class="list-item"><strong>Create your first site:</strong> Start with a voice prompt and let AI do the rest.</li>
					<li class="list-item"><strong>Personalize content:</strong> Update copy, galleries, and CTAs in real-time.</li>
					<li class="list-item"><strong>Share instantly:</strong> Publish links and share with investors or customers.</li>
				</ul>
			</div>
			<div class="callout">
				<p class="callout-label">Jump back in</p>
				${renderPrimaryButton('Go to your dashboard', dashboardUrl)}
			</div>
		`,
	});

	return sendEmail({
		to: email,
		subject: 'Welcome to VaaniWeb - Google sign-in confirmed',
		html,
	});
}

export async function sendPasswordResetEmail(
	email: string,
	name: string,
	resetLink: string,
	expiresAt: Date,
): Promise<SendEmailResult> {
	const safeName = escapeHtml(name || 'there');
	const safeResetLink = escapeHtml(resetLink);
	const expiresInMinutes = Math.max(1, Math.round((expiresAt.getTime() - Date.now()) / 60000));
	const expiresLabel = `${expiresInMinutes} minute${expiresInMinutes === 1 ? '' : 's'}`;

	const html = renderEmailTemplate({
		previewText: `Reset your VaaniWeb password - link expires in ${expiresLabel}.`,
		heroTitle: 'Reset your password',
		heroSubtitle: `Hi ${safeName}, use the secure link below to choose a new password.`,
		bodyContent: `
			<p class="body-text">We received a request to reset the password for your VaaniWeb account. Click the button below to continue. This link will expire in ${escapeHtml(expiresLabel)}.</p>
			<div class="callout">
				<p class="callout-label">Secure reset link</p>
				${renderPrimaryButton('Reset your password', safeResetLink)}
				<p class="callout-meta">If the button does not work, paste this link into your browser:</p>
				<p class="meta-text" style="word-break: break-word;">${safeResetLink}</p>
			</div>
			<p class="meta-text" style="text-align: center;">If you did not request a password reset, no action is required.</p>
		`,
	});

	return sendEmail({
		to: email,
		subject: 'Reset your VaaniWeb password',
		html,
	});
}

