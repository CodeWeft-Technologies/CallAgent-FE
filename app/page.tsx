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
    { label: 'Pricing', link: '#pricing', ariaLabel: 'View pricing' },
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

      <div className="min-h-screen bg-black relative overflow-hidden">
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


        {/* Feature highlights */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">Key capabilities</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">Fast, natural calls at scale—built on a modern, reliable stack.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {/* Groq LLM */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-orange-500/25 transition-all duration-300">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Language AI</h3>
                  <p className="text-slate-400">Lightning-fast language processing for natural, context-aware conversations.</p>
                </div>
              </div>

              {/* Deepgram STT */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-blue-500/25 transition-all duration-300">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Speech-to-Text</h3>
                  <p className="text-slate-400">Real-time, accurate transcription with multi-language support.</p>
                </div>
              </div>

              {/* Google TTS */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-emerald-500/25 transition-all duration-300">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Voice Synthesis</h3>
                  <p className="text-slate-400">Natural-sounding voices optimized for telephony.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Developer-first config example */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-white">Ship faster with simple config</h3>
                <p className="text-slate-400 max-w-lg">Define your agent, voice, and calling behavior in a few lines. Connect webhooks and you’re live.</p>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-800 flex items-center justify-between">
                  <span>audixa.config.json</span>
                  <span className="text-slate-500">readonly</span>
                </div>
                <pre className="p-4 text-sm leading-relaxed text-slate-200 overflow-x-auto"><code>{`{
  "agent": { "name": "Audixa", "voice": "neutral-female", "language": "en-US" },
  "calling": { "concurrency": 5, "retry": 2, "timeout": 20 },
  "campaign": { "list": "leads.csv", "schedule": "9am-6pm" },
  "webhook": "https://api.example.com/calls/webhook"
}`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Complete Voice Automation Suite
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Everything you need to automate outbound calling and manage leads at scale
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-blue-500/25 transition-all duration-300">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">AI Voice Agents</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Intelligent voice agents powered by advanced language, speech, and voice systems for natural, human-like phone conversations
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-emerald-500/25 transition-all duration-300">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Lead Management</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Upload CSV files, manage leads, track call attempts, and monitor conversion rates with comprehensive lead tracking
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-purple-500/25 transition-all duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Sequential Calling</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Automated sequential calling campaigns that work through your lead lists systematically with intelligent retry logic
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-orange-500/25 transition-all duration-300">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Telephony Integration</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Seamless integration with your telephony provider for reliable call routing, WebSocket streaming, and call transfer capabilities
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-red-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-red-500/25 transition-all duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Multi-Tenant Architecture</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Complete organization isolation with separate credentials, configurations, and data for enterprise-grade security
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-teal-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 hover:border-teal-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-teal-500/25 transition-all duration-300">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Advanced Call Features</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Call transfer to human agents, intelligent interruption handling, conversation memory, and timeout management for natural interactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                How It Works
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Simple 4-step process to automate your outbound calling campaigns
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Upload Leads</h3>
                  <p className="text-slate-400 text-sm">
                    Upload your lead list via CSV file with names, phone numbers, and any additional data
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden lg:block absolute top-8 -right-4 text-slate-600">
                  <ArrowRight className="w-8 h-8" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Configure AI</h3>
                  <p className="text-slate-400 text-sm">
                    Set up your AI agent with custom prompts, greetings, and conversation flows
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden lg:block absolute top-8 -right-4 text-slate-600">
                  <ArrowRight className="w-8 h-8" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Start Campaign</h3>
                  <p className="text-slate-400 text-sm">
                    Launch your sequential calling campaign and let AI agents handle the conversations
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden lg:block absolute top-8 -right-4 text-slate-600">
                  <ArrowRight className="w-8 h-8" />
                </div>
              </div>

              {/* Step 4 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-xl font-bold text-white">Monitor Results</h3>
                <p className="text-slate-400 text-sm">
                  Track call outcomes, view transcripts, and analyze performance metrics in real-time
                </p>
              </div>
            </div>
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
              {/* Inbound & Outbound */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <PhoneCall className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Inbound & Outbound</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Handle both incoming calls and automated outbound campaigns with the same AI agent configuration</p>
                </div>
              </div>

              {/* WebSocket Streaming */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Real-time Streaming</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Ultra-low latency voice processing with WebSocket streaming for natural conversation flow</p>
                </div>
              </div>

              {/* Multi-Language */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-800/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Multi-Language AI</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Support for multiple languages with automatic language detection and appropriate voice selection</p>
                </div>
              </div>

              {/* Call Transfer */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-800/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Smart Call Transfer</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Seamless transfer to human agents when needed, with full conversation context preservation</p>
                </div>
              </div>

              {/* Conversation Memory */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-teal-800/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Conversation Memory</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Intelligent conversation tracking with context awareness across multiple interactions</p>
                </div>
              </div>

              {/* Analytics & Reporting */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Advanced Analytics</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Comprehensive call analytics, conversion tracking, and performance metrics for optimization</p>
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