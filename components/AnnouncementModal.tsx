'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, AlertCircle, HelpCircle } from 'lucide-react'

interface AnnouncementContent {
  id?: number
  organization_id?: string | number
  content_type: 'announcement' | 'feedback'
  title: string
  content: string
  keywords: string[]
  is_active: boolean
  created_at?: string
  updated_at?: string
}

interface AnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: AnnouncementContent) => Promise<void>
  editingItem?: AnnouncementContent | null
  organizationId?: string
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  organizationId
}) => {
  const [formData, setFormData] = useState<AnnouncementContent>({
    content_type: 'announcement',
    title: '',
    content: '',
    keywords: [],
    is_active: true
  })
  
  const [newKeyword, setNewKeyword] = useState('')
  const [loading, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        keywords: [...(editingItem.keywords || [])]
      })
    } else {
      setFormData({
        content_type: 'announcement',
        title: '',
        content: '',
        keywords: [],
        is_active: true
      })
    }
    setErrors({})
  }, [editingItem, isOpen])

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    if (formData.content_type === 'feedback' && formData.keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required for feedback responses'
    }

    // Validate keyword length
    if (formData.content_type === 'feedback') {
      const invalidKeywords = formData.keywords.filter(k => k.trim().length < 3)
      if (invalidKeywords.length > 0) {
        newErrors.keywords = 'All keywords must be at least 3 characters long'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Add keyword
  const addKeyword = () => {
    const keyword = newKeyword.trim()
    if (keyword && keyword.length >= 3 && !formData.keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }))
      setNewKeyword('')
      // Clear keyword error if it exists
      if (errors.keywords) {
        setErrors(prev => ({ ...prev, keywords: '' }))
      }
    }
  }

  // Remove keyword
  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }))
  }

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      const dataToSave = {
        ...formData,
        organization_id: organizationId
      }
      await onSave(dataToSave)
      onClose()
    } catch (error) {
      console.error('Failed to save:', error)
      setErrors({ general: 'Failed to save. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  // Handle key press for adding keywords
  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {editingItem ? 'Edit Content' : 'Create New Content'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{errors.general}</span>
            </div>
          )}

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="content_type"
                  value="announcement"
                  checked={formData.content_type === 'announcement'}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    content_type: e.target.value as 'announcement' | 'feedback',
                    keywords: e.target.value === 'announcement' ? [] : prev.keywords
                  }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Announcement
                </span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="content_type"
                  value="feedback"
                  checked={formData.content_type === 'feedback'}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    content_type: e.target.value as 'announcement' | 'feedback'
                  }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Feedback Response
                </span>
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter a descriptive title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={
                formData.content_type === 'announcement' 
                  ? "Enter the announcement message that callers will hear"
                  : "Enter the response that will be played when feedback keywords are detected"
              }
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.content_type === 'announcement' 
                ? "This message will be played to callers when triggered manually or automatically."
                : "This response will be automatically played when any of the trigger keywords are detected in caller speech."
              }
            </p>
          </div>

          {/* Keywords (only for feedback) */}
          {formData.content_type === 'feedback' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Trigger Keywords *
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </label>
              
              {/* Add keyword input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={handleKeywordKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter keyword (min 3 characters)"
                  minLength={3}
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  disabled={!newKeyword.trim() || newKeyword.trim().length < 3}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              {/* Keywords list */}
              {formData.keywords.length > 0 && (
                <div className="space-y-2 mb-3">
                  <p className="text-sm text-gray-600">Current keywords:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {errors.keywords && (
                <p className="text-sm text-red-600">{errors.keywords}</p>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> When a caller says any of these keywords during the conversation, 
                  this response will be automatically played without using AI processing, ensuring fast and 
                  consistent responses.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Examples: "complaint", "feedback", "problem", "terrible service", "not satisfied"
                </p>
              </div>
            </div>
          )}

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (will be used in calls)
              </span>
            </label>
            <p className="text-sm text-gray-500 ml-6">
              Inactive content will be saved but won't be triggered during calls
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementModal