'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Building2, Key, Settings, Users, Plus, Edit, Trash2, 
  Eye, EyeOff, Save, X, Check, AlertCircle, Search,
  Shield, Database, Mic, MessageSquare, Volume2, LogOut,
  Clock, Timer
} from 'lucide-react'
import toast from 'react-hot-toast'
import APIKeyManager from '../../components/APIKeyManager'

interface Organization {
  id: number
  name: string
  subscription_tier: 'basic' | 'premium' | 'enterprise'
  max_users: number
  created_at: string
  user_count: number
  api_keys?: {
    stt_provider?: string
    stt_api_key?: string
    llm_provider?: string
    llm_api_key?: string
    tts_provider?: string
    tts_api_key?: string
    google_tts_api_key?: string
    cartesia_tts_api_key?: string
  }
  call_minutes?: {
    total_minutes_allocated: number
    minutes_used: number
    minutes_remaining: number
    is_active: boolean
  }
}

interface CallMinutesAllocation {
  minutes_to_allocate: number
  allocation_reason?: string
  allocation_type?: 'add' | 'reset'
}

interface APIKeyConfig {
  stt_provider: string
  stt_api_key: string
  llm_provider: string
  llm_api_key: string
  tts_provider: string
  tts_api_key: string
  google_tts_api_key: string
  cartesia_tts_api_key: string
}

const API_BASE = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

export default function AdminDashboard() {
  const { user, token, logout } = useAuth()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [showAPIKeys, setShowAPIKeys] = useState<{[key: number]: boolean}>({})
  const [editingKeys, setEditingKeys] = useState<{[key: number]: boolean}>({})
  const [apiKeyConfigs, setApiKeyConfigs] = useState<{[key: number]: APIKeyConfig}>({})
  
  // Call minutes allocation state
  const [showAllocateDialog, setShowAllocateDialog] = useState(false)
  const [selectedOrgForMinutes, setSelectedOrgForMinutes] = useState<Organization | null>(null)
  const [minutesAllocation, setMinutesAllocation] = useState<CallMinutesAllocation>({
    minutes_to_allocate: 60,
    allocation_reason: '',
    allocation_type: 'add'
  })
  const [organizationMinutes, setOrganizationMinutes] = useState<{[key: number]: any}>({})
  
  // Real-time polling state
  const [isPollingEnabled, setIsPollingEnabled] = useState(false)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [loadingMinutes, setLoadingMinutes] = useState(false)

  // Handle logout
  const handleLogout = () => {
    logout()
  }
  // Check if user is super admin
  useEffect(() => {
    if (user && (user.role !== 'super_admin' && !user.is_super_admin)) {
      toast.error('Access denied. Super admin privileges required.')
      window.location.href = '/'
    }
  }, [user])

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/organizations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrganizations(data)
        
        // Fetch call minutes data for each organization
        await fetchCallMinutesData(data)
      } else {
        toast.error('Failed to fetch organizations')
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      toast.error('Error fetching organizations')
    } finally {
      setLoading(false)
    }
  }

  // Fetch call minutes data for all organizations
  const fetchCallMinutesData = async (orgs: Organization[]) => {
    try {
      console.log('🔄 [ADMIN] Fetching call minutes data for', orgs.length, 'organizations')
      const minutesData: {[key: number]: any} = {}
      
      for (const org of orgs) {
        try {
          const response = await fetch(`${API_BASE}/call-minutes/organization/${org.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            minutesData[org.id] = data
            console.log(`✅ [ADMIN] Org ${org.id} minutes:`, data)
          } else {
            // If no data exists, set defaults
            minutesData[org.id] = {
              total_minutes_allocated: 0,
              minutes_used: 0,
              minutes_remaining: 0,
              is_active: false
            }
            console.log(`⚠️ [ADMIN] No minutes data for org ${org.id}, using defaults`)
          }
        } catch (error) {
          console.error(`Error fetching minutes for org ${org.id}:`, error)
          minutesData[org.id] = {
            total_minutes_allocated: 0,
            minutes_used: 0,
            minutes_remaining: 0,
            is_active: false
          }
        }
      }
      
      console.log('🔄 [ADMIN] Setting organization minutes:', minutesData)
      setOrganizationMinutes(minutesData)
    } catch (error) {
      console.error('Error fetching call minutes data:', error)
    }
  }

  // Open allocate minutes dialog
  const openAllocateDialog = (org: Organization) => {
    setSelectedOrgForMinutes(org)
    setShowAllocateDialog(true)
    setMinutesAllocation({
      minutes_to_allocate: 60,
      allocation_reason: '',
      allocation_type: 'add'
    })
  }

  // Open reset dialog
  const openResetDialog = (org: Organization) => {
    setSelectedOrgForMinutes(org)
    setShowAllocateDialog(true)
    setMinutesAllocation({
      minutes_to_allocate: 0,
      allocation_reason: '',
      allocation_type: 'reset'
    })
  }

  // Close allocate minutes dialog
  const closeAllocateDialog = () => {
    setShowAllocateDialog(false)
    setSelectedOrgForMinutes(null)
    setMinutesAllocation({
      minutes_to_allocate: 60,
      allocation_reason: '',
      allocation_type: 'add'
    })
  }

  // Allocate minutes to organization
  const allocateMinutes = async () => {
    if (!selectedOrgForMinutes) return
    
    setLoadingMinutes(true)
    try {
      const response = await fetch(`${API_BASE}/call-minutes/allocate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organization_id: selectedOrgForMinutes.id,
          minutes_to_allocate: minutesAllocation.minutes_to_allocate,
          allocation_reason: minutesAllocation.allocation_reason,
          allocation_type: minutesAllocation.allocation_type
        })
      })

      if (response.ok) {
        toast.success(`Successfully allocated ${minutesAllocation.minutes_to_allocate} minutes to ${selectedOrgForMinutes.name}`)
        closeAllocateDialog()
        // Refresh data
        await fetchCallMinutesData(organizations)
      } else {
        const errorData = await response.json()
        toast.error(errorData.detail || 'Failed to allocate minutes')
      }
    } catch (error) {
      console.error('Error allocating minutes:', error)
      toast.error('Error allocating minutes')
    } finally {
      setLoadingMinutes(false)
    }
  }

  // Quick reset to zero
  const quickResetToZero = async (org: Organization) => {
    if (!confirm(`Are you sure you want to completely reset ${org.name}'s minutes to 0? This will clear both total allocation and usage history. This action cannot be undone.`)) {
      return
    }

    setLoadingMinutes(true)
    try {
      const response = await fetch(`${API_BASE}/call-minutes/allocate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organization_id: org.id,
          minutes_to_allocate: 0,
          allocation_reason: 'Quick reset to zero minutes by super admin',
          allocation_type: 'reset'
        })
      })

      if (response.ok) {
        toast.success(`Successfully completed full reset for ${org.name} - all minutes cleared`)
        // Refresh data
        await fetchCallMinutesData(organizations)
      } else {
        const errorData = await response.json()
        toast.error(errorData.detail || 'Failed to reset minutes')
      }
    } catch (error) {
      console.error('Error resetting minutes:', error)
      toast.error('Error resetting minutes')
    } finally {
      setLoadingMinutes(false)
    }
  }

  // Toggle minutes active status
  const toggleMinutesStatus = async (orgId: number, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus 
        ? `/call-minutes/organization/${orgId}/deactivate`
        : `/call-minutes/organization/${orgId}/activate`
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success(`Minutes ${currentStatus ? 'deactivated' : 'activated'} successfully`)
        // Update local state
        setOrganizationMinutes(prev => ({
          ...prev,
          [orgId]: {
            ...prev[orgId],
            is_active: !currentStatus
          }
        }))
      } else {
        toast.error('Failed to update minutes status')
      }
    } catch (error) {
      console.error('Error updating minutes status:', error)
      toast.error('Error updating minutes status')
    }
  }

  useEffect(() => {
    if (token && (user?.role === 'super_admin' || user?.is_super_admin)) {
      fetchOrganizations()
    }
  }, [token, user])

  // Real-time polling for call minutes updates
  useEffect(() => {
    if (!isPollingEnabled || !token || !(user?.role === 'super_admin' || user?.is_super_admin)) {
      return
    }

    const startPolling = () => {
      const interval = setInterval(async () => {
        if (organizations.length > 0) {
          await fetchCallMinutesData(organizations)
        }
      }, 5000) // Poll every 5 seconds for testing (was 30000)
      
      setPollingInterval(interval)
    }

    startPolling()

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
    }
  }, [token, user, organizations, isPollingEnabled])

  // Toggle API key visibility
  const toggleAPIKeyVisibility = (orgId: number) => {
    console.log(`Toggling API key visibility for org ${orgId}`)
    console.log('Previous state:', showAPIKeys[orgId])
    setShowAPIKeys(prev => {
      const newState = {
        ...prev,
        [orgId]: !prev[orgId]
      }
      console.log('New state will be:', newState[orgId])
      return newState
    })
  }

  // Start editing API keys
  const startEditingKeys = (org: Organization) => {
    setEditingKeys(prev => ({ ...prev, [org.id]: true }))
    setApiKeyConfigs(prev => ({
      ...prev,
      [org.id]: {
        stt_provider: org.api_keys?.stt_provider || '',
        stt_api_key: org.api_keys?.stt_api_key || '',
        llm_provider: org.api_keys?.llm_provider || '',
        llm_api_key: org.api_keys?.llm_api_key || '',
        tts_provider: org.api_keys?.tts_provider || '',
        tts_api_key: org.api_keys?.tts_api_key || '',
        google_tts_api_key: org.api_keys?.google_tts_api_key || '',
        cartesia_tts_api_key: org.api_keys?.cartesia_tts_api_key || ''
      }
    }))
  }

  // Cancel editing
  const cancelEditing = (orgId: number) => {
    setEditingKeys(prev => ({ ...prev, [orgId]: false }))
    delete apiKeyConfigs[orgId]
  }

  // Save API keys
  const saveAPIKeys = async (orgId: number) => {
    try {
      const config = apiKeyConfigs[orgId]
      const response = await fetch(`${API_BASE}/api/admin/organizations/${orgId}/api-keys`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        toast.success('API keys updated successfully')
        setEditingKeys(prev => ({ ...prev, [orgId]: false }))
        fetchOrganizations() // Refresh data
      } else {
        toast.error('Failed to update API keys')
      }
    } catch (error) {
      console.error('Error updating API keys:', error)
      toast.error('Error updating API keys')
    }
  }

  // Update API key config
  const updateAPIKeyConfig = (orgId: number, field: keyof APIKeyConfig, value: string) => {
    setApiKeyConfigs(prev => ({
      ...prev,
      [orgId]: {
        ...prev[orgId],
        [field]: value
      }
    }))
  }

  // Filter organizations
  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user || (user.role !== 'super_admin' && !user.is_super_admin)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">Super admin privileges required to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
          <p className="text-slate-400">Manage organizations and their API key configurations</p>
        </div>

        {/* Real-time Polling Controls */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Real-time Updates</span>
              <span className="text-slate-400 text-sm">
                Manual refresh to prevent log flooding
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {isPollingEnabled && (
                <div className="flex items-center space-x-2 text-green-400 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Updates</span>
                </div>
              )}
              <button
                onClick={async () => {
                  if (organizations.length > 0) {
                    await fetchCallMinutesData(organizations)
                    console.log('Manual refresh completed')
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                <Clock className="w-4 h-4" />
                <span>Refresh Now</span>
              </button>
              <button
                onClick={() => setIsPollingEnabled(!isPollingEnabled)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none font-medium ${
                  isPollingEnabled 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:ring-green-500' 
                    : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-slate-300 focus:ring-slate-500'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isPollingEnabled ? 'bg-white' : 'bg-slate-400'}`}></div>
                <span>{isPollingEnabled ? 'Auto-Update On' : 'Auto-Update Off'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Functions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* API Key Management */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Key className="w-12 h-12 text-purple-400 mr-4" />
              <div>
                <h3 className="text-xl font-semibold text-white">API Keys</h3>
                <p className="text-slate-400 text-sm">Manage organization API credentials</p>
              </div>
            </div>
          </div>
          
          {/* User Management */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="w-12 h-12 text-green-400 mr-4" />
              <div>
                <h3 className="text-xl font-semibold text-white">User Management</h3>
                <p className="text-slate-400 text-sm">Manage users across all organizations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-slate-400 text-sm">Total Organizations</p>
                <p className="text-2xl font-bold text-white">{organizations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">
                  {organizations.reduce((sum, org) => sum + org.user_count, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations List */}
        <div className="bg-slate-800 rounded-xl shadow-lg">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Organizations</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-slate-400 mt-2">Loading organizations...</p>
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No organizations found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {filteredOrganizations.map((org) => (
                <div key={org.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{org.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            org.subscription_tier === 'enterprise' ? 'bg-purple-600/20 text-purple-400' :
                            org.subscription_tier === 'premium' ? 'bg-blue-600/20 text-blue-400' :
                            'bg-gray-600/20 text-gray-400'
                          }`}>
                            {org.subscription_tier}
                          </span>
                          <span>{org.user_count} users</span>
                          <span>Max: {org.max_users}</span>
                        </div>
                        
                        {/* Call Minutes Info */}
                        {organizationMinutes[org.id] && (
                          <div className="flex items-center space-x-4 text-sm mt-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span className="text-slate-300">
                                {organizationMinutes[org.id].minutes_remaining || 0} / {organizationMinutes[org.id].total_minutes_allocated || 0} mins
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              organizationMinutes[org.id].is_active ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                            }`}>
                              {organizationMinutes[org.id].is_active ? 'Active' : 'Inactive'}
                            </span>
                            {organizationMinutes[org.id].total_minutes_allocated > 0 && (
                              <div className="flex-1 max-w-32">
                                <div className="w-full bg-slate-600 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      (organizationMinutes[org.id].minutes_used / organizationMinutes[org.id].total_minutes_allocated * 100) >= 90 
                                        ? 'bg-red-500' 
                                        : (organizationMinutes[org.id].minutes_used / organizationMinutes[org.id].total_minutes_allocated * 100) >= 75 
                                        ? 'bg-yellow-500' 
                                        : 'bg-green-500'
                                    }`}
                                    style={{
                                      width: `${Math.min((organizationMinutes[org.id].minutes_used / organizationMinutes[org.id].total_minutes_allocated * 100), 100)}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Call Minutes Allocation Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          openAllocateDialog(org)
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        title="Allocate Call Minutes"
                      >
                        <Timer className="w-4 h-4" />
                        <span className="text-sm font-medium">Allocate</span>
                      </button>
                      
                      {/* Toggle Minutes Status Button */}
                      {organizationMinutes[org.id]?.total_minutes_allocated > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleMinutesStatus(org.id, organizationMinutes[org.id].is_active)
                          }}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none text-sm font-medium ${
                            organizationMinutes[org.id].is_active 
                              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:ring-green-500' 
                              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500'
                          }`}
                          title={organizationMinutes[org.id].is_active ? "Deactivate Minutes" : "Activate Minutes"}
                        >
                          <Clock className="w-4 h-4" />
                          <span>{organizationMinutes[org.id].is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      )}
                      
                      {/* Reset Minutes Button */}
                      {organizationMinutes[org.id]?.total_minutes_allocated > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            openResetDialog(org)
                          }}
                          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                          title="Reset Minutes to Specific Amount"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm font-medium">Reset</span>
                        </button>
                      )}
                      
                      {/* Quick Reset to Zero Button */}
                      {organizationMinutes[org.id]?.total_minutes_allocated > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            quickResetToZero(org)
                          }}
                          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-red-500 focus:outline-none"
                          title="Complete Reset - Clear All Minutes and Usage"
                        >
                          <X className="w-4 h-4" />
                          <span className="text-sm font-medium">Clear All</span>
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log(`Show button clicked for org ${org.id} (${org.name})`)
                          console.log('Current showAPIKeys state:', showAPIKeys)
                          toggleAPIKeyVisibility(org.id)
                        }}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none font-medium ${
                          showAPIKeys[org.id] 
                            ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white focus:ring-orange-500' 
                            : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-slate-300 focus:ring-slate-500'
                        }`}
                        title="Toggle API Keys"
                      >
                        {showAPIKeys[org.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="text-sm">{showAPIKeys[org.id] ? 'Hide' : 'Show'}</span>
                      </button>
                      
                      {!editingKeys[org.id] ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            startEditingKeys(org)
                          }}
                          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                          title="Edit API Keys"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="text-sm">Edit</span>
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              saveAPIKeys(org.id)
                            }}
                            className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:outline-none font-medium"
                            title="Save Changes"
                          >
                            <Check className="w-4 h-4" />
                            <span className="text-sm">Save</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              cancelEditing(org.id)
                            }}
                            className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                            <span className="text-sm">Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* API Keys Section */}
                  {showAPIKeys[org.id] && (
                    <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="text-white font-medium mb-4 flex items-center">
                        <Key className="w-4 h-4 mr-2" />
                        API Key Configuration
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* STT Configuration */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                            <Mic className="w-4 h-4" />
                            <span>Speech-to-Text (STT)</span>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Provider</label>
                            {editingKeys[org.id] ? (
                              <select
                                value={apiKeyConfigs[org.id]?.stt_provider || ''}
                                onChange={(e) => updateAPIKeyConfig(org.id, 'stt_provider', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Provider</option>
                                <option value="deepgram">Deepgram</option>
                                <option value="openai">OpenAI Whisper</option>
                                <option value="google">Google Speech</option>
                                <option value="azure">Azure Speech</option>
                              </select>
                            ) : (
                              <p className="text-white text-sm">{org.api_keys?.stt_provider || 'Not configured'}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">API Key</label>
                            {editingKeys[org.id] ? (
                              <input
                                type="password"
                                value={apiKeyConfigs[org.id]?.stt_api_key || ''}
                                onChange={(e) => updateAPIKeyConfig(org.id, 'stt_api_key', e.target.value)}
                                placeholder="Enter STT API key"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-white text-sm font-mono">
                                {org.api_keys?.stt_api_key ? '••••••••••••••••' : 'Not configured'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* LLM Configuration */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                            <MessageSquare className="w-4 h-4" />
                            <span>Large Language Model (LLM)</span>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Provider</label>
                            {editingKeys[org.id] ? (
                              <select
                                value={apiKeyConfigs[org.id]?.llm_provider || ''}
                                onChange={(e) => updateAPIKeyConfig(org.id, 'llm_provider', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Provider</option>
                                <option value="openai">OpenAI</option>
                                <option value="anthropic">Anthropic</option>
                                <option value="groq">Groq</option>
                                <option value="azure">Azure OpenAI</option>
                              </select>
                            ) : (
                              <p className="text-white text-sm">{org.api_keys?.llm_provider || 'Not configured'}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">API Key</label>
                            {editingKeys[org.id] ? (
                              <input
                                type="password"
                                value={apiKeyConfigs[org.id]?.llm_api_key || ''}
                                onChange={(e) => updateAPIKeyConfig(org.id, 'llm_api_key', e.target.value)}
                                placeholder="Enter LLM API key"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-white text-sm font-mono">
                                {org.api_keys?.llm_api_key ? '••••••••••••••••' : 'Not configured'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* TTS Configuration */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                            <Volume2 className="w-4 h-4" />
                            <span>Text-to-Speech (TTS) Providers</span>
                          </div>
                          
                          {/* Google TTS */}
                          <div className="bg-slate-800/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-slate-200">Google TTS</span>
                              {org.api_keys?.google_tts_api_key && (
                                <span className="px-2 py-0.5 text-xs bg-green-600 text-white rounded-full">
                                  Configured
                                </span>
                              )}
                            </div>
                            {editingKeys[org.id] ? (
                              <input
                                type="password"
                                value={apiKeyConfigs[org.id]?.google_tts_api_key || ''}
                                onChange={(e) => updateAPIKeyConfig(org.id, 'google_tts_api_key', e.target.value)}
                                placeholder="Enter Google TTS API key"
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-white text-sm font-mono">
                                {org.api_keys?.google_tts_api_key ? '••••••••••••••••' : 'Not configured'}
                              </p>
                            )}
                          </div>

                          {/* Cartesia TTS */}
                          <div className="bg-slate-800/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-slate-200">Cartesia TTS</span>
                              {org.api_keys?.cartesia_tts_api_key && (
                                <span className="px-2 py-0.5 text-xs bg-green-600 text-white rounded-full">
                                  Configured
                                </span>
                              )}
                            </div>
                            {editingKeys[org.id] ? (
                              <input
                                type="password"
                                value={apiKeyConfigs[org.id]?.cartesia_tts_api_key || ''}
                                onChange={(e) => updateAPIKeyConfig(org.id, 'cartesia_tts_api_key', e.target.value)}
                                placeholder="Enter Cartesia TTS API key"
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-white text-sm font-mono">
                                {org.api_keys?.cartesia_tts_api_key ? '••••••••••••••••' : 'Not configured'}
                              </p>
                            )}
                          </div>
                          
                          {/* Organization's Preferred Provider (for when both are available) */}
                          <div className="bg-blue-900/20 p-3 rounded-lg space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-blue-200">Organization's Current Preference</span>
                            </div>
                            <p className="text-blue-100 text-sm">
                              {org.api_keys?.tts_provider ? 
                                `Organization prefers: ${org.api_keys.tts_provider === 'google' ? 'Google TTS' : 'Cartesia TTS'}` : 
                                'No preference set - will use first available provider'
                              }
                            </p>
                            {(org.api_keys?.google_tts_api_key && org.api_keys?.cartesia_tts_api_key) && (
                              <p className="text-blue-300 text-xs">
                                ✅ Both providers available - organization can choose their preference
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {!editingKeys[org.id] && (
                        <div className="mt-4 p-3 bg-slate-600/30 rounded-lg">
                          <div className="flex items-center space-x-2 text-sm text-slate-400">
                            <AlertCircle className="w-4 h-4" />
                            <span>
                              API keys are encrypted and securely stored. Only you can view and modify them.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Call Minutes Allocation Dialog */}
      {showAllocateDialog && selectedOrgForMinutes && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Timer className="w-5 h-5 mr-2 text-green-400" />
                {minutesAllocation.allocation_type === 'reset' ? 'Reset Call Minutes' : 'Allocate Call Minutes'}
              </h2>
              <button
                type="button"
                onClick={closeAllocateDialog}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-slate-300 mb-4">
                  Allocating minutes to: <span className="font-semibold text-white">{selectedOrgForMinutes.name}</span>
                </p>
                
                {/* Current Allocation Display */}
                {organizationMinutes[selectedOrgForMinutes.id] && (
                  <div className="bg-slate-700 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-medium mb-2">Current Allocation</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Total:</span>
                        <span className="text-white ml-2">
                          {organizationMinutes[selectedOrgForMinutes.id].total_minutes_allocated} mins
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Used:</span>
                        <span className="text-white ml-2">
                          {organizationMinutes[selectedOrgForMinutes.id].minutes_used} mins
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Remaining:</span>
                        <span className="text-white ml-2">
                          {organizationMinutes[selectedOrgForMinutes.id].minutes_remaining} mins
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <span className={`ml-2 ${organizationMinutes[selectedOrgForMinutes.id].is_active ? 'text-green-400' : 'text-red-400'}`}>
                          {organizationMinutes[selectedOrgForMinutes.id].is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Allocation Type Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Allocation Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="allocation_type"
                        value="add"
                        checked={minutesAllocation.allocation_type === 'add'}
                        onChange={(e) => setMinutesAllocation(prev => ({
                          ...prev,
                          allocation_type: e.target.value as 'add' | 'reset'
                        }))}
                        className="text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-slate-300">Add Minutes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="allocation_type"
                        value="reset"
                        checked={minutesAllocation.allocation_type === 'reset'}
                        onChange={(e) => setMinutesAllocation(prev => ({
                          ...prev,
                          allocation_type: e.target.value as 'add' | 'reset'
                        }))}
                        className="text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-slate-300">Reset to Amount</span>
                    </label>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {minutesAllocation.allocation_type === 'add' 
                      ? 'Add the specified minutes to the current allocation'
                      : minutesAllocation.minutes_to_allocate === 0 
                        ? 'Complete reset: Clears both total allocation and usage history to zero'
                        : 'Reset the available balance to exactly the specified amount'
                    }
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {minutesAllocation.allocation_type === 'add' ? 'Minutes to Add' : 'Reset Available Balance To'}
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={minutesAllocation.minutes_to_allocate}
                    onChange={(e) => setMinutesAllocation(prev => ({
                      ...prev,
                      minutes_to_allocate: parseInt(e.target.value) || 0
                    }))}
                    min="1"
                    placeholder="Enter minutes to allocate"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Allocation Reason (Optional)
                  </label>
                  <textarea
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={minutesAllocation.allocation_reason}
                    onChange={(e) => setMinutesAllocation(prev => ({
                      ...prev,
                      allocation_reason: e.target.value
                    }))}
                    rows={3}
                    placeholder="Add a note about this allocation..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={closeAllocateDialog}
                  className="flex items-center px-6 py-3 border-2 border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 font-medium focus:ring-2 focus:ring-slate-500 focus:outline-none"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={allocateMinutes}
                  disabled={loadingMinutes || minutesAllocation.minutes_to_allocate <= 0}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:outline-none font-medium"
                >
                  {loadingMinutes ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Timer className="w-4 h-4 mr-2" />
                      {minutesAllocation.allocation_type === 'reset' ? 'Reset Minutes' : 'Allocate Minutes'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}