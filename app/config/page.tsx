'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Settings, RotateCcw, Save, MessageSquare, ArrowRight, FileText, Database, RefreshCw, Languages, Mic } from 'lucide-react'
import toast from 'react-hot-toast'

interface AgentConfig {
  greeting_message: string
  exit_message: string
  system_prompt: string
  knowledge_base_enabled: boolean
  knowledge_base: string
  max_retries: number
  retry_delay: number
  tts_provider?: string
  stt_provider?: string
}

const PROMPT_TEMPLATES = {
  'real-estate': {
    name: 'Real Estate Agent (Voice Optimized)',
    prompt: 'You are a professional voice AI agent working as a real estate agent on phone calls. Keep responses short and simple. Use natural, conversational language and ask one question at a time. Be helpful and knowledgeable when discussing properties.'
  },
  'customer-service': {
    name: 'Customer Service (Voice Optimized)',
    prompt: 'You are a professional voice AI agent working as a customer service representative on calls. Keep answers short and clear. Be patient and solution-focused. Ask one question at a time to help customers.'
  },
  'sales': {
    name: 'Sales Agent (Voice Optimized)',
    prompt: 'You are a professional voice AI agent working as a sales representative on phone calls. Keep responses brief and conversational. Focus on benefits. Ask simple questions to understand customer needs.'
  },
  'appointment': {
    name: 'Appointment Booking (Voice Optimized)',
    prompt: 'You are a professional voice AI agent booking appointments over the phone. Be efficient and courteous. Ask one question at a time about dates, times, or services. Keep responses short and natural.'
  },
  'healthcare': {
    name: 'Healthcare Assistant (Voice Optimized)',
    prompt: 'You are a professional voice AI agent helping patients book appointments by phone. Be caring and professional. Keep responses short and clear. Ask one simple question at a time.'
  },
  'education': {
    name: 'Education Counselor (Voice Optimized)',
    prompt: 'You are a professional voice AI agent working as an education counselor on phone calls. Be encouraging and supportive. Keep responses brief and ask one question at a time about courses or admissions.'
  },
  'restaurant': {
    name: 'Restaurant Assistant (Voice Optimized)',
    prompt: 'You are a professional voice AI agent taking restaurant calls for reservations and questions. Be welcoming and courteous. Keep responses short and ask one question at a time.'
  },
  'generic': {
    name: 'Generic Assistant (Voice Optimized)',
    prompt: 'You are a professional voice AI agent helping customers on phone calls. Keep responses short and simple. Use natural, conversational language. Ask one question at a time to help customers.'
  }
}

const KNOWLEDGE_BASE_FIELDS = {
  'real-estate': [
    { key: 'company_name', label: 'Company Name', placeholder: 'e.g., ABC Real Estate Group' },
    { key: 'developer_name', label: 'Developer Name', placeholder: 'e.g., XYZ Developers, Premium Builders' },
    { key: 'locations', label: 'Project Locations', placeholder: 'e.g., Mumbai, Pune, Bangalore - specific areas' },
    { key: 'property_types', label: 'Property Types', placeholder: 'e.g., 1BHK, 2BHK, 3BHK, Villas, Commercial' },
    { key: 'price_range', label: 'Price Range', placeholder: 'e.g., ₹45L - ₹2.5Cr, Starting from ₹65L' },
    { key: 'amenities', label: 'Amenities', placeholder: 'e.g., Swimming pool, Gym, Parking, Security, Garden' },
    { key: 'possession_date', label: 'Possession Timeline', placeholder: 'e.g., Ready to move, Dec 2025, Under construction' },
    { key: 'financing_options', label: 'Financing Options', placeholder: 'e.g., Home loans available, Bank partnerships, EMI options' },
    { key: 'contact_info', label: 'Contact Information', placeholder: 'Phone, email, office address, visiting hours' },
    { key: 'special_offers', label: 'Special Offers', placeholder: 'e.g., Festive discounts, Early bird offers, No brokerage' }
  ],
  'customer-service': [
    { key: 'company_name', label: 'Company Name', placeholder: 'Your Company Name' },
    { key: 'products', label: 'Products/Services', placeholder: 'Main products or services offered' },
    { key: 'support_hours', label: 'Support Hours', placeholder: 'e.g., 24/7, Mon-Fri 9AM-6PM, Business hours' },
    { key: 'return_policy', label: 'Return Policy', placeholder: 'e.g., 30-day return, No questions asked, Exchange policy' },
    { key: 'warranty_info', label: 'Warranty Information', placeholder: 'e.g., 1 year warranty, Extended warranty available' },
    { key: 'shipping_info', label: 'Shipping Information', placeholder: 'e.g., Free shipping above ₹500, 2-3 business days' },
    { key: 'payment_methods', label: 'Payment Methods', placeholder: 'e.g., Credit/Debit cards, UPI, Net banking, COD' },
    { key: 'escalation_process', label: 'Escalation Process', placeholder: 'How to escalate issues, manager contact' },
    { key: 'contact_info', label: 'Contact Information', placeholder: 'Support email, phone, chat, ticket system' },
    { key: 'faqs', label: 'Common FAQs', placeholder: 'Frequently asked questions and answers' }
  ],
  'sales': [
    { key: 'company_name', label: 'Company Name', placeholder: 'Your Company Name' },
    { key: 'products', label: 'Products/Services', placeholder: 'What you sell - be specific' },
    { key: 'pricing_tiers', label: 'Pricing Tiers', placeholder: 'e.g., Basic ₹999, Premium ₹1999, Enterprise ₹4999' },
    { key: 'key_benefits', label: 'Key Benefits', placeholder: 'Why choose your products - unique selling points' },
    { key: 'target_audience', label: 'Target Audience', placeholder: 'e.g., Small businesses, Enterprises, Individuals' },
    { key: 'competitors', label: 'Competitive Advantage', placeholder: 'How you\'re better than competitors' },
    { key: 'case_studies', label: 'Success Stories', placeholder: 'Customer success stories, testimonials' },
    { key: 'demo_trial', label: 'Demo/Trial Options', placeholder: 'e.g., Free trial, Live demo, Money-back guarantee' },
    { key: 'sales_process', label: 'Sales Process', placeholder: 'Steps from inquiry to purchase' },
    { key: 'contact_info', label: 'Sales Contact', placeholder: 'Sales team contact, meeting scheduling' }
  ],
  'appointment': [
    { key: 'business_name', label: 'Business Name', placeholder: 'e.g., Dr. Smith Clinic, Beauty Salon XYZ' },
    { key: 'service_types', label: 'Service Types', placeholder: 'e.g., Consultation, Treatment, Haircut, Massage' },
    { key: 'appointment_duration', label: 'Appointment Duration', placeholder: 'e.g., 30 mins, 1 hour, 2 hours' },
    { key: 'business_hours', label: 'Business Hours', placeholder: 'e.g., Mon-Sat 9AM-7PM, Sunday closed' },
    { key: 'location_address', label: 'Location & Address', placeholder: 'Full address, landmarks, parking info' },
    { key: 'booking_advance', label: 'Advance Booking', placeholder: 'e.g., Book 1 day ahead, Same day available' },
    { key: 'cancellation_policy', label: 'Cancellation Policy', placeholder: 'e.g., 24 hours notice, Cancellation charges' },
    { key: 'payment_info', label: 'Payment Information', placeholder: 'e.g., Pay at venue, Advance payment, Online payment' },
    { key: 'staff_info', label: 'Staff Information', placeholder: 'e.g., Dr. Smith (Mon-Wed), Therapist A (Thu-Sat)' },
    { key: 'contact_info', label: 'Contact Information', placeholder: 'Phone, WhatsApp, email for bookings' }
  ],
  'healthcare': [
    { key: 'clinic_name', label: 'Clinic/Hospital Name', placeholder: 'e.g., City Medical Center' },
    { key: 'doctor_info', label: 'Doctor Information', placeholder: 'e.g., Dr. John Smith - Cardiologist, 15 years exp' },
    { key: 'specializations', label: 'Specializations', placeholder: 'e.g., Cardiology, Orthopedics, General Medicine' },
    { key: 'consultation_fees', label: 'Consultation Fees', placeholder: 'e.g., ₹500 consultation, ₹300 follow-up' },
    { key: 'appointment_slots', label: 'Available Slots', placeholder: 'e.g., Morning 9-12, Evening 5-8' },
    { key: 'emergency_services', label: 'Emergency Services', placeholder: 'e.g., 24/7 emergency, Ambulance service' },
    { key: 'insurance_accepted', label: 'Insurance Accepted', placeholder: 'e.g., Cashless treatment, All major insurances' },
    { key: 'facilities', label: 'Facilities Available', placeholder: 'e.g., Lab tests, X-ray, Pharmacy, ICU' },
    { key: 'location_info', label: 'Location Information', placeholder: 'Address, nearby landmarks, parking' },
    { key: 'contact_emergency', label: 'Contact & Emergency', placeholder: 'Phone, emergency number, WhatsApp' }
  ],
  'education': [
    { key: 'institute_name', label: 'Institute Name', placeholder: 'e.g., ABC Learning Academy' },
    { key: 'courses_offered', label: 'Courses Offered', placeholder: 'e.g., Web Development, Data Science, Digital Marketing' },
    { key: 'course_duration', label: 'Course Duration', placeholder: 'e.g., 3 months, 6 months, 1 year programs' },
    { key: 'fees_structure', label: 'Fees Structure', placeholder: 'e.g., ₹25,000 for 3 months, EMI available' },
    { key: 'batch_timings', label: 'Batch Timings', placeholder: 'e.g., Morning 9-12, Evening 6-9, Weekend batches' },
    { key: 'faculty_info', label: 'Faculty Information', placeholder: 'e.g., Industry experts, 10+ years experience' },
    { key: 'placement_support', label: 'Placement Support', placeholder: 'e.g., 100% placement assistance, Job guarantee' },
    { key: 'certification', label: 'Certification', placeholder: 'e.g., Industry recognized certificate, Government approved' },
    { key: 'demo_classes', label: 'Demo Classes', placeholder: 'e.g., Free demo class, Trial week available' },
    { key: 'contact_admission', label: 'Admission Contact', placeholder: 'Admission office, counselor contact, visit hours' }
  ],
  'restaurant': [
    { key: 'restaurant_name', label: 'Restaurant Name', placeholder: 'e.g., Spice Garden Restaurant' },
    { key: 'cuisine_type', label: 'Cuisine Type', placeholder: 'e.g., North Indian, Chinese, Continental, Multi-cuisine' },
    { key: 'menu_highlights', label: 'Menu Highlights', placeholder: 'e.g., Signature dishes, Chef specials, Popular items' },
    { key: 'price_range', label: 'Price Range', placeholder: 'e.g., ₹200-500 per person, Budget-friendly, Premium dining' },
    { key: 'operating_hours', label: 'Operating Hours', placeholder: 'e.g., 11AM-11PM, Lunch 12-3PM, Dinner 7-11PM' },
    { key: 'seating_capacity', label: 'Seating & Ambiance', placeholder: 'e.g., 50 seats, Family dining, AC, Outdoor seating' },
    { key: 'special_services', label: 'Special Services', placeholder: 'e.g., Home delivery, Party bookings, Live music' },
    { key: 'location_info', label: 'Location Information', placeholder: 'Address, nearby landmarks, parking availability' },
    { key: 'reservation_info', label: 'Reservation Information', placeholder: 'e.g., Table booking required, Walk-ins welcome' },
    { key: 'contact_info', label: 'Contact Information', placeholder: 'Phone, WhatsApp, online ordering platforms' }
  ],
  'generic': [
    { key: 'company_name', label: 'Company Name', placeholder: 'Your Company Name' },
    { key: 'about', label: 'About Us', placeholder: 'Brief company description and mission' },
    { key: 'services', label: 'Services/Products', placeholder: 'What you offer to customers' },
    { key: 'contact', label: 'Contact Information', placeholder: 'Phone, email, address, website' }
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
    retry_delay: 0,
    tts_provider: 'google',
    stt_provider: 'deepgram'
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
      retry_delay: 0,
      tts_provider: 'cartesia',
      stt_provider: 'cartesia'
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

  const handleTTSProviderChange = useCallback(async (provider: string) => {
    setConfig(prev => ({ ...prev, tts_provider: provider }))
    
    try {
      const response = await fetch(`${API_BASE}/api/config/tts-provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      })
      
      if (response.ok) {
        toast.success(`TTS provider updated to ${provider}`)
      } else {
        toast.error('Failed to update TTS provider')
      }
    } catch (error) {
      console.error('Error updating TTS provider:', error)
      toast.error('Failed to update TTS provider')
    }
  }, [])

  const handleSTTProviderChange = useCallback(async (provider: string) => {
    setConfig(prev => ({ ...prev, stt_provider: provider }))
    
    try {
      const response = await fetch(`${API_BASE}/api/config/stt-provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      })
      
      if (response.ok) {
        toast.success(`STT provider updated to ${provider}`)
      } else {
        toast.error('Failed to update STT provider')
      }
    } catch (error) {
      console.error('Error updating STT provider:', error)
      toast.error('Failed to update STT provider')
    }
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
    { id: 'voice', name: 'Voice Settings', icon: Mic },
    { id: 'retry', name: 'Call Retry', icon: RefreshCw }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Agent Configuration</h1>
          <p className="text-slate-400 mt-1">Customize your AI agent's behavior and responses</p>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center space-x-2 px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none justify-center sm:justify-start
                ${activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/50'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'greeting' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Greeting Message</h3>
                <p className="text-slate-400 mb-4">This message will be played when a call starts</p>
                
                {/* Lead Name Instructions */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-4">
                  <h4 className="text-blue-300 font-medium mb-2">💡 Personalize with Lead Name</h4>
                  <p className="text-blue-200 text-sm mb-3">
                    You can include the caller's name in your greeting message by using the variable <code className="bg-blue-800/50 px-2 py-1 rounded text-blue-100">{'{{lead_name}}'}</code>
                  </p>
                  <div className="space-y-2">
                    <p className="text-blue-200 text-sm font-medium">Examples:</p>
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                       <p className="text-slate-300 text-sm">• "Hello {'{{lead_name}}'}, thank you for calling ABC Real Estate!"</p>
                       <p className="text-slate-300 text-sm">• "Hi {'{{lead_name}}'}, I'm here to help you with your property needs."</p>
                       <p className="text-slate-300 text-sm">• "Good day {'{{lead_name}}'}, how can I assist you today?"</p>
                     </div>
                    <p className="text-blue-200 text-xs mt-2">
                      <strong>Note:</strong> If no lead name is available, the variable will be replaced with a generic greeting.
                    </p>
                  </div>
                </div>
                
                <textarea
                  value={config.greeting_message || ''}
                  onChange={(e) => handleGreetingMessageChange(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your greeting message... Use {lead_name} to include the caller's name"
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {KNOWLEDGE_BASE_FIELDS[selectedTemplate as keyof typeof KNOWLEDGE_BASE_FIELDS]?.map(renderKnowledgeBaseField)}
                  </div>
                  
                  <div className="bg-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-white flex items-center">
                        <Database className="w-4 h-4 mr-2" />
                        Knowledge Base Preview
                      </h4>
                      <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                        Auto-generated from form fields
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-slate-700 rounded-lg p-4">
                        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
                          {config.knowledge_base ? JSON.stringify(JSON.parse(config.knowledge_base), null, 2) : '{}'}
                        </pre>
                      </div>
                      
                      <div className="flex items-start space-x-3 text-sm text-slate-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                          This knowledge base is automatically generated from the form fields above. 
                          Your AI agent will use this structured information to provide accurate, 
                          business-specific responses to customers.
                        </p>
                      </div>
                      
                      <div className="flex items-start space-x-3 text-sm text-slate-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                          Fill out the form fields above to automatically populate this knowledge base 
                          with your business information. No JSON knowledge required!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Voice Settings</h3>
                <p className="text-slate-400 mb-4">Configure Text-to-Speech (TTS) and Speech-to-Text (STT) providers</p>
                
                {/* Current Status Display */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Current Active Services
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Text-to-Speech (TTS)</p>
                        <p className="text-xs text-slate-400">Converting text to speech</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-400">
                          {config.tts_provider === 'cartesia' ? 'Cartesia TTS' : 'Google TTS'}
                        </p>
                        <div className="flex items-center text-xs text-green-400">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                          Active
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Speech-to-Text (STT)</p>
                        <p className="text-xs text-slate-400">Converting speech to text</p>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-medium text-green-400">
                           {config.stt_provider === 'deepgram' ? 'Deepgram STT' : 'Cartesia STT'}
                         </p>
                        <div className="flex items-center text-xs text-green-400">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                          Active
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* TTS Provider */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Text-to-Speech Provider
                    </label>
                    <select
                      value={config.tts_provider || 'cartesia'}
                      onChange={(e) => handleTTSProviderChange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value="google">Google TTS</option>
                      <option value="cartesia">Cartesia TTS</option>
                    </select>
                    <p className="text-sm text-slate-500 mt-2">
                      {config.tts_provider === 'cartesia' 
                        ? 'Cartesia provides high-quality, low-latency voice synthesis'
                        : 'Google TTS offers reliable voice synthesis with multiple language support'
                      }
                    </p>
                  </div>

                  {/* STT Provider */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Speech-to-Text Provider
                    </label>
                    <select
                      value={config.stt_provider || 'cartesia'}
                      onChange={(e) => handleSTTProviderChange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value="deepgram">Deepgram STT</option>
                      <option value="cartesia">Cartesia STT</option>
                    </select>
                    <p className="text-sm text-slate-500 mt-2">
                      {config.stt_provider === 'cartesia' 
                        ? 'Cartesia provides accurate real-time speech recognition'
                        : 'Deepgram offers industry-leading speech recognition accuracy'
                      }
                    </p>
                  </div>
                </div>

                {/* Provider Information */}
                <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <h4 className="text-md font-medium text-white mb-3">Provider Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-slate-300 mb-2">Google TTS</h5>
                      <ul className="text-slate-400 space-y-1">
                        <li>• Multiple language support</li>
                        <li>• High-quality voices</li>
                        <li>• Reliable and stable</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-300 mb-2">Cartesia TTS</h5>
                      <ul className="text-slate-400 space-y-1">
                        <li>• Ultra-low latency</li>
                        <li>• Natural-sounding voices</li>
                        <li>• Real-time streaming</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-300 mb-2">Deepgram STT</h5>
                      <ul className="text-slate-400 space-y-1">
                        <li>• Industry-leading accuracy</li>
                        <li>• Multi-language support</li>
                        <li>• Real-time transcription</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-300 mb-2">Cartesia STT</h5>
                      <ul className="text-slate-400 space-y-1">
                        <li>• Fast processing</li>
                        <li>• High accuracy</li>
                        <li>• Low latency</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
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
            <p>System prompts define your agent's personality and behavior for voice calls</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Voice-optimized prompts keep responses short and natural for real conversations</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Knowledge base provides specific information for your agent to reference</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Use contractions (I'll, we're, that's) and simple language for phone calls</p>
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
 