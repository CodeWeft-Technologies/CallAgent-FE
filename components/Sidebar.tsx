'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Settings,
  Phone,
  Users,
  Building,
  LogOut,
  Home,
  PhoneCall,
  Shield,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Menu,
  MessageSquare,
  UserCircle,
  Bell
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navigation = [
  {
    name: 'Dashboard', href: '/', icon: LayoutDashboard, hasSubmenu: true, submenu: [
      { name: 'Total Orders', href: '/dashboard/orders' },
      { name: 'In Production Orders', href: '/dashboard/production' },
      { name: 'Delay Orders', href: '/dashboard/delays' }
    ]
  },
  { name: 'Configuration', href: '/config', icon: Settings },
  { name: 'Calls', href: '/calls', icon: PhoneCall },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
]

const messages = [
  { name: 'Williams', avatar: '👨‍💼', status: 'online' },
  { name: 'Emily Deschanel', avatar: '👩‍💼', status: 'away' }
]

const Sidebar = React.memo(() => {
  console.log('🔄 Rendering Sidebar')

  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
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
    setExpandedMenu(null)
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
    }

    return nav
  }

  const toggleSubmenu = (itemName: string) => {
    if (isCollapsed) return
    setExpandedMenu(expandedMenu === itemName ? null : itemName)
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
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getUserInitials()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {getUserRole()}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {user?.username || 'User'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        {!isCollapsed && (
          <div className="px-4 py-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              MAIN
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 space-y-1">
          {getNavigation().map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const hasSubmenu = item.hasSubmenu && !isCollapsed
            const isExpanded = expandedMenu === item.name

            return (
              <div key={item.name}>
                {/* Main Navigation Item */}
                <div
                  className={`
                  group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer relative
                  ${isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                  onClick={() => hasSubmenu ? toggleSubmenu(item.name) : null}
                >
                  <div className="flex items-center">
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'
                      }`} />
                    {!isCollapsed && (
                      <span className="ml-3">{item.name}</span>
                    )}
                  </div>
                  {hasSubmenu && (
                    <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''
                      }`} />
                  )}
                </div>

                {/* Submenu */}
                {hasSubmenu && isExpanded && item.submenu && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/30 rounded-lg transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Non-submenu items as links */}
                {!hasSubmenu && (
                  <Link href={item.href} className="block">
                    {/* This is handled by the div above */}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Messages Section */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                MESSAGES
              </div>
              <button className="text-slate-500 hover:text-white">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {messages.map((message) => (
                <div key={message.name} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {message.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${message.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-300 group-hover:text-white truncate">
                      {message.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collapsed Messages */}
        {isCollapsed && (
          <div className="px-3 py-4 border-t border-slate-800 space-y-2">
            {messages.map((message) => (
              <div key={message.name} className="relative group">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium mx-auto cursor-pointer">
                  {message.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${message.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
              </div>
            ))}
          </div>
        )}

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => logout()}
            className={`
            flex items-center justify-center w-full p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors group
            ${isCollapsed ? 'px-3' : 'px-4'}
          `}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar