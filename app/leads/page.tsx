'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { 
  Users, Plus, Upload, Phone, Edit, Trash, 
  RefreshCw, Download, Filter, Search, 
  PhoneCall, Calendar, CheckCircle, AlertCircle,
  FileText, User, Mail, Building, PhoneIcon, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

interface Lead {
  id: string
  _id?: string  // MongoDB _id field
  name: string
  phone: string
  email: string
  company: string
  notes: string
  status: 'new' | 'called' | 'contacted' | 'converted'
  call_attempts: number
  last_call: string | null
  created_at: string
  updated_at: string
}

interface LeadStats {
  total: number
  new: number
  called: number
  contacted: number
  converted: number
  total_calls: number
}
const API_BASE = process.env.NEXT_PUBLIC_LEAD_API_URL || 'https://callagent-be-2.onrender.com'
const SEQUENTIAL_CALLER_API_BASE = process.env.NEXT_PUBLIC_SEQUENTIAL_CALLER_API_URL || 'https://callagent-be-2.onrender.com'
const CONFIG_API_BASE = process.env.NEXT_PUBLIC_CONFIG_API_URL || 'https://callagent-be-2.onrender.com'

export default function LeadsPage() {
  const { token } = useAuth()
  
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats>({
    total: 0, new: 0, called: 0, contacted: 0, converted: 0, total_calls: 0
  })
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [uploading, setUploading] = useState(false)
  
  // Retry configuration state
  const [retryConfig, setRetryConfig] = useState({
    max_retries: 3,
    retry_delay: 10
  })
  
  // Call All functionality state
  const [isCallingAll, setIsCallingAll] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [callAllProgress, setCallAllProgress] = useState({
    currentIndex: 0,
    currentLead: null as Lead | null,
    totalCalls: 0,
    completedCalls: 0,
    failedCalls: 0
  })
  const [showCallModal, setShowCallModal] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    notes: ''
  })

  const handleFormDataChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
  }, [])

  const handleShowAddForm = useCallback(() => {
    setShowAddForm(true)
  }, [])

  const handleHideAddForm = useCallback(() => {
    setShowAddForm(false)
    setFormData({ name: '', phone: '', email: '', company: '', notes: '' })
  }, [])

  const handleEditLead = useCallback((lead: Lead) => {
    setEditingLead(lead)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingLead(null)
  }, [])

  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const loadRetryConfig = useCallback(async () => {
    try {
      const response = await fetch(`${CONFIG_API_BASE}/api/config`)
      if (response.ok) {
        const data = await response.json()
        setRetryConfig({
          max_retries: data.max_retries || 3,
          retry_delay: data.retry_delay || 10
        })
      }
    } catch (error) {
      console.error('❌ Error loading retry config:', error)
      // Keep default values on error
    }
  }, [])

  const loadLeads = useCallback(async () => {
    if (!token) {
      console.log('❌ No token available for loadLeads')
      return
    }
    
    try {
      console.log('🔑 Making request with token:', token ? 'Token present' : 'No token')
      const response = await fetch(`${API_BASE}/api/leads`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error Response:', errorText)
        toast.error(`API Error: ${response.status} - ${response.statusText}`)
        return
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Transform MongoDB _id to id for frontend compatibility
        const transformedLeads = data.data.map((lead: any) => ({
          ...lead,
          id: lead._id || lead.id // Use _id from MongoDB or fallback to id
        }))
        setLeads(transformedLeads)
      } else {
        toast.error('Failed to load leads')
        console.error('❌ Failed to load leads')
      }
    } catch (error) {
      toast.error('Error connecting to backend')
      console.error('❌ Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  const loadStats = useCallback(async () => {
    if (!token) return
    
    try {
      const response = await fetch(`${API_BASE}/api/leads/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('❌ Error loading stats:', error)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      loadLeads()
      loadStats()
    }
    loadRetryConfig()
  }, [token, loadLeads, loadStats])

  const handleAddLead = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) return
    
    try {
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (data.success) {
        const newLead = {
          ...data.data,
          id: data.data._id || data.data.id
        }
        setLeads(prevLeads => [newLead, ...prevLeads])
        setFormData({ name: '', phone: '', email: '', company: '', notes: '' })
        setShowAddForm(false)
        toast.success('Lead added successfully!')
        loadStats()
      } else {
        toast.error(data.error || 'Failed to add lead')
      }
    } catch (error) {
      toast.error('Error adding lead')
      console.error('Error adding lead:', error)
    }
  }, [formData, loadStats, token])

  const handleUpdateLead = useCallback(async (lead: Lead) => {
    if (!token) return
    
    try {
      const leadId = lead._id || lead.id
      if (!leadId) {
        toast.error('Invalid lead ID')
        return
      }

      const response = await fetch(`${API_BASE}/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          company: lead.company,
          notes: lead.notes,
          status: lead.status
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        const updatedLead = {
          ...data.data,
          id: data.data._id || data.data.id
        }
        setLeads(prevLeads => prevLeads.map(l => (l._id === leadId || l.id === leadId) ? updatedLead : l))
        setEditingLead(null)
        toast.success('Lead updated successfully!')
        loadStats()
      } else {
        toast.error(data.error || 'Failed to update lead')
      }
    } catch (error) {
      toast.error('Error updating lead')
      console.error('Error updating lead:', error)
    }
  }, [loadStats, token])

  const handleDeleteLead = useCallback(async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) {
      return
    }

    if (!token) return

    try {
      const response = await fetch(`${API_BASE}/api/leads/${leadId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setLeads(prevLeads => prevLeads.filter(l => (l._id !== leadId && l.id !== leadId)))
        toast.success('Lead deleted successfully!')
        loadStats()
      } else {
        toast.error(data.error || 'Failed to delete lead')
      }
    } catch (error) {
      toast.error('Error deleting lead')
      console.error('Error deleting lead:', error)
    }
  }, [loadStats, token])

  const handleCallLead = useCallback(async (lead: Lead, maxRetries: number = retryConfig.max_retries) => {
    if (!token) return
    
    try {
      // Ensure we have a valid lead ID
      const leadId = lead._id || lead.id
      if (!leadId) {
        toast.error('Invalid lead ID')
        return
      }

      const response = await fetch(`${API_BASE}/api/leads/${leadId}/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          max_retries: maxRetries
        })
      })

      const data = await response.json()
      if (data.success) {
        // Update the lead in the list with the new data
        const updatedLead = data.data.lead
        if (updatedLead) {
          setLeads(prevLeads => prevLeads.map(l => (l.id === leadId || l._id === leadId) ? {
            ...updatedLead,
            id: updatedLead._id || updatedLead.id
          } : l))
        }
        toast.success(`Call initiated to ${lead.name} (max ${maxRetries} retries)`)
        loadStats()
        // Schedule refreshes to reflect webhook updates (answer -> contacted)
        setTimeout(() => { loadLeads(); loadStats(); }, 3000)
        setTimeout(() => { loadLeads(); loadStats(); }, 8000)
      } else {
        toast.error(data.error || 'Failed to initiate call')
      }
    } catch (error) {
      toast.error('Error calling lead')
      console.error('Error calling lead:', error)
    }
  }, [retryConfig.max_retries, loadStats, loadLeads, token])

  const checkCallCompletion = async (leadId: string, callInitiatedTime: number): Promise<boolean> => {
    try {
      // Use the dedicated call status endpoint for better accuracy
      const response = await fetch(`https://callagent-be-2.onrender.com/api/calls/status/${leadId}`)
      const data = await response.json()
      
      if (data.success) {
        const callData = data.data
        
        // If there's no recent call, consider it completed
        if (!callData.has_recent_call) {
          const elapsed = Date.now() - callInitiatedTime
          // Give some time for the call to be logged before considering it missing
          if (elapsed > 15000) {
            return true
          }
          return false // Wait a bit more for call to be logged
        }
                
        // Use the backend's determination of completion
        return callData.is_completed
      }
      
      // Fallback to time-based completion if API fails
      const elapsed = Date.now() - callInitiatedTime
      if (elapsed > 20000) { // Wait at least 20 seconds before giving up
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error checking call completion:', error)
      // If we can't check, wait a bit before giving up
      const elapsed = Date.now() - callInitiatedTime
      return elapsed > 15000 // Give up after 15 seconds if we can't check
    }
  }

  const waitForCallCompletion = async (leadId: string, callInitiatedTime: number, maxWaitTime: number = 120000): Promise<void> => {
    const startTime = Date.now()
    const pollInterval = 3000 // Check every 3 seconds
    
    return new Promise((resolve) => {
      const pollForCompletion = async () => {
        const elapsed = Date.now() - startTime
        
        // If max wait time exceeded, resolve anyway
        if (elapsed >= maxWaitTime) {
          resolve()
          return
        }
        
        const isCompleted = await checkCallCompletion(leadId, callInitiatedTime)
        
        if (isCompleted) {
          resolve()
        } else {
          // Continue polling
          setTimeout(pollForCompletion, pollInterval)
        }
      }
      
      // Start polling
      pollForCompletion()
    })
  }

  const handleCallAll = useCallback(async () => {
    if (filteredLeads.length === 0) {
      toast.error('No leads to call')
      return
    }

    if (isCallingAll) {
      toast.error('Call All is already in progress')
      return
    }

    setIsCallingAll(true)
    setIsPaused(false)
    setShowCallModal(true)
    setCallAllProgress({
      currentIndex: 0,
      currentLead: null,
      totalCalls: filteredLeads.length,
      completedCalls: 0,
      failedCalls: 0
    })

    try {
      // Build filters based on current search and status filters
      const filters: any = {}
      if (statusFilter !== 'all') {
        filters.status = statusFilter
      }
      if (searchTerm.trim()) {
        filters.search = searchTerm.trim()
      }

      
      // Start the sequential calling session using the new API
      const response = await fetch(`${SEQUENTIAL_CALLER_API_BASE}/api/sequential-caller/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filters: filters
        })
      })

      const data = await response.json()
      
      if (data.success) {
        
        // Start polling for progress updates
        await pollCallAllProgress()
        
      } else {
        console.error(`❌ Failed to start sequential calling: ${data.error}`)
        toast.error(`Failed to start sequential calling: ${data.error}`)
        setCallAllProgress(prev => ({ ...prev, failedCalls: filteredLeads.length }))
      }
      
    } catch (error) {
      console.error('Error starting sequential calling:', error)
      toast.error('Error starting sequential calling')
      setCallAllProgress(prev => ({ ...prev, failedCalls: filteredLeads.length }))
    } finally {
      // Note: Don't set isCallingAll to false here, let pollCallAllProgress handle it
    }
  }, [leads.length, isCallingAll, statusFilter, searchTerm])

  const pollCallAllProgress = useCallback(async () => {
    const pollInterval = 2000 // Poll every 2 seconds
    const maxPollTime = 600000 // 10 minutes max
    const startTime = Date.now()

    const poll = async () => {
      try {
        if (Date.now() - startTime > maxPollTime) {
          console.error('❌ Sequential calling polling timeout')
          toast.error('Sequential calling took too long and was stopped')
          setIsCallingAll(false)
          return
        }

        const response = await fetch(`${SEQUENTIAL_CALLER_API_BASE}/api/sequential-caller/status`)
        const data = await response.json()
        
        if (data.active) {
          const progress = data.progress || {}
          const stats = data.stats || {}
          
          // Update progress based on session data
          setCallAllProgress(prev => ({
            ...prev,
            currentIndex: progress.current_index ?? prev.currentIndex,
            currentLead: progress.current_lead ? {
              id: progress.current_lead._id,
              name: progress.current_lead.name,
              phone: progress.current_lead.phone,
              _id: progress.current_lead._id
            } as Lead : null,
            completedCalls: stats.completed_calls ?? prev.completedCalls,
            failedCalls: (stats.failed_calls ?? 0) + (stats.missed_calls ?? 0),
            totalCalls: stats.total_calls ?? prev.totalCalls
          }))
          
          // Update pause state if provided by API
          if (data.paused !== undefined) {
            setIsPaused(data.paused)
          }
          
          
          // Continue polling if still active
          setTimeout(poll, pollInterval)
        } else {
          // Session completed or stopped 
          const totalCompleted = callAllProgress.completedCalls
          const totalFailed = callAllProgress.failedCalls
          
          toast.success(`Sequential calling completed! ${totalCompleted} successful, ${totalFailed} failed`)
          
          // Refresh leads and stats
          await loadLeads()
          await loadStats()
          
          setIsCallingAll(false)
          
          // Keep modal open for a moment to show final results
          setTimeout(() => {
            setShowCallModal(false)
                              setCallAllProgress({
                  currentIndex: 0,
                  currentLead: null,
                  totalCalls: 0,
                  completedCalls: 0,
                  failedCalls: 0
                })
            }, 3000)
        }
        
      } catch (error) {
        console.error('Error polling call-all progress:', error)
        // Continue polling on error, but limit retries
        setTimeout(poll, pollInterval)
      }
    }

    // Start polling
    poll()
  }, [loadLeads, loadStats])

  const handlePauseCallAll = useCallback(async () => {
    try {
      const response = await fetch(`${SEQUENTIAL_CALLER_API_BASE}/api/sequential-caller/pause`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsPaused(true)
        toast('Sequential calling paused', { icon: '⏸️' })
      } else {
        toast.error(`Failed to pause: ${data.error}`)
      }
    } catch (error) {
      console.error('Error pausing sequential calling:', error)
      toast.error('Error pausing sequential calling')
    }
  }, [])

  const handleResumeCallAll = useCallback(async () => {
    try {
      const response = await fetch(`${SEQUENTIAL_CALLER_API_BASE}/api/sequential-caller/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsPaused(false)
        toast('Sequential calling resumed', { icon: '▶️' })
      } else {
        toast.error(`Failed to resume: ${data.error}`)
      }
    } catch (error) {
      console.error('Error resuming sequential calling:', error)
      toast.error('Error resuming sequential calling')
    }
  }, [])

  const handleStopCallAll = useCallback(async () => {
    try {
      const response = await fetch(`${SEQUENTIAL_CALLER_API_BASE}/api/sequential-caller/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast('Sequential calling stopped', { icon: 'ℹ️' })
      } else {
        toast.error(`Failed to stop: ${data.error}`)
      }
    } catch (error) {
      console.error('Error stopping sequential calling:', error)
      toast.error('Error stopping sequential calling')
    }
    
    setIsCallingAll(false)
    setIsPaused(false)
    setShowCallModal(false)
    setCallAllProgress({
      currentIndex: 0,
      currentLead: null,
      totalCalls: 0,
      completedCalls: 0,
      failedCalls: 0
    })
  }, [])

  const handleCSVUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_BASE}/api/leads/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.success) {
        await loadLeads()
        await loadStats()
        toast.success(`Successfully imported ${data.imported_count} leads`)
        
        if (data.errors && data.errors.length > 0) {
          toast.error(`${data.errors.length} rows had errors`)
        }
      } else {
        toast.error(data.error || 'Failed to upload CSV')
      }
    } catch (error) {
      toast.error('Error uploading CSV')
      console.error('Error uploading CSV:', error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [loadLeads, loadStats])

  const getStatusBadge = useCallback((status: string) => {
    const styles = {
      new: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
      called: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30',
      contacted: 'bg-purple-600/20 text-purple-400 border border-purple-500/30',
      converted: 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }, [])

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.phone.includes(searchTerm) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [leads, searchTerm, statusFilter])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-white">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Loading leads...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Leads Management</h1>
          <p className="text-slate-400 mt-1">Manage your leads, upload CSV files, and initiate calls</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCSVUpload}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={handleFileInputClick}
            disabled={uploading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-all"
          >
            {uploading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? 'Uploading...' : 'Upload CSV'}</span>
          </button>
          <button
            onClick={handleCallAll}
            disabled={isCallingAll || filteredLeads.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-xl transition-all"
          >
            {isCallingAll ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <PhoneCall className="w-4 h-4" />
            )}
            <span>{isCallingAll ? 'Calling...' : `Call All (${filteredLeads.length})`}</span>
          </button>
          <button
            onClick={handleShowAddForm}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Leads</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">New</p>
              <p className="text-2xl font-bold text-blue-400">{stats.new}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Called</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.called}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Contacted</p>
              <p className="text-2xl font-bold text-purple-400">{stats.contacted}</p>
            </div>
            <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Converted</p>
              <p className="text-2xl font-bold text-orange-400">{stats.converted}</p>
            </div>
            <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-orange-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Calls</p>
              <p className="text-2xl font-bold text-slate-400">{stats.total_calls}</p>
            </div>
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="called">Called</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table - Desktop */}
      <div className="hidden lg:block bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Calls</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Last Call</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLeads.map((lead) => (
                <tr key={lead._id || lead.id} className="hover:bg-slate-800/50 transition-colors bg-slate-900">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{lead.name}</div>
                      {lead.company && (
                        <div className="text-sm text-slate-400 flex items-center mt-1">
                          <Building className="w-3 h-3 mr-1" />
                          {lead.company}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center text-white">
                        <Phone className="w-3 h-3 mr-1" />
                        {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center text-slate-400 mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {lead.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {lead.call_attempts}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {lead.last_call ? (() => {
                  const d = new Date(lead.last_call)
                  const istDate = new Date(d.getTime() + (5.5 * 60 * 60 * 1000))
                  return istDate.toLocaleDateString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                })() : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCallLead(lead)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-all"
                        title="Call Lead"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditLead(lead)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                        title="Edit Lead"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead._id || lead.id || '')}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                        title="Delete Lead"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No leads found</p>
              <p className="text-sm text-slate-500">Add leads manually or upload a CSV file</p>
            </div>
          )}
        </div>
      </div>

      {/* Leads Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredLeads.map((lead) => (
          <div key={lead._id || lead.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-white text-lg">{lead.name}</h3>
                {lead.company && (
                  <div className="text-sm text-slate-400 flex items-center mt-1">
                    <Building className="w-3 h-3 mr-1" />
                    {lead.company}
                  </div>
                )}
              </div>
              <div className="ml-3">
                {getStatusBadge(lead.status)}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2 text-slate-400" />
                <span className="text-white">{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" />
                  <span className="text-slate-400">{lead.email}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
              <div className="flex items-center">
                <PhoneCall className="w-4 h-4 mr-1" />
                <span>{lead.call_attempts} calls</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {lead.last_call ? (() => {
                    const d = new Date(lead.last_call)
                    const istDate = new Date(d.getTime() + (5.5 * 60 * 60 * 1000))
                    return istDate.toLocaleDateString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  })() : 'Never'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCallLead(lead)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg transition-all flex items-center justify-center"
              >
                <PhoneCall className="w-4 h-4 mr-2" />
                Call
              </button>
              <button
                onClick={() => handleEditLead(lead)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                title="Edit Lead"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteLead(lead._id || lead.id || '')}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                title="Delete Lead"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {filteredLeads.length === 0 && (
          <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No leads found</p>
            <p className="text-sm text-slate-500">Add leads manually or upload a CSV file</p>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Lead</h3>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleFormDataChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleFormDataChange('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormDataChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleFormDataChange('company', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormDataChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl transition-all"
                >
                  Add Lead
                </button>
                <button
                  type="button"
                  onClick={handleHideAddForm}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Lead</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateLead(editingLead); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={editingLead.phone}
                  onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
                <input
                  type="email"
                  value={editingLead.email}
                  onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Company</label>
                <input
                  type="text"
                  value={editingLead.company}
                  onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Status</label>
                <select
                  value={editingLead.status}
                  onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as Lead['status'] })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="new">New</option>
                  <option value="called">Called</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Notes</label>
                <textarea
                  value={editingLead.notes}
                  onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition-all"
                >
                  Update Lead
                </button>
                <button
                  type="button"
                                      onClick={handleCancelEdit}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Automated Status Flow Info */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Automated Lead Status Flow
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-sm font-medium text-blue-400">New</div>
            <div className="text-xs text-slate-400 mt-1">Fresh leads</div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Phone className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-medium text-emerald-400">Called</div>
            <div className="text-xs text-slate-400 mt-1">Call initiated</div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-medium text-purple-400">Contacted</div>
            <div className="text-xs text-slate-400 mt-1">User answered</div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-sm font-medium text-orange-400">Converted</div>
            <div className="text-xs text-slate-400 mt-1">Showed interest</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">
          Lead status automatically updates based on call activity and AI-powered interest analysis
        </p>
      </div>

      {/* CSV Upload Instructions */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h4 className="font-semibold text-white mb-2 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          CSV Upload Format
        </h4>
        <p className="text-sm text-slate-400 mb-2">
          Your CSV file should have the following columns (name and phone are required):
        </p>
        <div className="text-sm text-slate-300 font-mono bg-slate-800 p-3 rounded-xl border border-slate-700">
          name,phone,email,company,notes
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Example: John Doe,+1234567890,john@company.com,Acme Corp,Interested in premium package
        </p>
      </div>

      {/* Call All Progress Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 w-full max-w-md shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {isCallingAll ? (
                  <PhoneIcon className="w-8 h-8 text-orange-400 animate-pulse" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {isCallingAll ? (
                  isPaused ? 'Sequential Calling Paused' : 'Sequential Calling in Progress'
                ) : 'Call All Completed'}
              </h3>
              
              {isCallingAll && callAllProgress.currentLead && (
                <div className="mb-4">
                  <p className="text-slate-300 text-sm mb-1">
                    Call {callAllProgress.currentIndex + 1} of {callAllProgress.totalCalls}
                  </p>
                  <p className="text-white font-medium">{callAllProgress.currentLead.name}</p>
                  <p className="text-slate-400 text-sm">{callAllProgress.currentLead.phone}</p>
                  <p className="text-slate-500 text-xs mt-2">
                    {isPaused ? (
                      '⏸️ Calling is paused. Click Resume to continue...'
                    ) : (
                      '⏳ Waiting for call to complete before next call...'
                    )}
                  </p>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Progress</span>
                  <span>{callAllProgress.currentIndex + 1} of {callAllProgress.totalCalls}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((callAllProgress.currentIndex + 1) / callAllProgress.totalCalls) * 100}%` 
                    }}
                  ></div>
                </div>
                {isCallingAll && (
                  <p className="text-slate-500 text-xs mt-2 text-center">
                    📞 Sequential calling - each call completes before the next begins
                  </p>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{callAllProgress.completedCalls}</div>
                  <div className="text-xs text-slate-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{callAllProgress.failedCalls}</div>
                  <div className="text-xs text-slate-400">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-400">
                    {callAllProgress.totalCalls - callAllProgress.completedCalls - callAllProgress.failedCalls}
                  </div>
                  <div className="text-xs text-slate-400">Remaining</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                {isCallingAll ? (
                  <>
                    {isPaused ? (
                      <button
                        onClick={handleResumeCallAll}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl transition-all"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>▶️</span>
                          <span>Resume</span>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={handlePauseCallAll}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-xl transition-all"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>⏸️</span>
                          <span>Pause</span>
                        </div>
                      </button>
                    )}
                    <button
                      onClick={handleStopCallAll}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl transition-all"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <X className="w-4 h-4" />
                        <span>Stop</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowCallModal(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-xl transition-all"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}