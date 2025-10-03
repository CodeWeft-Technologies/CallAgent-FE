'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function CalendarErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const errorMessage = searchParams.get('message') || 'An unknown error occurred';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Connection Failed
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We couldn't connect your Google Calendar.
          </p>
          
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-800">
              <p className="font-medium">Error Details:</p>
              <p className="mt-1">{decodeURIComponent(errorMessage)}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Common Solutions:</h3>
              <ul className="text-sm text-yellow-700 space-y-1 text-left">
                <li>• Make sure you granted calendar permissions</li>
                <li>• Check if your Google account has calendar access</li>
                <li>• Try clearing your browser cache and cookies</li>
                <li>• Ensure you're logged into the correct Google account</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/appointments?tab=settings')}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Settings
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}