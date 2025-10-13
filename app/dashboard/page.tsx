'use client'
import { useState, useEffect, useCallback } from 'react'
import { 
  Phone, Users, TrendingUp, PhoneCall, 
  CheckCircle, AlertCircle, User, Calendar,
  Settings, ArrowRight, RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

export default function DashboardPage() {  
  const { user, token } = useAuth()
  const [stats, setStats] = useState({
    leads: {
      total: 0,
      new: 0,
      called: 0,
      contacted: 0,
      converted: 0,
      total_calls: 0
    },
    calls: {
      total_calls: 0,
      calls_today: 0,
      calls_this_week: 0,
      average_duration: 0,
      inbound_calls: 0,
      outbound_calls: 0,
      completed_calls: 0,
      status_counts: { completed: 0, failed: 0, missed: 0 },
      interest_counts: { interested: 0, not_interested: 0, neutral: 0 }
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardStats = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Fetch leads stats with authentication
      const leadsResponse = await fetch(`${API_URL}/api/leads/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Fetch calls stats with authentication
      const callsResponse = await fetch(`${API_URL}/api/calls/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const leadsData = await leadsResponse.json()
      const callsData = await callsResponse.json()
      
      if (!leadsResponse.ok || !callsResponse.ok) {
        throw new Error('Failed to fetch stats')
      }
      
      setStats(prevStats => ({
        leads: leadsData.success ? leadsData.data : prevStats.leads,
        calls: callsData.success ? callsData.data : prevStats.calls
      }))
    } catch (error) {
      console.error('❌ Error loading dashboard stats:', error)
      setError('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadDashboardStats()
  }, [loadDashboardStats])

  // Show authentication required message if not logged in
  if (!user || !token) {
    return (
      <div className="space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-orange-600/10 to-yellow-600/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-800/50 p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Authentication Required</h1>
              <p className="text-slate-400 max-w-md mx-auto">Please log in to view your organization's dashboard statistics.</p>
              <Link href="/" className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <span>Go to Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-orange-600/10 to-yellow-600/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-red-900/20 backdrop-blur-sm rounded-2xl border border-red-500/30 p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-800/50 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    AI Calling Assistant
                  </h1>
                  <p className="text-slate-400 text-lg">Intelligent Voice Automation Dashboard</p>
                </div>
              </div>
              <p className="text-slate-300 max-w-2xl">Monitor your leads, track call performance, and analyze conversions with real-time insights powered by AI</p>
              {user && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-400">Organization: <span className="text-emerald-400 font-medium">{user.organization_name || 'Default'}</span></span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadDashboardStats}
                disabled={loading}
                className="group flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                <span className="text-sm font-medium">Refresh Data</span>
              </button>
              <div className="flex items-center space-x-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-sm text-emerald-400 font-medium">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-white">{loading ? '...' : stats.leads.total.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500/10 rounded-lg">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">{stats.leads.new}</span>
              </div>
              <span className="text-sm text-slate-400">new leads</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Total Calls</p>
                <p className="text-3xl font-bold text-white">{loading ? '...' : stats.calls.total_calls.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                <Phone className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-medium">{stats.calls.calls_today}</span>
              </div>
              <span className="text-sm text-slate-400">today</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Contacted Leads</p>
                <p className="text-3xl font-bold text-white">{loading ? '...' : stats.leads.contacted.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-purple-500/10 rounded-lg">
                <PhoneCall className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300 font-medium">{stats.leads.called}</span>
              </div>
              <span className="text-sm text-slate-400">called total</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-white">
                  {loading ? '...' : stats.leads.total > 0 ? `${((stats.leads.converted / stats.leads.total) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-orange-500/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-300 font-medium">{stats.leads.converted}</span>
              </div>
              <span className="text-sm text-slate-400">conversions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/leads" className="group">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors">Manage Leads</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Upload CSV files, view leads, and initiate automated calling campaigns</p>
              </div>
            </div>
          </Link>

          <Link href="/calls" className="group">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-100 transition-colors">Call History</h3>
                <p className="text-slate-400 text-sm leading-relaxed">View call logs, transcripts, and AI-powered conversation analysis</p>
              </div>
            </div>
          </Link>

          <Link href="/config" className="group">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-purple-500/30 hover:bg-slate-800/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-100 transition-colors">AI Configuration</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Configure AI prompts, greetings, and intelligent conversation flow</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">Performance Insights</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Status Breakdown */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-600/10 to-slate-800/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Lead Status Breakdown</h3>
              </div>
              <div className="space-y-4">
                <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg"></div>
                    <span className="text-slate-200 font-medium">New Leads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">{stats.leads.new}</span>
                    <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{width: `${stats.leads.total > 0 ? (stats.leads.new / stats.leads.total) * 100 : 0}%`}}></div>
                    </div>
                  </div>
                </div>
                <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-lg"></div>
                    <span className="text-slate-200 font-medium">Called</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">{stats.leads.called}</span>
                    <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{width: `${stats.leads.total > 0 ? (stats.leads.called / stats.leads.total) * 100 : 0}%`}}></div>
                    </div>
                  </div>
                </div>
                <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full shadow-lg"></div>
                    <span className="text-slate-200 font-medium">Contacted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">{stats.leads.contacted}</span>
                    <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" style={{width: `${stats.leads.total > 0 ? (stats.leads.contacted / stats.leads.total) * 100 : 0}%`}}></div>
                    </div>
                  </div>
                </div>
                <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-lg"></div>
                    <span className="text-slate-200 font-medium">Converted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">{stats.leads.converted}</span>
                    <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" style={{width: `${stats.leads.total > 0 ? (stats.leads.converted / stats.leads.total) * 100 : 0}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call Performance */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-600/10 to-slate-800/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Call Performance</h3>
              </div>
              <div className="space-y-4">
                <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-slate-200 font-medium">Average Duration</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{Math.floor((stats.calls.average_duration || 0) / 60)}m {(stats.calls.average_duration || 0) % 60}s</span>
                </div>
                <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-slate-200 font-medium">Successful Calls</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">{(stats.calls.completed_calls || 0).toLocaleString()}</span>
                </div>
                <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center">
                      <PhoneCall className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-slate-200 font-medium">Inbound Calls</span>
                  </div>
                  <span className="text-2xl font-bold text-red-400">{(stats.calls.inbound_calls || 0).toLocaleString()}</span>
                </div>
                <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-slate-200 font-medium">Outbound Calls</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{(stats.calls.outbound_calls || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Analysis (if available) */}
      {stats.calls.interest_counts && (stats.calls.interest_counts.interested > 0 || stats.calls.interest_counts.not_interested > 0) && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-red-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">AI Interest Analysis</h2>
          </div>
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-yellow-600/10 to-red-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-red-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Conversation Sentiment Analysis</h3>
                  <p className="text-slate-400 text-sm">AI-powered analysis of customer interest levels</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="group text-center p-4 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.calls.interest_counts.interested}</div>
                  <div className="text-sm font-medium text-emerald-300 mb-1">Interested</div>
                  <div className="text-xs text-slate-400">High conversion potential</div>
                </div>
                <div className="group text-center p-4 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.calls.interest_counts.neutral}</div>
                  <div className="text-sm font-medium text-yellow-300 mb-1">Neutral</div>
                  <div className="text-xs text-slate-400">Requires follow-up</div>
                </div>
                <div className="group text-center p-4 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="text-3xl font-bold text-red-400 mb-1">{stats.calls.interest_counts.not_interested}</div>
                  <div className="text-sm font-medium text-red-300 mb-1">Not Interested</div>
                  <div className="text-xs text-slate-400">Low conversion potential</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}