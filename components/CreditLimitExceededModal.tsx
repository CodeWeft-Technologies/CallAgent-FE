'use client'

import React from 'react'
import { Ban, X, CreditCard, Phone, DollarSign, AlertTriangle } from 'lucide-react'

interface CreditLimitExceededModalProps {
  isOpen: boolean
  onClose: () => void
  minutesRemaining: number
  extraMinutesDeficit: number
  message: string
}

export default function CreditLimitExceededModal({
  isOpen,
  onClose,
  minutesRemaining,
  extraMinutesDeficit,
  message
}: CreditLimitExceededModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-red-600/50 shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-400">Credit Limit Exceeded</h2>
              <p className="text-sm text-slate-400">Account requires immediate recharge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Credit Limit Status */}
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Ban className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-400">Service Blocked</span>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-slate-400">Current Balance:</span>
                <span className="text-red-300 ml-2 font-bold">{minutesRemaining} minutes</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-400">Credit Deficit:</span>
                <span className="text-red-300 ml-2 font-bold">{extraMinutesDeficit} minutes</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-400">Credit Limit:</span>
                <span className="text-orange-300 ml-2 font-bold">-20 minutes maximum</span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-orange-400 font-medium mb-1">Account Suspended</p>
                <p className="text-sm text-orange-300">{message}</p>
              </div>
            </div>
          </div>

          {/* Immediate Action Required */}
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-blue-400">Immediate Recharge Required</span>
            </div>
            <p className="text-sm text-blue-300 mb-4">
              Your account has exceeded the maximum credit limit of -20 minutes. All calling services are suspended until payment is received.
            </p>
            <div className="space-y-3">
              <div className="bg-slate-800 rounded-lg p-3">
                <h4 className="text-white font-medium mb-2">Contact Sales Team Now:</h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-slate-400">Email:</span>
                    <a href="mailto:sales@audixa.ai" className="text-blue-400 ml-2 hover:underline">
                      sales@audixa.ai
                    </a>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-400">Phone:</span>
                    <a href="tel:+15551234567" className="text-blue-400 ml-2 hover:underline">
                      +1 (555) 123-4567
                    </a>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-400">Priority:</span>
                    <span className="text-red-400 ml-2 font-bold">URGENT - Account Suspended</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
          >
            <span>Understood - Contact Sales</span>
          </button>
        </div>
      </div>
    </div>
  )
}