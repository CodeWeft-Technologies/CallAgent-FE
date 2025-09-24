'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

// User interface
interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  role: string
  organization_id: number
  organization_name: string
  created_at: string
}

// Auth context interface
interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  error: string | null
  registerOrganization: (registrationData: OrganizationRegistrationData) => Promise<boolean>
}

// Organization registration interface
interface OrganizationRegistrationData {
  organization: {
    name: string
    subscription_tier: 'basic' | 'premium' | 'enterprise'
    max_users: number
  }
  admin_user: {
    username: string
    email: string
    password: string
    first_name: string
    last_name: string
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('ai_agent_auth')
        if (authData) {
          const { token, user, timestamp } = JSON.parse(authData)
          
          // Check if authentication is still valid (24 hours)
          const now = Date.now()
          const authAge = now - timestamp
          const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
          
          if (token && user && authAge < maxAge) {
            setIsAuthenticated(true)
            setUser(user)
            setToken(token)
          } else {
            // Remove expired authentication
            localStorage.removeItem('ai_agent_auth')
            setIsAuthenticated(false)
            setUser(null)
            setToken(null)
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setIsAuthenticated(false)
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setError(null)
    
    try {
      // Call the authentication API
      const response = await fetch(`${API_URL}/api/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || 'Authentication failed')
        return false
      }
      
      const data = await response.json()
      
      // Extract token and user data
      const { access_token, user: userData } = data
      
      // Store authentication state
      setIsAuthenticated(true)
      setUser(userData)
      setToken(access_token)
      
      // Save to local storage
      localStorage.setItem('ai_agent_auth', JSON.stringify({
        token: access_token,
        user: userData,
        timestamp: Date.now(),
      }))
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login. Please try again.')
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setUser(null)
    setToken(null)
    setError(null)
    
    try {
      localStorage.removeItem('ai_agent_auth')
    } catch (error) {
      console.error('Error removing authentication:', error)
    }
  }, [])

  const registerOrganization = useCallback(async (registrationData: OrganizationRegistrationData): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`${API_URL}/api/auth/register-organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || 'Registration failed')
        return false
      }
      
      const data = await response.json()
      
      // Registration successful - don't auto-login, let user login manually
      return true
    } catch (error) {
      console.error('Registration error:', error)
      setError('An error occurred during registration. Please try again.')
      return false
    }
  }, [])

  const value: AuthContextType = {
    isAuthenticated,
    loading,
    user,
    token,
    login,
    logout,
    error,
    registerOrganization
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
