import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../contexts/AuthContext'
import AuthWrapper from '../components/AuthWrapper'
import { Navbar, Footer } from '../components'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Audixa AI - AI Voice Automation',
  description: 'Advanced AI Voice Agent Management Platform for Outbound Sales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <AuthWrapper>
            <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
              {/* Linkify-style background grid with radial gradient mask */}
              <div id="home" className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] h-full" />
              
              <Navbar />
              <main className="mt-20 mx-auto w-full z-0 relative">
                {children}
              </main>
              <Footer />
            </div>
          </AuthWrapper>
        </AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#F1F5F9',
              border: '1px solid #334155',
              marginTop: '80px',
            },
          }}
        />
      </body>
    </html>
  )
}