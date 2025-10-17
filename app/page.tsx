'use client'
import { useState, FormEvent, useRef, useEffect } from 'react'
import {
  Phone, Users, TrendingUp, PhoneCall,
  CheckCircle, AlertCircle, User, Calendar,
  Settings, ArrowRight, RefreshCw, Bot,
  Zap, Shield, Globe, Star, Play,
  MessageSquare, BarChart3, Headphones
} from 'lucide-react'
import Link from 'next/link'
import BlurText from '../components/BlurText'
import LaserFlow from '../components/LaserFlow'
import LiquidEther from '../components/LiquidEther'
import StaggeredMenu from '../components/StaggeredMenu'
import CurvedLoop from '../components/CurvedLoop'
import CardSwap, { Card } from '../components/CardSwap'
import SpotlightCard from '../components/SpotlightCard'
import Stepper, { Step } from '../components/Stepper'
import { useAuth } from '../contexts/AuthContext'
export default function LandingPage() {
  const { user, token } = useAuth()
  const [showDemo, setShowDemo] = useState(false)
  const [demoForm, setDemoForm] = useState({
    name: '',
    mobile: ''
  })
  const [heroScale, setHeroScale] = useState(1)

  // Refs for interactive reveal overlay in hero
  const heroRef = useRef<HTMLDivElement | null>(null)
  const revealRef = useRef<HTMLDivElement | null>(null)

  // Handle hero scaling for responsive design
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth
      let calculatedScale = 1

      if (width <= 480) {
        // Mobile phones - larger scale to ensure visibility
        calculatedScale = 0.6
      } else if (width <= 768) {
        // Tablets portrait - better scale for visibility
        calculatedScale = 0.75
      } else if (width <= 1024) {
        // Tablets landscape / small laptops
        calculatedScale = 0.85
      } else if (width <= 1440) {
        // Medium screens - progressive scaling
        calculatedScale = width / 1440
      } else {
        // Large screens - original size
        calculatedScale = 1
      }

      setHeroScale(calculatedScale)
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Menu items for StaggeredMenu
  const menuItems = [
    { label: 'Home', link: '/', ariaLabel: 'Go to home page' },
    { label: 'Features', link: '#features', ariaLabel: 'View features' },
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

  // No authentication required for landing page - it's accessible to everyone



  const handleDemoSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Demo functionality will be implemented later
    alert(`Demo call will be initiated for ${demoForm.name} at ${demoForm.mobile}. This feature will be implemented soon!`)
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

      <div className="min-h-screen bg-black relative overflow-hidden z-10">
        {/* Background fluid effect */}
        <LiquidEther
          className="absolute inset-0 -z-10 opacity-70"
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          resolution={0.5}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          isViscous={false}
          isBounce={false}
        />



        {/* Responsive Hero Wrapper */}
        <div style={{
          minHeight: '100vh',
          height: `${1400 * heroScale}px`,
          overflow: 'visible',
          position: 'relative',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: heroScale < 1 ? '20px' : '0px'
        }}>
          <section
            className="hero relative overflow-visible bg-black"
            style={{
              transform: `scale(${heroScale})`,
              transformOrigin: 'top center',
              height: '1400px',
              paddingTop: heroScale < 1 ? '100px' : '184px',
              width: '1800px',
              maxWidth: 'none',
              position: 'relative',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
            onMouseMove={(e) => {
              const el = revealRef.current;
              if (!el) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              el.style.setProperty('--mx', `${x}px`);
              el.style.setProperty('--my', `${y}px`);
            }}
            onMouseLeave={() => {
              const el = revealRef.current;
              if (!el) return;
              el.style.setProperty('--mx', '-9999px');
              el.style.setProperty('--my', '-9999px');
            }}
          >


            {/* Container for content */}
            <div className="container relative flex h-full flex-col px-4 sm:px-6 lg:px-8 xl:pl-[100px]">
              <h1 className="relative z-30 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-[616px] pt-8 sm:pt-12 lg:pt-16">
                <BlurText
                  text="Voice Automation for Modern Teams"
                  delay={50}
                  animateBy="words"
                  direction="top"
                  className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[84px] leading-[0.9] tracking-tight text-white"
                />
              </h1>

              <div className="relative z-30 mt-5 max-w-xs sm:max-w-sm md:max-w-md">
                <BlurText
                  text="Audixa AI empowers your business with intelligent voice automation, seamless CRM integration, and real-time analytics. Streamline calls, boost productivity, and deliver exceptional customer experiences—all in one platform."
                  delay={30}
                  animateBy="words"
                  direction="top"
                  className="text-sm sm:text-base md:text-lg xl:text-[18px] leading-snug tracking-tight text-slate-400"
                />
              </div>

              <div className="mt-8 sm:mt-10 lg:mt-11">
                <a
                  href="/demo"
                  className="inline-flex items-center space-x-1 px-8 sm:px-12 lg:px-16 h-10 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-700 hover:to-purple-700 rounded-full border border-white/60 font-bold uppercase text-xs xl:text-[12px] tracking-[-0.015em] text-white transition-all duration-200"
                >
                  <span>Try Demo</span>
                </a>
              </div>

              {/* LaserFlow background video area */}
              <div
                className="absolute z-0"
                style={{
                  bottom: '100px',
                  left: '5%',
                  height: '200vh',
                  aspectRatio: '1.067842',
                  width: '1574px',
                  maxWidth: 'none',
                  position: 'absolute'
                }}
                onMouseMove={(e) => {
                  const el = revealRef.current;
                  if (!el) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  el.style.setProperty('--mx', `${x}px`);
                  el.style.setProperty('--my', `${y}px`);
                }}
                onMouseLeave={() => {
                  const el = revealRef.current;
                  if (!el) return;
                  el.style.setProperty('--mx', '-9999px');
                  el.style.setProperty('--my', '-9999px');
                }}
              >

                {/* LaserFlow beam effect */}
                <div className="absolute left-0 bottom-0 z-0 aspect-[1.335187] w-[1920px] max-w-none mix-blend-lighten">
                  <div className="absolute inset-0 w-full h-full">
                    <LaserFlow
                      wispDensity={1}
                      dpr={window.devicePixelRatio || 1}
                      mouseSmoothTime={0.0}
                      mouseTiltStrength={0.01}
                      horizontalBeamOffset={0.1}
                      verticalBeamOffset={-0.12}
                      flowSpeed={0.35}
                      verticalSizing={24.0}
                      horizontalSizing={0.5}
                      fogIntensity={0.45}
                      fogScale={0.3}
                      wispSpeed={15.0}
                      wispIntensity={5.0}
                      flowStrength={0.25}
                      decay={1.1}
                      falloffStart={1.2}
                      fogFallSpeed={0.6}
                      color="#9279ffff"
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Dashboard image layered above beam */}
                <img
                  src="/dashboard.png"
                  alt="Dashboard Preview"
                  className="absolute bottom-[55px] left-[58%] -translate-x-1/2 z-10 w-[300px] sm:w-[400px] md:w-[600px] lg:w-[800px] xl:w-[1100px] h-auto rounded-t-xl shadow-2xl"
                  draggable={false}
                />



                {/* Interactive reveal overlay for dashboard image */}
                <div
                  ref={revealRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30"
                  style={{
                    '--mx': '-9999px',
                    '--my': '-9999px',
                    '--hero-mask-size': '240px',
                    maskImage: 'radial-gradient(var(--hero-mask-size) at var(--mx) var(--my), black 10%, transparent 60%)',
                    WebkitMaskImage: 'radial-gradient(var(--hero-mask-size) at var(--mx) var(--my), black 10%, transparent 60%)',
                  } as any}
                >
                  <img
                    src="/dashboard.png"
                    alt="Dashboard Preview"
                    className="absolute w-full h-full object-cover"
                    draggable={false}
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Curved Loop Text Animation - Below Dashboard */}
            <div className="absolute bottom-0 left-0 w-full z-30">
              <CurvedLoop
                marqueeText="Voice Automation ✦ AI Powered ✦ Real-Time Analytics ✦ Seamless Integration ✦"
                speed={2}
                curveAmount={0}
                direction="left"
                interactive={true}
                className="text-white/100"
                svgClassName="select-none w-full overflow-visible block aspect-[100/12] text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase leading-none"
              />
            </div>

            {/* Bottom gradient fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-[170px] sm:h-[200px] md:h-[250px] lg:h-[300px] xl:h-[340px] w-full bg-gradient-to-b from-black/0 to-black to-50%" />
          </section>
        </div>

        {/* Trusted by */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-8 opacity-70 flex-wrap">
              <span className="text-sm text-slate-400">Trusted by teams at</span>
              <div className="h-6 w-px bg-slate-700" />
              <div className="text-slate-300/90">Acme</div>
              <div className="text-slate-300/90">Globex</div>
              <div className="text-slate-300/90">Umbrella</div>
              <div className="text-slate-300/90">Initech</div>
              <div className="text-slate-300/90">Soylent</div>
            </div>
          </div>
        </section>


        {/* Key Capabilities - Enhanced */}
        <section className="py-24 relative bg-gradient-to-b from-black via-slate-950/50 to-black">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-6 mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
                <span className="text-purple-400 text-sm font-medium">CORE TECHNOLOGY</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Key <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">capabilities</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Fast, natural calls at scale—built on a modern, reliable stack with cutting-edge AI technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {/* Language AI - Enhanced Spotlight */}
              <div className="group relative overflow-hidden">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div 
                    className="absolute inset-0 blur-2xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(251, 146, 60, 0.3) 0%, rgba(251, 146, 60, 0.1) 40%, transparent 70%)'
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(253, 186, 116, 0.2) 0%, transparent 60%)'
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20 group-hover:shadow-[0_0_60px_rgba(251,146,60,0.4)]">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl mb-8 group-hover:shadow-orange-500/50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-100 transition-colors duration-300">Language AI</h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">Lightning-fast language processing for natural, context-aware conversations.</p>
                </div>
              </div>

              {/* Speech Recognition - Enhanced Spotlight */}
              <div className="group relative overflow-hidden">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div 
                    className="absolute inset-0 blur-2xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)'
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(147, 197, 253, 0.2) 0%, transparent 60%)'
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-blue-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.4)]">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl mb-8 group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
                    <Headphones className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors duration-300">Speech Recognition</h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">Real-time, accurate transcription with multi-language support and noise cancellation technology.</p>
                </div>
              </div>

              {/* Voice Synthesis - Enhanced Spotlight */}
              <div className="group relative overflow-hidden">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div 
                    className="absolute inset-0 blur-2xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 40%, transparent 70%)'
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(110, 231, 183, 0.2) 0%, transparent 60%)'
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-emerald-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 group-hover:shadow-[0_0_60px_rgba(16,185,129,0.4)]">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl mb-8 group-hover:shadow-emerald-500/50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
                    <Phone className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors duration-300">Voice Synthesis</h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">Natural-sounding voices optimized for telephony with emotional intelligence and accent adaptation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* CardSwap Feature Showcase Section */}
        <section className="py-24 relative bg-gradient-to-b from-black via-slate-950/30 to-black overflow-visible">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 rounded-full border border-indigo-500/20 backdrop-blur-sm">
                    <Play className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-medium text-indigo-300">Live Dashboard</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-indigo-100 to-pink-200 bg-clip-text text-transparent leading-tight">
                    Real-time Intelligence
                    <br />
                    <span className="text-3xl lg:text-4xl">In Action</span>
                  </h2>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    Watch your AI agents work in real-time with live analytics, campaign tracking, and performance insights that update as conversations happen.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">Live Call Status</span>
                    </div>
                    <p className="text-sm text-slate-400 ml-11">Monitor active conversations and agent performance in real-time</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">Analytics Dashboard</span>
                    </div>
                    <p className="text-sm text-slate-400 ml-11">Track conversion rates, call metrics, and campaign performance</p>
                  </div>
                </div>
              </div>

              {/* Right side - CardSwap */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative mt-12 pr-8">
                  <CardSwap
                    width={450}
                    height={280}
                    cardDistance={50}
                    verticalDistance={60}
                    delay={4000}
                    pauseOnHover={true}
                    easing="elastic"
                  >
                    <Card>
                      <SpotlightCard 
                        className="shadow-2xl" 
                        spotlightColor="rgba(59, 130, 246, 0.3)"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Bot className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">AI Voice Agent</h3>
                            <p className="text-sm text-slate-400">Active Call Session</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-base">
                            <span className="text-slate-300">Call Duration:</span>
                            <span className="text-blue-400 font-medium">2:34</span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span className="text-slate-300">Connection:</span>
                            <span className="text-emerald-400 font-medium">● Connected</span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span className="text-slate-300">Lead Score:</span>
                            <span className="text-yellow-400 font-medium">High</span>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Card>

                    <Card>
                      <SpotlightCard 
                        className="shadow-2xl" 
                        spotlightColor="rgba(16, 185, 129, 0.3)"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Lead Analytics</h3>
                            <p className="text-sm text-slate-400">Real-time Metrics</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-base">
                            <span className="text-slate-300">Conversion Rate:</span>
                            <span className="text-emerald-400 font-medium">24.5%</span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span className="text-slate-300">Calls Today:</span>
                            <span className="text-blue-400 font-medium">147</span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span className="text-slate-300">Success Rate:</span>
                            <span className="text-purple-400 font-medium">89%</span>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Card>

                    <Card>
                      <SpotlightCard 
                        className="shadow-2xl" 
                        spotlightColor="rgba(147, 51, 234, 0.3)"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Zap className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Campaign Status</h3>
                            <p className="text-sm text-slate-400">Sequential Calling</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-base">
                            <span className="text-slate-300">Progress:</span>
                            <span className="text-purple-400 font-medium">68%</span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span className="text-slate-300">Queue:</span>
                            <span className="text-orange-400 font-medium">23 leads</span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span className="text-slate-300">ETA:</span>
                            <span className="text-cyan-400 font-medium">2.5 hrs</span>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Card>
                  </CardSwap>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced */}
        <section className="py-24 relative bg-gradient-to-b from-black via-slate-950/30 to-black overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-6 mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Complete Automation Suite</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                Voice Automation
                <br />
                <span className="text-4xl lg:text-5xl">Redefined</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Everything you need to automate outbound calling and manage leads at scale with enterprise-grade reliability
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 - Enhanced Spotlight */}
              <div className="group relative overflow-hidden h-[320px]">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div 
                    className="absolute inset-0 blur-2xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)'
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(147, 197, 253, 0.2) 0%, transparent 60%)'
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative h-full bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-blue-400/40 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] flex flex-col">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:shadow-blue-500/30 transition-all duration-500 group-hover:scale-110">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors duration-300">AI Voice Agents</h3>
                  <p className="text-slate-300 leading-relaxed flex-1">
                    Intelligent voice agents powered by advanced language, speech, and voice systems for natural, human-like phone conversations that convert leads effectively.
                  </p>
                  <div className="mt-6 flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              {/* Feature 2 - Enhanced Spotlight */}
              <div className="group relative overflow-hidden h-[320px]">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-emerald-400/30 via-emerald-500/10 to-transparent blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-emerald-300/20 via-transparent to-transparent blur-3xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative h-full bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-emerald-400/40 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 group-hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] flex flex-col">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:shadow-emerald-500/30 transition-all duration-500 group-hover:scale-110">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors duration-300">Lead Management</h3>
                  <p className="text-slate-300 leading-relaxed flex-1">
                    Upload CSV files, manage leads, track call attempts, and monitor conversion rates with comprehensive analytics and real-time insights.
                  </p>
                  <div className="mt-6 flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300 transition-colors duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              {/* Feature 3 - Enhanced Spotlight */}
              <div className="group relative overflow-hidden h-[320px]">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-purple-400/30 via-purple-500/10 to-transparent blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-purple-300/20 via-transparent to-transparent blur-3xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative h-full bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-purple-400/40 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 group-hover:shadow-[0_0_60px_rgba(147,51,234,0.4)] flex flex-col">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:shadow-purple-500/30 transition-all duration-500 group-hover:scale-110">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-100 transition-colors duration-300">Sequential Calling</h3>
                  <p className="text-slate-300 leading-relaxed flex-1">
                    Automated sequential calling campaigns that work through your lead lists systematically with intelligent retry logic and optimal timing.
                  </p>
                  <div className="mt-6 flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              {/* Feature 4 - Enhanced Spotlight */}
              <div className="group relative overflow-hidden h-[320px]">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-orange-400/30 via-orange-500/10 to-transparent blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-orange-300/20 via-transparent to-transparent blur-3xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative h-full bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-orange-400/40 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20 group-hover:shadow-[0_0_60px_rgba(251,146,60,0.4)] flex flex-col">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:shadow-orange-500/30 transition-all duration-500 group-hover:scale-110">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-100 transition-colors duration-300">Telephony Integration</h3>
                  <p className="text-slate-300 leading-relaxed flex-1">
                    Seamless integration with your telephony provider for reliable call routing, WebSocket streaming, and advanced call transfer capabilities.
                  </p>
                  <div className="mt-6 flex items-center text-orange-400 text-sm font-medium group-hover:text-orange-300 transition-colors duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              {/* Feature 5 - Enhanced Spotlight */}
              <div className="group relative overflow-hidden h-[320px]">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-red-400/30 via-red-500/10 to-transparent blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-red-300/20 via-transparent to-transparent blur-3xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-red-600/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative h-full bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-red-400/40 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20 group-hover:shadow-[0_0_60px_rgba(239,68,68,0.4)] flex flex-col">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:shadow-red-500/30 transition-all duration-500 group-hover:scale-110">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-100 transition-colors duration-300">Multi-Tenant Architecture</h3>
                  <p className="text-slate-300 leading-relaxed flex-1">
                    Complete organization isolation with separate credentials, configurations, and data for enterprise-grade security and compliance.
                  </p>
                  <div className="mt-6 flex items-center text-red-400 text-sm font-medium group-hover:text-red-300 transition-colors duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              {/* Feature 6 - Enhanced Spotlight */}
              <div className="group relative overflow-hidden h-[320px]">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-teal-400/30 via-teal-500/10 to-transparent blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-teal-300/20 via-transparent to-transparent blur-3xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-teal-600/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative h-full bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-teal-400/40 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-teal-500/20 group-hover:shadow-[0_0_60px_rgba(20,184,166,0.4)] flex flex-col">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:shadow-teal-500/30 transition-all duration-500 group-hover:scale-110">
                    <Headphones className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-100 transition-colors duration-300">Advanced Call Features</h3>
                  <p className="text-slate-300 leading-relaxed flex-1">
                    Call transfer to human agents, intelligent interruption handling, conversation memory, and timeout management for natural interactions.
                  </p>
                  <div className="mt-6 flex items-center text-teal-400 text-sm font-medium group-hover:text-teal-300 transition-colors duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Interactive Stepper */}
        <section className="py-24 relative bg-gradient-to-b from-black via-slate-950/50 to-black overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-6 mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                <Play className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">Simple Process</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-emerald-100 to-blue-200 bg-clip-text text-transparent leading-tight">
                How It Works
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Interactive 4-step process to automate your outbound calling campaigns and start converting leads immediately
              </p>
            </div>

            <Stepper
              initialStep={1}
              onStepChange={(step: number) => {
                console.log('Current step:', step);
              }}
              onFinalStepCompleted={() => console.log("All steps completed!")}
              backButtonText="Previous"
              nextButtonText="Next"
              stepCircleContainerClassName="bg-slate-900/50 backdrop-blur-sm border-slate-700/50"
              contentClassName="text-white"
            >
              <Step>
                <div className="text-center space-y-6 py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">Upload Leads</h3>
                  <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Upload your lead list via CSV file with names, phone numbers, and any additional data for personalized campaigns. 
                    Our system supports bulk uploads and automatically validates phone number formats.
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-slate-400">Supported formats: CSV, Excel</p>
                    <p className="text-sm text-slate-400">Max file size: 10MB</p>
                  </div>
                </div>
              </Step>
              <Step>
                <div className="text-center space-y-6 py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">Configure AI Agent</h3>
                  <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Set up your AI agent with custom prompts, greetings, and conversation flows tailored to your business. 
                    Define objection handling, appointment booking, and call transfer scenarios.
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-slate-400">✓ Custom voice selection</p>
                    <p className="text-sm text-slate-400">✓ Conversation templates</p>
                    <p className="text-sm text-slate-400">✓ Integration setup</p>
                  </div>
                </div>
              </Step>
              <Step>
                <div className="text-center space-y-6 py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">Launch Campaign</h3>
                  <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Launch your sequential calling campaign and let AI agents handle the conversations automatically. 
                    Monitor real-time progress and adjust settings on the fly.
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-slate-400">⚡ Instant campaign start</p>
                    <p className="text-sm text-slate-400">📊 Real-time monitoring</p>
                    <p className="text-sm text-slate-400">🎯 Smart call routing</p>
                  </div>
                </div>
              </Step>
              <Step>
                <div className="text-center space-y-6 py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto">
                    <span className="text-3xl font-bold text-white">4</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">Analyze Results</h3>
                  <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Track call outcomes, view transcripts, and analyze performance metrics in real-time with detailed analytics. 
                    Export reports and optimize your campaigns for better results.
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-slate-400">📈 Detailed analytics</p>
                    <p className="text-sm text-slate-400">📝 Call transcriptions</p>
                    <p className="text-sm text-slate-400">📊 Performance reports</p>
                  </div>
                </div>
              </Step>
            </Stepper>
          </div>
        </section>

        {/* Platform Capabilities */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Enterprise-Grade Platform Capabilities
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Built for businesses that need reliable, scalable voice automation solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Inbound & Outbound - Enhanced Spotlight */}
              <div className="group relative overflow-hidden">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div 
                    className="absolute inset-0 blur-2xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)'
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(147, 197, 253, 0.2) 0%, transparent 60%)'
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-blue-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 group-hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:scale-110">
                      <PhoneCall className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">Inbound & Outbound</h3>
                  </div>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">Handle both incoming calls and automated outbound campaigns with the same AI agent configuration</p>
                </div>
              </div>

              {/* WebSocket Streaming - Enhanced Spotlight */}
              <div className="group relative overflow-hidden">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-emerald-400/30 via-emerald-500/10 to-transparent blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-emerald-300/20 via-transparent to-transparent blur-3xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-emerald-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 group-hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:shadow-emerald-500/50 transition-all duration-500 group-hover:scale-110">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-100 transition-colors duration-300">Real-time Streaming</h3>
                  </div>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">Ultra-low latency voice processing with WebSocket streaming for natural conversation flow</p>
                </div>
              </div>

              {/* Multi-Language - Enhanced Spotlight */}
              <div className="group relative overflow-hidden">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-purple-400/30 via-purple-500/10 to-transparent blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-purple-300/20 via-transparent to-transparent blur-3xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 group-hover:shadow-[0_0_50px_rgba(147,51,234,0.3)]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-110">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300">Multi-Language AI</h3>
                  </div>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">Support for multiple languages with automatic language detection and appropriate voice selection</p>
                </div>
              </div>

              {/* Call Transfer - Enhanced Spotlight */}
              <div className="group relative overflow-hidden">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-orange-400/30 via-orange-500/10 to-transparent blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-orange-300/20 via-transparent to-transparent blur-3xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20 group-hover:shadow-[0_0_50px_rgba(251,146,60,0.3)]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:shadow-orange-500/50 transition-all duration-500 group-hover:scale-110">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-100 transition-colors duration-300">Smart Call Transfer</h3>
                  </div>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">Seamless transfer to human agents when needed, with full conversation context preservation</p>
                </div>
              </div>

              {/* Conversation Memory - Enhanced Spotlight */}
              <div className="group relative overflow-hidden">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-teal-400/30 via-teal-500/10 to-transparent blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-teal-300/20 via-transparent to-transparent blur-3xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-teal-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-teal-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-teal-500/20 group-hover:shadow-[0_0_50px_rgba(20,184,166,0.3)]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:shadow-teal-500/50 transition-all duration-500 group-hover:scale-110">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-teal-100 transition-colors duration-300">Conversation Memory</h3>
                  </div>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">Intelligent conversation tracking with context awareness across multiple interactions</p>
                </div>
              </div>

              {/* Analytics & Reporting - Enhanced Spotlight */}
              <div className="group relative overflow-hidden">
                {/* Enhanced Spotlight Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-red-400/30 via-red-500/10 to-transparent blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-red-300/20 via-transparent to-transparent blur-3xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 hover:border-red-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20 group-hover:shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:shadow-red-500/50 transition-all duration-500 group-hover:scale-110">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-100 transition-colors duration-300">Advanced Analytics</h3>
                  </div>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">Comprehensive call analytics, conversion tracking, and performance metrics for optimization</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-slate-800/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Audixa AI</h3>
                  <p className="text-xs text-slate-400">Intelligent Voice Automation</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <span>© 2024 Audixa AI. All rights reserved.</span>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>



        {/* Demo Modal */}
        {showDemo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-8 w-full max-w-md">
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                ×
              </button>

              <div className="text-center space-y-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Try Live Demo</h2>
                <p className="text-slate-400">Experience our AI voice assistant in action</p>
              </div>

              <form onSubmit={handleDemoSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Your Name</label>
                  <input
                    type="text"
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Mobile Number</label>
                  <input
                    type="tel"
                    value={demoForm.mobile}
                    onChange={(e) => setDemoForm({ ...demoForm, mobile: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>

                <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <p className="text-emerald-300 text-sm">
                    Our AI assistant will call you within 30 seconds to demonstrate our capabilities.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Demo Call
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}