'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CalendarConnectedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orgId = searchParams.get('org');
  const calendarName = searchParams.get('calendar');

  useEffect(() => {
    // Redirect to appointments page after 5 seconds
    const timer = setTimeout(() => {
      router.push('/appointments?tab=settings');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Google Calendar Connected!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your Google Calendar has been successfully connected to CallAgent.
          </p>
          
          {calendarName && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="text-sm text-green-800">
                <p className="font-medium">Connected Calendar: {decodeURIComponent(calendarName)}</p>
                {orgId && <p>Organization ID: {orgId}</p>}
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• AI will now automatically detect appointment requests</li>
                <li>• High-confidence bookings will be created automatically</li>
                <li>• You can view and manage appointments in the calendar</li>
                <li>• Manual booking is also available</li>
              </ul>
            </div>

            <button
              onClick={() => router.push('/appointments')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Calendar
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            You will be automatically redirected in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}