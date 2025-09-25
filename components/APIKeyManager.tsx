'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Save, X } from 'lucide-react';

interface APIKeyConfig {
  stt_provider?: string;
  stt_api_key?: string;
  llm_provider?: string;
  llm_api_key?: string;
  tts_provider?: string;
  tts_api_key?: string;
}

interface APIKeyManagerProps {
  organizationId: number;
  organizationName: string;
  apiKeys?: APIKeyConfig;
  onSave: (orgId: number, apiKeys: APIKeyConfig) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const APIKeyManager: React.FC<APIKeyManagerProps> = ({
  organizationId,
  organizationName,
  apiKeys = {},
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<APIKeyConfig>({
    stt_provider: apiKeys.stt_provider || 'deepgram',
    stt_api_key: apiKeys.stt_api_key || '',
    llm_provider: apiKeys.llm_provider || 'groq',
    llm_api_key: apiKeys.llm_api_key || '',
    tts_provider: apiKeys.tts_provider || 'cartesia',
    tts_api_key: apiKeys.tts_api_key || ''
  });

  const [showKeys, setShowKeys] = useState({
    stt: false,
    llm: false,
    tts: false
  });

  const handleInputChange = (field: keyof APIKeyConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleKeyVisibility = (type: 'stt' | 'llm' | 'tts') => {
    setShowKeys(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = async () => {
    await onSave(organizationId, formData);
  };

  const providers = {
    stt: ['deepgram', 'google', 'azure', 'whisper'],
    llm: ['groq', 'openai', 'anthropic', 'google'],
    tts: ['cartesia', 'elevenlabs', 'google', 'azure']
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Configure API Keys - {organizationName}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* STT Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Speech-to-Text (STT)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider
                </label>
                <select
                  value={formData.stt_provider}
                  onChange={(e) => handleInputChange('stt_provider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {providers.stt.map(provider => (
                    <option key={provider} value={provider}>
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.stt ? 'text' : 'password'}
                    value={formData.stt_api_key}
                    onChange={(e) => handleInputChange('stt_api_key', e.target.value)}
                    placeholder="Enter STT API key"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('stt')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys.stt ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LLM Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Large Language Model (LLM)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider
                </label>
                <select
                  value={formData.llm_provider}
                  onChange={(e) => handleInputChange('llm_provider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {providers.llm.map(provider => (
                    <option key={provider} value={provider}>
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.llm ? 'text' : 'password'}
                    value={formData.llm_api_key}
                    onChange={(e) => handleInputChange('llm_api_key', e.target.value)}
                    placeholder="Enter LLM API key"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('llm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys.llm ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TTS Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Text-to-Speech (TTS)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider
                </label>
                <select
                  value={formData.tts_provider}
                  onChange={(e) => handleInputChange('tts_provider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {providers.tts.map(provider => (
                    <option key={provider} value={provider}>
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.tts ? 'text' : 'password'}
                    value={formData.tts_api_key}
                    onChange={(e) => handleInputChange('tts_api_key', e.target.value)}
                    placeholder="Enter TTS API key"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('tts')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys.tts ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save API Keys
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default APIKeyManager;