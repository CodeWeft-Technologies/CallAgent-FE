'use client';

import React, { useState } from 'react';
import { Save, X, Clock } from 'lucide-react';
import axios from 'axios';

interface CallMinutesConfig {
  minutes_allocated: number;
  is_active: boolean;
  allocation_note?: string;
}

interface CallMinutesManagerProps {
  organizationId: number;
  organizationName: string;
  onClose: () => void;
  onSave: () => void;
  initialConfig?: {
    total_minutes_allocated: number;
    is_active: boolean;
    allocation_note?: string;
  };
}

const CallMinutesManager = ({
  organizationId,
  organizationName,
  onClose,
  onSave,
  initialConfig
}: CallMinutesManagerProps) => {
  const [formData, setFormData] = useState<CallMinutesConfig>({
    minutes_allocated: initialConfig?.total_minutes_allocated || 0,
    is_active: initialConfig?.is_active || false,
    allocation_note: initialConfig?.allocation_note || ''
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (field: keyof CallMinutesConfig, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/call-minutes/allocate`,
        {
          organization_id: organizationId,
          minutes_to_allocate: formData.minutes_allocated,
          allocation_reason: formData.allocation_note
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Update active status if necessary
      if (initialConfig?.is_active !== formData.is_active) {
        const endpoint = formData.is_active 
          ? `/call-minutes/organization/${organizationId}/activate`
          : `/call-minutes/organization/${organizationId}/deactivate`;
          
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      }
      
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save changes');
      console.error('Error saving call minutes config:', err);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Call Minutes - {organizationName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minutes to Allocate
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.minutes_allocated}
              onChange={(e) => handleInputChange('minutes_allocated', parseInt(e.target.value))}
              min="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the total number of call minutes to allocate to this organization
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-active"
                  name="status"
                  checked={formData.is_active}
                  onChange={() => handleInputChange('is_active', true)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="status-active" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-inactive"
                  name="status"
                  checked={!formData.is_active}
                  onChange={() => handleInputChange('is_active', false)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="status-inactive" className="ml-2 text-sm text-gray-700">
                  Inactive
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Active status allows the organization to make calls using their allocated minutes
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allocation Note (Optional)
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.allocation_note}
              onChange={(e) => handleInputChange('allocation_note', e.target.value)}
              rows={3}
              placeholder="Add a note about this allocation"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {saving ? (
                <>
                  <span className="inline-block animate-spin mr-2">
                    <Clock className="w-4 h-4" />
                  </span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CallMinutesManager;