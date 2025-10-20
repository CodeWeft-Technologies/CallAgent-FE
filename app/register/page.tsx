'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LoaderIcon, Building, Home } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface RegistrationData {
  organizationName: string;
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
  maxUsers: number;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { registerOrganization, error: authError } = useAuth();
  const [formData, setFormData] = useState<RegistrationData>({
    organizationName: '',
    subscriptionTier: 'basic',
    maxUsers: 10,
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxUsers' ? parseInt(value) || 0 : value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.organizationName.trim()) return 'Organization name is required';
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.username.trim()) return 'Username is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.maxUsers < 1) return 'Max users must be at least 1';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const registrationData = {
        organization: {
          name: formData.organizationName,
          subscription_tier: formData.subscriptionTier,
          max_users: formData.maxUsers
        },
        admin_user: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName
        }
      };

      const success = await registerOrganization(registrationData);

      if (success) {
        setSuccess('Organization registered successfully! You can now login with your credentials.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(authError || 'Registration failed');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
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
              Create your organization
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Set up your CallAgent organization and admin account to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Details Section */}
            <div className="space-y-4 pb-6 border-b border-border/50">
              <h3 className="text-lg font-semibold text-foreground">Organization Details</h3>
              
              <div className="space-y-2 w-full">
                <label htmlFor="organizationName" className="block text-sm font-medium text-foreground">
                  Organization Name *
                </label>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  value={formData.organizationName}
                  disabled={loading}
                  onChange={handleInputChange}
                  placeholder="Enter your organization name"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2 w-full">
                <label htmlFor="subscriptionTier" className="block text-sm font-medium text-foreground">
                  Subscription Tier
                </label>
                <select
                  id="subscriptionTier"
                  name="subscriptionTier"
                  value={formData.subscriptionTier}
                  disabled={loading}
                  onChange={handleInputChange}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary transition-colors"
                >
                  <option value="basic">Basic - Standard features</option>
                  <option value="premium">Premium - Enhanced features</option>
                  <option value="enterprise">Enterprise - Full feature set</option>
                </select>
              </div>

              <div className="space-y-2 w-full">
                <label htmlFor="maxUsers" className="block text-sm font-medium text-foreground">
                  Maximum Users
                </label>
                <input
                  id="maxUsers"
                  name="maxUsers"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.maxUsers}
                  disabled={loading}
                  onChange={handleInputChange}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Admin User Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Admin User Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    disabled={loading}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    disabled={loading}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 w-full">
                <label htmlFor="username" className="block text-sm font-medium text-foreground">
                  Username *
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  disabled={loading}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2 w-full">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled={loading}
                  onChange={handleInputChange}
                  placeholder="admin@yourcompany.com"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    disabled={loading}
                    onChange={handleInputChange}
                    placeholder="Minimum 8 characters"
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    disabled={loading}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3">
                <div className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3">
                <div className="text-sm text-green-600 dark:text-green-400">
                  {success}
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
              ) : "Register Organization"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="space-y-6 pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4">
                  Privacy Policy
                </Link>
              </p>
            </div>
            
            <div className="border-t border-border/80 pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}