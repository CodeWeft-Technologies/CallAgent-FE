'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { PhoneMissed, Download, RefreshCw, Calendar, Clock, User, Phone, AlertCircle } from 'lucide-react'

interface MissedCall {
  _id: string
  phone_number: string | number
  direction?: 'inbound' | 'outbound'
  lead_id?: string
  lead?: {
    id?: string
    name: string
    company?: string
    email?: string
  }
  call_date: string
  status: 'completed' | 'failed' | 'missed' | 'initiated'
  duration: number
  call_summary?: string
  sentiment?: string
}

interface MissedCallsStats {
  total: number
  today: number
  this_week: number
  this_month: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://callagent-be-production.up.railway.app'

export default function FollowupPage() {
  const { user, token } = useAuth()
  const [missedCalls, setMissedCalls] = useState<MissedCall[]>([])
  const [stats, setStats] = useState<MissedCallsStats>({
    total: 0,
    today: 0,
    this_week: 0,
    this_month: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [callingNumbers, setCallingNumbers] = useState<Set<string>>(new Set())
  const itemsPerPage = 20

  // Initialize date range to last 7 days
  useEffect(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 7)
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    })
  }, [])

  // Fetch missed calls data
  const fetchMissedCalls = async (page = 1) => {
    if (!token || !user) return

    setLoading(true)
    setError(null)

    try {
      const skip = (page - 1) * itemsPerPage
      const params = new URLSearchParams({
        status: 'missed',
        skip: skip.toString(),
        limit: itemsPerPage.toString(),
        organization_id: user.organization_id?.toString() || '',
        ...(dateRange.start && { date_from: dateRange.start }),
        ...(dateRange.end && { date_to: dateRange.end })
      })



      const response = await fetch(`${API_URL}/api/calls?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch missed calls')
      }

      const data = await response.json()
      
      if (data.success) {
        setMissedCalls(data.data || [])
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage))
        
        // Calculate stats
        const total = data.total || 0
        const calls = data.data || []
        const today = calls.filter((call: MissedCall) => {
          const callDate = new Date(call.call_date).toDateString()
          const todayDate = new Date().toDateString()
          return callDate === todayDate
        }).length

        const thisWeek = calls.filter((call: MissedCall) => {
          const callDate = new Date(call.call_date)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return callDate >= weekAgo
        }).length

        const thisMonth = calls.filter((call: MissedCall) => {
          const callDate = new Date(call.call_date)
          const monthAgo = new Date()
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return callDate >= monthAgo
        }).length

        setStats({ total, today, this_week: thisWeek, this_month: thisMonth })
      } else {
        throw new Error('API returned success: false')
      }

    } catch (err) {
      console.error('Error fetching missed calls:', err)
      setError('Failed to fetch missed calls data')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch when component mounts and user/token are available
  useEffect(() => {
    if (token && user) {
      fetchMissedCalls(1)
      setCurrentPage(1)
    }
  }, [token, user])

  // Refetch when date range changes (debounced)
  useEffect(() => {
    if (token && user) {
      const timer = setTimeout(() => {
        fetchMissedCalls(1)
        setCurrentPage(1)
      }, 300) // Debounce to avoid too many API calls
      
      return () => clearTimeout(timer)
    }
  }, [dateRange.start, dateRange.end])

  // Make call through pipeline - simplified version following leads page pattern
  const makeCall = async (call: MissedCall) => {
    if (!token || !user) return

    const phoneNumber = String(call.phone_number)
    setCallingNumbers(prev => new Set(prev).add(phoneNumber))
    setError(null)

    try {
      // Use the lead_id from the missed call
      const leadId = call.lead_id
      if (!leadId) {
        throw new Error('No lead ID available for this call')
      }

      // Make the call using the same API as the leads page
      const response = await fetch(`${API_URL}/api/leads/${leadId}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          max_retries: 3
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Show success notification
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50'
        notification.textContent = `Call initiated to ${phoneNumber}`
        document.body.appendChild(notification)
        
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 3000)

        // Refresh the missed calls list
        fetchMissedCalls(currentPage)
      } else {
        throw new Error(data.error || 'Failed to initiate call')
      }
    } catch (error) {
      console.error('Error making call:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate call'
      setError(errorMessage)
      
      // Show error notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50'
      notification.textContent = errorMessage
      document.body.appendChild(notification)
      
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 3000)
    } finally {
      setCallingNumbers(prev => {
        const newSet = new Set(prev)
        newSet.delete(phoneNumber)
        return newSet
      })
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Export to CSV
  const exportToCSV = () => {
    if (missedCalls.length === 0) {
      alert('No data to export')
      return
    }

    const headers = ['Date & Time', 'Phone Number', 'Lead Name', 'Duration', 'Status']
    const csvContent = [
      headers.join(','),
      ...missedCalls.map(call => [
        `"${formatDate(call.call_date)}"`,
        `"${call.phone_number}"`,
        `"${call.lead?.name || 'Unknown'}"`,
        `"${formatDuration(call.duration)}"`,
        `"${call.status}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `missed_calls_${dateRange.start}_to_${dateRange.end}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchMissedCalls(page)
  }

  if (!user) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <div className="min-h-screen bg-slate-950 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <PhoneMissed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Follow-up Center</h1>
              <p className="text-slate-400 text-sm sm:text-base">Manage missed calls and follow-up activities</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => fetchMissedCalls(currentPage)}
              disabled={loading}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            <button
              onClick={exportToCSV}
              disabled={missedCalls.length === 0}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-800/50 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                <PhoneMissed className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">Total Missed</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-800/50 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">Today</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.today}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-800/50 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">This Week</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.this_week}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-800/50 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">This Month</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.this_month}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-800/50 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Date Range Filter</h3>
          
          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => {
                const end = new Date()
                const start = new Date()
                setDateRange({
                  start: start.toISOString().split('T')[0],
                  end: end.toISOString().split('T')[0]
                })
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => {
                const end = new Date()
                const start = new Date()
                start.setDate(end.getDate() - 7)
                setDateRange({
                  start: start.toISOString().split('T')[0],
                  end: end.toISOString().split('T')[0]
                })
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => {
                const end = new Date()
                const start = new Date()
                start.setDate(end.getDate() - 30)
                setDateRange({
                  start: start.toISOString().split('T')[0],
                  end: end.toISOString().split('T')[0]
                })
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => {
                const end = new Date()
                const start = new Date()
                start.setMonth(start.getMonth() - 3)
                setDateRange({
                  start: start.toISOString().split('T')[0],
                  end: end.toISOString().split('T')[0]
                })
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors"
            >
              Last 3 Months
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs sm:text-sm text-slate-400 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-slate-400 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => fetchMissedCalls(1)}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
              >
                {loading ? 'Loading...' : 'Apply Filter'}
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setDateRange({ start: '', end: '' })
                }}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>

        {/* Missed Calls Table */}
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-800/50 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-800/50">
            <h3 className="text-base sm:text-lg font-semibold text-white">Missed Calls ({missedCalls.length})</h3>
          </div>

          {error && (
            <div className="p-4 sm:p-6 border-b border-slate-800/50">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm sm:text-base">{error}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-slate-400 mt-2 text-sm sm:text-base">Loading missed calls...</p>
            </div>
          ) : missedCalls.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <PhoneMissed className="w-8 h-8 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-sm sm:text-base">No missed calls found for the selected date range</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on Mobile */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Lead Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {missedCalls.map((call) => (
                      <tr key={call._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-white">{formatDate(call.call_date)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-white">{call.phone_number}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-white">{call.lead?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-white">{formatDuration(call.duration)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full">
                            Missed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => makeCall(call)}
                            disabled={callingNumbers.has(String(call.phone_number))}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 disabled:bg-green-600/10 disabled:cursor-not-allowed text-green-400 text-xs rounded-lg transition-colors"
                          >
                            {callingNumbers.has(String(call.phone_number)) ? (
                              <div className="animate-spin rounded-full h-3 w-3 border border-green-400 border-t-transparent" />
                            ) : (
                              <Phone className="w-3 h-3" />
                            )}
                            <span>{callingNumbers.has(String(call.phone_number)) ? 'Calling...' : 'Call Back'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Visible on Mobile Only */}
              <div className="md:hidden space-y-4 p-4">
                {missedCalls.map((call) => (
                  <div key={call._id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                          <PhoneMissed className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{call.lead?.name || 'Unknown'}</p>
                          <p className="text-slate-400 text-xs">{call.phone_number}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full">
                        {call.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-slate-400 text-xs">Date & Time</p>
                        <p className="text-white text-sm">{formatDate(call.call_date)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Duration</p>
                        <p className="text-white text-sm">{formatDuration(call.duration)}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => makeCall(call)}
                      disabled={callingNumbers.has(String(call.phone_number))}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-600/50 disabled:to-emerald-700/50 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm"
                    >
                      {callingNumbers.has(String(call.phone_number)) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                      <span>{callingNumbers.has(String(call.phone_number)) ? 'Calling...' : 'Call Back'}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 sm:p-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs sm:text-sm text-slate-400">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded disabled:opacity-50 text-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded disabled:opacity-50 text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}