'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings, MessageSquare, Users, Phone, BarChart3, PhoneCall, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import OrganizationBadge from './OrganizationBadge'
import UserProfileDropdown from './UserProfileDropdown'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Configuration', href: '/config', icon: Settings },
  { name: 'Calls', href: '/calls', icon: PhoneCall },
  { name: 'Leads', href: '/leads', icon: Users },
]

const Sidebar = React.memo(() => {
  console.log('🔄 Rendering Sidebar')
  
  const pathname = usePathname()
  const { user } = useAuth()

  // Add organization settings to navigation for admins and managers
  const getNavigation = () => {
    const nav = [...navigation]
    
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      nav.push({ name: 'Organization', href: '/organization', icon: Settings })
    }
    
    return nav
  }
  
  return (
    <aside className="h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center h-16 px-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">CallAgent</span>
            <div className="text-xs text-slate-400">Multi-Tenant Platform</div>
          </div>
        </div>
      </div>

      {/* Organization Badge */}
      <OrganizationBadge />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {getNavigation().map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
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

      {/* Status & User Profile */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <div>
            <div className="text-sm font-medium text-white">System Online</div>
            <div className="text-xs text-slate-400">All services running</div>
          </div>
        </div>
        
        {/* User Profile Dropdown */}
        <div className="flex justify-center w-full">
          <UserProfileDropdown />
        </div>
      </div>
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar