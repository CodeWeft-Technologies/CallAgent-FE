'use client'
import { useState, useEffect, FormEvent } from 'react'
import {
  Phone, Calculator, Check, Star, Zap, Shield,
  Globe, ArrowRight, TrendingUp, Users, Clock,
  DollarSign, BarChart3, Headphones, Play
} from 'lucide-react'
import Link from 'next/link'
import StaggeredMenu from '../../components/StaggeredMenu'
import SpotlightCard from '../../components/SpotlightCard'
import { useAuth } from '../../contexts/AuthContext'

export default function PricingPage() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [showDemo, setShowDemo] = useState(false)
  const [demoForm, setDemoForm] = useState({
    name: '',
    mobile: ''
  })

  // Menu items for StaggeredMenu
  const menuItems = [
    { label: 'Home', link: '/', ariaLabel: 'Go to home page' },
    { label: 'Features', link: '/#features', ariaLabel: 'View features' },
    { label: 'Pricing', link: '/pricing', ariaLabel: 'View pricing' },
    { label: 'Demo', link: 'javascript:void(0)', ariaLabel: 'See demo call' },
    {
      label: user ? 'Dashboard' : 'Login',
      link: user ? '/dashboard' : '/login',
      ariaLabel: user ? 'Go to dashboard' : 'Sign in to your account'
    },
  ]

  // Handle demo click from menu
  useEffect(() => {
    const handleDemoClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.textContent?.includes('Demo') && target.closest('a[href="javascript:void(0)"]')) {
        e.preventDefault()
        setShowDemo(true)
      }
    }
    document.addEventListener('click', handleDemoClick)
    return () => document.removeEventListener('click', handleDemoClick)
  }, [])

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com', ariaLabel: 'Visit our GitHub' },
    { label: 'Twitter', link: 'https://twitter.com', ariaLabel: 'Follow us on Twitter' },
  ]

  const handleDemoSubmit = (e: FormEvent) => {
    e.preventDefault()
    alert(`Demo call will be initiated for ${demoForm.name} at ${demoForm.mobile}. This feature will be implemented soon!`)
    setShowDemo(false)
  }

  // Pricing tiers (per minute rates)
  const pricingTiers = {
    starter: {
      name: 'Starter',
      pricePerMinute: 0.15,
      minMinutes: 100,
      maxMinutes: 5000,
      features: [
        'Basic AI Voice Agent',
        'Standard Voice Quality',
        'Email Support',
        'Basic Analytics',
        'CSV Lead Upload',
        '1 Campaign at a time'
      ],
      color: 'blue',
      popular: false
    },
    pro: {
      name: 'Professional',
      pricePerMinute: 0.12,
      minMinutes: 500,
      maxMinutes: 25000,
      features: [
        'Advanced AI Voice Agent',
        'Premium Voice Quality',
        'Priority Support',
        'Advanced Analytics',
        'CRM Integration',
        'Multiple Campaigns',
        'Custom Prompts',
        'Call Recording'
      ],
      color: 'emerald',
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      pricePerMinute: 0.08,
      minMinutes: 10000,
      maxMinutes: 100000,
      features: [
        'Enterprise AI Voice Agent',
        'Ultra-Premium Voice Quality',
        'Dedicated Support Manager',
        'Custom Analytics Dashboard',
        'Full API Access',
        'Unlimited Campaigns',
        'White-label Solution',
        'Custom Integrations',
        'SLA Guarantee'
      ],
      color: 'purple',
      popular: false
    }
  }

  const currentTier = pricingTiers[selectedPlan as keyof typeof pricingTiers]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        gradient: 'from-blue-400 via-blue-500 to-blue-600',
        border: 'border-blue-500/50',
        text: 'text-blue-400',
        bg: 'bg-blue-500/10',
        shadow: 'shadow-blue-500/20',
        hover: 'hover:border-blue-400/50'
      },
      emerald: {
        gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
        border: 'border-emerald-500/50',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        shadow: 'shadow-emerald-500/20',
        hover: 'hover:border-emerald-400/50'
      },
      purple: {
        gradient: 'from-purple-400 via-purple-500 to-purple-600',
        border: 'border-purple-500/50',
        text: 'text-purple-400',
        bg: 'bg-purple-500/10',
        shadow: 'shadow-purple-500/20',
        hover: 'hover:border-purple-400/50'
      },
      orange: {
        gradient: 'from-orange-400 via-orange-500 to-orange-600',
        border: 'border-orange-500/50',
        text: 'text-orange-400',
        bg: 'bg-orange-500/10',
        shadow: 'shadow-orange-500/20',
        hover: 'hover:border-orange-400/50'
      }
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <>
      {/* StaggeredMenu Navigation - Fixed overlay */}
      <StaggeredMenu
        position="right"
        colors={['#B19EEF', '#5227FF']}
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        menuButtonColor="#ffffff"
        accentColor="#5227FF"
        isFixed={true}
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden z-10">

        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl"></div>
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">Transparent Pricing</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-emerald-100 to-blue-200 bg-clip-text text-transparent leading-tight">
                Pay Per Minute
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Simple, transparent pricing based on actual usage. No hidden fees, no monthly minimums.
                Pay only for the minutes you use with our AI voice agents.
              </p>
            </div>

            {/* Pricing Calculator */}
            <div className="max-w-4xl mx-auto">
              <SpotlightCard
                className="mb-12 bg-slate-900/50 backdrop-blur-sm border-slate-800/50"
                spotlightColor="rgba(16, 185, 129, 0.15)"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Pricing Calculator</h2>
                  <p className="text-slate-400">Estimate your monthly costs based on usage</p>
                </div>

                <div className="text-center space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-4">
                      Select Plan to See Pricing
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      {Object.entries(pricingTiers).map(([key, tier]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedPlan(key)}
                          className={`p-4 rounded-lg border transition-all duration-300 ${selectedPlan === key
                            ? `${getColorClasses(tier.color).border} ${getColorClasses(tier.color).bg}`
                            : 'border-slate-700 hover:border-slate-600'
                            }`}
                        >
                          <div className="text-lg font-medium text-white">{tier.name}</div>
                          <div className={`text-2xl font-bold ${selectedPlan === key ? getColorClasses(tier.color).text : 'text-slate-400'}`}>
                            ${tier.pricePerMinute}
                          </div>
                          <div className="text-sm text-slate-400">per minute</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 max-w-md mx-auto">
                    <div className="text-center space-y-6">
                      <div>
                        <div className="text-sm text-slate-400 mb-2">Selected Plan</div>
                        <div className="text-3xl font-bold text-white mb-2">
                          {currentTier.name}
                        </div>
                        <div className={`text-4xl font-bold ${getColorClasses(currentTier.color).text}`}>
                          ${currentTier.pricePerMinute}
                        </div>
                        <div className="text-slate-400">per minute</div>
                      </div>

                      <div className="border-t border-slate-700 pt-6">
                        <div className="text-sm text-slate-400 mb-2">Usage Range</div>
                        <div className="text-lg text-white">
                          {currentTier.minMinutes.toLocaleString()} - {currentTier.maxMinutes.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">minutes per month</div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25">
                        Start Free Trial
                      </button>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Choose Your Plan
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                All plans include core features. Scale up as your business grows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {Object.entries(pricingTiers).map(([key, tier]) => {
                const colors = getColorClasses(tier.color)
                return (
                  <div
                    key={key}
                    className={`relative group ${tier.popular ? 'scale-105' : ''}`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <SpotlightCard
                      className={`bg-slate-900/50 backdrop-blur-sm border-${tier.color}-500/50 h-full`}
                      spotlightColor={`rgba(${tier.color === 'blue' ? '59, 130, 246' : tier.color === 'emerald' ? '16, 185, 129' : '147, 51, 234'}, 0.15)`}
                    >
                      <div className="text-center space-y-4 mb-8">
                        <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                        <div className="space-y-2">
                          <div className={`text-4xl font-bold ${colors.text}`}>
                            ${tier.pricePerMinute}
                          </div>
                          <div className="text-slate-400">per minute</div>
                          <div className="text-sm text-slate-500">
                            {tier.minMinutes.toLocaleString()} - {tier.maxMinutes.toLocaleString()} min/month
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        {tier.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Check className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                            <span className="text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedPlan(key)}
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${selectedPlan === key
                          ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
                          : `border ${colors.border} ${colors.text} hover:${colors.bg}`
                          }`}
                      >
                        {selectedPlan === key ? 'Selected' : 'Select Plan'}
                      </button>
                    </SpotlightCard>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20 relative bg-gradient-to-b from-black via-slate-950/50 to-black">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Why Choose CallAgent?
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Industry-leading features at competitive per-minute rates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Clock,
                  title: 'Pay Per Use',
                  description: 'Only pay for actual call minutes. No monthly fees or hidden costs.',
                  color: 'emerald'
                },
                {
                  icon: Zap,
                  title: 'Instant Setup',
                  description: 'Get started in minutes. Upload leads and launch campaigns immediately.',
                  color: 'blue'
                },
                {
                  icon: Shield,
                  title: 'Enterprise Security',
                  description: 'Bank-level encryption and compliance with industry standards.',
                  color: 'purple'
                },
                {
                  icon: BarChart3,
                  title: 'Real-time Analytics',
                  description: 'Track performance, conversion rates, and ROI in real-time.',
                  color: 'orange'
                }
              ].map((feature, index) => {
                const colors = getColorClasses(feature.color)
                return (
                  <SpotlightCard
                    key={index}
                    className="text-center space-y-4 bg-slate-900/30 border-slate-800/50"
                    spotlightColor={`rgba(${feature.color === 'emerald' ? '16, 185, 129' :
                        feature.color === 'blue' ? '59, 130, 246' :
                          feature.color === 'purple' ? '147, 51, 234' :
                            '251, 146, 60'
                      }, 0.15)`}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </SpotlightCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 text-center">
            <SpotlightCard
              className="max-w-3xl mx-auto space-y-8 bg-slate-900/30 border-slate-800/50"
              spotlightColor="rgba(16, 185, 129, 0.15)"
            >
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-emerald-100 to-blue-200 bg-clip-text text-transparent">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-slate-300">
                Start your free trial today. No credit card required. Cancel anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/login"
                  className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </SpotlightCard>
          </div>
        </section>
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-8 max-w-md w-full">
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Demo Call</h3>
                <p className="text-slate-400">Experience our AI voice agent in action</p>
              </div>

              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone Number"
                    value={demoForm.mobile}
                    onChange={(e) => setDemoForm({ ...demoForm, mobile: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDemo(false)}
                    className="flex-1 px-4 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-colors"
                  >
                    Request Demo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}