'use client'
import { useState } from 'react'
import { 
  Phone, Users, TrendingUp, PhoneCall, 
  CheckCircle, AlertCircle, User, Calendar,
  Settings, ArrowRight, RefreshCw, Bot,
  Zap, Shield, Globe, Star, Play,
  MessageSquare, BarChart3, Headphones
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export default function LandingPage() {  
  const { user, token } = useAuth()
  const [showDemo, setShowDemo] = useState(false)
  const [demoForm, setDemoForm] = useState({
    name: '',
    mobile: ''
  })

  // No authentication required for landing page - it's accessible to everyone



  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo functionality will be implemented later
    alert(`Demo call will be initiated for ${demoForm.name} at ${demoForm.mobile}. This feature will be implemented soon!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Audixa AI
                </h1>
                <p className="text-xs text-slate-400">Intelligent Voice Automation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDemo(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Play className="w-4 h-4" />
                <span>See Demo</span>
              </button>
              {user && token ? (
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 rounded-3xl blur-3xl"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                AI Voice Calling Platform
              </h1>
              <p className="text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Automate your outbound calling campaigns with intelligent AI agents. Upload leads, configure conversations, and let AI handle customer interactions with natural voice technology.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => setShowDemo(true)}
                className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-semibold">Try Live Demo</span>
              </button>
              {user && token ? (
                <Link
                  href="/dashboard"
                  className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold">Go to Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="group flex items-center space-x-3 px-8 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold">Access Platform</span>
                </Link>
              )}
            </div>

            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-400">99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-400">Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-400">Multi-Language</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Complete Voice Automation Suite
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to automate outbound calling and manage leads at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Voice Agents</h3>
                <p className="text-slate-400 leading-relaxed">
                  Intelligent voice agents powered by Groq LLM, Deepgram STT, and Google TTS for natural, human-like phone conversations
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-emerald-500/25 transition-all duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Lead Management</h3>
                <p className="text-slate-400 leading-relaxed">
                  Upload CSV files, manage leads, track call attempts, and monitor conversion rates with comprehensive lead tracking
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-purple-500/25 transition-all duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Sequential Calling</h3>
                <p className="text-slate-400 leading-relaxed">
                  Automated sequential calling campaigns that work through your lead lists systematically with intelligent retry logic
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-orange-500/25 transition-all duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Real-time Call Monitoring</h3>
                <p className="text-slate-400 leading-relaxed">
                  Monitor live calls, view transcripts, track conversation outcomes, and analyze call performance in real-time
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-red-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-red-500/25 transition-all duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Multi-Tenant Architecture</h3>
                <p className="text-slate-400 leading-relaxed">
                  Complete organization isolation with separate credentials, configurations, and data for enterprise-grade security
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-teal-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-teal-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-teal-500/25 transition-all duration-300">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Custom AI Configuration</h3>
                <p className="text-slate-400 leading-relaxed">
                  Configure AI prompts, greetings, knowledge bases, and conversation flows tailored to your business needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              How It Works
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Simple 4-step process to automate your outbound calling campaigns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-white">Upload Leads</h3>
                <p className="text-slate-400 text-sm">
                  Upload your lead list via CSV file with names, phone numbers, and any additional data
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden lg:block absolute top-8 -right-4 text-slate-600">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-white">Configure AI</h3>
                <p className="text-slate-400 text-sm">
                  Set up your AI agent with custom prompts, greetings, and conversation flows
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden lg:block absolute top-8 -right-4 text-slate-600">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-white">Start Campaign</h3>
                <p className="text-slate-400 text-sm">
                  Launch your sequential calling campaign and let AI agents handle the conversations
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden lg:block absolute top-8 -right-4 text-slate-600">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-white">Monitor Results</h3>
              <p className="text-slate-400 text-sm">
                Track call outcomes, view transcripts, and analyze performance metrics in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-3xl blur-3xl"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Powerful Voice Automation Platform
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built for sales teams, call centers, and businesses that need to scale their outbound calling
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI
              </div>
              <p className="text-slate-400 font-medium">Voice Agents</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Multi
              </div>
              <p className="text-slate-400 font-medium">Language Support</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Real-time
              </div>
              <p className="text-slate-400 font-medium">Call Monitoring</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Enterprise
              </div>
              <p className="text-slate-400 font-medium">Multi-Tenant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Audixa AI</h3>
                <p className="text-xs text-slate-400">Intelligent Voice Automation</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span>© 2024 Audixa AI. All rights reserved.</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>



      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-8 w-full max-w-md">
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              ×
            </button>
            
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Try Live Demo</h2>
              <p className="text-slate-400">Experience our AI voice assistant in action</p>
            </div>

            <form onSubmit={handleDemoSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Your Name</label>
                <input
                  type="text"
                  value={demoForm.name}
                  onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Mobile Number</label>
                <input
                  type="tel"
                  value={demoForm.mobile}
                  onChange={(e) => setDemoForm({...demoForm, mobile: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>

              <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <p className="text-emerald-300 text-sm">
                  Our AI assistant will call you within 30 seconds to demonstrate our capabilities.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Demo Call
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}