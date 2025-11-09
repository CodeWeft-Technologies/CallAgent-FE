'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import ResourceUsageMinutes from '../../components/ResourceUsageMinutes'


const API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

export default function OrganizationPage() {
    const { user, token, refreshUser } = useAuth()
    const [activeTab, setActiveTab] = useState('general')
    const [loading, setLoading] = useState(true)
    const [credentials, setCredentials] = useState<any[]>([])
    const [resourceLimits, setResourceLimits] = useState<any[]>([])
    const [calendarSettings, setCalendarSettings] = useState<any>({
        ai_booking_enabled: true,
        ai_confidence_threshold: 0.70,
        timezone: 'UTC',
        default_duration_minutes: 30,
        max_advance_days: 30,
        min_advance_hours: 2,
        buffer_minutes: 15
    })
    const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([])
    const [savingCalendar, setSavingCalendar] = useState(false)
    const [organizationName, setOrganizationName] = useState('')
    const [editingName, setEditingName] = useState(false)
    const [savingName, setSavingName] = useState(false)
    
    // SMS Configuration States
    const [smsConfig, setSmsConfig] = useState({
        sms_enabled: false,
        interested_sms_template: 'Thank you for your interest! We\'ll contact you soon.',
        followup_sms_template: 'Following up on your inquiry. Please let us know if you need any assistance.',
        has_credentials: false
    })
    const [smsCredentials, setSmsCredentials] = useState({
        app_id: '',
        app_secret: ''
    });
    const [savingSms, setSavingSms] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return
            setLoading(true)

            try {
                const credsResponse = await fetch(`${API_URL}/api/org-credentials/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (credsResponse.ok) {
                    const credsData = await credsResponse.json()
                    setCredentials(Array.isArray(credsData) ? credsData : [])
                }

                const limitsResponse = await fetch(`${API_URL}/api/resource-limits/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (limitsResponse.ok) {
                    const limitsData = await limitsResponse.json()
                    setResourceLimits(Array.isArray(limitsData) ? limitsData : [])
                }

                // Load calendar settings
                const calendarResponse = await fetch(`${API_URL}/api/appointments/calendar/settings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (calendarResponse.ok) {
                    const calendarData = await calendarResponse.json()
                    if (calendarData.success) {
                        setCalendarSettings(calendarData.data)
                    }
                }

                // Load availability slots
                const availabilityResponse = await fetch(`${API_URL}/api/appointments/calendar/availability-rules`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (availabilityResponse.ok) {
                    const availabilityData = await availabilityResponse.json()
                    if (availabilityData.success) {
                        setAvailabilitySlots(Array.isArray(availabilityData.data) ? availabilityData.data : [])
                    }
                }

                // Fetch SMS configuration
                const smsConfigResponse = await fetch(`${API_URL}/api/sms/config`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (smsConfigResponse.ok) {
                    setSmsConfig(await smsConfigResponse.json())
                }
            } catch (err) {
                console.error('Error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        
        // Initialize organization name from user data
        if (user?.organization_name) {
            setOrganizationName(user.organization_name)
        }
    }, [token, user?.organization_name])

    const saveCalendarSettings = async () => {
        if (!token) return
        setSavingCalendar(true)

        try {
            // Save calendar settings
            const settingsResponse = await fetch(`${API_URL}/api/appointments/calendar/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(calendarSettings)
            })

            // Save availability slots
            const slotsResponse = await fetch(`${API_URL}/api/appointments/calendar/availability-rules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(availabilitySlots)
            })

            if (settingsResponse.ok && slotsResponse.ok) {
                toast.success('Calendar settings saved successfully!')
            } else {
                toast.error('Failed to save calendar settings')
            }
        } catch (error) {
            console.error('Error saving calendar settings:', error)
            toast.error('Error saving calendar settings')
        } finally {
            setSavingCalendar(false)
        }
    }

    const saveOrganizationName = async () => {
        if (!token || !organizationName.trim()) return
        setSavingName(true)

        try {
            const response = await fetch(`${API_URL}/api/org-config/organizations/update-name`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    organization_id: user?.organization_id,
                    name: organizationName.trim()
                })
            })

            if (response.ok) {
                toast.success('Organization name updated successfully!')
                setEditingName(false)
                // Refresh user data to update sidebar and organization name display
                if (refreshUser) {
                    await refreshUser()
                }
            } else {
                toast.error('Failed to update organization name')
            }
        } catch (error) {
            console.error('Error updating organization name:', error)
            toast.error('Error updating organization name')
        } finally {
            setSavingName(false)
        }
    }

    const cancelEditName = () => {
        setOrganizationName(user?.organization_name || '')
        setEditingName(false)
    }

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
                        onClick={() => setActiveTab('resources')}
                        className={`px-3 py-2 sm:py-3 rounded-lg sm:rounded-none sm:border-b-2 transition-colors text-xs sm:text-base font-medium ${activeTab === 'resources'
                            ? 'bg-blue-600 text-white sm:bg-transparent sm:border-blue-500 sm:text-blue-500'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 sm:bg-transparent sm:border-transparent sm:text-slate-400 sm:hover:text-slate-300'
                            }`}
                    >
                        Resource Limits
                    </button>
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`px-3 py-2 sm:py-3 rounded-lg sm:rounded-none sm:border-b-2 transition-colors text-xs sm:text-base font-medium ${activeTab === 'calendar'
                            ? 'bg-blue-600 text-white sm:bg-transparent sm:border-blue-500 sm:text-blue-500'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 sm:bg-transparent sm:border-transparent sm:text-slate-400 sm:hover:text-slate-300'
                            }`}
                    >
                        Calendar
                    </button>
                    <button
                        onClick={() => setActiveTab('sms')}
                        className={`px-3 py-2 sm:py-3 rounded-lg sm:rounded-none sm:border-b-2 transition-colors text-xs sm:text-base font-medium ${activeTab === 'sms'
                            ? 'bg-blue-600 text-white sm:bg-transparent sm:border-blue-500 sm:text-blue-500'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 sm:bg-transparent sm:border-transparent sm:text-slate-400 sm:hover:text-slate-300'
                            }`}
                    >
                        SMS
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
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Organization Name</label>
                                        {editingName ? (
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    value={organizationName}
                                                    onChange={(e) => setOrganizationName(e.target.value)}
                                                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter organization name"
                                                    disabled={savingName}
                                                />
                                                <button
                                                    onClick={saveOrganizationName}
                                                    disabled={savingName || !organizationName.trim()}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                                                >
                                                    {savingName ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={cancelEditName}
                                                    disabled={savingName}
                                                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between bg-slate-700 rounded-lg p-3">
                                                <span className="text-white">{user?.organization_name}</span>
                                                <button
                                                    onClick={() => setEditingName(true)}
                                                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        )}
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

                        {activeTab === 'resources' && (
                            <div className="bg-slate-800 rounded-lg p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Resource Usage</h2>
                                <div className="space-y-6">
                                    {/* Call Minutes Usage Card */}
                                    <ResourceUsageMinutes token={token} organizationId={user?.organization_id || null} />
                                    
                                    {/* Resource Limits - Only Minutes */}
                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-4">Minutes Allocation</h3>
                                        {resourceLimits.length === 0 ? (
                                            <div className="bg-slate-700 rounded-lg p-6 text-center">
                                                <p className="text-slate-400">No minutes allocation configured.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 sm:space-y-4">
                                                {Array.isArray(resourceLimits) ? resourceLimits
                                                    .filter((limit) => limit.resource_type.toLowerCase().includes('minutes') || limit.resource_type.toLowerCase().includes('call'))
                                                    .map((limit) => (
                                                    <div key={limit.id} className="bg-slate-700 rounded-lg p-4">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                                                            <div className="flex-1">
                                                                <h3 className="text-white font-medium">{limit.resource_type}</h3>
                                                                <p className="text-slate-400 text-sm">{limit.description}</p>
                                                            </div>
                                                            <div className="text-white font-medium">{limit.limit_value} minutes</div>
                                                        </div>
                                                    </div>
                                                )) : []}
                                                {(Array.isArray(resourceLimits) ? resourceLimits.filter((limit) => limit.resource_type.toLowerCase().includes('minutes') || limit.resource_type.toLowerCase().includes('call')) : []).length === 0 && (
                                                    <div className="bg-slate-700 rounded-lg p-6 text-center">
                                                        <p className="text-slate-400">No minutes allocation configured.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'calendar' && (
                            <div className="bg-slate-800 rounded-lg p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-medium text-white mb-4">Calendar Settings</h2>
                                <div className="space-y-6">
                                    <div className="bg-slate-700 rounded-lg p-4">
                                        <h3 className="text-white font-medium mb-3">AI Appointment Booking</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white text-sm">Enable AI Booking</p>
                                                    <p className="text-slate-400 text-xs">Allow AI to book appointments during calls</p>
                                                </div>
                                                <button
                                                    onClick={() => setCalendarSettings({
                                                        ...calendarSettings,
                                                        ai_booking_enabled: !calendarSettings.ai_booking_enabled
                                                    })}
                                                    className={`w-12 h-6 rounded-full relative transition-colors ${
                                                        calendarSettings.ai_booking_enabled ? 'bg-blue-600' : 'bg-slate-600'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                                                        calendarSettings.ai_booking_enabled ? 'translate-x-6' : 'translate-x-0.5'
                                                    }`}></div>
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                                    AI Confidence Threshold ({Math.round(calendarSettings.ai_confidence_threshold * 100)}%)
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0.5"
                                                    max="0.95"
                                                    step="0.05"
                                                    value={calendarSettings.ai_confidence_threshold}
                                                    onChange={(e) => setCalendarSettings({
                                                        ...calendarSettings,
                                                        ai_confidence_threshold: parseFloat(e.target.value)
                                                    })}
                                                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                                    <span>Conservative (50%)</span>
                                                    <span>Aggressive (95%)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-700 rounded-lg p-4">
                                        <h3 className="text-white font-medium mb-3">Business Hours</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Timezone</label>
                                                <select 
                                                    value={calendarSettings.timezone}
                                                    onChange={(e) => setCalendarSettings({
                                                        ...calendarSettings,
                                                        timezone: e.target.value
                                                    })}
                                                    className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500"
                                                >
                                                    <option value="UTC">UTC</option>
                                                    <option value="America/New_York">America/New_York</option>
                                                    <option value="America/Los_Angeles">America/Los_Angeles</option>
                                                    <option value="Europe/London">Europe/London</option>
                                                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Default Duration</label>
                                                <select 
                                                    value={calendarSettings.default_duration_minutes}
                                                    onChange={(e) => setCalendarSettings({
                                                        ...calendarSettings,
                                                        default_duration_minutes: parseInt(e.target.value)
                                                    })}
                                                    className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500"
                                                >
                                                    <option value={15}>15 minutes</option>
                                                    <option value={30}>30 minutes</option>
                                                    <option value={45}>45 minutes</option>
                                                    <option value={60}>60 minutes</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Buffer Time (min)</label>
                                                <input
                                                    type="number"
                                                    value={calendarSettings.buffer_minutes}
                                                    onChange={(e) => setCalendarSettings({
                                                        ...calendarSettings,
                                                        buffer_minutes: parseInt(e.target.value)
                                                    })}
                                                    className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500"
                                                    min="0"
                                                    max="60"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Max Advance Days</label>
                                                <input
                                                    type="number"
                                                    value={calendarSettings.max_advance_days}
                                                    onChange={(e) => setCalendarSettings({
                                                        ...calendarSettings,
                                                        max_advance_days: parseInt(e.target.value)
                                                    })}
                                                    className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500"
                                                    min="1"
                                                    max="365"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Min Advance Hours</label>
                                                <input
                                                    type="number"
                                                    value={calendarSettings.min_advance_hours}
                                                    onChange={(e) => setCalendarSettings({
                                                        ...calendarSettings,
                                                        min_advance_hours: parseInt(e.target.value)
                                                    })}
                                                    className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500"
                                                    min="0"
                                                    max="72"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <p className="text-slate-400 text-sm mb-3">Available Days & Hours</p>
                                            <div className="space-y-2">
                                                {[
                                                    { name: 'Monday', value: 1 },
                                                    { name: 'Tuesday', value: 2 },
                                                    { name: 'Wednesday', value: 3 },
                                                    { name: 'Thursday', value: 4 },
                                                    { name: 'Friday', value: 5 }
                                                ].map(day => {
                                                    const existingSlot = Array.isArray(availabilitySlots) ? availabilitySlots.find(slot => slot.day_of_week === day.value) : null
                                                    const isEnabled = !!existingSlot
                                                    const startTime = existingSlot?.start_time || '09:00:00'
                                                    const endTime = existingSlot?.end_time || '17:00:00'
                                                    
                                                    return (
                                                        <div key={day.name} className="flex items-center justify-between bg-slate-600 rounded-lg p-3">
                                                            <div className="flex items-center space-x-3">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={isEnabled}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setAvailabilitySlots([
                                                                                ...(Array.isArray(availabilitySlots) ? availabilitySlots.filter(slot => slot.day_of_week !== day.value) : []),
                                                                                {
                                                                                    day_of_week: day.value,
                                                                                    start_time: '09:00:00',
                                                                                    end_time: '17:00:00'
                                                                                }
                                                                            ])
                                                                        } else {
                                                                            setAvailabilitySlots(Array.isArray(availabilitySlots) ? availabilitySlots.filter(slot => slot.day_of_week !== day.value) : [])
                                                                        }
                                                                    }}
                                                                    className="rounded" 
                                                                />
                                                                <span className="text-white text-sm">{day.name}</span>
                                                            </div>
                                                            {isEnabled && (
                                                                <div className="flex items-center space-x-2 text-sm">
                                                                    <input 
                                                                        type="time" 
                                                                        value={startTime.slice(0, 5)}
                                                                        onChange={(e) => {
                                                                            const updatedSlots = Array.isArray(availabilitySlots) ? availabilitySlots.map(slot => 
                                                                                slot.day_of_week === day.value 
                                                                                    ? { ...slot, start_time: e.target.value + ':00' }
                                                                                    : slot
                                                                            ) : []
                                                                            setAvailabilitySlots(updatedSlots)
                                                                        }}
                                                                        className="bg-slate-700 text-white rounded px-2 py-1 text-xs"
                                                                    />
                                                                    <span className="text-slate-400">to</span>
                                                                    <input 
                                                                        type="time" 
                                                                        value={endTime.slice(0, 5)}
                                                                        onChange={(e) => {
                                                                            const updatedSlots = Array.isArray(availabilitySlots) ? availabilitySlots.map(slot => 
                                                                                slot.day_of_week === day.value 
                                                                                    ? { ...slot, end_time: e.target.value + ':00' }
                                                                                    : slot
                                                                            ) : []
                                                                            setAvailabilitySlots(updatedSlots)
                                                                        }}
                                                                        className="bg-slate-700 text-white rounded px-2 py-1 text-xs"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button 
                                            onClick={saveCalendarSettings}
                                            disabled={savingCalendar}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                        >
                                            {savingCalendar && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            )}
                                            <span>{savingCalendar ? 'Saving...' : 'Save Calendar Settings'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'sms' && (
                            <div className="space-y-6">
                                {/* SMS Configuration */}
                                <div className="bg-slate-800 rounded-lg p-6">
                                    <h2 className="text-xl font-medium text-white mb-4">SMS Configuration</h2>
                                    
                                    <div className="space-y-4">
                                        {/* Enable/Disable SMS */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-sm font-medium text-white">Enable SMS Notifications</label>
                                                <p className="text-xs text-slate-400">Send automated SMS messages to interested leads</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={smsConfig.sms_enabled}
                                                    onChange={(e) => setSmsConfig(prev => ({...prev, sms_enabled: e.target.checked}))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        {/* SMS Templates */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Interested Lead SMS Template</label>
                                                <textarea
                                                    value={smsConfig.interested_sms_template}
                                                    onChange={(e) => setSmsConfig(prev => ({...prev, interested_sms_template: e.target.value}))}
                                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows={3}
                                                    placeholder="Enter SMS template for interested leads"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Follow-up SMS Template</label>
                                                <textarea
                                                    value={smsConfig.followup_sms_template}
                                                    onChange={(e) => setSmsConfig(prev => ({...prev, followup_sms_template: e.target.value}))}
                                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows={3}
                                                    placeholder="Enter SMS template for follow-ups"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={async () => {
                                                    setSavingSms(true)
                                                    try {
                                                        const response = await fetch(`${API_URL}/api/sms/config`, {
                                                            method: 'PUT',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${token}`
                                                            },
                                                            body: JSON.stringify(smsConfig)
                                                        })
                                                        if (response.ok) {
                                                            toast.success('SMS configuration updated successfully!')
                                                        } else {
                                                            toast.error('Failed to update SMS configuration')
                                                        }
                                                    } catch (error) {
                                                        toast.error('Error updating SMS configuration')
                                                    } finally {
                                                        setSavingSms(false)
                                                    }
                                                }}
                                                disabled={savingSms}
                                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                            >
                                                {savingSms && (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                                )}
                                                <span>{savingSms ? 'Saving...' : 'Save SMS Settings'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* PIOPIY Credentials */}
                                <div className="bg-slate-800 rounded-lg p-6">
                                    <h2 className="text-xl font-medium text-white mb-4">PIOPIY SMS Credentials</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">App ID</label>
                                            <input
                                                type="text"
                                                value={smsCredentials.app_id}
                                                onChange={(e) => setSmsCredentials(prev => ({...prev, app_id: e.target.value}))}
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter PIOPIY App ID"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">App Secret</label>
                                            <input
                                                type="password"
                                                value={smsCredentials.app_secret}
                                                onChange={(e) => setSmsCredentials(prev => ({...prev, app_secret: e.target.value}))}
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter PIOPIY App Secret"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={async () => {
                                                setSavingSms(true)
                                                try {
                                                    const response = await fetch(`${API_URL}/api/sms/credentials`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${token}`
                                                        },
                                                        body: JSON.stringify(smsCredentials)
                                                    })
                                                    if (response.ok) {
                                                        toast.success('PIOPIY credentials updated successfully!')
                                                        setSmsConfig(prev => ({...prev, has_credentials: true}))
                                                    } else {
                                                        toast.error('Failed to update PIOPIY credentials')
                                                    }
                                                } catch (error) {
                                                    toast.error('Error updating PIOPIY credentials')
                                                } finally {
                                                    setSavingSms(false)
                                                }
                                            }}
                                            disabled={savingSms || !smsCredentials.app_id || !smsCredentials.app_secret}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                        >
                                            {savingSms && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            )}
                                            <span>{savingSms ? 'Saving...' : 'Save Credentials'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Test SMS Section */}
                                {smsConfig.has_credentials && smsConfig.sms_enabled && (
                                    <div className="bg-slate-800 rounded-lg p-6">
                                        <h2 className="text-xl font-medium text-white mb-4">Test SMS</h2>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Test Phone Number</label>
                                                <input
                                                    type="tel"
                                                    placeholder="Enter phone number to test SMS"
                                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    id="test-phone-number"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    onClick={async () => {
                                                        const phoneInput = document.getElementById('test-phone-number') as HTMLInputElement;
                                                        const phoneNumber = phoneInput?.value;
                                                        
                                                        if (!phoneNumber) {
                                                            toast.error('Please enter a phone number');
                                                            return;
                                                        }
                                                        
                                                        setSavingSms(true);
                                                        try {
                                                            const response = await fetch(`${API_URL}/api/sms/send`, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    'Authorization': `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({
                                                                    phone_number: phoneNumber,
                                                                    message: smsConfig.interested_sms_template,
                                                                    template_type: 'interested'
                                                                })
                                                            });
                                                            
                                                            if (response.ok) {
                                                                toast.success('Test SMS sent successfully!');
                                                                phoneInput.value = '';
                                                            } else {
                                                                const error = await response.json();
                                                                toast.error(error.detail || 'Failed to send test SMS');
                                                            }
                                                        } catch (error) {
                                                            toast.error('Error sending test SMS');
                                                        } finally {
                                                            setSavingSms(false);
                                                        }
                                                    }}
                                                    disabled={savingSms}
                                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                                                >
                                                    {savingSms && (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                                    )}
                                                    <span>{savingSms ? 'Sending...' : 'Send Test SMS'}</span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <p className="text-xs text-slate-400">
                                            This will send a test SMS using your "Interested Lead" template to verify your PIOPIY configuration.
                                        </p>
                                    </div>
                                )}
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