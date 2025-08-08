'use client'
import { useState, useEffect } from 'react'
import { Activity, Phone, MessageSquare, TrendingUp, Users, Settings, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeSessions: 0,
    totalMessages: 0,
    conversionRate: 0
  })

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalCalls: 156,
      activeSessions: 3,
      totalMessages: 1247,
      conversionRate: 23.5
    })
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome to your AI Agent management system</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-emerald-400 font-medium">System Online</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Calls</p>
              <p className="text-2xl font-bold text-white">{stats.totalCalls}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-emerald-500">+12% from last week</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Sessions</p>
              <p className="text-2xl font-bold text-white">{stats.activeSessions}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-emerald-500">Live monitoring</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Messages</p>
              <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-emerald-500">+8% from last week</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">{stats.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-emerald-500">+2.3% from last week</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/config" className="group">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 hover:bg-slate-800/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Configure Agent</h3>
            <p className="text-slate-400 text-sm">Set up greeting messages, system prompts, and knowledge base</p>
          </div>
        </Link>

        <Link href="/conversation" className="group">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 hover:bg-slate-800/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Monitor Conversations</h3>
            <p className="text-slate-400 text-sm">View real-time conversation logs and message history</p>
          </div>
        </Link>

        <Link href="/leads" className="group">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 hover:bg-slate-800/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Manage Leads</h3>
            <p className="text-slate-400 text-sm">Upload CSV files and manage your contact database efficiently</p>
          </div>
        </Link>
      </div>

      {/* Features Overview */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
        <h2 className="text-xl font-semibold text-white mb-6">System Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-white">Dynamic Configuration</h4>
                <p className="text-sm text-slate-400">Customize agent behavior, greetings, and knowledge base in real-time</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-white">Real-time Monitoring</h4>
                <p className="text-sm text-slate-400">Live conversation logs and WebSocket-based message streaming</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-white">Lead Management</h4>
                <p className="text-sm text-slate-400">Upload CSV files and manage your contact database efficiently</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-white">Voice Integration</h4>
                <p className="text-sm text-slate-400">Piopiy-powered voice calls with inbound and outbound capabilities</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-white">AI-Powered Responses</h4>
                <p className="text-sm text-slate-400">Advanced LLM integration with customizable system prompts</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-white">Modern Dashboard</h4>
                <p className="text-sm text-slate-400">Clean, responsive interface with real-time statistics and monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 