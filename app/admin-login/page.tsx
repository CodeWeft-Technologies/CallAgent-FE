'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LoaderIcon, Shield } from 'lucide-react'
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
    <div className="flex flex-col items-start max-w-sm mx-auto h-dvh overflow-hidden pt-4 md:pt-20">
      <div className="flex items-center w-full py-8 border-b border-border/80">
        <Link href="/" className="flex items-center gap-x-2">
          <Shield className="w-6 h-6 text-red-500" />
          <h1 className="text-lg font-medium">
            Super Admin
          </h1>
        </Link>
      </div>

      <div className="flex flex-col items-start gap-y-6 py-8 w-full px-0.5">
        <h2 className="text-2xl font-semibold">
          Super Admin Access
        </h2>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="space-y-2 w-full">
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
            />
          </div>
          <div className="mt-4 space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
              />
              <button
                type="button"
                disabled={loading}
                className="absolute top-1 right-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ?
                  <EyeOff className="w-4 h-4" /> :
                  <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 text-sm text-red-500">
              {error}
            </div>
          )}
          
          <div className="mt-4 w-full">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-600/90 h-10 px-4 py-2 w-full"
            >
              {loading ? (
                <LoaderIcon className="w-5 h-5 animate-spin" />
              ) : "Sign in as Super Admin"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col items-start w-full">
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg w-full">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-400">
              <strong>Security Notice:</strong> This login is for system administrators only. 
              All access attempts are logged and monitored.
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-start mt-auto border-t border-border/80 py-6 w-full">
        <p className="text-sm text-muted-foreground">
          Need organization access?{" "}
          <Link href="/login" className="text-primary">
            Organization Login
          </Link>
        </p>
      </div>
    </div>
  )
}