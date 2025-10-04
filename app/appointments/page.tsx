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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-xl">
            <Calendar className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Appointments</h1>
            <p className="text-slate-400 mt-1 flex items-center">
              {calendarStatus.connected ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                  Connected to {calendarStatus.calendar_name}
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-400 mr-2" />
                  Calendar not connected
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <div className={`px-3 py-2 rounded-full text-sm font-medium border ${
            calendarStatus.connected 
              ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-600/20 text-amber-400 border-amber-500/30'
          }`}>
            {calendarStatus.connected ? 'Connected' : 'Not Connected'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800">
        {/* Mobile Tab Selector */}
        <div className="sm:hidden mb-4">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="block w-full py-3 px-3 border border-slate-700 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name} - {tab.description}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tabs */}
        <nav className="hidden sm:flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 transition-colors ${
                  activeTab === tab.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'
                }`} />
                <div className="text-left">
                  <div>{tab.name}</div>
                  <div className="text-xs text-slate-500 font-normal">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-white">Calendar View</h2>
              <p className="text-slate-400 mt-1">View and manage your appointments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-lg">
                <Clock className="h-4 w-4 mr-2" />
                {upcomingEvents.length} upcoming
              </div>
              <div className="flex items-center text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-lg">
                <Users className="h-4 w-4 mr-2" />
                {events.length} total
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <CalendarView organizationId={organizationId} />
          </div>
        </div>
      )}

      {activeTab === 'booking' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-white">Book Appointment</h2>
              <p className="text-slate-400 mt-1">Schedule a new appointment manually</p>
            </div>
            <div className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm">
              Manual booking
            </div>
          </div>
          
          <div className="max-w-2xl">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <BookingWidget 
                organizationId={organizationId}
                onBookingComplete={handleBookingComplete}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Calendar Settings</h2>
            <p className="text-slate-400 mt-1">Configure your Google Calendar integration</p>
          </div>
          
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <OrgSettings 
              organizationId={organizationId}
              organizationName="Your Organization"
            />
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
            <p className="text-slate-400 mt-1">View appointment statistics and insights</p>
          </div>
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Appointments</p>
                  <p className="text-3xl font-bold text-white mt-2">{events.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                <span className="text-emerald-400 font-medium">+12%</span>
                <span className="text-slate-400 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">This Month</p>
                  <p className="text-3xl font-bold text-white mt-2">{thisMonthEvents.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Activity className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-slate-400">{upcomingEvents.length} upcoming</span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">AI Bookings</p>
                  <p className="text-3xl font-bold text-white mt-2">{aiBookings.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-400">
                {events.length > 0 ? Math.round((aiBookings.length / events.length) * 100) : 0}% automated
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Connection Status</p>
                  <p className="text-lg font-semibold text-white mt-2">
                    {calendarStatus.connected ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  calendarStatus.connected ? 'bg-emerald-600/20' : 'bg-red-600/20'
                }`}>
                  {calendarStatus.connected ? (
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  calendarStatus.connected ? 'bg-emerald-400' : 'bg-red-400'
                }`} />
                <span className="text-slate-400">
                  {calendarStatus.connected ? 'Sync active' : 'Setup required'}
                </span>
              </div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-slate-900 rounded-xl border border-slate-800">
            <div className="px-6 py-8 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Advanced Analytics Coming Soon
              </h3>
              <p className="text-slate-400 max-w-md mx-auto mb-6">
                Get detailed insights into booking trends, conversion rates, peak hours, 
                and AI performance metrics to optimize your appointment scheduling.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-slate-400">
                <div className="flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Booking Trends
                </div>
                <div className="flex items-center justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  Customer Insights
                </div>
                <div className="flex items-center justify-center">
                  <Activity className="h-4 w-4 mr-2" />
                  AI Performance
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}