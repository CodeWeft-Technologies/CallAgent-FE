"use client";

import React, { useState, useEffect } from 'react';
import { LinearProgress, Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { Phone, Clock, AlertCircle } from 'lucide-react';

interface MinutesData {
  organization_id: number;
  total_minutes_allocated: number;
  minutes_used: number;
  minutes_remaining: number;
  percentage_used: number;
  is_active: boolean;
  updated_at: string;
}

interface ResourceUsageMinutesProps {
  token: string | null;
  organizationId: number | null;
}

const API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000';

const ResourceUsageMinutes: React.FC<ResourceUsageMinutesProps> = ({ token, organizationId }) => {
  const [minutesData, setMinutesData] = useState<MinutesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch call minutes data
  const fetchMinutesData = async () => {
    if (!token || !organizationId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // Updated endpoint to match the backend route structure
      const response = await fetch(
        `${API_URL}/call-minutes/organization/${organizationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch minutes data');
      }
      
      const data = await response.json();
      setMinutesData(data);
    } catch (err) {
      console.error('Error fetching call minutes data:', err);
      setError('Failed to load call minutes data');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMinutesData();
    
    // Set up polling every 60 seconds to keep data fresh
    const intervalId = setInterval(fetchMinutesData, 60000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [token, organizationId]);

  // Calculate percentage used
  const calculatePercentageUsed = () => {
    if (!minutesData || minutesData.total_minutes_allocated === 0) {
      return 0;
    }
    return (minutesData.minutes_used / minutesData.total_minutes_allocated) * 100;
  };

  // Determine status color
  const getStatusColor = (): 'error' | 'warning' | 'success' | 'primary' => {
    if (!minutesData) return 'primary';
    
    const percentageUsed = calculatePercentageUsed();
    
    if (percentageUsed >= 90) return 'error';
    if (percentageUsed >= 75) return 'warning';
    return 'success';
  };

  // Format last updated time
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-slate-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Call Minutes Usage</h3>
        </div>
        <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
        <p className="text-slate-400 text-sm mt-2">Loading minutes data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-700 rounded-lg p-6">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!minutesData) {
    return (
      <div className="bg-slate-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Call Minutes Usage</h3>
        </div>
        <Alert severity="info">No call minutes data available for this organization.</Alert>
      </div>
    );
  }

  const percentageUsed = calculatePercentageUsed();
  const statusColor = getStatusColor();

  return (
    <div className="bg-slate-700 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
          <Phone className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Call Minutes Usage</h3>
          <p className="text-slate-400 text-xs">Real-time consumption tracking</p>
        </div>
        {!minutesData.is_active && (
          <div className="ml-auto px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
            Inactive
          </div>
        )}
        {minutesData.is_active && minutesData.minutes_remaining <= 0 && (
          <div className="ml-auto px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
            Exhausted
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(percentageUsed, 100)} 
                color={statusColor}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Box sx={{ minWidth: 45 }}>
              <Typography variant="body2" color="text.secondary">
                {percentageUsed.toFixed(1)}%
              </Typography>
            </Box>
          </Box>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-slate-600/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Total Minutes</p>
              <p className="text-xl font-bold text-white">{minutesData.total_minutes_allocated}</p>
            </div>
            <div className="text-center p-3 bg-slate-600/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Minutes Used</p>
              <p className="text-xl font-bold text-white">{minutesData.minutes_used}</p>
            </div>
            <div className="text-center p-3 bg-slate-600/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Minutes Left</p>
              <p className="text-xl font-bold text-white">{minutesData.minutes_remaining}</p>
            </div>
          </div>
        </div>
        
        {minutesData.minutes_remaining <= 60 && minutesData.minutes_remaining > 0 && (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            You're running low on call minutes. Contact support to allocate more minutes.
          </Alert>
        )}
        
        {minutesData.minutes_remaining <= 0 && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Your organization has exhausted all allocated call minutes. Contact support immediately.
          </Alert>
        )}
        
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Last updated: {formatLastUpdated(minutesData.updated_at)}</span>
          </div>
          <button 
            onClick={fetchMinutesData}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceUsageMinutes;