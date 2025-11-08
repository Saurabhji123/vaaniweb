export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const PASSWORD_REQUIREMENTS = 'Use at least 8 characters with uppercase, lowercase, number, and a special symbol.';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TRUSTED_EMAIL_DOMAINS = new Set<string>([
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'outlook.in',
  'hotmail.com',
  'live.com',
  'msn.com',
  'yahoo.com',
  'yahoo.in',
  'ymail.com',
  'protonmail.com',
  'pm.me',
  'icloud.com',
  'me.com',
  'mac.com',
  'zoho.com',
  'zohomail.com',
  'gmx.com',
  'yandex.com',
  'fastmail.com'
]);

const TRUSTED_DOMAIN_SUFFIXES = [
  '.edu',
  '.edu.in',
  '.ac.in',
  '.ac.uk',
  '.ac.',
  '.gov',
  '.gov.in',
  '.org',
  '.org.in'
];

const DISPOSABLE_DOMAINS = new Set<string>([
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'mailinator.com',
  'trashmail.com',
  'yopmail.com',
  'burnermail.io',
  'fakeinbox.com',
  'maildrop.cc',
  'sharklasers.com',
  'getnada.com',
  'dispostable.com',
  'trashmail.de',
  'throwawaymail.com',
  'mailpoof.com'
]);

const DISPOSABLE_KEYWORDS = ['tempmail', 'mailinator', 'yopmail', 'guerrilla', 'sharklaser', 'fakeinbox', 'trashmail', '10minutemail', 'throwaway'];

export type EmailValidationReason = 'format' | 'disposable' | 'unverified' | 'ok';

export interface EmailValidationResult {
  valid: boolean;
  normalized?: string;
  domain?: string;
  reason: EmailValidationReason;
  message?: string;
}

export function isStrongPassword(password: string): boolean {
  return STRONG_PASSWORD_REGEX.test(password);
}

export function validateEmailAddress(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      valid: false,
      reason: 'format',
      message: 'Enter a valid email address (name@domain.com)'
    };
  }

  const domain = trimmed.split('@')[1];
  if (!domain) {
    return {
      valid: false,
      reason: 'format',
      message: 'Email domain is missing'
    };
  }

  if (DISPOSABLE_DOMAINS.has(domain) || DISPOSABLE_KEYWORDS.some(keyword => domain.includes(keyword))) {
    return {
      valid: false,
      reason: 'disposable',
      message: 'This looks like a disposable email. Please use a verified address such as Gmail, Outlook, Zoho, Yahoo, etc.',
      domain
    };
  }

  const trustedProvider = TRUSTED_EMAIL_DOMAINS.has(domain);
  const trustedSuffix = TRUSTED_DOMAIN_SUFFIXES.some(suffix => domain.endsWith(suffix));

  if (!trustedProvider && !trustedSuffix) {
    return {
      valid: false,
      reason: 'unverified',
      message: 'Please use an official or institute email (Gmail, Outlook, Zoho, Yahoo, college domain, etc.).',
      domain
    };
  }

  return {
    valid: true,
    normalized: trimmed,
    domain,
    reason: 'ok'
  };
}

