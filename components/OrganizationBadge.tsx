'use client'

import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Building } from 'lucide-react'

export default function OrganizationBadge() {
  const { user } = useAuth()
  
  if (!user) return null
  
  // Get organization initials
  const getOrgInitials = () => {
    if (!user.organization_name) return 'O'
    
    const words = user.organization_name.split(' ')
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase()
    } else {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
  }
  
  return (
    <div className="flex items-center space-x-3 px-4 py-3 border-b border-slate-800">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
        {getOrgInitials()}
      </div>
      <div>
        <div className="font-medium text-white truncate max-w-[180px]">
          {user.organization_name}
        </div>
        <div className="flex items-center text-xs text-slate-400">
          <Building className="h-3 w-3 mr-1" />
          <span>Organization</span>
        </div>
      </div>
    </div>
  )
}