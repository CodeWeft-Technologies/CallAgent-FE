'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Settings, Key, Users, Database, Shield, Activity, FileText } from 'lucide-react'
import APIKeyRequestForm from '../../components/APIKeyRequestForm'
import APIKeyRequestStatus from '../../components/APIKeyRequestStatus'

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

export default function OrganizationPage() {
  const { user, token } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orgData, setOrgData] = useState<any>(null)
  const [credentials, setCredentials] = useState<any[]>([])
  const [resourceLimits, setResourceLimits] = useState<any[]>([])
  const [requestRefreshTrigger, setRequestRefreshTrigger] = useState(0)
  // Fetch organization data
  useEffect(() => {
    const fetchOrgData = async () => {
      if (!token) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Fetch organization credentials
        const credsResponse = await fetch(`${API_URL}/api/org-credentials/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (credsResponse.ok) {
          const credsData = await credsResponse.json()
          setCredentials(credsData)
        }
        
        // Fetch resource limits
        const limitsResponse = await fetch(`${API_URL}/api/resource-limits/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (limitsResponse.ok) {
          const limitsData = await limitsResponse.json()
          setResourceLimits(limitsData)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error fetching organization data:', err)
        setError('Failed to load organization data')
        setLoading(false)
      }
    }
    
    fetchOrgData()
  }, [token])
  
  // Check if user has permission to access this page
  if (user && user.role !== 'admin' && user.role !== 'manager') {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          <h2 className="text-lg font-medium mb-2">Access Denied</h2>
          <p>You don't have permission to access organization settings.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Organization Settings</h1>
          <p className="text-slate-400">
            Manage your organization's settings, credentials, and resource limits
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-slate-800 mb-6">
        <div className="flex space-x-8">
          <TabButton 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')}
            icon={<Settings className="w-4 h-4 mr-2" />}
            label="General"
          />
          <TabButton 
            active={activeTab === 'credentials'} 
            onClick={() => setActiveTab('credentials')}
            icon={<Key className="w-4 h-4 mr-2" />}
            label="API Credentials"
          />
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
            icon={<Users className="w-4 h-4 mr-2" />}
            label="Users"
          />
          <TabButton 
            active={activeTab === 'resources'} 
            onClick={() => setActiveTab('resources')}
            icon={<Database className="w-4 h-4 mr-2" />}
            label="Resource Limits"
          />
          <TabButton 
            active={activeTab === 'api-requests'} 
            onClick={() => setActiveTab('api-requests')}
            icon={<FileText className="w-4 h-4 mr-2" />}
            label="API Key Requests"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {activeTab === 'general' && (
              <GeneralSettings user={user} />
            )}
            
            {activeTab === 'credentials' && (
              <CredentialsSettings credentials={credentials} token={token} />
            )}
            
            {activeTab === 'users' && (
              <UsersSettings token={token} />
            )}
            
            {activeTab === 'resources' && (
              <ResourcesSettings resourceLimits={resourceLimits} token={token} />
            )}
            
            {activeTab === 'api-requests' && (
              <APIKeyRequestsSettings 
                token={token} 
                refreshTrigger={requestRefreshTrigger}
                onRequestSubmitted={() => setRequestRefreshTrigger(prev => prev + 1)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-3 border-b-2 transition-colors ${
        active 
          ? 'border-blue-500 text-blue-500' 
          : 'border-transparent text-slate-400 hover:text-slate-300'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

// General Settings Component
function GeneralSettings({ user }: { user: any }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-medium text-white mb-4">Organization Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Organization Name
          </label>
          <div className="bg-slate-700 rounded-lg p-3 text-white">
            {user?.organization_name}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Organization ID
          </label>
          <div className="bg-slate-700 rounded-lg p-3 text-white">
            {user?.organization_id}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Your Role
          </label>
          <div className="bg-slate-700 rounded-lg p-3 text-white flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-500" />
            {user?.role === 'admin' ? 'Administrator' : 'Manager'}
          </div>
        </div>
      </div>
    </div>
  )
}

// Credentials Settings Component
function CredentialsSettings({ credentials, token }: { credentials: any[], token: string | null }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCredential, setEditingCredential] = useState<any>(null)
  const [formData, setFormData] = useState({
    credential_type: 'piopiy',
    app_id: '',
    app_secret: '',
    caller_id: '',
    is_active: true
  })
  const [saving, setSaving] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const handleAddCredential = async () => {
    if (!token) return
    
    setSaving(true)
    setTestResult(null)
    
    try {
      const endpoint = `${API_URL}/api/org-credentials/piopiy`
      
      const payload = {
        credential_type: 'piopiy',
        app_id: formData.app_id,
        app_secret: formData.app_secret,
        caller_id: formData.caller_id,
        is_active: formData.is_active
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        // Refresh credentials list
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Error: ${error.detail}`)
      }
    } catch (error) {
      alert(`Error: ${error}`)
    } finally {
      setSaving(false)
    }
  }

  const handleTestCredential = async () => {
    if (!token || formData.credential_type !== 'piopiy') return
    
    setSaving(true)
    setTestResult(null)
    
    try {
      const response = await fetch(`${API_URL}/api/org-credentials/test/piopiy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          credential_type: 'piopiy',
          app_id: formData.app_id,
          app_secret: formData.app_secret,
          caller_id: formData.caller_id,
          is_active: true
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setTestResult(result)
      } else {
        const error = await response.json()
        setTestResult({ success: false, message: error.detail })
      }
    } catch (error) {
      setTestResult({ success: false, message: `Error: ${error}` })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCredential = async (credentialId: number) => {
    if (!token || !confirm('Are you sure you want to delete this credential?')) return
    
    try {
      const response = await fetch(`${API_URL}/api/org-credentials/${credentialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Error: ${error.detail}`)
      }
    } catch (error) {
      alert(`Error: ${error}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-white">API Credentials</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add New Credential
          </button>
        </div>
        
        {credentials.length === 0 ? (
          <div className="bg-slate-700 rounded-lg p-6 text-center">
            <p className="text-slate-400">No credentials found. Add your first API credential.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {credentials.map((cred) => (
              <div key={cred.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-white">{cred.credential_type.toUpperCase()}</div>
                  <div className={`px-2 py-1 rounded-full text-xs ${cred.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {cred.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {cred.credential_type === 'piopiy' && (
                    <>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">App ID</label>
                        <div className="bg-slate-800 rounded p-2 text-sm text-slate-300">{cred.app_id}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Caller ID</label>
                        <div className="bg-slate-800 rounded p-2 text-sm text-slate-300">{cred.caller_id}</div>
                      </div>
                    </>
                  )}
                  
                  {cred.credential_type !== 'piopiy' && (
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">API Key</label>
                      <div className="bg-slate-800 rounded p-2 text-sm text-slate-300">
                        {cred.api_key ? '••••••••••••••••' : 'No API key'}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-3 space-x-2">
                  <button 
                    onClick={() => {
                      setEditingCredential(cred)
                      setFormData({
                        credential_type: cred.credential_type,
                        app_id: cred.app_id || '',
                        app_secret: '',
                        caller_id: cred.caller_id || '',
                        api_key: cred.api_key || '',
                        is_active: cred.is_active
                      })
                      setShowEditModal(true)
                    }}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCredential(cred.id)}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Credential Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-white mb-4">Add New Credential</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Credential Type</label>
                <div className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600">
                  Piopiy (Voice Calling)
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">App ID</label>
                <input
                  type="text"
                  value={formData.app_id}
                  onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter Piopiy App ID"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">App Secret</label>
                <input
                  type="password"
                  value={formData.app_secret}
                  onChange={(e) => setFormData({ ...formData, app_secret: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter Piopiy App Secret"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Caller ID</label>
                <input
                  type="text"
                  value={formData.caller_id}
                  onChange={(e) => setFormData({ ...formData, caller_id: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter Caller ID (e.g., +1234567890)"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm text-slate-300">Active</label>
              </div>

              {/* Test Result */}
              {testResult && (
                <div className={`p-3 rounded-lg ${testResult.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  <p className="text-sm">{testResult.message}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleTestCredential}
                disabled={saving || !formData.app_id || !formData.app_secret}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? 'Testing...' : 'Test'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setFormData({
                    credential_type: 'piopiy',
                    app_id: '',
                    app_secret: '',
                    caller_id: '',
                    is_active: true
                  })
                  setTestResult(null)
                }}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCredential}
                disabled={saving || !formData.app_id || !formData.app_secret || !formData.caller_id}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Users Settings Component
function UsersSettings({ token }: { token: string | null }) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return
      
      try {
        // This endpoint would need to be implemented in the backend
        const response = await fetch(`${API_URL}/api/auth/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error fetching users:', err)
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [token])
  
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white">Organization Users</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Add User
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-slate-700 rounded-lg p-6 text-center">
          <p className="text-slate-400">No users found or feature not implemented yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-700">
                  <td className="py-3 text-white">{user.first_name} {user.last_name}</td>
                  <td className="py-3 text-white">{user.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : user.role === 'manager'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-600 transition-colors">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Resources Settings Component
function ResourcesSettings({ resourceLimits, token }: { resourceLimits: any[], token: string | null }) {
  const [limits, setLimits] = useState(resourceLimits)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleUpdateLimit = async (limitId: number, newValue: number) => {
    if (!token) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${API_URL}/api/resource-limits/${limitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ limit_value: newValue })
      })

      if (!response.ok) {
        throw new Error('Failed to update resource limit')
      }

      const updatedLimit = await response.json()
      setLimits(prev => prev.map(limit => 
        limit.id === limitId ? updatedLimit : limit
      ))
      setSuccess('Resource limit updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Resource Limits</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-500 mb-4">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {limits.map((limit) => (
          <div key={limit.id} className="bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">{limit.resource_type}</h3>
                <p className="text-slate-400 text-sm">{limit.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={limit.limit_value}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value)
                    setLimits(prev => prev.map(l => 
                      l.id === limit.id ? { ...l, limit_value: newValue } : l
                    ))
                  }}
                  className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 w-20"
                />
                <button
                  onClick={() => handleUpdateLimit(limit.id, limit.limit_value)}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function APIKeyRequestsSettings({ 
  token, 
  refreshTrigger, 
  onRequestSubmitted 
}: { 
  token: string | null, 
  refreshTrigger: number,
  onRequestSubmitted: () => void 
}) {
  const [activeSubTab, setActiveSubTab] = useState('request')

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="border-b border-slate-700">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveSubTab('request')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === 'request'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Submit Request
          </button>
          <button
            onClick={() => setActiveSubTab('status')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === 'status'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Request Status
          </button>
        </div>
      </div>

      {/* Content */}
      {activeSubTab === 'request' && (
        <APIKeyRequestForm onRequestSubmitted={onRequestSubmitted} />
      )}
      
      {activeSubTab === 'status' && (
        <APIKeyRequestStatus refreshTrigger={refreshTrigger} />
      )}
    </div>
  )
}