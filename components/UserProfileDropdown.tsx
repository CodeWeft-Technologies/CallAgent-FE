'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, Settings, Building, ChevronDown } from 'lucide-react'

export default function UserProfileDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return 'U'
    
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    } else if (user.username) {
      return user.username.substring(0, 2).toUpperCase()
    } else {
      return 'U'
    }
  }

  // Get user role display name
  const getRoleDisplay = () => {
    if (!user) return ''
    
    switch (user.role) {
      case 'super_admin':
        return 'Super Administrator'
      case 'admin':
        return 'Administrator'
      case 'manager':
        return 'Manager'
      case 'agent':
        return 'Agent'
      default:
        return user.role
    }
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-3 py-2 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {getInitials()}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium truncate max-w-[120px]">
            {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
          </div>
          <div className="text-xs text-slate-400 truncate max-w-[120px]">
            {user.organization_name}
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg">
                {getInitials()}
              </div>
              <div>
                <div className="font-medium text-white">
                  {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
                </div>
                <div className="text-sm text-slate-400">{user.email}</div>
                <div className="mt-1 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full inline-block">
                  {getRoleDisplay()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-slate-400 flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Organization:</span>
              <span className="text-white font-medium">{user.organization_name}</span>
            </div>
            
            <button
              onClick={() => {
                setIsOpen(false)
                // TODO: Navigate to profile page
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
            
            {(user.role === 'admin' || user.role === 'manager') && (
              <button
                onClick={() => {
                  setIsOpen(false)
                  // TODO: Navigate to settings page
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Organization Settings</span>
              </button>
            )}
            
            <button
              onClick={() => {
                setIsOpen(false)
                logout()
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}