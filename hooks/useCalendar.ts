import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// Types
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  attendees?: Array<{ email: string }>;
  htmlLink?: string;
}

interface AvailableSlot {
  start: string;
  end: string;
  display_time: string;
  duration: number;
}

interface GoogleCalendarStatus {
  connected: boolean;
  calendar_name?: string;
  calendar_id?: string;
  timezone?: string;
  last_sync?: string;
  message?: string;
}

interface BookingRequest {
  service: string;
  date: string;
  time: string;
  duration: number;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  notes?: string;
}

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState<GoogleCalendarStatus>({
    connected: false
  });
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);

  // Get API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Get auth token from localStorage or context
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      // Try both token storage methods
      const directToken = localStorage.getItem('auth_token');
      if (directToken) return directToken;
      
      // Check AuthContext storage
      const authData = localStorage.getItem('ai_agent_auth');
      if (authData) {
        try {
          const { token } = JSON.parse(authData);
          return token;
        } catch (error) {
          console.error('Error parsing auth data:', error);
        }
      }
    }
    return null;
  };

  // API headers with auth
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // Check Google Calendar connection status
  const checkCalendarStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/google/status`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setCalendarStatus(data.google_calendar || { connected: false });
      } else {
        setCalendarStatus({ connected: false, message: 'Failed to check status' });
      }
    } catch (error) {
      console.error('Error checking calendar status:', error);
      setCalendarStatus({ connected: false, message: 'Connection error' });
    }
  }, [API_BASE]);

  // Connect Google Calendar
  const connectGoogleCalendar = useCallback(async (organizationId: number) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/auth/google/start`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          organization_id: organizationId,
          redirect_uri: `${window.location.origin}/calendar/callback`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.auth_url) {
          // Redirect to Google OAuth
          window.location.href = data.auth_url;
        } else {
          toast.error('Failed to initiate Google Calendar connection');
        }
      } else {
        toast.error('Failed to connect Google Calendar');
      }
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      toast.error('Connection error occurred');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Disconnect Google Calendar
  const disconnectGoogleCalendar = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/auth/google/disconnect`, {
        method: 'POST',
        headers: getHeaders()
      });

      if (response.ok) {
        setCalendarStatus({ connected: false });
        setEvents([]);
        toast.success('Google Calendar disconnected successfully');
      } else {
        toast.error('Failed to disconnect Google Calendar');
      }
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      toast.error('Disconnection error occurred');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Fetch calendar events
  const fetchEvents = useCallback(async (startDate?: string, endDate?: string) => {
    if (!calendarStatus.connected) return;

    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await fetch(`${API_BASE}/api/calendar/events?${params}`, {
        headers: getHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform Google Calendar events to FullCalendar format
          const transformedEvents = data.data.events.map((event: any) => ({
            id: event.id,
            title: event.summary || 'Untitled Event',
            start: event.start?.dateTime || event.start?.date,
            end: event.end?.dateTime || event.end?.date,
            description: event.description,
            attendees: event.attendees,
            htmlLink: event.htmlLink,
            backgroundColor: event.colorId ? `#${event.colorId}` : '#3B82F6',
            borderColor: event.colorId ? `#${event.colorId}` : '#3B82F6'
          }));
          
          setEvents(transformedEvents);
        }
      } else {
        toast.error('Failed to fetch calendar events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Error loading calendar events');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, calendarStatus.connected]);

  // Check availability for a specific date
  const checkAvailability = useCallback(async (date: string, duration: number = 30, timePreference?: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/api/calendar/availability`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          date,
          duration,
          service: 'appointment',
          time_preference: timePreference
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAvailableSlots(data.data.available_slots || []);
          return data.data.available_slots || [];
        }
      } else {
        toast.error('Failed to check availability');
      }
      return [];
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Error checking availability');
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Book an appointment
  const bookAppointment = useCallback(async (booking: BookingRequest) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/api/calendar/book`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(booking)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Appointment booked successfully!');
          // Refresh events
          await fetchEvents();
          return data.data;
        } else {
          toast.error(data.message || 'Failed to book appointment');
        }
      } else {
        toast.error('Failed to book appointment');
      }
      return null;
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Error booking appointment');
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_BASE, fetchEvents]);

  // Cancel an appointment
  const cancelAppointment = useCallback(async (eventId: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/api/calendar/cancel`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ event_id: eventId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Appointment cancelled successfully');
          // Refresh events
          await fetchEvents();
          return true;
        } else {
          toast.error(data.message || 'Failed to cancel appointment');
        }
      } else {
        toast.error('Failed to cancel appointment');
      }
      return false;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Error cancelling appointment');
      return false;
    } finally {
      setLoading(false);
    }
  }, [API_BASE, fetchEvents]);

  // Test calendar connection
  const testConnection = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/auth/google/test-connection`, {
        headers: getHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Calendar connection is working!');
          return true;
        } else {
          toast.error(data.message || 'Calendar connection test failed');
        }
      } else {
        toast.error('Connection test failed');
      }
      return false;
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Connection test error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Initialize - check status on mount
  useEffect(() => {
    checkCalendarStatus();
  }, [checkCalendarStatus]);

  // Auto-refresh events when calendar is connected
  useEffect(() => {
    if (calendarStatus.connected) {
      fetchEvents();
    }
  }, [calendarStatus.connected, fetchEvents]);

  return {
    // State
    events,
    loading,
    calendarStatus,
    availableSlots,
    
    // Actions
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    checkCalendarStatus,
    fetchEvents,
    checkAvailability,
    bookAppointment,
    cancelAppointment,
    testConnection
  };
};