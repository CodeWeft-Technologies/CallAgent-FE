'use client';

import React, { useState } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  LinkIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface OrgSettingsProps {
  organizationId: number;
  organizationName?: string;
}

export const OrgSettings: React.FC<OrgSettingsProps> = ({ 
  organizationId, 
  organizationName = 'Your Organization' 
}) => {
  const {
    calendarStatus,
    loading,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    checkCalendarStatus,
    testConnection
  } = useCalendar();

  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);

  const handleConnect = () => {
    connectGoogleCalendar(organizationId);
  };

  const handleDisconnect = async () => {
    await disconnectGoogleCalendar();
    setShowConfirmDisconnect(false);
  };

  const handleTestConnection = async () => {
    await testConnection();
  };

  const handleRefreshStatus = async () => {
    await checkCalendarStatus();
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <CalendarIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">
            Google Calendar Integration
          </h3>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Connect your Google Calendar to enable automatic appointment booking
        </p>
      </div>

      <div className="px-6 py-6">
        {/* Connection Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Connection Status</h4>
            <button
              onClick={handleRefreshStatus}
              disabled={loading}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="flex items-center">
            {calendarStatus.connected ? (
              <>
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Connected</p>
                  {calendarStatus.calendar_name && (
                    <p className="text-xs text-green-600">
                      Calendar: {calendarStatus.calendar_name}
                    </p>
                  )}
                  {calendarStatus.timezone && (
                    <p className="text-xs text-green-600">
                      Timezone: {calendarStatus.timezone}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Not Connected</p>
                  {calendarStatus.message && (
                    <p className="text-xs text-yellow-600">{calendarStatus.message}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {!calendarStatus.connected ? (
            <div>
              <button
                onClick={handleConnect}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                {loading ? 'Connecting...' : 'Connect Google Calendar'}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                You'll be redirected to Google to authorize calendar access for {organizationName}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  onClick={handleTestConnection}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  {loading ? 'Testing...' : 'Test Connection'}
                </button>

                <button
                  onClick={() => setShowConfirmDisconnect(true)}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Disconnect
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <CheckCircleIcon className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-medium text-blue-800">Calendar Connected Successfully</h4>
                    <div className="mt-2 text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>AI can now automatically book appointments</li>
                        <li>Availability is checked in real-time</li>
                        <li>Events sync with your Google Calendar</li>
                        <li>Customers receive calendar invitations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features List */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">AI Auto-Booking</p>
                <p className="text-xs text-gray-500">Automatically book appointments from phone calls</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Real-time Availability</p>
                <p className="text-xs text-gray-500">Check availability instantly during calls</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Calendar Sync</p>
                <p className="text-xs text-gray-500">Two-way sync with Google Calendar</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Multi-language Support</p>
                <p className="text-xs text-gray-500">Works with conversations in any language</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showConfirmDisconnect && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Disconnect Google Calendar
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to disconnect your Google Calendar? 
                    This will disable automatic appointment booking.
                  </p>
                </div>
                <div className="flex justify-center space-x-3 mt-4">
                  <button
                    onClick={() => setShowConfirmDisconnect(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};