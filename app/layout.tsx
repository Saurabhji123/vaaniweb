import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import GoogleOAuthWrapper from '@/app/components/GoogleOAuthWrapper'

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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <GoogleOAuthWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthWrapper>
      </body>
    </html>
  )
}
