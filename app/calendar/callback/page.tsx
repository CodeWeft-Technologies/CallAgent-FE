'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

export default function GoogleCalendarCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [calendarInfo, setCalendarInfo] = useState<any>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`OAuth error: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('Missing authorization code or state parameter');
          return;
        }

        // Get auth token from localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setStatus('error');
          setMessage('Authentication required. Please log in first.');
          return;
        }

        // Send callback data to backend
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_BASE}/auth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            code,
            organization_id: parseInt(state)
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStatus('success');
            setMessage('Google Calendar connected successfully!');
            setCalendarInfo(data.calendar_info);
            
            // Redirect to appointments page after 3 seconds
            setTimeout(() => {
              router.push('/appointments?tab=settings');
            }, 3000);
          } else {
            setStatus('error');
            setMessage(data.message || 'Failed to connect Google Calendar');
          }
        } else {
          setStatus('error');
          setMessage('Failed to process OAuth callback');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('An error occurred while connecting your calendar');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <ArrowPathIcon className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Connecting Calendar
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we connect your Google Calendar...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-600" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Calendar Connected!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {message}
              </p>
              {calendarInfo && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="text-sm text-green-800">
                    <p className="font-medium">Calendar: {calendarInfo.calendar_name}</p>
                    <p>Timezone: {calendarInfo.timezone}</p>
                  </div>
                </div>
              )}
              <p className="mt-4 text-xs text-gray-500">
                Redirecting to appointments page in a few seconds...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-600" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Connection Failed
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {message}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/appointments?tab=settings')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Settings
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}