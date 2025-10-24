'use client'

import { useState, useCallback } from 'react'
import MemoizedCallRow from '../../components/MemoizedCallRow'
import CallFilters from '../../components/CallFilters'
import { useCallsWithFilters, useFilterOptions } from '../../hooks/useCallsWithFilters'
import { useIST } from '../../hooks/useIST'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Phone, PhoneCall, Clock, User, MessageSquare, 
  Calendar, Search, Filter, Download, Eye,
  Play, Pause, Volume2, FileText, Users,
  TrendingUp, Activity, CheckCircle, XCircle,
  PhoneIncoming, PhoneOutgoing, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

// CSV Export utility function
const exportToCSV = (data: Call[], filename: string) => {
  // Define CSV headers
  const headers = [
    'Call ID',
    'Phone Number',
    'Direction',
    'Date & Time',
    'Lead Name',
    'Lead Company',
    'Lead Email', 
    'Status',
    'Duration (seconds)',
    'Duration (formatted)',
    'Interest Status',
    'Interest Confidence',
    'Sentiment',
    'Call Summary',
    'User Messages Count',
    'AI Messages Count',
    'Total Transcription Length'
  ]

  // Convert data to CSV rows
  const csvData = data.map(call => {
    const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const userMessagesCount = call.transcription?.filter(t => t.type === 'user').length || 0
    const aiMessagesCount = call.ai_responses?.length || 0
    const totalTranscriptionLength = call.transcription?.reduce((acc, t) => {
      const content = typeof t.content === 'string' ? t.content : 
                     t.content?.transcript || t.content?.text || ''
      return acc + content.length
    }, 0) || 0

    return [
      call._id,
      call.phone_number,
      call.direction?.toUpperCase() || 'UNKNOWN',
      new Date(call.call_date).toLocaleString(),
      call.lead?.name || 'No Lead',
      call.lead?.company || 'N/A',
      call.lead?.email || 'N/A',
      call.status?.toUpperCase() || 'UNKNOWN',
      call.duration,
      formatDuration(call.duration),
      call.interest_analysis?.interest_status?.replace('_', ' ').toUpperCase() || 'NO ANALYSIS',
      call.interest_analysis?.confidence ? `${Math.round(call.interest_analysis.confidence * 100)}%` : 'N/A',
      call.sentiment?.toUpperCase() || 'UNKNOWN',
      `"${call.call_summary?.replace(/"/g, '""') || 'No summary'}"`, // Escape quotes in CSV
      userMessagesCount,
      aiMessagesCount,
      totalTranscriptionLength
    ]
  })

  // Combine headers and data
  const csvContent = [headers, ...csvData]
    .map(row => row.join(','))
    .join('\n')

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

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
    content: string | { transcript?: string; text?: string; [key: string]: any }
    timestamp: string
  }>
  ai_responses: Array<{
    type: 'bot' | 'greeting' | 'exit'
    content: string | { transcript?: string; text?: string; [key: string]: any }
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

export default function EnhancedCallsPage() {
  const { token } = useAuth()
  
  // Use the new filtering hooks
  const {
    data: calls,
    loading: callsLoading,
    error: callsError,
    total,
    filters,
    updateFilters,
    clearFilters,
    refresh: refreshCalls,
    setPage,
    currentPage,
    pageSize
  } = useCallsWithFilters(token || undefined, { limit: 50 })
  
  const {
    options: filterOptions,
    loading: optionsLoading
  } = useFilterOptions(token || undefined)
  
  const [selectedCall, setSelectedCall] = useState<Call | null>(null)
  
  const loading = callsLoading || optionsLoading
  
  // Calculate pagination
  const totalPages = Math.ceil(total / pageSize)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1
  
  const handlePageChange = useCallback((page: number) => {
    setPage(page)
  }, [setPage])
  
  const handleRefresh = useCallback(() => {
    refreshCalls()
    toast.success('Calls refreshed')
  }, [refreshCalls])
  
  const getStatusBadge = useCallback((status: string) => {
    const styles = {
      completed: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30',
      failed: 'bg-red-600/20 text-red-400 border border-red-500/30',
      missed: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30',
      initiated: 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }, [])

  const getDirectionBadge = useCallback((call: Call) => {
    const direction = call.direction || 'outbound'
    const isInbound = direction === 'inbound'
    
    let displayNumber = ''
    
    if (isInbound) {
      displayNumber = String(call.phone_number || call.webhook_data?.from || '')
    } else {
      displayNumber = String(call.phone_number || call.webhook_data?.to || '')
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

  const { formatDateTime, formatTimeOnly } = useIST()

  const handleSelectCall = useCallback((call: Call) => {
    setSelectedCall(call)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedCall(null)
  }, [])

  const handleExportCSV = useCallback(async () => {
    if (total === 0) {
      toast.error('No calls to export')
      return
    }

    try {
      toast.loading('Preparing CSV export...', { id: 'export-loading' })

      const API_BASE = process.env.NEXT_PUBLIC_CALL_API_URL || 'https://callagent-be-2.onrender.com'
      
      // Build query parameters from current filters
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
          queryParams.append(key, String(value))
        }
      })

      // Use the backend CSV export endpoint
      const exportUrl = `${API_BASE}/api/calls/export/csv?${queryParams}`
      
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
      let filename = 'calls-export.csv'
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
      toast.success(`Exported ${total} calls to CSV`, { 
        duration: 3000,
        icon: '📊'
      })
      
    } catch (error) {
      console.error('Export failed:', error)
      toast.dismiss('export-loading')
      toast.error('Failed to export calls. Please try again.')
    }
  }, [filters, total, token])

  if (callsError) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Error Loading Calls</h3>
            <p className="text-slate-400 mb-4">{callsError.message}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
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
          <p className="text-slate-400 mt-2">
            {total > 0 ? `${total} calls found` : 'View call details, transcriptions, and analytics'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            disabled={loading || total === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={`Export ${total > 0 ? `all ${total}` : '0'} ${Object.keys(filters).length > 0 ? 'filtered ' : ''}calls to CSV`}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
            {total > 0 && (
              <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded-full">
                {total}
              </span>
            )}
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <CallFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        filterOptions={filterOptions?.filter_options}
        loading={loading}
      />

      {/* Results Summary */}
      {total > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing {calls.length} of {total} calls
              {Object.keys(filters).length > 0 && (
                <span className="ml-2 text-blue-400">
                  (filtered)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {Object.keys(filters).length > 0 && (
                <div className="text-xs text-emerald-400 flex items-center">
                  <Download className="w-3 h-3 mr-1" />
                  Export will include all {total} filtered results
                </div>
              )}
              {totalPages > 1 && (
                <div className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Calls Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-white">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span>Loading calls...</span>
            </div>
          </div>
        )}
        
        {!loading && calls.length > 0 && (
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
                {calls.map((call: Call, index: number) => (
                  <MemoizedCallRow
                    key={call._id}
                    call={call}
                    index={index}
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
          </div>
        )}
        
        {!loading && calls.length === 0 && (
          <div className="text-center py-16">
            <Phone className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No calls found</p>
            <p className="text-sm text-slate-500">
              {Object.keys(filters).length > 0 
                ? 'Try adjusting your filters or search terms'
                : 'Calls will appear here after they are completed'
              }
            </p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {totalPages > 1 && !loading && (
          <div className="px-4 py-4 bg-slate-800/50 border-t border-slate-700">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="text-sm text-slate-400">
                Showing {calls.length} of {total} calls
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevPage}
                  className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-all"
                >
                  Previous
                </button>
                
                <span className="px-3 py-2 text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                  className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Details Modal - Same as original */}
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