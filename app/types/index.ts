export interface GeneratedPageData {
  title: string;
  tagline: string;
  description?: string;
  theme_color: string;
  pics: string[];
  picDescriptions?: string[]; // Alt text for images
  instagram?: string;
  contact_fields: string[];
  businessType?: string;
  slug?: string; // Website slug for form submissions
  sections?: {
    about: string;
    features: string[];
    callToAction: string;
    testimonials?: Array<{
      name: string;
      role: string;
      quote: string;
      rating?: number;
    }>;
    services?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
    faq?: Array<{
      question: string;
      answer: string;
    }>;
  };
  seoKeywords?: string[];
}

export interface PageDocument {
  _id: string;
  slug?: string; // Custom URL slug (e.g., "united-university")
  html: string;
  json: GeneratedPageData;
  createdAt: Date;
  userId?: string | null;
  userEmail?: string | null;
}

export interface GenerateRequest {
  audio: string;
}

export interface GenerateResponse {
  url: string;
}

export interface FeedItem {
  _id: string;
  slug?: string; // Custom URL slug
  json: GeneratedPageData;
}

export interface FeedResponse {
  items: FeedItem[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  plan: string;
  sitesCreated: number;
  monthlyLimit: number;
  profilePicture?: string | null;
  authProvider?: 'email' | 'google';
  hasPassword?: boolean;
  isEmailVerified?: boolean;
  emailVerificationOTP?: string;
  otpExpiry?: Date;
  verifiedAt?: Date;
}
