'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Navigation from './Navigation'

interface LayoutContentProps {
  children: React.ReactNode
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()
  
  // Don't show sidebar/navigation on landing page, register page and admin page
  if (pathname === '/' || pathname === '/register' || pathname === '/admin' || pathname === '/admin-login') {
    return (
      <main className="min-h-screen bg-slate-950">
        {children}
      </main>
    )
  }

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Responsive Sidebar - Always rendered but positioned differently */}
      <Sidebar />
      
      {/* Mobile Navigation Fallback (if needed) */}
      <div className="hidden">
        <Navigation />
      </div>
      
      <main className="flex-1 overflow-auto bg-slate-950">
        <div className="p-4 sm:p-6 lg:p-8 pt-4 transition-all duration-300">
          {children}
        </div>
      </main>
    </div>
  )
}