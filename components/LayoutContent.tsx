'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Navigation from './Navigation'

interface LayoutContentProps {
  children: React.ReactNode
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()
  
  // Don't show sidebar/navigation on register page
  if (pathname === '/register') {
    return (
      <main className="min-h-screen bg-slate-950">
        {children}
      </main>
    )
  }

  return (
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
  )
}