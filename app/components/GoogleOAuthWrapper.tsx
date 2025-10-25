'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function GoogleOAuthWrapper({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  if (!clientId) {
    console.error('Google Client ID not found in environment variables');
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
