'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '../../components/CalendarView';
import { BookingWidget } from '../../components/BookingWidget';
import { OrgSettings } from '../../components/OrgSettings';
import { useCalendar } from '../../hooks/useCalendar';
import { 
  CalendarIcon, 
  Cog6ToothIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'booking' | 'settings' | 'analytics'>('calendar');
  const [organizationId, setOrganizationId] = useState<number>(1); // This should come from auth context
  const { calendarStatus, events, loading } = useCalendar();

  // Get organization info from auth context or API
  useEffect(() => {
    // TODO: Get actual organization ID from auth context
    // For now, using hardcoded value
  }, []);

  const tabs = [
    { id: 'calendar', name: 'Calendar', icon: CalendarIcon },
    { id: 'booking', name: 'Book Appointment', icon: PlusIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ];

  const handleBookingComplete = (booking: any) => {
    // Switch to calendar view after successful booking
    setActiveTab('calendar');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Google Calendar Integration
                </h1>
                <p className="text-sm text-gray-500">
                  {calendarStatus.connected 
                    ? `Connected to ${calendarStatus.calendar_name}` 
                    : 'Calendar not connected'
                  }
                </p>
              </div>
            </div>
            
            {/* Connection Status Indicator */}
            <div className="flex items-center">
              <div className={`
                flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${calendarStatus.connected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
                }
              `}>
                <div className={`
                  w-2 h-2 rounded-full mr-2
                  ${calendarStatus.connected ? 'bg-green-500' : 'bg-yellow-500'}
                `} />
                {calendarStatus.connected ? 'Connected' : 'Not Connected'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calendar' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Calendar View</h2>
              <p className="mt-1 text-sm text-gray-600">
                View and manage your appointments in calendar format
              </p>
            </div>
            <CalendarView organizationId={organizationId} />
          </div>
        )}

        {activeTab === 'booking' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
              <p className="mt-1 text-sm text-gray-600">
                Schedule a new appointment manually
              </p>
            </div>
            <div className="max-w-2xl">
              <BookingWidget 
                organizationId={organizationId}
                onBookingComplete={handleBookingComplete}
              />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Calendar Settings</h2>
              <p className="mt-1 text-sm text-gray-600">
                Configure your Google Calendar integration
              </p>
            </div>
            <div className="max-w-4xl">
              <OrgSettings 
                organizationId={organizationId}
                organizationName="Your Organization"
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
              <p className="mt-1 text-sm text-gray-600">
                View appointment booking statistics and insights
              </p>
            </div>
            
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CalendarIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Appointments
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {events.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          This Month
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {events.filter(event => {
                            const eventDate = new Date(event.start);
                            const now = new Date();
                            return eventDate.getMonth() === now.getMonth() && 
                                   eventDate.getFullYear() === now.getFullYear();
                          }).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`
                        w-6 h-6 rounded-full
                        ${calendarStatus.connected ? 'bg-green-500' : 'bg-red-500'}
                      `} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Calendar Status
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {calendarStatus.connected ? 'Connected' : 'Disconnected'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <PlusIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          AI Bookings
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {events.filter(event => 
                            event.description?.includes('AI assistant')
                          ).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Message */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-8 text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Detailed Analytics Coming Soon
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Advanced analytics including booking trends, conversion rates, 
                  and AI performance metrics will be available soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}