'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, Settings, MessageSquare, Users, Phone, BarChart3, PhoneCall, LogOut, 
  ChevronRight, Zap, Activity, TrendingUp, Brain, Sparkles, Waves
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: Home, 
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Overview & Analytics'
  },
  { 
    name: 'AI Configuration', 
    href: '/config', 
    icon: Brain, 
    gradient: 'from-purple-500 to-pink-500',
    description: 'Smart Settings'
  },
  { 
    name: 'Call History', 
    href: '/calls', 
    icon: PhoneCall, 
    gradient: 'from-emerald-500 to-teal-500',
    description: 'Voice Analytics'
  },
  { 
    name: 'Lead Management', 
    href: '/leads', 
    icon: Users, 
    gradient: 'from-orange-500 to-red-500',
    description: 'Customer Pipeline'
  },
]

const Sidebar = React.memo(() => {
  console.log('🔄 Rendering Sidebar')
  
  const pathname = usePathname()
  const { logout } = useAuth()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSignOut = () => {
      logout()
  }
  
  return (
    <aside className="h-screen w-72 relative overflow-hidden flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-emerald-600/5 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 animate-pulse"></div>
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 right-4 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center h-20 px-6 border-b border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Phone className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl animate-ping"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Zap className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">CallAgent AI</span>
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>
              <div className="text-xs text-slate-400 flex items-center space-x-1">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>Intelligent Voice System</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-3">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            const isHovered = hoveredItem === item.name
            return (
              <Link
                key={item.name}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  group relative flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300 transform
                  ${isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl shadow-${item.gradient.split('-')[1]}-500/30 scale-105`
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-105 backdrop-blur-sm'
                  }
                `}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-pulse"></div>
                )}
                
                {/* Icon Container */}
                <div className={`
                  relative mr-4 p-2 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-white/20 shadow-lg' 
                    : isHovered 
                      ? `bg-gradient-to-br ${item.gradient} bg-opacity-20` 
                      : 'bg-slate-700/30'
                  }
                `}>
                  <item.icon className={`
                    h-5 w-5 transition-all duration-300
                    ${isActive 
                      ? 'text-white' 
                      : isHovered 
                        ? 'text-white' 
                        : 'text-slate-400 group-hover:text-white'
                    }
                  `} />
                  
                  {/* Floating Particles */}
                  {isHovered && (
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-ping"></div>
                      <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full animate-ping delay-300"></div>
                    </div>
                  )}
                </div>
                
                {/* Text Content */}
                <div className="flex-1">
                  <div className={`
                    font-semibold transition-all duration-300
                    ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}
                  `}>
                    {item.name}
                  </div>
                  <div className={`
                    text-xs mt-1 transition-all duration-300
                    ${isActive ? 'text-white/80' : 'text-slate-400 group-hover:text-slate-300'}
                  `}>
                    {item.description}
                  </div>
                </div>
                
                {/* Arrow Indicator */}
                <ChevronRight className={`
                  h-4 w-4 transition-all duration-300
                  ${isActive 
                    ? 'text-white translate-x-1' 
                    : isHovered 
                      ? 'text-white translate-x-1' 
                      : 'text-slate-500 group-hover:text-white group-hover:translate-x-1'
                  }
                `} />
                
                {/* Hover Glow Effect */}
                {isHovered && !isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-2xl blur-sm`}></div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Status & Sign Out */}
        <div className="p-4 space-y-4">
          {/* Real-time Clock */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/30 p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-emerald-400">LIVE</span>
                </div>
                <Waves className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>
              <div className="text-lg font-bold text-white font-mono">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          
          {/* System Status */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/30 p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">System Online</div>
                  <div className="text-xs text-slate-400">All services operational</div>
                </div>
              </div>
              
              {/* Mini Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center">
                  <div className="text-xs font-bold text-emerald-400">99.9%</div>
                  <div className="text-xs text-slate-500">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-blue-400">24ms</div>
                  <div className="text-xs text-slate-500">Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-purple-400">AI</div>
                  <div className="text-xs text-slate-500">Active</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sign Out Button */}
          <button 
            onClick={handleSignOut}
            className="w-full group relative overflow-hidden flex items-center justify-center px-4 py-4 text-sm font-semibold text-slate-300 hover:text-white rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-slate-600/30 hover:border-red-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
            <div className="relative z-10 flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-slate-700/50 group-hover:bg-red-500/20 transition-all duration-300">
                <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-400 transition-all duration-300" />
              </div>
              <span>Sign Out</span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </button>
        </div>
      </div>
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar