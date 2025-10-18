'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Navigation from './Navigation'
import { Navbar, Footer } from './index'

interface LayoutContentProps {
  children: React.ReactNode
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()
  
  // Marketing pages (show navbar and footer, no sidebar)
  const isMarketingPage = pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/pricing' || pathname === '/admin-login' || pathname === '/features' || pathname === '/enterprise' || pathname === '/changelog' || pathname === '/privacy' || pathname === '/terms'
  
  if (isMarketingPage) {
    return (
      <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        {/* Linkify-style background grid with radial gradient mask */}
        <div id="home" className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] h-full" />
        
        <Navbar />
        <main className="mt-20 mx-auto w-full z-0 relative">
          {children}
        </main>
        <Footer />
      </div>
    )
  }

  // Dashboard pages (show sidebar, no navbar/footer)
  return (
    <div className="flex h-screen bg-background">
      {/* Responsive Sidebar */}
      <Sidebar />
      
      {/* Mobile Navigation Fallback (if needed) */}
      <div className="hidden">
        <Navigation />
      </div>
      
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-4 sm:p-6 lg:p-8 pt-4 transition-all duration-300">
          {children}
        </div>
      </main>
    </div>
  )
}