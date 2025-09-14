import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '../components/Sidebar'
import Navigation from '../components/Navigation'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../contexts/AuthContext'
import AuthWrapper from '../components/AuthWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Agent Dashboard',
  description: 'Modern AI Voice Agent Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthWrapper>
            <div className="flex h-screen bg-slate-950">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block">
                <Sidebar />
              </div>
              
              {/* Mobile Navigation */}
              <div className="lg:hidden">
                <Navigation />
              </div>
              
              <main className="flex-1 overflow-auto bg-slate-950">
                <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-4">
                  {children}
                </div>
              </main>
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