import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import GoogleOAuthWrapper from '@/app/components/GoogleOAuthWrapper'
import Footer from '@/app/components/Footer'

const rawBaseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'https://vaaniweb.com'
const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl
const searchConsoleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? ''

const metadataBase = (() => {
  try {
    return new URL(baseUrl)
  } catch (error) {
    return new URL('https://vaaniweb.com')
  }
})()

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VaaniWeb',
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: 'support@vaaniweb.com',
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  ],
}

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: 'VaaniWeb - Voice to Website',
    template: '%s | VaaniWeb',
  },
  description: 'Create conversion-ready websites in seconds using your voice with VaaniWeb\'s AI website builder.',
  keywords: [
    'AI website builder',
    'voice website builder',
    'no code website generator',
    'VaaniWeb',
    'instant website generator',
    'startup landing page builder',
  ],
  applicationName: 'VaaniWeb',
  authors: [{ name: 'VaaniWeb Team' }],
  creator: 'VaaniWeb',
  publisher: 'VaaniWeb',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'VaaniWeb - Voice to Website',
    description: 'Create conversion-ready websites in seconds using your voice with VaaniWeb\'s AI website builder.',
    siteName: 'VaaniWeb',
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
        alt: 'VaaniWeb logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VaaniWeb - Voice to Website',
    description: 'Create conversion-ready websites in seconds using your voice with VaaniWeb\'s AI website builder.',
    images: [`${baseUrl}/logo.png`],
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {searchConsoleVerification ? (
          <meta name="google-site-verification" content={searchConsoleVerification} />
        ) : null}
        <link rel="canonical" href={baseUrl} />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MVX56X46WH"
          strategy="afterInteractive"
        />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MVX56X46WH');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <GoogleOAuthWrapper>
          <AuthProvider>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </AuthProvider>
        </GoogleOAuthWrapper>
      </body>
    </html>
  )
}
