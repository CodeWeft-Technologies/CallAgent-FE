'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
    Calendar, Clock, User, Phone, Mail,
    CheckCircle, XCircle, AlertCircle,
    Plus, Edit, Trash, Settings, Bot,
    Brain, Zap, Globe, MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

interface Appointment {
    id: string
    title: string
    description?: string
    scheduled_datetime: string
    duration_minutes: number
    status: string
    attendee_name?: string
    attendee_phone?: string
    attendee_email?: string
    booking_source: string
    ai_confidence?: number
    lead_name?: string
    appointment_type_name?: string
    appointment_type_color?: string
    // Smart auto-booking fields
    auto_booked?: boolean
    llm_confidence?: number
    llm_reasoning?: string
    booking_message?: string
    detected_language?: string
    time_preferences?: any
}

interface AppointmentStats {
    total_appointments: number
    scheduled: number
    confirmed: number
    completed: number
    cancelled: number
    no_shows: number
    ai_booked: number
    upcoming_appointments: number
    avg_ai_confidence: number
}

export default function AppointmentsPage() {
    const { user, token } = useAuth()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [stats, setStats] = useState<AppointmentStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [statusFilter, setStatusFilter] = useState('all')
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
    const [showNewAppointment, setShowNewAppointment] = useState(false)
    const [newAppointment, setNewAppointment] = useState({
        title: '',
        description: '',
        scheduled_datetime: '',
        duration_minutes: 30,
        attendee_name: '',
        attendee_phone: '',
        attendee_email: ''
    })

    useEffect(() => {
        if (token) {
            loadAppointments()
            loadStats()
        }
    }, [token, selectedDate, statusFilter])

    const loadAppointments = async () => {
        try {
            const params = new URLSearchParams()
            if (selectedDate) {
                params.append('start_date', selectedDate)
                params.append('end_date', selectedDate)
            }
            if (statusFilter !== 'all') {
                params.append('status', statusFilter)
            }

            const response = await fetch(`${API_URL}/api/appointments?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            const data = await response.json()
            if (data.success) {
                setAppointments(data.data)
            }
        } catch (error) {
            console.error('Error loading appointments:', error)
            toast.error('Failed to load appointments')
        } finally {
            setLoading(false)
        }
    }

    const loadStats = async () => {
        try {
            const response = await fetch(`${API_URL}/api/appointments/dashboard/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            const data = await response.json()
            if (data.success) {
                setStats(data.data)
            }
        } catch (error) {
            console.error('Error loading stats:', error)
        }
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            scheduled: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
            confirmed: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30',
            completed: 'bg-purple-600/20 text-purple-400 border border-purple-500/30',
            cancelled: 'bg-red-600/20 text-red-400 border border-red-500/30',
            no_show: 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
        }

        const icons = {
            scheduled: <Clock className="w-3 h-3" />,
            confirmed: <CheckCircle className="w-3 h-3" />,
            completed: <CheckCircle className="w-3 h-3" />,
            cancelled: <XCircle className="w-3 h-3" />,
            no_show: <AlertCircle className="w-3 h-3" />
        }

        return (
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.scheduled}`}>
                {icons[status as keyof typeof icons]}
                <span>{status.replace('_', ' ').toUpperCase()}</span>
            </span>
        )
    }

    const getSmartBookingBadge = (appointment: Appointment) => {
        if (appointment.auto_booked) {
            return (
                <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
                    <Zap className="w-3 h-3" />
                    <span>AUTO-BOOKED</span>
                </span>
            )
        } else if (appointment.booking_source === 'ai_call') {
            return (
                <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                    <Bot className="w-3 h-3" />
                    <span>AI DETECTED</span>
                </span>
            )
        }
        return null
    }

    const getConfidenceBadge = (appointment: Appointment) => {
        const confidence = appointment.llm_confidence || appointment.ai_confidence || 0
        if (confidence === 0) return null

        const getConfidenceColor = (conf: number) => {
            if (conf >= 0.8) return 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
            if (conf >= 0.6) return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
            return 'bg-orange-600/20 text-orange-400 border-orange-500/30'
        }

        const getConfidenceLabel = (conf: number) => {
            if (conf >= 0.8) return 'HIGH'
            if (conf >= 0.6) return 'MEDIUM'
            return 'LOW'
        }

        return (
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(confidence)}`}>
                <Brain className="w-3 h-3" />
                <span>{getConfidenceLabel(confidence)} ({(confidence * 100).toFixed(0)}%)</span>
            </span>
        )
    }

    const getLanguageBadge = (language?: string) => {
        if (!language || language === 'english') return null

        const languageNames: { [key: string]: string } = {
            'hindi': 'हिन्दी',
            'tamil': 'தமிழ்',
            'telugu': 'తెలుగు',
            'bengali': 'বাংলা',
            'marathi': 'मराठी',
            'gujarati': 'ગુજરાતી',
            'kannada': 'ಕನ್ನಡ',
            'malayalam': 'മലയാളം',
            'punjabi': 'ਪੰਜਾਬੀ'
        }

        return (
            <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <Globe className="w-3 h-3" />
                <span>{languageNames[language] || language.toUpperCase()}</span>
            </span>
        )
    }

    const formatDateTime = (datetime: string) => {
        const date = new Date(datetime)
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    }

    const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
        try {
            const response = await fetch(`${API_URL}/api/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            const data = await response.json()
            if (data.success) {
                toast.success(`Appointment ${newStatus}`)
                loadAppointments()
                loadStats()
            } else {
                toast.error('Failed to update appointment')
            }
        } catch (error) {
            console.error('Error updating appointment:', error)
            toast.error('Failed to update appointment')
        }
    }

    const deleteAppointment = async (appointmentId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()
            if (data.success) {
                toast.success('Appointment deleted successfully')
                loadAppointments()
                loadStats()
                setShowDeleteConfirm(null)
            } else {
                toast.error('Failed to delete appointment')
            }
        } catch (error) {
            console.error('Error deleting appointment:', error)
            toast.error('Failed to delete appointment')
        }
    }

    const updateAppointment = async (appointmentId: string, updates: Partial<Appointment>) => {
        try {
            const response = await fetch(`${API_URL}/api/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            })

            const data = await response.json()
            if (data.success) {
                toast.success('Appointment updated successfully')
                loadAppointments()
                loadStats()
                setEditingAppointment(null)
            } else {
                toast.error('Failed to update appointment')
            }
        } catch (error) {
            console.error('Error updating appointment:', error)
            toast.error('Failed to update appointment')
        }
    }

    const createAppointment = async () => {
        try {
            const response = await fetch(`${API_URL}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAppointment)
            })

            const data = await response.json()
            if (data.success) {
                toast.success('Appointment created successfully')
                loadAppointments()
                loadStats()
                setShowNewAppointment(false)
                setNewAppointment({
                    title: '',
                    description: '',
                    scheduled_datetime: '',
                    duration_minutes: 30,
                    attendee_name: '',
                    attendee_phone: '',
                    attendee_email: ''
                })
            } else {
                toast.error('Failed to create appointment')
            }
        } catch (error) {
            console.error('Error creating appointment:', error)
            toast.error('Failed to create appointment')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2 text-white">
                    <Calendar className="w-6 h-6 animate-pulse" />
                    <span>Loading appointments...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Appointments</h1>
                    <p className="text-slate-400 mt-1">Manage your scheduled appointments and calendar</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all">
                        <Settings className="w-4 h-4" />
                        <span>Calendar Settings</span>
                    </button>
                    <button
                        onClick={() => setShowNewAppointment(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Appointment</span>
                    </button>
                </div>
            </div>

            {/* Smart Booking Insights */}
            {stats && stats.ai_booked > 0 && (
                <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-2xl border border-cyan-500/30 p-4 sm:p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-cyan-600/20 rounded-lg">
                            <Zap className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Smart Auto-Booking Active</h3>
                            <p className="text-sm text-slate-400">AI is automatically booking appointments from conversations</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-400">{stats.ai_booked}</div>
                            <div className="text-xs text-slate-400">Auto-Booked This Month</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400">
                                {stats.avg_ai_confidence ? `${(stats.avg_ai_confidence * 100).toFixed(0)}%` : '0%'}
                            </div>
                            <div className="text-xs text-slate-400">Average Confidence</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">
                                {stats.ai_booked > 0 ? Math.round((stats.ai_booked / stats.total_appointments) * 100) : 0}%
                            </div>
                            <div className="text-xs text-slate-400">Automation Rate</div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                            <Bot className="w-4 h-4 text-cyan-400" />
                            <span>
                                AI detects booking intent in <strong>11 Indian languages</strong> and automatically schedules appointments when confidence is high.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{stats.total_appointments}</div>
                            <div className="text-xs text-slate-400">Total</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{stats.scheduled}</div>
                            <div className="text-xs text-slate-400">Scheduled</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400">{stats.confirmed}</div>
                            <div className="text-xs text-slate-400">Confirmed</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{stats.completed}</div>
                            <div className="text-xs text-slate-400">Completed</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-400">{stats.cancelled}</div>
                            <div className="text-xs text-slate-400">Cancelled</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-400">{stats.no_shows}</div>
                            <div className="text-xs text-slate-400">No Shows</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                                <Zap className="w-4 h-4 text-cyan-400" />
                                <div className="text-2xl font-bold text-cyan-400">{stats.ai_booked}</div>
                            </div>
                            <div className="text-xs text-slate-400">Smart Auto-Booked</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">{stats.upcoming_appointments}</div>
                            <div className="text-xs text-slate-400">Upcoming</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-all">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                                <Brain className="w-4 h-4 text-indigo-400" />
                                <div className="text-2xl font-bold text-indigo-400">
                                    {stats.avg_ai_confidence ? `${(stats.avg_ai_confidence * 100).toFixed(0)}%` : '0%'}
                                </div>
                            </div>
                            <div className="text-xs text-slate-400">Avg AI Confidence</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="no_show">No Show</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Booking Source</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="all">All Sources</option>
                            <option value="ai_auto_booked">🤖 Smart Auto-Booked</option>
                            <option value="ai_detected">🔍 AI Detected</option>
                            <option value="manual">👤 Manual</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800">
                <div className="p-4 sm:p-6 border-b border-slate-800">
                    <h2 className="text-lg font-semibold text-white">
                        Appointments {selectedDate && `for ${new Date(selectedDate).toLocaleDateString()}`}
                    </h2>
                </div>

                {appointments.length === 0 ? (
                    <div className="p-8 text-center">
                        <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No appointments found for the selected criteria.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {appointments.map((appointment) => {
                            const { date, time } = formatDateTime(appointment.scheduled_datetime)

                            return (
                                <div key={appointment.id} className="p-4 sm:p-6 hover:bg-slate-800/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-medium text-white">{appointment.title}</h3>
                                                {getStatusBadge(appointment.status)}
                                                {getSmartBookingBadge(appointment)}
                                                {getConfidenceBadge(appointment)}
                                                {getLanguageBadge(appointment.detected_language)}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-400">
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{time} ({appointment.duration_minutes}min)</span>
                                                </div>
                                                {appointment.attendee_name && (
                                                    <div className="flex items-center space-x-2">
                                                        <User className="w-4 h-4" />
                                                        <span>{appointment.attendee_name}</span>
                                                    </div>
                                                )}
                                                {appointment.attendee_phone && (
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{appointment.attendee_phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {appointment.description && (
                                                <p className="text-sm text-slate-500 mt-2">{appointment.description}</p>
                                            )}

                                            {/* Smart Booking Details */}
                                            {(appointment.auto_booked || appointment.llm_reasoning || appointment.booking_message) && (
                                                <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Brain className="w-4 h-4 text-cyan-400" />
                                                        <span className="text-sm font-medium text-cyan-400">Smart Booking Details</span>
                                                    </div>

                                                    {appointment.booking_message && (
                                                        <div className="flex items-start space-x-2 mb-2">
                                                            <MessageSquare className="w-3 h-3 text-slate-400 mt-0.5" />
                                                            <p className="text-xs text-slate-300">{appointment.booking_message}</p>
                                                        </div>
                                                    )}

                                                    {appointment.llm_reasoning && (
                                                        <div className="flex items-start space-x-2 mb-2">
                                                            <Bot className="w-3 h-3 text-slate-400 mt-0.5" />
                                                            <p className="text-xs text-slate-400">
                                                                <span className="font-medium">AI Reasoning:</span> {appointment.llm_reasoning}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {appointment.time_preferences && (
                                                        <div className="flex items-start space-x-2">
                                                            <Clock className="w-3 h-3 text-slate-400 mt-0.5" />
                                                            <div className="text-xs text-slate-400">
                                                                <span className="font-medium">Detected Preferences:</span>
                                                                <div className="mt-1 flex flex-wrap gap-1">
                                                                    {appointment.time_preferences.preferred_days?.map((day: string) => (
                                                                        <span key={day} className="px-1.5 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs">
                                                                            {day}
                                                                        </span>
                                                                    ))}
                                                                    {appointment.time_preferences.preferred_times?.map((time: string) => (
                                                                        <span key={time} className="px-1.5 py-0.5 bg-green-600/20 text-green-400 rounded text-xs">
                                                                            {time}
                                                                        </span>
                                                                    ))}
                                                                    {appointment.time_preferences.specific_times?.map((time: string) => (
                                                                        <span key={time} className="px-1.5 py-0.5 bg-purple-600/20 text-purple-400 rounded text-xs">
                                                                            {time}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {appointment.status === 'scheduled' && (
                                                <button
                                                    onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {appointment.status === 'confirmed' && (
                                                <button
                                                    onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                                                >
                                                    Complete
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setEditingAppointment(appointment)}
                                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                                title="Edit appointment"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(appointment.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete appointment"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Edit Appointment Modal */}
            {
                editingAppointment && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-md shadow-xl">
                            <h3 className="text-xl font-semibold text-white mb-4">Edit Appointment</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={editingAppointment.title}
                                        onChange={(e) => setEditingAppointment({ ...editingAppointment, title: e.target.value })}
                                        className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                                    <textarea
                                        value={editingAppointment.description || ''}
                                        onChange={(e) => setEditingAppointment({ ...editingAppointment, description: e.target.value })}
                                        className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            value={new Date(editingAppointment.scheduled_datetime).toISOString().slice(0, 16)}
                                            onChange={(e) => setEditingAppointment({ ...editingAppointment, scheduled_datetime: e.target.value })}
                                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Duration (min)</label>
                                        <input
                                            type="number"
                                            value={editingAppointment.duration_minutes}
                                            onChange={(e) => setEditingAppointment({ ...editingAppointment, duration_minutes: parseInt(e.target.value) })}
                                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                            min="15"
                                            step="15"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Attendee Name</label>
                                    <input
                                        type="text"
                                        value={editingAppointment.attendee_name || ''}
                                        onChange={(e) => setEditingAppointment({ ...editingAppointment, attendee_name: e.target.value })}
                                        className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={editingAppointment.attendee_phone || ''}
                                            onChange={(e) => setEditingAppointment({ ...editingAppointment, attendee_phone: e.target.value })}
                                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={editingAppointment.attendee_email || ''}
                                            onChange={(e) => setEditingAppointment({ ...editingAppointment, attendee_email: e.target.value })}
                                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => setEditingAppointment(null)}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateAppointment(editingAppointment.id, {
                                        title: editingAppointment.title,
                                        description: editingAppointment.description,
                                        scheduled_datetime: editingAppointment.scheduled_datetime,
                                        duration_minutes: editingAppointment.duration_minutes,
                                        attendee_name: editingAppointment.attendee_name,
                                        attendee_phone: editingAppointment.attendee_phone,
                                        attendee_email: editingAppointment.attendee_email
                                    })}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-sm shadow-xl">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash className="w-8 h-8 text-red-400" />
                                </div>

                                <h3 className="text-xl font-semibold text-white mb-2">Delete Appointment</h3>
                                <p className="text-slate-400 mb-6">
                                    Are you sure you want to delete this appointment? This action cannot be undone.
                                </p>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(null)}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => deleteAppointment(showDeleteConfirm)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* New Appointment Modal */}
            {
                showNewAppointment && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-md shadow-xl">
                            <h3 className="text-xl font-semibold text-white mb-4">New Appointment</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={newAppointment.title}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                                        className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                        placeholder="Meeting with client"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                                    <textarea
                                        value={newAppointment.description}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                                        className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                        rows={3}
                                        placeholder="Meeting details..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Date & Time *</label>
                                        <input
                                            type="datetime-local"
                                            value={newAppointment.scheduled_datetime}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, scheduled_datetime: e.target.value })}
                                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Duration (min)</label>
                                        <select
                                            value={newAppointment.duration_minutes}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, duration_minutes: parseInt(e.target.value) })}
                                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value={15}>15 min</option>
                                            <option value={30}>30 min</option>
                                            <option value={45}>45 min</option>
                                            <option value={60}>60 min</option>
                                            <option value={90}>90 min</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Attendee Name</label>
                                    <input
                                        type="text"
                                        value={newAppointment.attendee_name}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, attendee_name: e.target.value })}
                                        className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={newAppointment.attendee_phone}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, attendee_phone: e.target.value })}
                                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                            placeholder="+1234567890"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={newAppointment.attendee_email}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, attendee_email: e.target.value })}
                                            className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-blue-500 focus:outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowNewAppointment(false)
                                        setNewAppointment({
                                            title: '',
                                            description: '',
                                            scheduled_datetime: '',
                                            duration_minutes: 30,
                                            attendee_name: '',
                                            attendee_phone: '',
                                            attendee_email: ''
                                        })
                                    }}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createAppointment}
                                    disabled={!newAppointment.title || !newAppointment.scheduled_datetime}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Create Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}