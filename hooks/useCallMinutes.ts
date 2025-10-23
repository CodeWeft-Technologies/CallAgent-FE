'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface MinutesAvailability {
  available: boolean;
  minutes_remaining: number;
  message: string;
  organization_id: number;
  warning_type?: 'negative_balance' | 'low_balance' | 'normal' | 'no_allocation' | 'credit_limit_exceeded';
  extra_minutes_deficit?: number;
  credit_limit_reached?: boolean;
}

interface UseCallMinutesReturn {
  checkMinutesAvailability: (estimatedDuration?: number) => Promise<MinutesAvailability>;
  consumeMinutes: (callData: ConsumeMinutesData) => Promise<void>;
  isChecking: boolean;
  isConsuming: boolean;
  error: string | null;
}

interface ConsumeMinutesData {
  call_id: string;
  minutes_consumed: number;
  call_start_time: Date;
  call_end_time: Date;
  user_id?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000';

export const useCallMinutes = (): UseCallMinutesReturn => {
  const { user, token } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isConsuming, setIsConsuming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkMinutesAvailability = useCallback(async (estimatedDuration?: number): Promise<MinutesAvailability> => {
    if (!user || !token || !user.organization_id) {
      throw new Error('User not authenticated or organization not found');
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/call-minutes/check-availability`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organization_id: user.organization_id,
          estimated_duration_minutes: estimatedDuration
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to check minutes availability');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to check minutes availability';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsChecking(false);
    }
  }, [user, token]);

  const consumeMinutes = useCallback(async (callData: ConsumeMinutesData): Promise<void> => {
    if (!user || !token || !user.organization_id) {
      throw new Error('User not authenticated or organization not found');
    }

    setIsConsuming(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/call-minutes/consume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organization_id: user.organization_id,
          call_id: callData.call_id,
          minutes_consumed: callData.minutes_consumed,
          call_start_time: callData.call_start_time.toISOString(),
          call_end_time: callData.call_end_time.toISOString(),
          user_id: callData.user_id || user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to consume minutes');
      }

      // Successfully consumed minutes
      console.log('Minutes consumed successfully:', callData.minutes_consumed);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to consume minutes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsConsuming(false);
    }
  }, [user, token]);

  return {
    checkMinutesAvailability,
    consumeMinutes,
    isChecking,
    isConsuming,
    error
  };
};