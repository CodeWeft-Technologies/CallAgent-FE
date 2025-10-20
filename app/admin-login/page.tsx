'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LoaderIcon, Shield, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL || 'http://localhost:8000'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!username || !password) {
      setError('Username and password are required!')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/super-admin/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        const authData = {
          token: data.access_token,
          user: {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email || '',
            first_name: data.user.first_name || '',
            last_name: data.user.last_name || '',
            role: data.user.role,
            is_super_admin: data.user.is_super_admin,
            organization_id: data.user.organization_id,
            organization_name: data.user.organization_name,
            created_at: data.user.created_at || new Date().toISOString()
          },
          timestamp: Date.now()
        }
        
        localStorage.setItem('ai_agent_auth', JSON.stringify(authData))
        window.location.href = '/admin'
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Invalid super admin credentials')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        {/* Header with Home Button */}
        <div className="flex items-center justify-between w-full py-6 sm:py-8 border-b border-border/80 mb-6 sm:mb-8">
          <Link href="/" className="flex items-center gap-x-2 text-foreground hover:text-primary transition-colors">
            <Shield className="w-6 h-6 text-red-500" />
            <h1 className="text-lg font-medium">
              Super Admin
            </h1>
          </Link>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Super Admin Access
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Restricted access for system administrators only.
            </p>
          </div>

          {/* Admin Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Super Admin Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                disabled={loading}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter super admin username"
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-red-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-red-500 transition-colors"
                />
                <button
                  type="button"
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3">
                <div className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 h-11 px-8"
            >
              {loading ? (
                <LoaderIcon className="w-5 h-5 animate-spin" />
              ) : "Sign in as Super Admin"}
            </button>
          </form>

          {/* Security Notice */}
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Security Notice</p>
                <p>This login is for system administrators only. All access attempts are logged and monitored.</p>
              </div>
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="border-t border-border/80 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need organization access?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Organization Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}