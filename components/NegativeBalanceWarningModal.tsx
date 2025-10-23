'use client'

import React from 'react'
import { AlertTriangle, X, Phone, CreditCard, DollarSign } from 'lucide-react'

interface NegativeBalanceWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
  minutesRemaining: number
  extraMinutesDeficit: number
  message: string
}

export default function NegativeBalanceWarningModal({
  isOpen,
  onClose,
  onProceed,
  minutesRemaining,
  extraMinutesDeficit,
  message
}: NegativeBalanceWarningModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-red-500/30 shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-400">Negative Balance Warning</h2>
              <p className="text-sm text-slate-400">Extra charges will apply</p>
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
          {/* Balance Status */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="w-5 h-5 text-red-400" />
              <span className="font-medium text-red-400">Account Balance</span>
            </div>
            <div className="text-2xl font-bold text-red-300">
              {minutesRemaining} minutes
            </div>
            {extraMinutesDeficit > 0 && (
              <div className="text-sm text-red-400 mt-1">
                {extraMinutesDeficit} extra minutes already consumed
              </div>
            )}
          </div>

          {/* Warning Message */}
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-orange-400 font-medium mb-1">Important Notice</p>
                <p className="text-sm text-orange-300">{message}</p>
              </div>
            </div>
          </div>

          {/* Sales Contact Info */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-blue-400">Need to Recharge?</span>
            </div>
            <p className="text-sm text-blue-300 mb-3">
              Contact our sales team to add more minutes to your account and avoid extra charges.
            </p>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-slate-400">Email:</span>
                <span className="text-blue-400 ml-2">sales@audixa.ai</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-400">Phone:</span>
                <span className="text-blue-400 ml-2">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
          >
            Cancel Call
          </button>
          <button
            onClick={onProceed}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Proceed with Charges</span>
          </button>
        </div>
      </div>
    </div>
  )
}