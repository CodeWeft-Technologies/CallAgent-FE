'use client';

import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendar } from '../hooks/useCalendar';
import { 
  CalendarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface CalendarViewProps {
  organizationId: number;
}

interface EventDetails {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  attendees?: Array<{ email: string }>;
  htmlLink?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ organizationId }) => {
  const {
    events,
    loading,
    calendarStatus,
    fetchEvents,
    cancelAppointment
  } = useCalendar();

  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const calendarRef = useRef<FullCalendar>(null);

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start?.toISOString() || '',
      end: event.end?.toISOString() || '',
      description: event.extendedProps?.description,
      attendees: event.extendedProps?.attendees,
      htmlLink: event.extendedProps?.htmlLink
    });
    setShowEventModal(true);
  };

  // Handle date click
  const handleDateClick = (dateInfo: any) => {
    if (!calendarStatus.connected) {
      return;
    }
    setSelectedDate(dateInfo.dateStr);
    setShowCreateModal(true);
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const success = await cancelAppointment(eventId);
      if (success) {
        setShowEventModal(false);
        setSelectedEvent(null);
      }
    }
  };

  // Format date for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate event duration
  const getEventDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minutes`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  // Extract customer info from event description
  const extractCustomerInfo = (description?: string) => {
    if (!description) return null;
    
    const phoneMatch = description.match(/Phone:\s*([^\n]+)/);
    const emailMatch = description.match(/Email:\s*([^\n]+)/);
    const customerMatch = description.match(/Customer:\s*([^\n]+)/);
    
    return {
      name: customerMatch?.[1]?.trim() || 'Unknown',
      phone: phoneMatch?.[1]?.trim() || 'N/A',
      email: emailMatch?.[1]?.trim() || 'N/A'
    };
  };

  if (!calendarStatus.connected) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-8 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Google Calendar Not Connected
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Connect your Google Calendar to view and manage appointments
          </p>
          <div className="mt-6">
            <p className="text-xs text-gray-400">
              Go to Organization Settings to connect your calendar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Calendar</h3>
              <p className="text-sm text-gray-500">
                {calendarStatus.calendar_name} • {calendarStatus.timezone}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Syncing...
              </div>
            )}
            <button
              onClick={() => fetchEvents()}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-6">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          eventDisplay="block"
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
            startTime: '09:00',
            endTime: '17:00'
          }}
          weekends={true}
          nowIndicator={true}
          selectable={true}
          selectMirror={true}
          eventClassNames="cursor-pointer hover:opacity-80"
        />
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Appointment Details
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    {selectedEvent.title}
                  </h4>
                </div>

                {/* Time */}
                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(selectedEvent.start)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Duration: {getEventDuration(selectedEvent.start, selectedEvent.end)}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                {selectedEvent.description && (() => {
                  const customerInfo = extractCustomerInfo(selectedEvent.description);
                  return customerInfo ? (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{customerInfo.name}</span>
                      </div>
                      {customerInfo.phone !== 'N/A' && (
                        <div className="flex items-center">
                          <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{customerInfo.phone}</span>
                        </div>
                      )}
                      {customerInfo.email !== 'N/A' && (
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{customerInfo.email}</span>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}

                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Notes</h5>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <div>
                    {selectedEvent.htmlLink && (
                      <a
                        href={selectedEvent.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View in Google
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    {loading ? 'Cancelling...' : 'Cancel Appointment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create Appointment
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-4 text-base font-medium text-gray-900">
                  Manual Booking Coming Soon
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  Currently, appointments are created automatically through AI phone conversations.
                  Manual booking interface will be available soon.
                </p>
                <p className="mt-4 text-xs text-gray-400">
                  Selected date: {selectedDate}
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};