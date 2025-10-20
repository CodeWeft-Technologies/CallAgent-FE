'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, LoaderIcon, Building, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, error: authError } = useAuth()

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
      const success = await login(username, password)
      
      if (success) {
        router.push('/dashboard')
      } else {
        setError(authError || 'Invalid username or password. Please try again.')
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.')
      console.error('Login error:', err)
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
            <Building className="w-6 h-6" />
            <h1 className="text-lg font-medium">
              CallAgent
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
              Sign in to CallAgent
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                disabled={loading}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary transition-colors"
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
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary transition-colors"
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
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 h-11 px-8"
            >
              {loading ? (
                <LoaderIcon className="w-5 h-5 animate-spin" />
              ) : "Sign in"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="space-y-6 pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4">
                  Privacy Policy
                </Link>
              </p>
            </div>
            
            <div className="border-t border-border/80 pt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
              
              <div className="text-center border-t border-border/80 pt-4">
                <p className="text-xs text-muted-foreground mb-2">System Administrator?</p>
                <Link 
                  href="/admin-login" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium text-sm"
                >
                  Super Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

