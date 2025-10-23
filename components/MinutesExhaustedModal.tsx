'use client';

import React from 'react';
import { X, Clock, AlertTriangle, Phone } from 'lucide-react';

interface MinutesExhaustedModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutesRemaining: number;
  organizationName?: string;
  message: string;
}

const MinutesExhaustedModal: React.FC<MinutesExhaustedModalProps> = ({
  isOpen,
  onClose,
  minutesRemaining,
  organizationName,
  message
}) => {
  if (!isOpen) return null;

  const handleContactSales = () => {
    // You can implement contact sales logic here
    // For now, we'll show contact information
    window.open('mailto:sales@audixa.ai?subject=Call Minutes Recharge Request', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Call Minutes Exhausted</h2>
              <p className="text-sm text-gray-500">Unable to proceed with call</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {organizationName && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Organization: {organizationName}</span>
              </div>
              <div className="text-sm text-gray-600">
                Minutes Remaining: <span className="font-semibold text-red-600">{minutesRemaining}</span>
              </div>
            </div>
          )}

          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-10 h-10 text-red-600" />
            </div>
            <p className="text-gray-700 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              To continue making calls, please purchase additional minutes from our sales team.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-4">
            <button
              onClick={handleContactSales}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Contact Audixa Sales Team
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>

          {/* Contact Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Sales Contact</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>📧 Email: sales@audixa.ai</div>
              <div>📞 Phone: +1 (555) 123-4567</div>
              <div>🕒 Hours: Mon-Fri 9AM-6PM EST</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinutesExhaustedModal;