'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface APIKeyRequest {
  id: number;
  stt_provider: string;
  llm_provider: string;
  tts_provider: string;
  business_justification: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at?: string;
}

interface APIKeyRequestStatusProps {
  refreshTrigger?: number;
}

const APIKeyRequestStatus: React.FC<APIKeyRequestStatusProps> = ({ refreshTrigger }) => {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<APIKeyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/organization-requests/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token, refreshTrigger]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Request Status</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Request Status</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchRequests}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Request Status</h2>
        <button
          onClick={fetchRequests}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No API key requests found.</p>
          <p className="text-sm mt-1">Submit a request to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Request #{request.id}</span>
                    <span className={getStatusBadge(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Requested: {formatDate(request.requested_at)}
                    {request.reviewed_at && (
                      <span className="ml-4">
                        Reviewed: {formatDate(request.reviewed_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">STT Provider:</span>
                  <p className="text-sm text-gray-900 capitalize">{request.stt_provider}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">LLM Provider:</span>
                  <p className="text-sm text-gray-900 capitalize">{request.llm_provider}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">TTS Provider:</span>
                  <p className="text-sm text-gray-900 capitalize">{request.tts_provider}</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">Business Justification:</span>
                <p className="text-sm text-gray-900 mt-1">{request.business_justification}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default APIKeyRequestStatus;