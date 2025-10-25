export interface GeneratedPageData {
  title: string;
  tagline: string;
  description?: string;
  theme_color: string;
  pics: string[];
  instagram?: string;
  contact_fields: string[];
  businessType?: string;
  sections?: {
    about: string;
    features: string[];
    callToAction: string;
  };
  seoKeywords?: string[];
}

export interface PageDocument {
  _id: string;
  html: string;
  json: GeneratedPageData;
  createdAt: Date;
}

export interface GenerateRequest {
  audio: string;
}

export interface GenerateResponse {
  url: string;
}

export interface FeedItem {
  _id: string;
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
  hasPassword?: boolean; // Flag to check if user has set a password
}
