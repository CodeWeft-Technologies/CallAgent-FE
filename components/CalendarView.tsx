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
  EnvelopeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';

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
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
        <div className="px-6 py-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-amber-600/20 rounded-xl mx-auto mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Google Calendar Not Connected
          </h3>
          <p className="text-slate-400 mb-6">
            Connect your Google Calendar to view and manage appointments
          </p>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-sm text-slate-300">
              Go to <span className="text-blue-400 font-medium">Organization Settings</span> to connect your calendar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600/20 rounded-lg mr-3">
              <CalendarIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Calendar</h3>
              <p className="text-sm text-slate-400 flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-emerald-400 mr-1" />
                {calendarStatus.calendar_name} • {calendarStatus.timezone}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {loading && (
              <div className="flex items-center text-sm text-slate-400">
                <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                Syncing...
              </div>
            )}
            <button
              onClick={() => fetchEvents()}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 border border-slate-700"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-6">
        <div className="calendar-dark-theme">
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
            eventClassNames="cursor-pointer hover:opacity-90 transition-opacity"
            eventBackgroundColor="#3B82F6"
            eventBorderColor="#2563EB"
            eventTextColor="#FFFFFF"
          />
        </div>
      </div>

      {/* Custom CSS for dark theme */}
      <style jsx>{`
        .calendar-dark-theme :global(.fc) {
          background-color: transparent;
          color: #F1F5F9;
        }
        
        .calendar-dark-theme :global(.fc-theme-standard .fc-scrollgrid) {
          border-color: #334155;
        }
        
        .calendar-dark-theme :global(.fc-theme-standard td, .fc-theme-standard th) {
          border-color: #334155;
        }
        
        .calendar-dark-theme :global(.fc-col-header-cell) {
          background-color: #1E293B;
          color: #94A3B8;
          font-weight: 600;
        }
        
        .calendar-dark-theme :global(.fc-daygrid-day) {
          background-color: transparent;
        }
        
        .calendar-dark-theme :global(.fc-daygrid-day:hover) {
          background-color: #1E293B;
        }
        
        .calendar-dark-theme :global(.fc-day-today) {
          background-color: #1E293B !important;
        }
        
        .calendar-dark-theme :global(.fc-day-today .fc-daygrid-day-number) {
          color: #3B82F6;
          font-weight: bold;
        }
        
        .calendar-dark-theme :global(.fc-daygrid-day-number) {
          color: #F1F5F9;
          font-weight: 500;
        }
        
        .calendar-dark-theme :global(.fc-button) {
          background-color: #374151;
          border-color: #4B5563;
          color: #F9FAFB;
        }
        
        .calendar-dark-theme :global(.fc-button:hover) {
          background-color: #4B5563;
          border-color: #6B7280;
        }
        
        .calendar-dark-theme :global(.fc-button:disabled) {
          background-color: #1F2937;
          border-color: #374151;
          color: #6B7280;
        }
        
        .calendar-dark-theme :global(.fc-toolbar-title) {
          color: #F1F5F9;
          font-weight: 600;
        }
        
        .calendar-dark-theme :global(.fc-event) {
          background-color: #3B82F6;
          border-color: #2563EB;
          color: #FFFFFF;
          border-radius: 6px;
          font-weight: 500;
        }
        
        .calendar-dark-theme :global(.fc-event:hover) {
          background-color: #2563EB;
          border-color: #1D4ED8;
        }
        
        .calendar-dark-theme :global(.fc-event-title) {
          color: #FFFFFF;
        }
        
        .calendar-dark-theme :global(.fc-event-time) {
          color: #E2E8F0;
        }
        
        .calendar-dark-theme :global(.fc-more-link) {
          color: #60A5FA;
        }
        
        .calendar-dark-theme :global(.fc-more-link:hover) {
          color: #3B82F6;
        }
        
        .calendar-dark-theme :global(.fc-popover) {
          background-color: #1E293B;
          border-color: #334155;
        }
        
        .calendar-dark-theme :global(.fc-popover-header) {
          background-color: #0F172A;
          color: #F1F5F9;
        }
        
        .calendar-dark-theme :global(.fc-timegrid-slot) {
          border-color: #334155;
        }
        
        .calendar-dark-theme :global(.fc-timegrid-slot-label) {
          color: #94A3B8;
        }
        
        .calendar-dark-theme :global(.fc-now-indicator-line) {
          border-color: #EF4444;
        }
        
        .calendar-dark-theme :global(.fc-now-indicator-arrow) {
          border-top-color: #EF4444;
        }
      `}</style>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border border-slate-700 w-full max-w-md shadow-2xl rounded-xl bg-slate-900">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl leading-6 font-semibold text-white">
                  Appointment Details
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white">
                    {selectedEvent.title}
                  </h4>
                </div>

                {/* Time */}
                <div className="flex items-start bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600/20 rounded-lg mr-3">
                    <ClockIcon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {formatDateTime(selectedEvent.start)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Duration: {getEventDuration(selectedEvent.start, selectedEvent.end)}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                {selectedEvent.description && (() => {
                  const customerInfo = extractCustomerInfo(selectedEvent.description);
                  return customerInfo ? (
                    <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                      <h5 className="text-sm font-medium text-slate-300 mb-3">Customer Information</h5>
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-600/20 rounded-lg mr-3">
                          <UserIcon className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className="text-sm text-white">{customerInfo.name}</span>
                      </div>
                      {customerInfo.phone !== 'N/A' && (
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-600/20 rounded-lg mr-3">
                            <PhoneIcon className="h-4 w-4 text-purple-400" />
                          </div>
                          <span className="text-sm text-white">{customerInfo.phone}</span>
                        </div>
                      )}
                      {customerInfo.email !== 'N/A' && (
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-8 h-8 bg-amber-600/20 rounded-lg mr-3">
                            <EnvelopeIcon className="h-4 w-4 text-amber-400" />
                          </div>
                          <span className="text-sm text-white">{customerInfo.email}</span>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}

                {/* Description */}
                {selectedEvent.description && (
                  <div className="bg-slate-800 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-slate-300 mb-2">Notes</h5>
                    <p className="text-sm text-white whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between pt-6 border-t border-slate-700">
                  <div>
                    {selectedEvent.htmlLink && (
                      <a
                        href={selectedEvent.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View in Google
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-500/30 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border border-slate-700 w-full max-w-md shadow-2xl rounded-xl bg-slate-900">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl leading-6 font-semibold text-white">
                  Create Appointment
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-center py-8">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-xl mx-auto mb-4">
                  <CalendarIcon className="h-8 w-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  Manual Booking Coming Soon
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                  Currently, appointments are created automatically through AI phone conversations.
                  Manual booking interface will be available soon.
                </p>
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-xs text-slate-300">
                    Selected date: <span className="text-blue-400 font-medium">{selectedDate}</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
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