import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import GoogleOAuthWrapper from '@/app/components/GoogleOAuthWrapper'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'VaaniWeb - Voice to Website',
  description: 'Create websites with your voice',
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
