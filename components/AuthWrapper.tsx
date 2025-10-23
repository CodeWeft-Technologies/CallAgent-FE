'use client'

import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePathname } from 'next/navigation'
import LoginForm from './LoginForm'

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper = React.memo<AuthWrapperProps>(({ children }) => {
  
  const { isAuthenticated, logout, loading } = useAuth()
  const pathname = usePathname()

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Allow access to landing page, login page, register page, pricing page, features page, contact page and admin-login page without authentication
  if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/pricing' || pathname === '/features' || pathname === '/contact' || pathname === '/admin-login') {
    return <>{children}</>
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />
  }

  // Show authenticated content - just render children as the layout handles the structure
  return (
    <div className="relative">
        {children}
    </div>
  )
})

AuthWrapper.displayName = 'AuthWrapper'

export default AuthWrapper
