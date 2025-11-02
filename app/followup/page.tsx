'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { 
  Users, Phone, RefreshCw, Filter, Search, 
  PhoneCall, Calendar, CheckCircle, AlertCircle,
  FileText, User, Mail, Building, PhoneIcon, X,
  Clock, TrendingUp, BarChart3, Play, Pause, Square, Download
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { useCallMinutes } from '../../hooks/useCallMinutes'
import MinutesExhaustedModal from '../../components/MinutesExhaustedModal'
import NegativeBalanceWarningModal from '../../components/NegativeBalanceWarningModal'
import CreditLimitExceededModal from '../../components/CreditLimitExceededModal'

interface FollowupLead {
  id: string
  name: string
  phone: string
  email: string
  company: string
  status: 'missed' | 'called' | 'contacted' | 'converted'
  call_attempts: number
  last_call: string | null
  created_at: string
  updated_at: string
  latest_call_status?: string
  latest_call_duration?: number
  latest_call_time?: string
}

interface FollowupStats {
  missed_leads: {
    total: number
    never_called: number
    called_but_missed: number
    high_attempts: number
    recent_missed: number
    old_missed: number
  }
  call_performance: {
    total_calls_30d: number
    successful_calls_30d: number
    success_rate: number
  }
}

interface CallingStatus {
  active: boolean
  is_running: boolean
  paused: boolean
  is_paused: boolean
  queue_size: number
  current_call: any
  progress: {
    current_index: number
    current_lead: any
    total_calls: number
    completed_calls: number
    remaining_calls: number
  }
}

const API_BASE = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'
const FOLLOWUP_API_BASE = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

export default function FollowupPage() {
  const { token } = useAuth()
  
  // Call minutes management hooks
  const { checkMinutesAvailability, consumeMinutes, isChecking } = useCallMinutes()
  const [showMinutesModal, setShowMinutesModal] = useState(false)
  const [showNegativeBalanceModal, setShowNegativeBalanceModal] = useState(false)
  const [showCreditLimitModal, setShowCreditLimitModal] = useState(false)
  const [negativeBalanceData, setNegativeBalanceData] = useState({
    minutesRemaining: 0,
    extraMinutesDeficit: 0,
    message: '',
    pendingCall: null as (() => void) | null
  })
  const [creditLimitData, setCreditLimitData] = useState({
    minutesRemaining: 0,
    extraMinutesDeficit: 0,
    message: ''
  })
  
  const [leads, setLeads] = useState<FollowupLead[]>([])
  const [stats, setStats] = useState<FollowupStats>({
    missed_leads: {
      total: 0,
      never_called: 0,
      called_but_missed: 0,
      high_attempts: 0,
      recent_missed: 0,
      old_missed: 0
    },
    call_performance: {
      total_calls_30d: 0,
      successful_calls_30d: 0,
      success_rate: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('missed')
  const [attemptsFilter, setAttemptsFilter] = useState<string>('all')
  const [dateFromFilter, setDateFromFilter] = useState('')
  const [dateToFilter, setDateToFilter] = useState('')
  
  // Sequential calling state
  const [isCallingAll, setIsCallingAll] = useState(false)
  const [callingStatus, setCallingStatus] = useState<CallingStatus | null>(null)
  const [showCallModal, setShowCallModal] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 50

  // Fetch followup leads
  const fetchFollowupLeads = useCallback(async () => {
    if (!token) return
    
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })
      
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }
      
      if (attemptsFilter !== 'all') {
        if (attemptsFilter === 'never_called') {
          params.append('max_attempts', '0')
        } else if (attemptsFilter === 'low_attempts') {
          params.append('min_attempts', '1')
          params.append('max_attempts', '2')
        } else if (attemptsFilter === 'high_attempts') {
          params.append('min_attempts', '3')
        }
      }
      
      if (dateFromFilter) {
        params.append('date_from', dateFromFilter)
      }
      
      if (dateToFilter) {
        params.append('date_to', dateToFilter)
      }
      
      const response = await fetch(`${FOLLOWUP_API_BASE}/api/followup/leads?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch followup leads')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setLeads(data.data.leads)
        setCurrentPage(data.data.pagination.page)
        setTotalPages(data.data.pagination.total_pages)
        setTotalCount(data.data.pagination.total_count)
      } else {
        throw new Error(data.message || 'Failed to fetch followup leads')
      }
    } catch (error) {
      console.error('Error fetching followup leads:', error)
      toast.error('Failed to load followup leads')
    } finally {
      setLoading(false)
    }
  }, [token, currentPage, statusFilter, searchTerm, attemptsFilter, dateFromFilter, dateToFilter])

  // Fetch followup stats
  const fetchFollowupStats = useCallback(async () => {
    if (!token) return
    
    try {
      const response = await fetch(`${FOLLOWUP_API_BASE}/api/followup/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch followup stats')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching followup stats:', error)
    }
  }, [token])

  // Fetch calling status
  const fetchCallingStatus = useCallback(async () => {
    if (!token) return
    
    try {
      const response = await fetch(`${FOLLOWUP_API_BASE}/api/followup/calling-status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        return // Don't throw error for status check
      }
      
      const data = await response.json()
      
      if (data.success) {
        setCallingStatus(data.data)
        setIsCallingAll(data.data.is_running)
        
        if (data.data.is_running && !showCallModal) {
          setShowCallModal(true)
        }
      }
    } catch (error) {
      console.error('Error fetching calling status:', error)
    }
  }, [token, showCallModal])

  // Initial data fetch
  useEffect(() => {
    fetchFollowupLeads()
    fetchFollowupStats()
    fetchCallingStatus()
  }, [fetchFollowupLeads, fetchFollowupStats, fetchCallingStatus])

  // Poll calling status when active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isCallingAll) {
      interval = setInterval(() => {
        fetchCallingStatus()
      }, 2000) // Poll every 2 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isCallingAll, fetchCallingStatus])

  // Start followup calling
  const handleStartCalling = useCallback(async () => {
    if (isCallingAll) {
      toast.error('Followup calling is already in progress')
      return
    }

    const filteredLeads = leads.filter(lead => {
      const matchesSearch = !searchTerm.trim() || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
      
      let matchesAttempts = true
      if (attemptsFilter === 'never_called') {
        matchesAttempts = lead.call_attempts === 0
      } else if (attemptsFilter === 'low_attempts') {
        matchesAttempts = lead.call_attempts >= 1 && lead.call_attempts <= 2
      } else if (attemptsFilter === 'high_attempts') {
        matchesAttempts = lead.call_attempts >= 3
      }
      
      return matchesSearch && matchesStatus && matchesAttempts
    })
    
    if (filteredLeads.length === 0) {
      toast.error('No leads match the current filters for calling')
      return
    }

    try {
      // Check minutes availability (estimate 3 minutes per lead)
      const estimatedMinutes = filteredLeads.length * 3
      const availability = await checkMinutesAvailability(estimatedMinutes)
      
      if (availability.warning_type === 'credit_limit_exceeded') {
        setCreditLimitData({
          minutesRemaining: availability.minutes_remaining,
          extraMinutesDeficit: availability.extra_minutes_deficit || 0,
          message: availability.message
        })
        setShowCreditLimitModal(true)
        return
      }
      
      if (availability.warning_type === 'negative_balance') {
        setNegativeBalanceData({
          minutesRemaining: availability.minutes_remaining,
          extraMinutesDeficit: availability.extra_minutes_deficit || 0,
          message: availability.message,
          pendingCall: () => proceedWithCalling()
        })
        setShowNegativeBalanceModal(true)
        return
      }
      
      if (!availability.available) {
        setShowMinutesModal(true)
        return
      }
      
      await proceedWithCalling()
      
    } catch (error) {
      console.error('Error checking minutes availability:', error)
      toast.error('Unable to verify minute availability. Please try again.')
    }
  }, [leads, searchTerm, statusFilter, attemptsFilter, isCallingAll, checkMinutesAvailability])

  const proceedWithCalling = useCallback(async () => {
    try {
      // Build filters
      const filters: any = {}
      
      if (statusFilter && statusFilter !== 'all') {
        filters.status = statusFilter
      }
      
      if (searchTerm.trim()) {
        filters.search = searchTerm.trim()
      }
      
      if (attemptsFilter !== 'all') {
        if (attemptsFilter === 'never_called') {
          filters.max_attempts = 0
        } else if (attemptsFilter === 'low_attempts') {
          filters.min_attempts = 1
          filters.max_attempts = 2
        } else if (attemptsFilter === 'high_attempts') {
          filters.min_attempts = 3
        }
      }
      
      if (dateFromFilter) {
        filters.date_from = dateFromFilter
      }
      
      if (dateToFilter) {
        filters.date_to = dateToFilter
      }
      
      const response = await fetch(`${FOLLOWUP_API_BASE}/api/followup/start-calling`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          filters: filters
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        setIsCallingAll(true)
        setShowCallModal(true)
        fetchCallingStatus()
      } else {
        throw new Error(data.message || 'Failed to start followup calling')
      }
    } catch (error) {
      console.error('Error starting followup calling:', error)
      toast.error('Failed to start followup calling')
    }
  }, [token, statusFilter, searchTerm, attemptsFilter, dateFromFilter, dateToFilter, fetchCallingStatus])

  // Stop calling
  const handleStopCalling = useCallback(async () => {
    try {
      const response = await fetch(`${FOLLOWUP_API_BASE}/api/followup/stop-calling`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        toast('Followup calling stopped', { icon: 'ℹ️' })
        setIsCallingAll(false)
        setShowCallModal(false)
        setCallingStatus(null)
      } else {
        toast.error(`Failed to stop: ${data.error}`)
      }
    } catch (error) {
      console.error('Error stopping followup calling:', error)
      toast.error('Failed to stop followup calling')
    }
  }, [token])

  // Pause/Resume calling
  const handlePauseResumeCalling = useCallback(async () => {
    try {
      const endpoint = callingStatus?.is_paused ? 'resume-calling' : 'pause-calling'
      const response = await fetch(`${FOLLOWUP_API_BASE}/api/followup/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        toast(data.message, { icon: callingStatus?.is_paused ? '▶️' : '⏸️' })
        fetchCallingStatus()
      } else {
        toast.error(`Failed to ${callingStatus?.is_paused ? 'resume' : 'pause'}: ${data.error}`)
      }
    } catch (error) {
      console.error('Error pausing/resuming followup calling:', error)
      toast.error('Failed to pause/resume followup calling')
    }
  }, [token, callingStatus?.is_paused, fetchCallingStatus])

  // Force next call
  const handleForceNext = useCallback(async () => {
    try {
      const response = await fetch(`${FOLLOWUP_API_BASE}/api/followup/force-next`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        toast('Forced next call', { icon: '⏭️' })
        fetchCallingStatus()
      } else {
        toast.error(`Failed to force next: ${data.error}`)
      }
    } catch (error) {
      console.error('Error forcing next call:', error)
      toast.error('Failed to force next call')
    }
  }, [token, fetchCallingStatus])

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('missed')
    setAttemptsFilter('all')
    setDateFromFilter('')
    setDateToFilter('')
    setCurrentPage(1)
  }

  // Export to CSV
  const handleExportCSV = useCallback(async () => {
    if (leads.length === 0) {
      toast.error('No leads to export')
      return
    }

    try {
      toast.loading('Preparing CSV export...', { id: 'export-loading' })

      const FOLLOWUP_API_BASE = process.env.NEXT_PUBLIC_CALL_API_URL || 'https://callagent-be-2.onrender.com'
      
      // Build query parameters from current filters
      const queryParams = new URLSearchParams()
      
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter)
      }
      
      if (searchTerm) {
        queryParams.append('search', searchTerm)
      }
      
      if (attemptsFilter !== 'all') {
        const [min, max] = attemptsFilter === '0' 
          ? [0, 0] 
          : attemptsFilter === '1-2'
            ? [1, 2]
            : attemptsFilter === '3+'
              ? [3, null]
              : [null, null]
        
        if (min !== null) queryParams.append('min_attempts', min.toString())
        if (max !== null) queryParams.append('max_attempts', max.toString())
      }
      
      if (dateFromFilter) {
        queryParams.append('date_from', dateFromFilter)
      }
      
      if (dateToFilter) {
        queryParams.append('date_to', dateToFilter)
      }

      // Use the backend CSV export endpoint
      const exportUrl = `${FOLLOWUP_API_BASE}/api/followup/export/csv?${queryParams}`
      
      const response = await fetch(exportUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`)
      }

      // Get the CSV content as blob
      const blob = await response.blob()
      
      // Extract filename from response headers or generate one
      let filename = 'followup-leads-export.csv'
      const contentDisposition = response.headers.get('Content-Disposition')
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.+)/)
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/['"]/g, '') // Remove quotes
        }
      }

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.dismiss('export-loading')
      toast.success(`Exported ${leads.length} leads to CSV`, { 
        duration: 3000,
        icon: '📊'
      })
      
    } catch (error) {
      console.error('Export failed:', error)
      toast.dismiss('export-loading')
      toast.error('Failed to export leads. Please try again.')
    }
  }, [token, leads.length, statusFilter, searchTerm, attemptsFilter, dateFromFilter, dateToFilter])

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  // Format time ago
  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'missed': return 'text-red-300 bg-red-500/20 border border-red-500/30'
      case 'called': return 'text-yellow-300 bg-yellow-500/20 border border-yellow-500/30'
      case 'contacted': return 'text-blue-300 bg-blue-500/20 border border-blue-500/30'
      case 'converted': return 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/30'
      default: return 'text-slate-300 bg-slate-500/20 border border-slate-500/30'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-red-600/10 to-yellow-600/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-800/50 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-orange-100 to-red-100 bg-clip-text text-transparent">
                    Followup Management
                  </h1>
                  <p className="text-slate-400 text-lg">Missed Call Recovery System</p>
                </div>
              </div>
              <p className="text-slate-300 max-w-2xl">Systematically follow up on missed leads to improve conversion rates and maximize opportunities</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4 sm:gap-0">
              <button
                onClick={handleExportCSV}
                disabled={loading || leads.length === 0}
                className="group flex items-center justify-center sm:justify-start space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl sm:transform sm:hover:scale-105 touch-manipulation"
                title={`Export ${leads.length > 0 ? `all ${leads.length}` : '0'} filtered leads to CSV`}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export CSV</span>
                {leads.length > 0 && (
                  <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded-full">
                    {leads.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => {
                  fetchFollowupLeads()
                  fetchFollowupStats()
                }}
                disabled={loading}
                className="group flex items-center justify-center sm:justify-start space-x-2 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl sm:transform sm:hover:scale-105 touch-manipulation"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                <span className="text-sm font-medium">Refresh Data</span>
              </button>
              
              {!isCallingAll ? (
                <button
                  onClick={handleStartCalling}
                  disabled={loading || leads.length === 0}
                  className="group flex items-center justify-center sm:justify-start space-x-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl sm:transform sm:hover:scale-105 touch-manipulation"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span className="text-sm font-medium">Call All Filtered</span>
                </button>
              ) : (
                <button
                  onClick={handleStopCalling}
                  className="group flex items-center justify-center sm:justify-start space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl sm:transform sm:hover:scale-105 touch-manipulation"
                >
                  <Square className="w-4 h-4" />
                  <span className="text-sm font-medium">Stop Calling</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-red-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Total Missed</p>
                <p className="text-3xl font-bold text-white">{loading ? '...' : stats.missed_leads.total.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/10 rounded-lg">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-300 font-medium">{stats.missed_leads.recent_missed}</span>
              </div>
              <span className="text-sm text-slate-400">recent</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-orange-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-yellow-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Never Called</p>
                <p className="text-3xl font-bold text-white">{loading ? '...' : stats.missed_leads.never_called.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/25 transition-all duration-300">
                <Phone className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/10 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-300 font-medium">0</span>
              </div>
              <span className="text-sm text-slate-400">attempts</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">High Attempts</p>
                <p className="text-3xl font-bold text-white">{loading ? '...' : stats.missed_leads.high_attempts.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500/10 rounded-lg">
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">3+</span>
              </div>
              <span className="text-sm text-slate-400">attempts</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-green-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-white">{loading ? '...' : `${stats.call_performance.success_rate}%`}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-medium">{stats.call_performance.successful_calls_30d}</span>
              </div>
              <span className="text-sm text-slate-400">successful</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 via-slate-700/10 to-slate-800/10 rounded-2xl blur-xl"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Search */}
              <div className="sm:col-span-2 lg:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, phone, or email..."
                    className="pl-10 block w-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-slate-400 text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white sm:text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="missed">Missed</option>
                  <option value="called">Called</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </div>

              {/* Attempts Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Attempts
                </label>
                <select
                  value={attemptsFilter}
                  onChange={(e) => setAttemptsFilter(e.target.value)}
                  className="block w-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white sm:text-sm"
                >
                  <option value="all">All Attempts</option>
                  <option value="never_called">Never Called (0)</option>
                  <option value="low_attempts">Low Attempts (1-2)</option>
                  <option value="high_attempts">High Attempts (3+)</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => setDateFromFilter(e.target.value)}
                  className="block w-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white sm:text-sm"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => setDateToFilter(e.target.value)}
                  className="block w-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <button
                onClick={resetFilters}
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                Reset Filters
              </button>
              <div className="text-sm text-slate-400">
                Showing {leads.length} of {totalCount} leads
              </div>
            </div>
          </div>
        </div>

      {/* Leads Table */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 via-slate-700/10 to-slate-800/10 rounded-2xl blur-xl"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/50">
            <h3 className="text-lg leading-6 font-medium text-white">
              Followup Leads
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Leads that require followup calls
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-slate-400" />
              <p className="mt-2 text-slate-400">Loading followup leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-slate-400" />
              <p className="mt-2 text-slate-400">No followup leads found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-slate-800/50">
                {leads.map((lead) => (
                  <li key={lead.id} className="px-4 sm:px-6 py-4 hover:bg-slate-800/30 transition-colors duration-200">
                    {/* Desktop/Tablet Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-300" />
                          </div>
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-white truncate">
                              {lead.name}
                            </p>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-slate-400">
                            <PhoneIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            <span className="truncate">{lead.phone}</span>
                            {lead.email && (
                              <>
                                <Mail className="flex-shrink-0 ml-4 mr-1.5 h-4 w-4" />
                                <span className="truncate">{lead.email}</span>
                              </>
                            )}
                            {lead.company && (
                              <>
                                <Building className="flex-shrink-0 ml-4 mr-1.5 h-4 w-4" />
                                <span className="truncate">{lead.company}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-white">
                            {lead.call_attempts} attempts
                          </p>
                          <p className="text-xs text-slate-400">
                            Last: {formatTimeAgo(lead.last_call)}
                          </p>
                        </div>
                        {lead.latest_call_duration && (
                          <div className="text-right">
                            <p className="text-sm text-white">
                              {Math.round(lead.latest_call_duration)}s
                            </p>
                            <p className="text-xs text-slate-400">
                              {lead.latest_call_status}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {lead.name}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white">
                            {lead.call_attempts} attempts
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatTimeAgo(lead.last_call)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center text-slate-400">
                          <PhoneIcon className="flex-shrink-0 mr-2 h-4 w-4" />
                          <span className="truncate">{lead.phone}</span>
                        </div>
                        {lead.email && (
                          <div className="flex items-center text-slate-400">
                            <Mail className="flex-shrink-0 mr-2 h-4 w-4" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        )}
                        {lead.company && (
                          <div className="flex items-center text-slate-400">
                            <Building className="flex-shrink-0 mr-2 h-4 w-4" />
                            <span className="truncate">{lead.company}</span>
                          </div>
                        )}
                        {lead.latest_call_duration && (
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Last Call Duration:</span>
                            <span className="text-white">{Math.round(lead.latest_call_duration)}s</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-slate-900/50 px-4 sm:px-6 py-4 border-t border-slate-800/50">
                  {/* Mobile Pagination */}
                  <div className="sm:hidden">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-slate-400">
                        Page {currentPage} of {totalPages}
                      </p>
                      <p className="text-xs text-slate-400">
                        {totalCount} total results
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="flex-1 mr-2 inline-flex items-center justify-center px-4 py-3 border border-slate-700 text-sm font-medium rounded-xl text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 disabled:opacity-50 transition-colors touch-manipulation"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="flex-1 ml-2 inline-flex items-center justify-center px-4 py-3 border border-slate-700 text-sm font-medium rounded-xl text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 disabled:opacity-50 transition-colors touch-manipulation"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                  
                  {/* Desktop Pagination */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Showing{' '}
                        <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span>
                        {' '}to{' '}
                        <span className="font-medium text-white">
                          {Math.min(currentPage * itemsPerPage, totalCount)}
                        </span>
                        {' '}of{' '}
                        <span className="font-medium text-white">{totalCount}</span>
                        {' '}results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 rounded-l-xl border border-slate-700 bg-slate-800/50 text-sm font-medium text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 transition-colors"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-4 py-2 rounded-r-xl border border-slate-700 bg-slate-800/50 text-sm font-medium text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 transition-colors"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Calling Progress Modal */}
      {showCallModal && callingStatus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-6 w-full max-w-md sm:w-96 shadow-2xl rounded-2xl bg-slate-900/95 backdrop-blur-sm border border-slate-800/50">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">
                  Followup Calling Progress
                </h3>
                <button
                  onClick={() => setShowCallModal(false)}
                  className="text-slate-400 hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Progress</span>
                    <span>
                      {callingStatus.progress?.completed_calls || 0} / {callingStatus.progress?.total_calls || 0}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${callingStatus.progress?.total_calls ? 
                          ((callingStatus.progress.completed_calls || 0) / callingStatus.progress.total_calls) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Current Call */}
                {callingStatus.current_call && (
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <p className="text-sm font-medium text-blue-300">
                      Currently calling:
                    </p>
                    <p className="text-sm text-blue-200">
                      {callingStatus.current_call.name} ({callingStatus.current_call.phone})
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status:</span>
                  <span className={`text-sm font-medium ${
                    callingStatus.is_paused ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {callingStatus.is_paused ? 'Paused' : 'Running'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Queue:</span>
                  <span className="text-sm font-medium text-white">
                    {callingStatus.queue_size} remaining
                  </span>
                </div>

                {/* Controls */}
                <div className="flex space-x-3 pt-6">
                  <button
                    onClick={handlePauseResumeCalling}
                    className={`flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      callingStatus.is_paused 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' 
                        : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                    }`}
                  >
                    {callingStatus.is_paused ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleForceNext}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-slate-700 text-sm font-medium rounded-xl text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300"
                  >
                    Skip Current
                  </button>
                  
                  <button
                    onClick={handleStopCalling}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <MinutesExhaustedModal 
        isOpen={showMinutesModal} 
        onClose={() => setShowMinutesModal(false)}
        minutesRemaining={0}
        message="Insufficient call minutes to start followup calling"
      />
      
      <NegativeBalanceWarningModal
        isOpen={showNegativeBalanceModal}
        onClose={() => setShowNegativeBalanceModal(false)}
        minutesRemaining={negativeBalanceData.minutesRemaining}
        extraMinutesDeficit={negativeBalanceData.extraMinutesDeficit}
        message={negativeBalanceData.message}
        onProceed={() => {
          setShowNegativeBalanceModal(false)
          if (negativeBalanceData.pendingCall) {
            negativeBalanceData.pendingCall()
          }
        }}
      />
      
      <CreditLimitExceededModal
        isOpen={showCreditLimitModal}
        onClose={() => setShowCreditLimitModal(false)}
        minutesRemaining={creditLimitData.minutesRemaining}
        extraMinutesDeficit={creditLimitData.extraMinutesDeficit}
        message={creditLimitData.message}
      />
    </div>
  )
}