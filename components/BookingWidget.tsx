'use client';

import React, { useState, useEffect } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface BookingWidgetProps {
  organizationId: number;
  className?: string;
  onBookingComplete?: (booking: any) => void;
}

interface AvailableSlot {
  start: string;
  end: string;
  display_time: string;
  duration: number;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ 
  organizationId, 
  className = '',
  onBookingComplete 
}) => {
  const {
    calendarStatus,
    availableSlots,
    loading,
    checkAvailability,
    bookAppointment
  } = useCalendar();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'consultation',
    notes: ''
  });
  const [step, setStep] = useState<'date' | 'slot' | 'info' | 'confirm'>('date');
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get date 30 days from now
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // Handle date selection
  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    
    // Check availability for selected date
    await checkAvailability(date, 30);
    setStep('slot');
  };

  // Handle slot selection
  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setStep('info');
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedSlot || !customerInfo.name) return;

    const bookingRequest = {
      service: customerInfo.service,
      date: selectedDate,
      time: new Date(selectedSlot.start).toTimeString().slice(0, 5), // HH:MM format
      duration: selectedSlot.duration,
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone || undefined,
      customer_email: customerInfo.email || undefined,
      notes: customerInfo.notes || undefined
    };

    const result = await bookAppointment(bookingRequest);
    
    if (result) {
      setBookingResult(result);
      setStep('confirm');
      onBookingComplete?.(result);
    }
  };

  // Reset widget
  const resetWidget = () => {
    setSelectedDate('');
    setSelectedSlot(null);
    setCustomerInfo({
      name: '',
      phone: '',
      email: '',
      service: 'consultation',
      notes: ''
    });
    setStep('date');
    setBookingResult(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!calendarStatus.connected) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Calendar Not Connected
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Connect Google Calendar to enable appointment booking
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <CalendarDaysIcon className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Book Appointment</h3>
            <p className="text-sm text-gray-500">Schedule a meeting with our team</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {['date', 'slot', 'info', 'confirm'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${step === stepName || (['slot', 'info', 'confirm'].includes(step) && index < ['date', 'slot', 'info', 'confirm'].indexOf(step))
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={`
                  w-12 h-0.5 mx-2
                  ${(['slot', 'info', 'confirm'].includes(step) && index < ['date', 'slot', 'info', 'confirm'].indexOf(step))
                    ? 'bg-blue-600' 
                    : 'bg-gray-200'
                  }
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Date Selection */}
        {step === 'date' && (
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">Select a Date</h4>
            <input
              type="date"
              min={getTodayDate()}
              max={getMaxDate()}
              value={selectedDate}
              onChange={(e) => handleDateSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Select a date up to 30 days in advance
            </p>
          </div>
        )}

        {/* Step 2: Time Slot Selection */}
        {step === 'slot' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-gray-900">
                Available Times for {formatDate(selectedDate)}
              </h4>
              <button
                onClick={() => setStep('date')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Change Date
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <ArrowPathIcon className="h-6 w-6 text-blue-600 animate-spin mr-2" />
                <span className="text-sm text-gray-600">Checking availability...</span>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(slot)}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {slot.display_time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h5 className="mt-4 text-base font-medium text-gray-900">No Available Times</h5>
                <p className="mt-2 text-sm text-gray-500">
                  No available slots for this date. Please select a different date.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Customer Information */}
        {step === 'info' && selectedSlot && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-gray-900">Your Information</h4>
              <button
                onClick={() => setStep('slot')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Change Time
              </button>
            </div>

            {/* Selected slot summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <div className="flex items-center text-sm text-blue-800">
                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                {formatDate(selectedDate)} at {selectedSlot.display_time}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <select
                  value={customerInfo.service}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, service: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="consultation">Consultation</option>
                  <option value="demo">Product Demo</option>
                  <option value="meeting">General Meeting</option>
                  <option value="follow-up">Follow-up</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information or special requests"
                />
              </div>

              <button
                onClick={handleBooking}
                disabled={!customerInfo.name || loading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirm' && bookingResult && (
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h4 className="mt-4 text-lg font-medium text-gray-900">
              Appointment Booked Successfully!
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              Your appointment has been added to the calendar and you'll receive a confirmation.
            </p>
            
            <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="text-sm text-green-800">
                <p className="font-medium">{customerInfo.service}</p>
                <p>{formatDate(selectedDate)} at {selectedSlot?.display_time}</p>
                <p>Duration: {selectedSlot?.duration} minutes</p>
              </div>
            </div>

            <button
              onClick={resetWidget}
              className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Book Another Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};