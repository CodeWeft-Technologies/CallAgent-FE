'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Building2, Key, Settings, Users, Plus, Edit, Trash2, 
  Eye, EyeOff, Save, X, Check, AlertCircle, Search,
  Shield, Database, Mic, MessageSquare, Volume2
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
  }
}

interface APIKeyConfig {
  stt_provider: string
  stt_api_key: string
  llm_provider: string
  llm_api_key: string
  tts_provider: string
  tts_api_key: string
}

const API_BASE = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [showAPIKeys, setShowAPIKeys] = useState<{[key: number]: boolean}>({})
  const [editingKeys, setEditingKeys] = useState<{[key: number]: boolean}>({})
  const [apiKeyConfigs, setApiKeyConfigs] = useState<{[key: number]: APIKeyConfig}>({})

  // Check if user is super admin
  useEffect(() => {
    if (user && (user.role !== 'super_admin' || !user.is_super_admin)) {
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

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchOrganizations()
    }
  }, [token, user])

  // Toggle API key visibility
  const toggleAPIKeyVisibility = (orgId: number) => {
    setShowAPIKeys(prev => ({
      ...prev,
      [orgId]: !prev[orgId]
    }))
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
        tts_api_key: org.api_keys?.tts_api_key || ''
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

  if (!user || user.role !== 'super_admin' || !user.is_super_admin) {
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
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-slate-400">Manage organizations and their API key configurations</p>
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
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAPIKeyVisibility(org.id)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Toggle API Keys"
                      >
                        {showAPIKeys[org.id] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      
                      {!editingKeys[org.id] ? (
                        <button
                          onClick={() => startEditingKeys(org)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit API Keys"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => saveAPIKeys(org.id)}
                            className="p-2 text-green-400 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Save Changes"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => cancelEditing(org.id)}
                            className="p-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
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
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                            <Volume2 className="w-4 h-4" />
                            <span>Text-to-Speech (TTS)</span>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Provider</label>
                            {editingKeys[org.id] ? (
                              <select
                                value={apiKeyConfigs[org.id]?.tts_provider || ''}
                                onChange={(e) => updateAPIKeyConfig(org.id, 'tts_provider', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Provider</option>
                                <option value="elevenlabs">ElevenLabs</option>
                                <option value="openai">OpenAI TTS</option>
                                <option value="cartesia">Cartesia</option>
                                <option value="azure">Azure Speech</option>
                              </select>
                            ) : (
                              <p className="text-white text-sm">{org.api_keys?.tts_provider || 'Not configured'}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">API Key</label>
                            {editingKeys[org.id] ? (
                              <input
                                type="password"
                                value={apiKeyConfigs[org.id]?.tts_api_key || ''}
                                onChange={(e) => updateAPIKeyConfig(org.id, 'tts_api_key', e.target.value)}
                                placeholder="Enter TTS API key"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-white text-sm font-mono">
                                {org.api_keys?.tts_api_key ? '••••••••••••••••' : 'Not configured'}
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
    </div>
  )
}