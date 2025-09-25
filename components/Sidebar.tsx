'use client'

import React from 'react'
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
  Shield
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import OrganizationBadge from './OrganizationBadge'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Configuration', href: '/config', icon: Settings },
  { name: 'Calls', href: '/calls', icon: PhoneCall },
  { name: 'Leads', href: '/leads', icon: Users },
]

const Sidebar = React.memo(() => {
  console.log('🔄 Rendering Sidebar')
  
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Add navigation items based on user role
  const getNavigation = () => {
    const nav = [...navigation]
    
    // Add organization settings for regular admins and managers (not super admin)
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      nav.push({ name: 'Organization', href: '/organization', icon: Settings })
    }
    
    // Add admin panel for super admin only
    if (user && user.role === 'super_admin' && user.is_super_admin) {
      nav.push({ name: 'Admin Panel', href: '/admin', icon: Shield })
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

      {/* Organization Badge - Moved to top as dropdown */}
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

      {/* Status & Sign Out */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        {/* Sign Out Button */}
        <div className="flex justify-center w-full">
          <button
            onClick={() => logout()}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition-colors w-full justify-center"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <div>
            <div className="text-sm font-medium text-white">System Online</div>
            <div className="text-xs text-slate-400">All services running</div>
          </div>
        </div>
      </div>
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar