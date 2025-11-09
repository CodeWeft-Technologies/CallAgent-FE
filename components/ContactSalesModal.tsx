"use client";

import React, { useState } from 'react';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: `I'm interested in ${feature} for my organization.`
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with actual contact form API
    console.log('Contact Sales Form:', formData);
    alert('Thank you! Our sales team will contact you within 24 hours.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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

          {/* Quick Contact Options */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <a
              href="mailto:sales@callagent.ai"
              className="flex flex-col items-center p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-xs text-slate-300">Email</span>
            </a>
            <a
              href="tel:+1-555-AGENT-AI"
              className="flex flex-col items-center p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5 text-green-400 mb-1" />
              <span className="text-xs text-slate-300">Call</span>
            </a>
            <button className="flex flex-col items-center p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5 text-purple-400 mb-1" />
              <span className="text-xs text-slate-300">Chat</span>
            </button>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Business Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Your company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Message
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                placeholder="Tell us about your needs..."
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Send Request
              </button>
            </div>
          </form>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Our sales team typically responds within 2 business hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactSalesModal;