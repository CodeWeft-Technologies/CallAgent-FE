'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import MemoizedCallRow from '../../components/MemoizedCallRow'
import VirtualList from '../../components/VirtualList'
import { usePagination } from '../../hooks/usePagination'
import { useCallsCache, useStatsCache } from '../../hooks/useDataCache'
import { useDebouncedSearch } from '../../hooks/useDebounce'
import { useIST } from '../../hooks/useIST'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Phone, PhoneCall, Clock, User, MessageSquare, 
  Calendar, Search, Filter, Download, Eye,
  Play, Pause, Volume2, FileText, Users,
  TrendingUp, Activity, CheckCircle, XCircle,
  PhoneIncoming, PhoneOutgoing
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Call {
  _id: string
  phone_number: string | number
  direction?: 'inbound' | 'outbound'
  lead_id?: string
  lead?: {
    name: string
    company?: string
    email?: string
  }
  call_date: string
  status: 'completed' | 'failed' | 'missed' | 'initiated'
  duration: number
  transcription: Array<{
    type: 'user' | 'bot' | 'greeting' | 'exit'
    content: string
    timestamp: string
  }>
  ai_responses: Array<{
    type: 'bot' | 'greeting' | 'exit'
    content: string
    timestamp: string
  }>
  call_summary: string
  sentiment: string
  interest_analysis?: {
    interest_status: 'interested' | 'not_interested' | 'neutral'
    confidence: number
    reasoning: string
    key_indicators: string[]
  }
  created_at: string
  webhook_data?: {
    from?: number
    to?: number
    [key: string]: any
  }
}

interface CallStats {
  total_calls: number
  calls_today: number
  calls_this_week: number
  average_duration: number
  status_counts: {
    completed: number
    failed: number
    missed: number
  }
  interest_counts?: {
    interested: number
    not_interested: number
    neutral: number
  }
  calls_with_analysis?: number
}

const API_BASE = process.env.NEXT_PUBLIC_CALL_API_URL || 'https://callagent-be-2.onrender.com'

export default function CallsPage() {
  const { token } = useAuth()
  
  // Use optimized data fetching with caching
  const { data: callsData, loading: callsLoading, refresh: refreshCalls } = useCallsCache(token)
  const calls = callsData || []
  const { data: statsData, loading: statsLoading } = useStatsCache(token)
  const stats = statsData || {
    total_calls: 0,
    calls_today: 0,
    calls_this_week: 0,
    average_duration: 0,
    status_counts: { completed: 0, failed: 0, missed: 0 },
    interest_counts: { interested: 0, not_interested: 0, neutral: 0 },
    calls_with_analysis: 0
  }
  
  const [selectedCall, setSelectedCall] = useState<Call | null>(null)
  
  // Use debounced search to reduce API calls
  const { searchTerm, debouncedSearchTerm, handleSearchChange, clearSearch } = useDebouncedSearch('', 300)
  
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [interestFilter, setInterestFilter] = useState<string>('all')
  const [directionFilter, setDirectionFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  
  // Filtered calls calculation
  const filteredCalls = useMemo(() => {
    if (!calls) return []
    return calls.filter((call: Call) => {
      const phoneStr = String(call.phone_number ?? '')
      const leadName = call.lead?.name ? call.lead.name.toLowerCase() : ''
      const term = debouncedSearchTerm.toLowerCase()
      const matchesSearch = phoneStr.includes(debouncedSearchTerm) || leadName.includes(term)
      
      const matchesStatus = statusFilter === 'all' || call.status === statusFilter
      
      const matchesInterest = interestFilter === 'all' || 
        (interestFilter === 'no_analysis' && !call.interest_analysis) ||
        (call.interest_analysis?.interest_status === interestFilter)
      
      const matchesDirection = directionFilter === 'all' || 
        (call.direction || 'outbound') === directionFilter
      
      return matchesSearch && matchesStatus && matchesInterest && matchesDirection
    })
  }, [calls, debouncedSearchTerm, statusFilter, interestFilter, directionFilter])


  // Pagination for better performance with large datasets
  const ITEMS_PER_PAGE = 50
  const pagination = usePagination({
    totalItems: filteredCalls.length,
    itemsPerPage: ITEMS_PER_PAGE
  })
  
  const loading = callsLoading || statsLoading

  // Remove old useEffect since we're using the cache hooks now

  // Remove old loadStats since we're using the cache hooks now

  const getStatusBadge = useCallback((status: string) => {
    const styles = {
      completed: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30',
      failed: 'bg-red-600/20 text-red-400 border border-red-500/30',
      missed: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }, [])

  const getDirectionBadge = useCallback((call: Call) => {
    const direction = call.direction || 'outbound' // Default to outbound if not specified
    const isInbound = direction === 'inbound'
    
    // Get the relevant phone number to display
    let displayNumber = ''
    let label = ''
    
    if (isInbound) {
      // For inbound: show who called us
      displayNumber = String(call.phone_number || call.webhook_data?.from || '')
      label = 'Inbound Call'
    } else {
      // For outbound: show who we called
      displayNumber = String(call.phone_number || call.webhook_data?.to || '')
      label = 'Outbound Call'
    }
    
    return (
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
          isInbound 
            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
            : 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
        }`}>
          {isInbound ? (
            <PhoneIncoming className="w-3 h-3" />
          ) : (
            <PhoneOutgoing className="w-3 h-3" />
          )}
          <span>{isInbound ? 'Inbound' : 'Outbound'}</span>
        </div>
        {displayNumber && (
          <div className="text-xs text-slate-400">
            {isInbound ? 'From:' : 'To:'} {displayNumber}
        </div>
        )}
      </div>
    )
  }, [])

  const getInterestBadge = useCallback((interest_analysis?: Call['interest_analysis']) => {
    if (!interest_analysis) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-600/20 text-slate-400 border border-slate-500/30">
          No Analysis
        </span>
      )
    }

    const { interest_status, confidence } = interest_analysis
    const styles = {
      interested: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30',
      not_interested: 'bg-red-600/20 text-red-400 border border-red-500/30',
      neutral: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
    }
    
    const labels = {
      interested: 'Interested',
      not_interested: 'Not Interested',
      neutral: 'Neutral'
    }
    
    return (
      <div className="flex items-center space-x-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[interest_status]}`}>
          {labels[interest_status]}
        </span>
        <span className="text-xs text-slate-400">
          {Math.round(confidence * 100)}%
        </span>
      </div>
    )
  }, [])

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  // Use IST conversion hook
  const { formatDateTime, formatTime, formatIST, formatTimeOnly } = useIST()

  const getSentimentColor = useCallback((sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-emerald-400'
      case 'negative': return 'text-red-400'
      case 'neutral': return 'text-slate-400'
      default: return 'text-slate-400'
    }
  }, [])

  // Remove duplicate function since we're using the debounced search hook

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
  }, [])

  const handleInterestFilterChange = useCallback((value: string) => {
    setInterestFilter(value)
  }, [])

  const handleDirectionFilterChange = useCallback((value: string) => {
    setDirectionFilter(value)
  }, [])

  const handleSelectCall = useCallback((call: Call) => {
    setSelectedCall(call)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedCall(null)
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-white">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span>Loading calls...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Call History</h1>
          <p className="text-slate-400 mt-2">View call details, transcriptions, and analytics</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Total Calls</p>
              <p className="text-xl font-bold text-white">{stats.total_calls}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Today</p>
              <p className="text-xl font-bold text-blue-400">{stats.calls_today}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Interested</p>
              <p className="text-xl font-bold text-emerald-400">{stats.interest_counts?.interested || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Not Interested</p>
              <p className="text-xl font-bold text-red-400">{stats.interest_counts?.not_interested || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Avg Duration</p>
              <p className="text-xl font-bold text-purple-400">{formatDuration(stats.average_duration)}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Completed</p>
              <p className="text-xl font-bold text-emerald-400">{stats.status_counts.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by phone number or lead name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          
          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="missed">Missed</option>
            </select>
            
            <select
              value={interestFilter}
              onChange={(e) => handleInterestFilterChange(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="all">All Interest</option>
              <option value="interested">Interested</option>
              <option value="not_interested">Not Interested</option>
              <option value="neutral">Neutral</option>
              <option value="no_analysis">No Analysis</option>
            </select>
            
            <select
              value={directionFilter}
              onChange={(e) => handleDirectionFilterChange(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="all">All Directions</option>
              <option value="inbound">Inbound Calls</option>
              <option value="outbound">Outbound Calls</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Call Direction</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Lead</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Interest</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Messages</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCalls
                .slice(pagination.startIndex, pagination.endIndex)
                .map((call: Call, index: number) => (
                  <MemoizedCallRow
                    key={call._id}
                    call={call}
                    index={pagination.startIndex + index}
                    getStatusBadge={getStatusBadge}
                    getDirectionBadge={getDirectionBadge}
                    getInterestBadge={getInterestBadge}
                    formatDuration={formatDuration}
                    formatDate={formatDateTime}
                    onSelectCall={handleSelectCall}
                  />
                ))}
            </tbody>
          </table>
          
          {filteredCalls.length === 0 && (
            <div className="text-center py-16">
              <Phone className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No calls found</p>
              <p className="text-sm text-slate-500">Calls will appear here after they are completed</p>
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-4 bg-slate-800/50 border-t border-slate-700">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="text-sm text-slate-400">
                Showing {pagination.startIndex + 1} to {pagination.endIndex} of {filteredCalls.length} calls
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={pagination.prevPage}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-all"
                >
                  Previous
                </button>
                
                {pagination.pageNumbers.map((pageNum, index) => (
                  <button
                    key={index}
                    onClick={() => pageNum > 0 ? pagination.goToPage(pageNum) : null}
                    disabled={pageNum === -1}
                    className={`px-3 py-2 text-sm rounded-lg transition-all ${
                      pageNum === pagination.currentPage
                        ? 'bg-blue-600 text-white'
                        : pageNum === -1
                        ? 'text-slate-500 cursor-default'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {pageNum === -1 ? '...' : pageNum}
                  </button>
                ))}
                
                <button
                  onClick={pagination.nextPage}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Details Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Call Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {/* Call Info */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-slate-800 rounded-xl p-4">
                <div className="text-sm text-slate-400">Call Direction</div>
                <div className="text-white font-medium">{getDirectionBadge(selectedCall)}</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4">
                <div className="text-sm text-slate-400">Phone Number</div>
                <div className="text-white font-medium">{selectedCall.phone_number}</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4">
                <div className="text-sm text-slate-400">Duration</div>
                <div className="text-white font-medium">{formatDuration(selectedCall.duration)}</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4">
                <div className="text-sm text-slate-400">Status</div>
                <div className="text-white font-medium">{getStatusBadge(selectedCall.status)}</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4">
                <div className="text-sm text-slate-400">Date</div>
                <div className="text-white font-medium">{formatDateTime(selectedCall.call_date)}</div>
              </div>
            </div>

            {/* Lead Info */}
            {selectedCall.lead && (
              <div className="bg-slate-800 rounded-xl p-4 mb-6">
                <h4 className="text-white font-medium mb-2">Lead Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-slate-400">Name</div>
                    <div className="text-white">{selectedCall.lead.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Company</div>
                    <div className="text-white">{selectedCall.lead.company || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Email</div>
                    <div className="text-white">{selectedCall.lead.email || 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Interest Analysis */}
            {selectedCall.interest_analysis && (
              <div className="bg-slate-800 rounded-xl p-4 mb-6">
                <h4 className="text-white font-medium mb-4">Interest Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Interest Level</div>
                    <div className="flex items-center space-x-2">
                      {getInterestBadge(selectedCall.interest_analysis)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Confidence</div>
                    <div className="text-white font-medium">
                      {Math.round(selectedCall.interest_analysis.confidence * 100)}%
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-slate-400 mb-1">Reasoning</div>
                  <p className="text-slate-300 text-sm">{selectedCall.interest_analysis.reasoning}</p>
                </div>
                {selectedCall.interest_analysis.key_indicators.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-slate-400 mb-2">Key Indicators</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCall.interest_analysis.key_indicators.map((indicator, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md"
                        >
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Call Summary */}
            <div className="bg-slate-800 rounded-xl p-4 mb-6">
              <h4 className="text-white font-medium mb-2">Call Summary</h4>
              <p className="text-slate-300">{selectedCall.call_summary}</p>
            </div>

            {/* Conversation */}
            <div className="bg-slate-800 rounded-xl p-4">
              <h4 className="text-white font-medium mb-4">Conversation</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[...selectedCall.transcription, ...selectedCall.ai_responses]
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((message, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-600/20 border border-blue-500/30' 
                        : 'bg-slate-700/50 border border-slate-600/30'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-blue-400" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                          )}
                          <span className={`text-xs font-medium ${
                            message.type === 'user' ? 'text-blue-400' : 'text-emerald-400'
                          }`}>
                            {message.type === 'user' ? 'User' : 'AI'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatTimeOnly(message.timestamp)}
                        </span>
                      </div>
                      <div className="text-white text-sm">
                        {typeof message.content === 'string' 
                          ? message.content 
                          : message.content?.transcript || message.content?.text || JSON.stringify(message.content)
                        }
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}