"use client";

import React from 'react';
import { X, Mail, Phone, MessageCircle } from 'lucide-react';

interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const ContactSalesModal: React.FC<ContactSalesModalProps> = ({
  isOpen,
  onClose,
  feature = "TTS Voice Options"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Contact Sales</h2>
              <p className="text-sm text-slate-400">Get enterprise features and pricing</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            {/* Email Contact */}
            <div className="flex items-center p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors group">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg mr-4">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">Email Sales Team</h4>
                <p className="text-sm text-slate-400 mb-2">Direct contact for pricing and demos</p>
                <a
                  href="mailto:sales@callagent.ai"
                  className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                >
                  sales@callagent.ai
                </a>
              </div>
            </div>

            {/* Phone Contact */}
            <div className="flex items-center p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors group">
              <div className="flex items-center justify-center w-12 h-12 bg-green-600/20 rounded-lg mr-4">
                <Phone className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">Call Sales</h4>
                <p className="text-sm text-slate-400 mb-2">Speak with our sales experts</p>
                <a
                  href="tel:+1-800-CALL-AGENT"
                  className="text-green-400 hover:text-green-300 font-medium text-sm"
                >
                  +1 (800) CALL-AGENT
                </a>
              </div>
            </div>

            {/* WhatsApp/Message Contact */}
            <div className="flex items-center p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors group">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg mr-4">
                <MessageCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">WhatsApp / Message</h4>
                <p className="text-sm text-slate-400 mb-2">Quick messaging support</p>
                <a
                  href="https://wa.me/18002255243"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-medium text-sm"
                >
                  +1 (800) 225-5243
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-xl">
            <h4 className="text-blue-200 font-medium mb-2">Need Help With {feature}?</h4>
            <p className="text-sm text-blue-300/80 mb-3">
              Our sales team can help you with enterprise features, custom pricing, and technical setup.
            </p>
            <p className="text-xs text-blue-400">
              📞 Available Monday-Friday, 9 AM - 6 PM EST
            </p>
          </div>

          {/* Close Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSalesModal;