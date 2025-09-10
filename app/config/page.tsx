'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Settings, RotateCcw, Save, MessageSquare, ArrowRight, FileText, Database, RefreshCw, Languages } from 'lucide-react'
import toast from 'react-hot-toast'

interface AgentConfig {
  greeting_message: string
  exit_message: string
  system_prompt: string
  knowledge_base_enabled: boolean
  knowledge_base: string
  max_retries: number
  retry_delay: number
}

const PROMPT_TEMPLATES = {
  'real-estate': {
    name: 'Real Estate Agent',
    prompt: 'You are a professional real estate agent. Help clients with property inquiries, scheduling viewings, and providing market information. Keep responses concise and professional.'
  },
  'customer-service': {
    name: 'Customer Service',
    prompt: 'You are a helpful customer service representative. Assist customers with inquiries, complaints, and general support. Be polite, patient, and solution-oriented.'
  },
  'sales': {
    name: 'Sales Agent',
    prompt: 'You are a skilled sales agent. Help prospects understand products/services, address objections, and guide them through the sales process. Be persuasive but not pushy.'
  },
  'appointment': {
    name: 'Appointment Booking',
    prompt: 'You are an appointment booking assistant. Help clients schedule, reschedule, or cancel appointments. Collect necessary information and confirm details.'
  },
  'generic': {
    name: 'Generic Assistant',
    prompt: 'You are a helpful AI assistant. Provide clear, concise answers to user questions. Be friendly and professional in all interactions.'
  }
}

const KNOWLEDGE_BASE_FIELDS = {
  'real-estate': [
    { key: 'company_name', label: 'Company Name', placeholder: 'Your Real Estate Company' },
    { key: 'services', label: 'Services Offered', placeholder: 'Buying, selling, renting, property management' },
    { key: 'areas', label: 'Service Areas', placeholder: 'City, neighborhoods, regions covered' },
    { key: 'contact_info', label: 'Contact Information', placeholder: 'Phone, email, office hours' }
  ],
  'customer-service': [
    { key: 'company_name', label: 'Company Name', placeholder: 'Your Company' },
    { key: 'products', label: 'Products/Services', placeholder: 'Main products or services offered' },
    { key: 'policies', label: 'Policies', placeholder: 'Return policy, warranty, shipping info' },
    { key: 'contact_info', label: 'Contact Information', placeholder: 'Support email, phone, hours' }
  ],
  'sales': [
    { key: 'company_name', label: 'Company Name', placeholder: 'Your Company' },
    { key: 'products', label: 'Products/Services', placeholder: 'What you sell' },
    { key: 'pricing', label: 'Pricing Information', placeholder: 'Price ranges, packages, discounts' },
    { key: 'benefits', label: 'Key Benefits', placeholder: 'Why choose your products/services' }
  ],
  'appointment': [
    { key: 'company_name', label: 'Company Name', placeholder: 'Your Business Name' },
    { key: 'services', label: 'Services Offered', placeholder: 'Types of appointments available' },
    { key: 'hours', label: 'Business Hours', placeholder: 'Available days and times' },
    { key: 'location', label: 'Location', placeholder: 'Address or virtual meeting info' }
  ],
  'generic': [
    { key: 'company_name', label: 'Company Name', placeholder: 'Your Company' },
    { key: 'about', label: 'About Us', placeholder: 'Brief company description' },
    { key: 'services', label: 'Services', placeholder: 'What you offer' },
    { key: 'contact', label: 'Contact Info', placeholder: 'How to reach you' }
  ]
}

const VOICE_OPTIONS: Record<string, { name: string; value: string }[]> = {
  'en-US': [
    { name: 'English (US) - Male', value: 'en-US-Standard-B' },
    { name: 'English (US) - Female', value: 'en-US-Standard-C' },
    { name: 'English (US) - Wavenet Male', value: 'en-US-Wavenet-D' },
    { name: 'English (US) - Wavenet Female', value: 'en-US-Wavenet-F' },
  ],
  'en-IN': [
    { name: 'English (India) - Chirp3 HD Achird', value: 'en-IN-Chirp3-HD-Achird' },
  ],
  'hi-IN': [
    { name: 'Hindi (India) - Female', value: 'hi-IN-Wavenet-A' },
    { name: 'Hindi (India) - Male', value: 'hi-IN-Wavenet-B' },
    { name: 'Hindi (India) - Female (Standard)', value: 'hi-IN-Standard-A' },
    { name: 'Hindi (India) - Male (Standard)', value: 'hi-IN-Standard-B' },
    { name: 'Hindi (India) - Chirp3 HD Sadaltager', value: 'hi-IN-Chirp3-HD-Sadaltager' },
  ],
  'bn-IN': [
    { name: 'Bengali (India) - Female', value: 'bn-IN-Wavenet-A' },
    { name: 'Bengali (India) - Male', value: 'bn-IN-Wavenet-B' },
  ],
  'ta-IN': [
    { name: 'Tamil (India) - Female', value: 'ta-IN-Wavenet-A' },
    { name: 'Tamil (India) - Male', value: 'ta-IN-Wavenet-B' },
  ],
  'te-IN': [
    { name: 'Telugu (India) - Female', value: 'te-IN-Standard-A' },
    { name: 'Telugu (India) - Male', value: 'te-IN-Standard-B' },
  ],
}

const API_BASE = process.env.NEXT_PUBLIC_CONFIG_API_URL || 'https://callagent-be-2.onrender.com'

export default function ConfigPage() {
  
  const [config, setConfig] = useState<AgentConfig>({
    greeting_message: '',
    exit_message: '',
    system_prompt: '',
    knowledge_base_enabled: false,
    knowledge_base: '{}',
    max_retries: 0,
    retry_delay: 0
  })
  const [activeTab, setActiveTab] = useState('greeting')
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('generic')

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/config`)
      if (response.ok) {
        const data = await response.json()
        setConfig({
          greeting_message: data.greeting_message || '',
          exit_message: data.exit_message || '',
          system_prompt: data.system_prompt || '',
          knowledge_base_enabled: data.knowledge_base_enabled || false,
          knowledge_base: data.knowledge_base || '{}',
          max_retries: data.max_retries || 0,
          retry_delay: data.retry_delay || 0
        })
      }
    } catch (error) {
      console.error('❌ Error loading config:', error)
      toast.error('Failed to load configuration')
    }
  }, [])

  const saveConfig = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        toast.success('Configuration saved successfully!')
      } else {
        toast.error('Failed to save configuration')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }, [config])

  const resetConfig = useCallback(() => {
    setConfig({
      greeting_message: '',
      exit_message: '',
      system_prompt: '',
      knowledge_base_enabled: false,
      knowledge_base: '{}',
      max_retries: 0,
      retry_delay: 0
    })
    toast.success('Configuration reset to empty')
  }, [])

  const handleTemplateChange = useCallback((template: string) => {
    setSelectedTemplate(template)
    const templateData = PROMPT_TEMPLATES[template as keyof typeof PROMPT_TEMPLATES]
    setConfig(prev => ({
      ...prev,
      system_prompt: templateData.prompt
    }))
  }, [])

  const handleKnowledgeBaseToggle = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      knowledge_base_enabled: !prev.knowledge_base_enabled
    }))
  }, [])

  const handleKnowledgeBaseFieldChange = useCallback((field: string, value: string) => {
    const currentKB = config.knowledge_base ? JSON.parse(config.knowledge_base) : {};
    try {
      const updatedKB = { ...currentKB, [field]: value }
      setConfig(prev => ({
        ...prev,
        knowledge_base: JSON.stringify(updatedKB, null, 2)
      }))
    } catch (error) {
      // If parsing fails, it might be because the knowledge_base is not a valid JSON string yet.
      console.error('Error updating knowledge base:', error)
    }
  }, [config.knowledge_base])

  const renderKnowledgeBaseField = useCallback((field: any) => {
    let currentValue = ''
    try {
      const kb = config.knowledge_base ? JSON.parse(config.knowledge_base as string) : {}
      currentValue = kb[field.key] || ''
    } catch (error) {
      currentValue = ''
    }

    return (
      <div key={field.key} className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          {field.label}
        </label>
        <input
          type="text"
          value={currentValue}
          onChange={(e) => handleKnowledgeBaseFieldChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
    )
  }, [config.knowledge_base, handleKnowledgeBaseFieldChange])

  const handleGreetingMessageChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, greeting_message: value }))
  }, [])

  const handleExitMessageChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, exit_message: value }))
  }, [])

  const handleSystemPromptChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, system_prompt: value }))
  }, [])

  const handleMaxRetriesChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, max_retries: parseInt(value) }))
  }, [])

  const handleRetryDelayChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, retry_delay: parseInt(value) }))
  }, [])

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
  }, [])

  const tabs = [
    { id: 'greeting', name: 'Greeting', icon: MessageSquare },
    { id: 'exit', name: 'Exit', icon: ArrowRight },
    { id: 'behavior', name: 'Agent Behavior', icon: FileText },
    { id: 'knowledge', name: 'Knowledge Base', icon: Database },
    { id: 'retry', name: 'Call Retry', icon: RefreshCw }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Agent Configuration</h1>
          <p className="text-slate-400 mt-1">Customize your AI agent's behavior and responses</p>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/50'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'greeting' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Greeting Message</h3>
                <p className="text-slate-400 mb-4">This message will be played when a call starts</p>
                <textarea
                  value={config.greeting_message || ''}
                  onChange={(e) => handleGreetingMessageChange(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your greeting message..."
                />
                <p className="text-sm text-slate-500 mt-2">Character count: {(config.greeting_message || '').length}</p>
              </div>
            </div>
          )}

          {activeTab === 'exit' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Exit Message</h3>
                <p className="text-slate-400 mb-4">This message will be played when a call ends</p>
                <textarea
                  value={config.exit_message || ''}
                  onChange={(e) => handleExitMessageChange(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your exit message..."
                />
                <p className="text-sm text-slate-500 mt-2">Character count: {(config.exit_message || '').length}</p>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">System Prompt Template</h3>
                <p className="text-slate-400 mb-4">Choose a template or customize your system prompt</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {Object.entries(PROMPT_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => handleTemplateChange(key)}
                      className={`
                        p-4 rounded-xl border-2 transition-all text-left
                        ${selectedTemplate === key
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                        }
                      `}
                    >
                      <div className="font-medium text-white mb-1">{template.name}</div>
                      <div className="text-sm text-slate-400">{template.prompt.substring(0, 80)}...</div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Custom System Prompt
                  </label>
                  <textarea
                    value={config.system_prompt || ''}
                    onChange={(e) => handleSystemPromptChange(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter your custom system prompt..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Knowledge Base</h3>
                  <p className="text-slate-400">Enable and configure custom knowledge for your agent</p>
                </div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.knowledge_base_enabled || false}
                    onChange={handleKnowledgeBaseToggle}
                    className="w-5 h-5 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-200">Enable Knowledge Base</span>
                </label>
              </div>

              {config.knowledge_base_enabled && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {KNOWLEDGE_BASE_FIELDS[selectedTemplate as keyof typeof KNOWLEDGE_BASE_FIELDS]?.map(renderKnowledgeBaseField)}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Raw Knowledge Base (JSON)
                    </label>
                    <textarea
                      value={config.knowledge_base || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, knowledge_base: e.target.value }))}
                      rows={8}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
                      placeholder='{"key": "value"}'
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'retry' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Call Retry Configuration</h3>
                <p className="text-slate-400 mb-6">Configure automatic retry behavior for missed calls</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Max Retries */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Maximum Retries
                    </label>
                    <select
                      value={config.max_retries}
                      onChange={(e) => handleMaxRetriesChange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value={0}>No retries</option>
                      <option value={1}>1 retry</option>
                      <option value={2}>2 retries</option>
                      <option value={3}>3 retries (recommended)</option>
                      <option value={4}>4 retries</option>
                      <option value={5}>5 retries</option>
                      <option value={6}>6 retries</option>
                      <option value={7}>7 retries</option>
                      <option value={8}>8 retries</option>
                      <option value={9}>9 retries</option>
                      <option value={10}>10 retries (maximum)</option>
                    </select>
                    <p className="text-sm text-slate-500 mt-2">
                      Number of times to retry a missed call before giving up
                    </p>
                  </div>

                  {/* Retry Delay */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Retry Delay (seconds)
                    </label>
                    <select
                      value={config.retry_delay}
                      onChange={(e) => handleRetryDelayChange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value={5}>5 seconds</option>
                      <option value={10}>10 seconds (recommended)</option>
                      <option value={15}>15 seconds</option>
                      <option value={20}>20 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={45}>45 seconds</option>
                      <option value={60}>1 minute</option>
                      <option value={120}>2 minutes</option>
                      <option value={300}>5 minutes</option>
                    </select>
                    <p className="text-sm text-slate-500 mt-2">
                      Time to wait between retry attempts
                    </p>
                  </div>
                </div>

                {/* Retry Info */}
                <div className="bg-slate-800 rounded-xl p-6 mt-6">
                  <h4 className="text-md font-semibold text-white mb-3 flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    How Call Retry Works
                  </h4>
                  <div className="space-y-3 text-slate-400">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>When a call is missed (no answer, busy, or rejected), the system automatically schedules a retry</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Retries happen after the configured delay period</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Maximum retry limit prevents infinite calling loops</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Works for both individual calls and sequential calling sessions</p>
                    </div>
                  </div>

                  {/* Current Configuration Display */}
                  <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                    <h5 className="text-sm font-medium text-white mb-2">Current Configuration:</h5>
                    <div className="text-sm text-slate-300">
                      <p>• Maximum retries: <span className="text-blue-400 font-medium">{config.max_retries}</span></p>
                      <p>• Retry delay: <span className="text-blue-400 font-medium">{config.retry_delay} seconds</span></p>
                      <p className="mt-2 text-slate-400">
                        {config.max_retries === 0 
                          ? "⚠️ Retries are disabled - missed calls will not be retried"
                          : `✅ Missed calls will be retried up to ${config.max_retries} times with ${config.retry_delay}s delay`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={resetConfig}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Empty</span>
        </button>

        <button
          onClick={saveConfig}
          disabled={loading}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* How it works */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
        <div className="space-y-3 text-slate-400">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Greeting messages are played when calls start to welcome callers</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Exit messages are played when calls end to provide closure</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>System prompts define your agent's personality and behavior</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Knowledge base provides specific information for your agent to reference</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Call retry settings automatically retry missed calls to improve contact rates</p>
          </div>
        </div>
      </div>
    </div>
  )
}
 