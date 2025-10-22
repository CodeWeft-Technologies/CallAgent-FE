"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Alert, Button, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios, { AxiosError } from 'axios';

// Define interfaces for our data
interface MinutesData {
  organization_id: number;
  total_minutes_allocated: number;
  minutes_used: number;
  minutes_remaining: number;
  is_active: boolean;
}

interface User {
  organization_id: number;
  organization_name: string;
}

interface ApiError {
  detail?: string;
  message?: string;
}

/**
 * Component for displaying call minutes usage and alerts
 */
const CallMinutesTracker = () => {
  const { token, user } = useAuth();
  const [minutesData, setMinutesData] = useState<MinutesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showExhaustedDialog, setShowExhaustedDialog] = useState<boolean>(false);
  
  // Fetch call minutes data
  useEffect(() => {
    const fetchMinutesData = async () => {
      if (!user || !user.organization_id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/call-minutes/summary/${user.organization_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMinutesData(response.data);
        
        // Show exhausted dialog if minutes are depleted
        if (response.data.minutes_remaining <= 0 && response.data.total_minutes_allocated > 0) {
          setShowExhaustedDialog(true);
        }
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        setError(error.response?.data?.detail || 'Failed to load call minutes data');
        console.error('Error fetching call minutes data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && (user as User).organization_id) {
      fetchMinutesData();
    }
  }, [token, user]);

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

  // Handle dialog close
  const handleCloseDialog = () => {
    setShowExhaustedDialog(false);
  };

  // Handle support contact
  const handleContactSupport = () => {
    if (!user) return;
    
    // Open email client with pre-filled support email
    window.location.href = 'mailto:support@audixa.com?subject=Call%20Minutes%20Recharge%20Request&body=Organization%20ID:%20' + 
      (user as User).organization_id + '%0D%0AOrganization%20Name:%20' + (user as User).organization_name;
    setShowExhaustedDialog(false);
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Call Minutes Usage
          </Typography>
          
          {minutesData ? (
            <>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(calculatePercentageUsed(), 100)} 
                color={getStatusColor()}
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
              />
              
              <Typography variant="body2" color="text.secondary">
                {minutesData.minutes_used} / {minutesData.total_minutes_allocated} minutes used
                ({Math.min(calculatePercentageUsed(), 100).toFixed(1)}%)
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Minutes Remaining: <strong>{minutesData.minutes_remaining}</strong>
              </Typography>
              
              {minutesData.minutes_remaining <= 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Your organization has used all allocated call minutes. 
                  Please contact Audixa support to recharge.
                </Alert>
              )}
              
              {minutesData.minutes_remaining > 0 && minutesData.minutes_remaining < 60 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Your organization is running low on call minutes. 
                  Consider contacting support for a recharge soon.
                </Alert>
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No call minutes data available.
            </Typography>
          )}
        </CardContent>
      </Card>
      
      {/* Minutes Exhausted Dialog */}
      <Dialog open={showExhaustedDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          Call Minutes Exhausted
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1">
            Your organization has used all allocated call minutes. 
            You will not be able to make any new calls until more minutes are added to your account.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Please contact Audixa support team to recharge your account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleContactSupport}
          >
            Contact Support
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CallMinutesTracker;