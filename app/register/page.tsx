'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LoaderIcon, Building } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-start max-w-sm sm:max-w-md md:max-w-lg mx-auto w-full overflow-hidden pt-4 md:pt-8">
        <div className="flex items-center w-full py-6 sm:py-8 border-b border-border/80">
          <Link href="/" className="flex items-center gap-x-2">
            <Building className="w-6 h-6" />
            <h1 className="text-lg font-medium">
              CallAgent
            </h1>
          </Link>
        </div>

        <div className="flex flex-col items-start gap-y-6 py-6 sm:py-8 w-full px-0.5">
          <h2 className="text-2xl font-semibold">
            Create your organization
          </h2>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Organization Details Section */}
            <div className="space-y-4 pb-4 border-b border-border/50">
              <h3 className="text-lg font-medium text-foreground">Organization Details</h3>
              
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
                />
              </div>
            </div>

            {/* Admin User Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Admin User Details</h3>
              
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password *
                </label>
                <div className="relative w-full">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    disabled={loading}
                    onChange={handleInputChange}
                    placeholder="Minimum 8 characters"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    className="absolute top-1 right-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
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
                <div className="relative w-full">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    disabled={loading}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-foreground"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    className="absolute top-1 right-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-500 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                {success}
              </div>
            )}

            <div className="w-full pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                {loading ? (
                  <LoaderIcon className="w-5 h-5 animate-spin" />
                ) : "Register Organization"}
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-start w-full px-0.5">
          <p className="text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
              Terms of Service{" "}
            </Link>
            and{" "}
            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
        
        <div className="flex items-start mt-6 border-t border-border/80 py-6 w-full px-0.5">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}