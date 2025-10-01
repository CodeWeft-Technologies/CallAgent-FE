'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Settings, Key, Users, Database, Shield, Activity, FileText } from 'lucide-react'

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

export default function OrganizationPage() {
  const { user, token } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  
  // Check if user has permission to access this page
  if (user && user.role !== 'admin' && user.role !== 'manager') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          <h2 className="text-lg font-medium mb-2">Access Denied</h2>
          <p>You don't have permission to access organization settings.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Organization Settings</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Manage your organization's settings, credentials, and resource limits
          </p>
        </div>
      </div>
      
      {/* Tabs - Mobile Responsive */}
      <div className="border-b border-slate-800 mb-6">
        <div className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2 scrollbar-hide">
          <TabButton 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')}
            icon={<Settings className="w-4 h-4 mr-2" />}
            label="General"
          />
          <TabButton 
            active={activeTab === 'credentials'} 
            onClick={() => setActiveTab('credentials')}
            icon={<Key className="w-4 h-4 mr-2" />}
            label="API Credentials"
          />
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
            icon={<Users className="w-4 h-4 mr-2" />}
            label="Users"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <GeneralSettings user={user} />
        )}
        
        {activeTab === 'credentials' && (
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-medium text-white">API Credentials</h2>
            <p className="text-slate-400 mt-2">Manage your API credentials here.</p>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-medium text-white">Organization Users</h2>
            <p className="text-slate-400 mt-2">Manage organization users here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Tab Button Component - Mobile Responsive
function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
        active 
          ? 'border-blue-500 text-blue-500' 
          : 'border-transparent text-slate-400 hover:text-slate-300'
      }`}
    >
      <span className="hidden sm:inline">{icon}</span>
      <span className="sm:hidden">{icon}</span>
      <span className="ml-1 sm:ml-0">{label}</span>
    </button>
  )
}

// General Settings Component - Mobile Responsive
function GeneralSettings({ user }: { user: any }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-medium text-white mb-4">Organization Information</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Organization Name
          </label>
          <div className="bg-slate-700 rounded-lg p-3 text-white">
            {user?.organization_name}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Organization ID
          </label>
          <div className="bg-slate-700 rounded-lg p-3 text-white">
            {user?.organization_id}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Your Role
          </label>
          <div className="bg-slate-700 rounded-lg p-3 text-white flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-500" />
            {user?.role === 'admin' ? 'Administrator' : 'Manager'}
          </div>
        </div>
      </div>
    </div>
  )
}