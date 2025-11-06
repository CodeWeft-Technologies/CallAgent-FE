'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '../../components/CalendarView';
import { BookingWidget } from '../../components/BookingWidget';
import { OrgSettings } from '../../components/OrgSettings';
import { useCalendar } from '../../hooks/useCalendar';
import { 
  Calendar,
  Plus,
  Settings,
  BarChart3,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  RefreshCw
} from 'lucide-react';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'booking' | 'settings' | 'analytics'>('calendar');
  const [organizationId, setOrganizationId] = useState<number>(1); // This should come from auth context
  const { calendarStatus, events, loading, checkCalendarStatus, fetchEvents } = useCalendar();

  // Get organization info from auth context or API
  useEffect(() => {
    // TODO: Get actual organization ID from auth context
    // For now, using hardcoded value
  }, []);

  const tabs = [
    { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'View appointments' },
    { id: 'booking', name: 'Book Appointment', icon: Plus, description: 'Schedule manually' },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'Configure calendar' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'View insights' },
  ];

  const handleBookingComplete = (booking: any) => {
    // Switch to calendar view after successful booking
    setActiveTab('calendar');
  };

  const handleRefresh = () => {
    checkCalendarStatus();
    // Also refresh events to catch realtime bookings
    if (calendarStatus.connected) {
      fetchEvents();
    }
  };

  // Auto-refresh when calendar is updated via realtime booking
  useEffect(() => {
    const handleCalendarRefresh = () => {
      console.log('📅 Auto-refreshing calendar due to realtime booking');
      if (calendarStatus.connected) {
        fetchEvents();
      }
    };

    // Listen for custom calendar refresh events
    window.addEventListener('calendar-refresh', handleCalendarRefresh);
    
    return () => {
      window.removeEventListener('calendar-refresh', handleCalendarRefresh);
    };
  }, [calendarStatus.connected, fetchEvents]);

  // Calculate analytics
  const thisMonthEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    const now = new Date();
    return eventDate.getMonth() === now.getMonth() && 
           eventDate.getFullYear() === now.getFullYear();
  });

  const aiBookings = events.filter(event => 
    event.description?.includes('AI assistant') || event.description?.includes('Automated')
  );

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    const now = new Date();
    return eventDate > now;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-800/50 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Appointments
                  </h1>
                  <p className="text-slate-400 text-lg">Smart Calendar Management & Booking</p>
                </div>
              </div>
              <p className="text-slate-300 max-w-2xl">Manage appointments, schedule meetings, and track calendar integrations with intelligent booking automation</p>
              <div className="flex items-center space-x-2 mt-2">
                {calendarStatus.connected ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-slate-400">Calendar: <span className="text-emerald-400 font-medium">{calendarStatus.calendar_name}</span></span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm text-slate-400">Status: <span className="text-amber-400 font-medium">Not Connected</span></span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="group flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                <span className="text-sm font-medium">Refresh Calendar</span>
              </button>
              
              <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border ${
                calendarStatus.connected 
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/20'
              }`}>
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    calendarStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></div>
                  <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-75 ${
                    calendarStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></div>
                </div>
                <span className={`text-sm font-medium ${
                  calendarStatus.connected ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {calendarStatus.connected ? 'Calendar Connected' : 'Calendar Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 via-slate-700/20 to-slate-800/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-2">
          {/* Mobile Tab Selector */}
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="block w-full py-3 px-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.name} - {tab.description}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs */}
          <nav className="hidden sm:flex space-x-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-700'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 transition-colors ${
                    activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-white'
                  }`} />
                  <div className="text-left">
                    <div>{tab.name}</div>
                    <div className={`text-xs font-normal ${
                      activeTab === tab.id ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-300'
                    }`}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Total Events</p>
                    <p className="text-3xl font-bold text-white">{events.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Upcoming</p>
                    <p className="text-3xl font-bold text-white">{upcomingEvents.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">This Month</p>
                    <p className="text-3xl font-bold text-white">{thisMonthEvents.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-amber-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">AI Bookings</p>
                    <p className="text-3xl font-bold text-white">{aiBookings.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-900/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-3xl border border-slate-800/50 overflow-hidden">
              <div className="p-6 border-b border-slate-800/50">
                <h2 className="text-xl font-bold text-white">Calendar View</h2>
                <p className="text-slate-400 mt-1">View and manage your appointments</p>
              </div>
              <CalendarView organizationId={organizationId} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'booking' && (
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-900/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-3xl border border-slate-800/50 overflow-hidden">
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-xl font-bold text-white">Book Appointment</h2>
                    <p className="text-slate-400 mt-1">Schedule a new appointment manually</p>
                  </div>
                  <div className="flex items-center space-x-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <Plus className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400 font-medium">Manual Booking</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <BookingWidget 
                  organizationId={organizationId}
                  onBookingComplete={handleBookingComplete}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-900/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-3xl border border-slate-800/50 overflow-hidden">
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Calendar Settings</h2>
                    <p className="text-slate-400 mt-1">Configure your Google Calendar integration</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <OrgSettings 
                  organizationId={organizationId}
                  organizationName="Your Organization"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
                  <p className="text-slate-400 mt-1">View appointment statistics and insights</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Total Appointments</p>
                    <p className="text-3xl font-bold text-white">{events.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-300 font-medium">+12%</span>
                  </div>
                  <span className="text-sm text-slate-400">vs last month</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">This Month</p>
                    <p className="text-3xl font-bold text-white">{thisMonthEvents.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500/10 rounded-lg">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-300 font-medium">{upcomingEvents.length}</span>
                  </div>
                  <span className="text-sm text-slate-400">upcoming</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">AI Bookings</p>
                    <p className="text-3xl font-bold text-white">{aiBookings.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-purple-500/10 rounded-lg">
                    <span className="text-sm text-purple-300 font-medium">
                      {events.length > 0 ? Math.round((aiBookings.length / events.length) * 100) : 0}%
                    </span>
                  </div>
                  <span className="text-sm text-slate-400">automated</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden">
              <div className={`absolute inset-0 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 ${
                calendarStatus.connected 
                  ? 'bg-gradient-to-br from-emerald-600/20 to-emerald-800/20'
                  : 'bg-gradient-to-br from-red-600/20 to-red-800/20'
              }`}></div>
              <div className={`relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 transition-all duration-300 hover:transform hover:scale-105 ${
                calendarStatus.connected 
                  ? 'hover:border-emerald-500/30'
                  : 'hover:border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Connection Status</p>
                    <p className="text-lg font-semibold text-white">
                      {calendarStatus.connected ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                    calendarStatus.connected 
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:shadow-emerald-500/25'
                      : 'bg-gradient-to-br from-red-500 to-red-600 group-hover:shadow-red-500/25'
                  }`}>
                    {calendarStatus.connected ? (
                      <CheckCircle className="w-7 h-7 text-white" />
                    ) : (
                      <AlertCircle className="w-7 h-7 text-white" />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    calendarStatus.connected ? 'bg-emerald-400' : 'bg-red-400'
                  }`} />
                  <span className="text-sm text-slate-400">
                    {calendarStatus.connected ? 'Sync active' : 'Setup required'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-900/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-3xl border border-slate-800/50">
              <div className="px-6 py-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BarChart3 className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                  Advanced Analytics Coming Soon
                </h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  Get detailed insights into booking trends, conversion rates, peak hours, 
                  and AI performance metrics to optimize your appointment scheduling.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-slate-300">Booking Trends</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-slate-300">Customer Insights</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg">
                    <Activity className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-slate-300">AI Performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}