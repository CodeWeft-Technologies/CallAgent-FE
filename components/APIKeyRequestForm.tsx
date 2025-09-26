'use client'

import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Send, AlertCircle, CheckCircle, Key } from 'lucide-react'

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

interface APIKeyRequestFormProps {
  onRequestSubmitted?: () => void
}

export default function APIKeyRequestForm({ onRequestSubmitted }: APIKeyRequestFormProps) {
  const { user, token } = useAuth()
  const [formData, setFormData] = useState({
    stt_provider: '',
    llm_provider: '',
    tts_provider: '',
    business_justification: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const providerOptions = {
    stt: [
      { value: 'deepgram', label: 'Deepgram' },
      { value: 'google', label: 'Google Speech-to-Text' },
      { value: 'assemblyai', label: 'AssemblyAI' }
    ],
    llm: [
      { value: 'groq', label: 'Groq' },
      { value: 'openai', label: 'OpenAI' },
      { value: 'google', label: 'Google Gemini' }
    ],
    tts: [
      { value: 'cartesia', label: 'Cartesia' },
      { value: 'google', label: 'Google Text-to-Speech' },
      { value: 'elevenlabs', label: 'ElevenLabs' }
    ]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setSubmitStatus('idle')
    setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setErrorMessage('Authentication required')
      setSubmitStatus('error')
      return
    }

    // Validate required fields
    if (!formData.business_justification.trim()) {
      setErrorMessage('Business justification is required')
      setSubmitStatus('error')
      return
    }

    if (!formData.stt_provider && !formData.llm_provider && !formData.tts_provider) {
      setErrorMessage('At least one provider must be specified')
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/api/organization-requests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          stt_provider: '',
          llm_provider: '',
          tts_provider: '',
          business_justification: ''
        })
        onRequestSubmitted?.()
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.detail || 'Failed to submit request')
        setSubmitStatus('error')
      }
    } catch (error) {
      setErrorMessage('Network error occurred')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Key className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Request API Keys</h3>
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Piopiy credentials (voice calling) are managed directly by your organization and are not available through this request system. Please contact your organization administrator to configure Piopiy credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STT Provider */}
        <div>
          <label htmlFor="stt_provider" className="block text-sm font-medium text-gray-700 mb-2">
            Speech-to-Text Provider
          </label>
          <select
            id="stt_provider"
            name="stt_provider"
            value={formData.stt_provider}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select STT Provider (Optional)</option>
            {providerOptions.stt.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* LLM Provider */}
        <div>
          <label htmlFor="llm_provider" className="block text-sm font-medium text-gray-700 mb-2">
            Language Model Provider
          </label>
          <select
            id="llm_provider"
            name="llm_provider"
            value={formData.llm_provider}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select LLM Provider (Optional)</option>
            {providerOptions.llm.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* TTS Provider */}
        <div>
          <label htmlFor="tts_provider" className="block text-sm font-medium text-gray-700 mb-2">
            Text-to-Speech Provider
          </label>
          <select
            id="tts_provider"
            name="tts_provider"
            value={formData.tts_provider}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select TTS Provider (Optional)</option>
            {providerOptions.tts.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Business Justification */}
        <div>
          <label htmlFor="business_justification" className="block text-sm font-medium text-gray-700 mb-2">
            Business Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            id="business_justification"
            name="business_justification"
            value={formData.business_justification}
            onChange={handleInputChange}
            rows={4}
            placeholder="Please explain why you need these API keys and how they will be used..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Status Messages */}
        {submitStatus === 'error' && errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">{errorMessage}</span>
          </div>
        )}

        {submitStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Request submitted successfully!</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !token}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Request
            </>
          )}
        </button>
      </form>
    </div>
  )
}