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
  const { calendarStatus, events, loading, checkCalendarStatus } = useCalendar();

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
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Responsive Modern Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-0 sm:h-20 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  Appointments
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center mt-1">
                  {calendarStatus.connected ? (
                    <>
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 flex-shrink-0" />
                      <span className="truncate">Connected to {calendarStatus.calendar_name}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 mr-1 flex-shrink-0" />
                      <span>Calendar not connected</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {/* Responsive Header Actions */}
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-2 sm:px-3 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''} sm:mr-2`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              {/* Responsive Connection Status Badge */}
              <div className={`
                inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium
                ${calendarStatus.connected 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                }
              `}>
                <div className={`
                  w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-2
                  ${calendarStatus.connected ? 'bg-green-500' : 'bg-amber-500'}
                `} />
                <span className="hidden sm:inline">
                  {calendarStatus.connected ? 'Connected' : 'Not Connected'}
                </span>
                <span className="sm:hidden">
                  {calendarStatus.connected ? '●' : '○'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Tab Selector */}
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="block w-full py-3 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.name} - {tab.description}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop/Tablet Tabs */}
          <nav className="hidden sm:flex sm:space-x-4 lg:space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    group flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 lg:h-5 lg:w-5 mr-2 transition-colors ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  <div className="text-left">
                    <div className="text-sm lg:text-base">{tab.name}</div>
                    <div className="text-xs text-gray-400 font-normal hidden lg:block">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Responsive Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === 'calendar' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Responsive Calendar Header with Quick Stats */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Calendar View</h2>
                <p className="mt-1 text-sm text-gray-600">
                  View and manage your appointments in calendar format
                </p>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="font-medium">{upcomingEvents.length}</span>
                  <span className="hidden sm:inline ml-1">upcoming</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="font-medium">{events.length}</span>
                  <span className="hidden sm:inline ml-1">total</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <CalendarView organizationId={organizationId} />
            </div>
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Book Appointment</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Schedule a new appointment manually
                </p>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-md w-fit">
                Manual booking
              </div>
            </div>
            
            <div className="max-w-full sm:max-w-2xl">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <BookingWidget 
                  organizationId={organizationId}
                  onBookingComplete={handleBookingComplete}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Calendar Settings</h2>
              <p className="mt-1 text-sm text-gray-600">
                Configure your Google Calendar integration and preferences
              </p>
            </div>
            
            <div className="max-w-full lg:max-w-4xl">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <OrgSettings 
                  organizationId={organizationId}
                  organizationName="Your Organization"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="mt-1 text-sm text-gray-600">
                View appointment booking statistics and insights
              </p>
            </div>
            
            {/* Responsive Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Appointments</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{events.length}</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex-shrink-0 ml-3">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 flex-shrink-0" />
                  <span className="text-green-600 font-medium">+12%</span>
                  <span className="text-gray-500 ml-1 truncate">from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">This Month</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{thisMonthEvents.length}</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex-shrink-0 ml-3">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-1 flex-shrink-0" />
                  <span className="text-gray-500 truncate">
                    {upcomingEvents.length} upcoming
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">AI Bookings</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{aiBookings.length}</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex-shrink-0 ml-3">
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                  <span className="text-gray-500 truncate">
                    {events.length > 0 ? Math.round((aiBookings.length / events.length) * 100) : 0}% automated
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Connection Status</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1 sm:mt-2 truncate">
                      {calendarStatus.connected ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex-shrink-0 ml-3 ${
                    calendarStatus.connected ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {calendarStatus.connected ? (
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2 flex-shrink-0 ${
                    calendarStatus.connected ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-gray-500 truncate">
                    {calendarStatus.connected ? 'Sync active' : 'Setup required'}
                  </span>
                </div>
              </div>
            </div>

            {/* Responsive Coming Soon Section */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
              <div className="px-4 py-6 sm:px-6 sm:py-8 text-center">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg sm:rounded-xl mx-auto mb-3 sm:mb-4">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Advanced Analytics Coming Soon
                </h3>
                <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-4 sm:mb-6 px-4">
                  Get detailed insights into booking trends, conversion rates, peak hours, 
                  and AI performance metrics to optimize your appointment scheduling.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center justify-center py-2 sm:py-0">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    <span>Booking Trends</span>
                  </div>
                  <div className="flex items-center justify-center py-2 sm:py-0">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    <span>Customer Insights</span>
                  </div>
                  <div className="flex items-center justify-center py-2 sm:py-0">
                    <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    <span>AI Performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}