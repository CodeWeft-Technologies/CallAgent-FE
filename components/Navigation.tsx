'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings, PhoneCall, Users, Phone, Menu, X, LogOut, Building, Shield, Calendar } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import OrganizationBadge from './OrganizationBadge'

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Configuration', href: '/config', icon: Settings },
  { name: 'Calls', href: '/calls', icon: PhoneCall },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
]

const Navigation = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Add navigation items based on user role (same logic as Sidebar)
  const getNavigation = () => {
    const nav = [...baseNavigation]
    
    console.log('🔍 Mobile Navigation - User:', user?.role, user?.is_super_admin)
    
    // Add organization settings for regular admins and managers (not super admin)
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      console.log('✅ Adding Organization tab for mobile')
      nav.push({ name: 'Organization', href: '/organization', icon: Building })
    }
    
    // Add admin panel for super admin only
    if (user && user.role === 'super_admin' && user.is_super_admin) {
      console.log('✅ Adding Admin Panel tab for mobile')
      nav.push({ name: 'Admin Panel', href: '/admin', icon: Shield })
    }
    
    return nav
  }

  const handleSignOut = () => {
    logout()
    setIsOpen(false)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 lg:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Audixa AI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-bold text-white">Audixa AI</span>
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-xl">
            {/* Organization Badge for Mobile */}
            <div className="px-4 pt-4">
              <OrganizationBadge />
            </div>
            
            <nav className="px-4 py-6 space-y-2">
              {getNavigation().map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    className={`
                      group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Status & Sign Out */}
            <div className="px-4 pb-6 border-t border-slate-800 pt-4 space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-sm font-medium text-white">System Online</div>
                  <div className="text-xs text-slate-400">All services running</div>
                </div>
              </div>
              
              {/* Sign Out Button */}
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200 group"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-red-400" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation