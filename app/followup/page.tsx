'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { 
  Users, Phone, RefreshCw, Filter, Search, 
  PhoneCall, Calendar, CheckCircle, AlertCircle,
  FileText, User, Mail, Building, PhoneIcon, X,
  Clock, TrendingUp, BarChart3, Play, Pause, Square
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
      case 'missed': return 'text-red-600 bg-red-50'
      case 'called': return 'text-yellow-600 bg-yellow-50'
      case 'contacted': return 'text-blue-600 bg-blue-50'
      case 'converted': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-600" />
                Followup Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage and call leads with missed status to improve conversion rates
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  fetchFollowupLeads()
                  fetchFollowupStats()
                }}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              {!isCallingAll ? (
                <button
                  onClick={handleStartCalling}
                  disabled={loading || leads.length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Call All Filtered
                </button>
              ) : (
                <button
                  onClick={handleStopCalling}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Calling
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Missed
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.missed_leads.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Never Called
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.missed_leads.never_called}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      High Attempts (3+)
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.missed_leads.high_attempts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Success Rate (30d)
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.call_performance.success_rate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, phone, or email..."
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attempts
                </label>
                <select
                  value={attemptsFilter}
                  onChange={(e) => setAttemptsFilter(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Attempts</option>
                  <option value="never_called">Never Called (0)</option>
                  <option value="low_attempts">Low Attempts (1-2)</option>
                  <option value="high_attempts">High Attempts (3+)</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => setDateFromFilter(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => setDateToFilter(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Reset Filters
              </button>
              <div className="text-sm text-gray-500">
                Showing {leads.length} of {totalCount} leads
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Followup Leads
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Leads that require followup calls
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Loading followup leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">No followup leads found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <li key={lead.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {lead.name}
                            </p>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
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
                          <p className="text-sm text-gray-900">
                            {lead.call_attempts} attempts
                          </p>
                          <p className="text-xs text-gray-500">
                            Last: {formatTimeAgo(lead.last_call)}
                          </p>
                        </div>
                        {lead.latest_call_duration && (
                          <div className="text-right">
                            <p className="text-sm text-gray-900">
                              {Math.round(lead.latest_call_duration)}s
                            </p>
                            <p className="text-xs text-gray-500">
                              {lead.latest_call_status}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                        {' '}to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, totalCount)}
                        </span>
                        {' '}of{' '}
                        <span className="font-medium">{totalCount}</span>
                        {' '}results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Followup Calling Progress
                </h3>
                <button
                  onClick={() => setShowCallModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {callingStatus.progress?.completed_calls || 0} / {callingStatus.progress?.total_calls || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${callingStatus.progress?.total_calls ? 
                          ((callingStatus.progress.completed_calls || 0) / callingStatus.progress.total_calls) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Current Call */}
                {callingStatus.current_call && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-blue-900">
                      Currently calling:
                    </p>
                    <p className="text-sm text-blue-700">
                      {callingStatus.current_call.name} ({callingStatus.current_call.phone})
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-medium ${
                    callingStatus.is_paused ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {callingStatus.is_paused ? 'Paused' : 'Running'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Queue:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {callingStatus.queue_size} remaining
                  </span>
                </div>

                {/* Controls */}
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={handlePauseResumeCalling}
                    className={`flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                      callingStatus.is_paused 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-yellow-600 hover:bg-yellow-700'
                    }`}
                  >
                    {callingStatus.is_paused ? (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleForceNext}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Skip Current
                  </button>
                  
                  <button
                    onClick={handleStopCalling}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <Square className="w-4 h-4 mr-1" />
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