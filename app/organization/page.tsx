'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Shield } from 'lucide-react'
import APIKeyRequestForm from '../../components/APIKeyRequestForm'

const API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

export default function OrganizationPage() {
    const { user, token } = useAuth()
    const [activeTab, setActiveTab] = useState('general')
    const [loading, setLoading] = useState(true)
    const [credentials, setCredentials] = useState<any[]>([])
    const [resourceLimits, setResourceLimits] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return
            setLoading(true)

            try {
                const credsResponse = await fetch(`${API_URL}/api/org-credentials/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (credsResponse.ok) {
                    setCredentials(await credsResponse.json())
                }

                const limitsResponse = await fetch(`${API_URL}/api/resource-limits/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (limitsResponse.ok) {
                    setResourceLimits(await limitsResponse.json())
                }
            } catch (err) {
                console.error('Error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [token])

    if (user && user.role !== 'admin' && user.role !== 'manager') {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
                    <h2 className="text-lg font-medium mb-2">Access Denied</h2>
                    <p>You don't have permission to access organization settings.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Organization Settings</h1>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Manage your organization settings, credentials, and resource limits
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <div className="grid grid-cols-2 sm:flex sm:space-x-8 gap-2 sm:gap-0 sm:border-b sm:border-slate-800 sm:pb-2">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-3 py-2 sm:py-3 rounded-lg sm:rounded-none sm:border-b-2 transition-colors text-xs sm:text-base font-medium ${activeTab === 'general'
                            ? 'bg-blue-600 text-white sm:bg-transparent sm:border-blue-500 sm:text-blue-500'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 sm:bg-transparent sm:border-transparent sm:text-slate-400 sm:hover:text-slate-300'
                            }`}
                    >
                        General
                    </button>
                    <button
                        onClick={() => setActiveTab('credentials')}
                        className={`px-3 py-2 sm:py-3 rounded-lg sm:rounded-none sm:border-b-2 transition-colors text-xs sm:text-base font-medium ${activeTab === 'credentials'
                            ? 'bg-blue-600 text-white sm:bg-transparent sm:border-blue-500 sm:text-blue-500'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 sm:bg-transparent sm:border-transparent sm:text-slate-400 sm:hover:text-slate-300'
                            }`}
                    >
                        API Credentials
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-3 py-2 sm:py-3 rounded-lg sm:rounded-none sm:border-b-2 transition-colors text-xs sm:text-base font-medium ${activeTab === 'users'
                            ? 'bg-blue-600 text-white sm:bg-transparent sm:border-blue-500 sm:text-blue-500'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 sm:bg-transparent sm:border-transparent sm:text-slate-400 sm:hover:text-slate-300'
                            }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-3 py-2 sm:py-3 rounded-lg sm:rounded-none sm:border-b-2 transition-colors text-xs sm:text-base font-medium ${activeTab === 'resources'
                            ? 'bg-blue-600 text-white sm:bg-transparent sm:border-blue-500 sm:text-blue-500'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 sm:bg-transparent sm:border-transparent sm:text-slate-400 sm:hover:text-slate-300'
                            }`}
                    >
                        Resource Limits
                    </button>
                    <button
                        onClick={() => setActiveTab('api-requests')}
                        className={`px-3 py-2 sm:py-3 rounded-lg sm:rounded-none sm:border-b-2 transition-colors text-xs sm:text-base font-medium col-span-2 sm:col-span-1 ${activeTab === 'api-requests'
                            ? 'bg-blue-600 text-white sm:bg-transparent sm:border-blue-500 sm:text-blue-500'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 sm:bg-transparent sm:border-transparent sm:text-slate-400 sm:hover:text-slate-300'
                            }`}
                    >
                        API Key Requests
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'general' && (
                            <div className="bg-slate-800 rounded-lg p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-medium text-white mb-4">Organization Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Organization Name</label>
                                        <div className="bg-slate-700 rounded-lg p-3 text-white">{user?.organization_name}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Organization ID</label>
                                        <div className="bg-slate-700 rounded-lg p-3 text-white">{user?.organization_id}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Your Role</label>
                                        <div className="bg-slate-700 rounded-lg p-3 text-white flex items-center">
                                            <Shield className="w-4 h-4 mr-2 text-blue-500" />
                                            {user?.role === 'admin' ? 'Administrator' : 'Manager'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'credentials' && (
                            <CredentialsSettings credentials={credentials} token={token} />
                        )}

                        {activeTab === 'users' && (
                            <div className="bg-slate-800 rounded-lg p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-medium text-white mb-4">Organization Users</h2>
                                <div className="bg-slate-700 rounded-lg p-6 text-center">
                                    <p className="text-slate-400">User management feature coming soon.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'resources' && (
                            <div className="bg-slate-800 rounded-lg p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Resource Limits</h2>
                                {resourceLimits.length === 0 ? (
                                    <div className="bg-slate-700 rounded-lg p-6 text-center">
                                        <p className="text-slate-400">No resource limits configured.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {resourceLimits.map((limit) => (
                                            <div key={limit.id} className="bg-slate-700 rounded-lg p-4">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                                                    <div className="flex-1">
                                                        <h3 className="text-white font-medium">{limit.resource_type}</h3>
                                                        <p className="text-slate-400 text-sm">{limit.description}</p>
                                                    </div>
                                                    <div className="text-white font-medium">{limit.limit_value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'api-requests' && (
                            <div className="space-y-6">
                                <div className="border-b border-slate-700">
                                    <div className="flex space-x-6">
                                        <button className="pb-2 px-1 border-b-2 border-blue-500 text-blue-400 font-medium text-sm">
                                            Submit Request
                                        </button>
                                        <button className="pb-2 px-1 border-b-2 border-transparent text-slate-400 hover:text-slate-300 font-medium text-sm">
                                            Request Status
                                        </button>
                                    </div>
                                </div>
                                <APIKeyRequestForm onRequestSubmitted={() => { }} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
} function
    CredentialsSettings({ credentials, token }: { credentials: any[], token: string | null }) {
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({
        app_id: '',
        app_secret: '',
        caller_id: ''
    })
    const [saving, setSaving] = useState(false)

    const handleAddCredential = async () => {
        if (!token) return
        setSaving(true)

        try {
            const response = await fetch(`${API_URL}/api/org-credentials/piopiy`, {
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

    const handleDeleteCredential = async (credentialId: number) => {
        if (!token || !confirm('Are you sure?')) return

        try {
            const response = await fetch(`${API_URL}/api/org-credentials/${credentialId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                window.location.reload()
            }
        } catch (error) {
            alert(`Error: ${error}`)
        }
    }

    return (
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-medium text-white">API Credentials</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">App ID</label>
                                    <div className="bg-slate-800 rounded p-2 text-sm text-slate-300">{cred.app_id}</div>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Caller ID</label>
                                    <div className="bg-slate-800 rounded p-2 text-sm text-slate-300">{cred.caller_id}</div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={() => handleDeleteCredential(cred.id)}
                                    className="text-red-400 hover:text-red-300 text-sm px-3 py-2 rounded hover:bg-red-500/10 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-white mb-4">Add New Credential</h3>

                        <div className="space-y-4">
                            <input
                                type="text"
                                value={formData.app_id}
                                onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
                                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                                placeholder="App ID"
                            />
                            <input
                                type="password"
                                value={formData.app_secret}
                                onChange={(e) => setFormData({ ...formData, app_secret: e.target.value })}
                                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                                placeholder="App Secret"
                            />
                            <input
                                type="text"
                                value={formData.caller_id}
                                onChange={(e) => setFormData({ ...formData, caller_id: e.target.value })}
                                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                                placeholder="Caller ID"
                            />
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCredential}
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1"
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