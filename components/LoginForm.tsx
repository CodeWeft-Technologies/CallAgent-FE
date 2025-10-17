'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, LoaderIcon, Building } from 'lucide-react'
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
    <div className="flex flex-col items-start max-w-sm mx-auto h-dvh overflow-hidden pt-4 md:pt-20">
      <div className="flex items-center w-full py-8 border-b border-border/80">
        <Link href="/" className="flex items-center gap-x-2">
          <Building className="w-6 h-6" />
          <h1 className="text-lg font-medium">
            CallAgent
          </h1>
        </Link>
      </div>

      <div className="flex flex-col items-start gap-y-6 py-8 w-full px-0.5">
        <h2 className="text-2xl font-semibold">
          Sign in to CallAgent
        </h2>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="space-y-2 w-full">
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
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              {loading ? (
                <LoaderIcon className="w-5 h-5 animate-spin" />
              ) : "Sign in with username"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col items-start w-full">
        <p className="text-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary">
            Terms of Service{" "}
          </Link>
          and{" "}
          <Link href="/privacy" className="text-primary">
            Privacy Policy
          </Link>
        </p>
      </div>
      
      <div className="flex flex-col items-start mt-auto border-t border-border/80 py-6 w-full space-y-4">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary">
            Sign up
          </Link>
        </p>
        <div className="border-t border-border/80 pt-4 w-full">
          <p className="text-sm text-muted-foreground mb-2">System Administrator?</p>
          <Link 
            href="/admin-login" 
            className="text-primary hover:text-primary/80 transition-colors font-medium text-sm"
          >
            Super Admin Login
          </Link>
        </div>
      </div>
    </div>
  )
}

