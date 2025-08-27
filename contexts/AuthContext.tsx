'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Fixed credentials - these will be hardcoded for now
const FIXED_CREDENTIALS = {
  username: 'codeweft.ai',
  password: 'cWt@123'
}

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('ai_agent_auth')
        if (authData) {
          const { isAuthenticated: stored, timestamp } = JSON.parse(authData)
          
          // Check if authentication is still valid (24 hours)
          const now = Date.now()
          const authAge = now - timestamp
          const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
          
          if (stored && authAge < maxAge) {
            setIsAuthenticated(true)
          } else {
            // Remove expired authentication
            localStorage.removeItem('ai_agent_auth')
            setIsAuthenticated(false)
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (username: string, password: string): boolean => {
    // Check against fixed credentials
    if (username === FIXED_CREDENTIALS.username && password === FIXED_CREDENTIALS.password) {
      setIsAuthenticated(true)
      
      // Store authentication state with timestamp
      try {
        localStorage.setItem('ai_agent_auth', JSON.stringify({
          isAuthenticated: true,
          timestamp: Date.now(),
          username: username
        }))
      } catch (error) {
        console.error('Error storing authentication:', error)
      }
      
      return true
    }
    
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    try {
      localStorage.removeItem('ai_agent_auth')
    } catch (error) {
      console.error('Error removing authentication:', error)
    }
  }

  const value: AuthContextType = {
    isAuthenticated,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
