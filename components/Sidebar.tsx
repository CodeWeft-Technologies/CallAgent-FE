'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Settings,
  Users,
  Building,
  LogOut,
  PhoneCall,
  Shield,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Menu,
  Clock,
  PhoneMissed
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Configuration', href: '/config', icon: Settings },
  { name: 'Calls', href: '/calls', icon: PhoneCall },
  { name: 'Follow-up', href: '/followup', icon: PhoneMissed },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
]

const Sidebar = React.memo(() => {
  console.log('🔄 Rendering Sidebar')

  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Auto-collapse on mobile/tablet and handle responsive behavior
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setIsCollapsed(true)
        setIsMobileOpen(false)
      } else if (window.innerWidth < 1280) { // xl breakpoint
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Add navigation items based on user role
  const getNavigation = () => {
    const nav = [...navigation]

    // Add organization settings for regular admins and managers (not super admin)
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      nav.push({ name: 'Organization', href: '/organization', icon: Building })
    }

    // Add admin panel for super admin only
    if (user && user.role === 'super_admin' && user.is_super_admin) {
      nav.push({ name: 'Admin Panel', href: '/admin', icon: Shield })
      nav.push({ name: 'Call Minutes', href: '/admin/call-minutes', icon: Clock })
    }

    return nav
  }

  const getUserInitials = () => {
    if (!user?.username) return 'U'
    const names = user.username.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return user.username.substring(0, 2).toUpperCase()
  }

  const getUserRole = () => {
    switch (user?.role) {
      case 'super_admin': return 'SUPER ADMIN'
      case 'admin': return 'ADMIN'
      case 'manager': return 'MANAGER'
      default: return 'USER'
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-50
        ${isCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'}
        ${isMobileOpen ? 'fixed left-0 top-0' : ''}
        lg:relative lg:translate-x-0
      `}>
        {/* Header with User Profile */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed && (
              <div className="flex items-center justify-start w-full">
                <div className="w-30 h-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src="/sidebarlogo.png" 
                    alt="Voiceze AI Logo" 
                    className="w-full h-full object-contain p-0"
                  />
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="flex items-center justify-center w-full">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src="/sidebarlogo.png" 
                    alt="Voiceze AI Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Desktop Collapse Button */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors hidden lg:block"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* User Profile */}
          {!isCollapsed && (
            <div className="flex items-center space-x-3 bg-slate-800/30 rounded-xl p-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {getUserInitials()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {user?.username || 'User'}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  Online
                </div>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-lg">
                  {getUserInitials()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
              </div>
            </div>
          )}
        </div>



        <nav className="flex-1 px-4 py-2 space-y-2">
          {getNavigation().map((item) => {
            // Better active state detection
            const isActive = pathname === item.href || 
                           (item.href !== '/' && pathname.startsWith(item.href + '/')) ||
                           (item.href === '/' && pathname === '/')

            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`
                  group flex items-center rounded-xl transition-all duration-300 cursor-pointer relative block transform hover:scale-105
                  ${isCollapsed 
                    ? 'justify-center w-12 h-12 mx-auto' 
                    : 'px-4 py-3 w-full'
                  }
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50 hover:shadow-lg'
                  }
                `}
                onClick={(e) => {
                  // Ensure the link navigation works properly
                  setIsMobileOpen(false) // Close mobile menu on navigation
                }}
              >
                <item.icon className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} flex-shrink-0 transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'
                }`} />
                {!isCollapsed && (
                  <span className="ml-3 truncate text-sm font-medium">{item.name}</span>
                )}
                
                {/* Active indicator for expanded state */}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
                
                {/* Active indicator for collapsed state */}
                {isActive && isCollapsed && (
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-700 shadow-xl">
                    {item.name}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45"></div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>



        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={() => logout()}
            className={`
            group flex items-center w-full rounded-xl transition-all duration-300 transform hover:scale-105 text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20 hover:shadow-lg hover:shadow-red-500/10
            ${isCollapsed ? 'justify-center h-12 px-3' : 'px-4 py-3'}
          `}
          >
            <LogOut className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} transition-all duration-300`} />
            {!isCollapsed && <span className="ml-3 text-sm font-medium">Log Out</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-700 shadow-xl">
                Log Out
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar