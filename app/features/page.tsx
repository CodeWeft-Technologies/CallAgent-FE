"use client";

import React from 'react';
import { Timeline } from '../../components/Timeline';
import { motion } from 'framer-motion';
import { 
    PhoneIcon, 
    BrainCircuitIcon, 
    CalendarIcon, 
    BarChart3Icon,
    ClockIcon,
    UsersIcon,
    MessageSquareIcon,
    TrendingUpIcon,
    CheckCircleIcon,
    StarIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    ZapIcon,
    HeadphonesIcon
} from 'lucide-react';
import Link from 'next/link';

const timelineData = [
    {
        title: "AI Voice Technology",
        content: (
            <div>
                <p className="text-muted-foreground text-sm sm:text-base font-normal mb-4 sm:mb-6 leading-relaxed">
                    Built on cutting-edge AI voice technology that delivers human-like conversations. Our agents can handle complex dialogues, understand context, and respond naturally to customer inquiries.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <img
                        src="/dashboard.png"
                        alt="AI Voice Technology"
                        width={500}
                        height={500}
                        className="rounded-xl object-cover h-32 sm:h-20 md:h-44 lg:h-60 w-full border border-border/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    />
                    <img
                        src="/dashboard.png"
                        alt="Voice Analytics"
                        width={500}
                        height={500}
                        className="rounded-xl object-cover h-32 sm:h-20 md:h-44 lg:h-60 w-full border border-border/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Smart Automation",
        content: (
            <div>
                <p className="text-muted-foreground text-sm sm:text-base font-normal mb-4 sm:mb-6 leading-relaxed">
                    Automate your entire sales pipeline with intelligent workflows. From lead qualification to appointment booking, our AI handles it all while you focus on closing deals.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <img
                        src="/dashboard.png"
                        alt="Automation Dashboard"
                        width={500}
                        height={500}
                        className="rounded-xl object-cover h-32 sm:h-20 md:h-44 lg:h-60 w-full border border-border/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    />
                    <img
                        src="/dashboard.png"
                        alt="Workflow Builder"
                        width={500}
                        height={500}
                        className="rounded-xl object-cover h-32 sm:h-20 md:h-44 lg:h-60 w-full border border-border/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Real-time Analytics",
        content: (
            <div>
                <p className="text-muted-foreground text-sm sm:text-base font-normal mb-4 sm:mb-6 leading-relaxed">
                    Monitor your campaigns in real-time with comprehensive analytics. Track conversion rates, call quality, customer sentiment, and ROI with detailed insights and reporting.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <img
                        src="/dashboard.png"
                        alt="Analytics Dashboard"
                        width={500}
                        height={500}
                        className="rounded-xl object-cover h-32 sm:h-20 md:h-44 lg:h-60 w-full border border-border/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    />
                    <img
                        src="/dashboard.png"
                        alt="Performance Metrics"
                        width={500}
                        height={500}
                        className="rounded-xl object-cover h-32 sm:h-20 md:h-44 lg:h-60 w-full border border-border/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Seamless Integration",
        content: (
            <div>
                <p className="text-muted-foreground text-sm sm:text-base font-normal mb-4 sm:mb-6 leading-relaxed">
                    Connect with your existing CRM, calendar, and business tools. Our platform integrates seamlessly with popular services to fit into your current workflow without disruption.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <img
                        src="/dashboard.png"
                        alt="CRM Integration"
                        width={500}
                        height={500}
                        className="rounded-xl object-cover h-32 sm:h-20 md:h-44 lg:h-60 w-full border border-border/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    />
                    <img
                        src="/dashboard.png"
                        alt="API Connections"
                        width={500}
                        height={500}
                        className="rounded-xl object-cover h-32 sm:h-20 md:h-44 lg:h-60 w-full border border-border/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Enterprise Security",
        content: (
            <div>
                <p className="text-muted-foreground text-sm sm:text-base font-normal mb-4 sm:mb-6 leading-relaxed">
                    Enterprise-grade security with end-to-end encryption, compliance certifications, and robust data protection. Your customer data and conversations are always secure and private.
                </p>
                <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="flex gap-1.5 sm:gap-2 items-center text-foreground text-xs sm:text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                        ✅ SOC 2 Type II Certified
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 items-center text-foreground text-xs sm:text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                        ✅ GDPR Compliant
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 items-center text-foreground text-xs sm:text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                        ✅ End-to-End Encryption
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 items-center text-foreground text-xs sm:text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                        ✅ 99.9% Uptime SLA
                    </div>
                </div>
                <img
                    src="/dashboard.png"
                    alt="Security Dashboard"
                    width={500}
                    height={500}
                    className="rounded-xl object-cover h-32 sm:h-20 md:h-44 lg:h-60 w-full border border-border/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                />
            </div>
        ),
    },
];

const keyFeatures = [
    {
        icon: PhoneIcon,
        title: "AI Voice Agents",
        description: "Human-like AI agents that handle calls with natural conversation flow, objection handling, and appointment booking.",
        benefits: ["Natural conversation", "Objection handling", "24/7 availability", "Multi-language support"]
    },
    {
        icon: BrainCircuitIcon,
        title: "Smart Lead Qualification",
        description: "Automatically qualify leads based on custom criteria, ensuring your sales team focuses on high-value prospects.",
        benefits: ["Custom qualification", "Lead scoring", "Automated routing", "Real-time insights"]
    },
    {
        icon: CalendarIcon,
        title: "Appointment Booking",
        description: "Seamlessly book appointments directly into your calendar with real-time availability checking and confirmations.",
        benefits: ["Real-time booking", "Calendar sync", "Automated reminders", "Time zone handling"]
    },
    {
        icon: BarChart3Icon,
        title: "Advanced Analytics",
        description: "Comprehensive insights into call performance, conversion rates, and ROI with detailed reporting dashboards.",
        benefits: ["Performance metrics", "Conversion tracking", "ROI analysis", "Custom reports"]
    },
    {
        icon: ClockIcon,
        title: "24/7 Operations",
        description: "Your AI agents work around the clock, handling calls across different time zones without breaks or holidays.",
        benefits: ["Always available", "Global coverage", "No downtime", "Consistent quality"]
    },
    {
        icon: UsersIcon,
        title: "Multi-Tenant Support",
        description: "Manage multiple organizations, teams, and campaigns from a single platform with advanced permissions.",
        benefits: ["Team management", "Role-based access", "Campaign isolation", "Scalable architecture"]
    },
    {
        icon: MessageSquareIcon,
        title: "Conversation AI",
        description: "Advanced natural language processing that understands context, sentiment, and intent in real-time.",
        benefits: ["Context awareness", "Sentiment analysis", "Intent recognition", "Dynamic responses"]
    },
    {
        icon: ShieldCheckIcon,
        title: "Enterprise Security",
        description: "Bank-grade security with end-to-end encryption, compliance certifications, and data protection.",
        benefits: ["End-to-end encryption", "SOC 2 certified", "GDPR compliant", "99.9% uptime"]
    },
    {
        icon: ZapIcon,
        title: "Smart Calling Engine",
        description: "Intelligent call routing and timing optimization that maximizes connection rates and minimizes wasted attempts.",
        benefits: ["Optimal timing detection", "Smart retry logic", "Connection rate optimization", "Predictive dialing"]
    },
    {
        icon: TrendingUpIcon,
        title: "Per-Minute Billing",
        description: "Transparent, usage-based pricing with 30-second increment billing. Pay only for what you use with no hidden fees.",
        benefits: ["30-second increments", "Transparent pricing", "No hidden fees", "Usage tracking"]
    },
    {
        icon: HeadphonesIcon,
        title: "Sequential Calling",
        description: "Focused, one-call-at-a-time approach ensuring quality conversations and better customer experience.",
        benefits: ["Quality over quantity", "Better focus", "Improved conversion", "Resource optimization"]
    }
];

const comparisonData = [
    {
        feature: "Availability",
        callAgent: "24/7 Never sleeps",
        traditional: "Business hours only"
    },
    {
        feature: "Scale",
        callAgent: "Unlimited concurrent calls",
        traditional: "Limited by team size"
    },
    {
        feature: "Consistency",
        callAgent: "Perfect every time",
        traditional: "Varies by agent"
    },
    {
        feature: "Cost",
        callAgent: "Fixed monthly rate",
        traditional: "Salary + benefits + training"
    },
    {
        feature: "Training Time",
        callAgent: "Instant deployment",
        traditional: "Weeks to months"
    },
    {
        feature: "Performance",
        callAgent: "Data-driven optimization",
        traditional: "Manual coaching required"
    },
    {
        feature: "Languages",
        callAgent: "100+ languages",
        traditional: "Limited by hiring"
    }
];

const testimonials = [
    {
        name: "Sarah Johnson",
        title: "VP of Sales, TechCorp",
        quote: "CallAgent increased our qualified leads by 300% in just 2 months. The AI agents are so natural, our prospects can't tell the difference."
    },
    {
        name: "Michael Chen",
        title: "CEO, StartupX",
        quote: "We went from 50 calls per day to 500 calls per day overnight. CallAgent scaled our outbound efforts without scaling our team."
    },
    {
        name: "Emily Rodriguez",
        title: "Sales Director, GrowthCo",
        quote: "The ROI is incredible. We're seeing 5x more appointments booked with half the cost of our previous sales team."
    },
    {
        name: "David Kim",
        title: "Founder, InnovateLab",
        quote: "24/7 lead qualification means we never miss an opportunity. Our conversion rates have doubled since implementing CallAgent."
    },
    {
        name: "Lisa Thompson",
        title: "CMO, ScaleUp Inc",
        quote: "The analytics and insights are game-changing. We can optimize our campaigns in real-time based on actual performance data."
    },
    {
        name: "Robert Wilson",
        title: "Head of Business Development",
        quote: "Setup was incredibly easy. We were making calls within hours, not weeks. The support team is outstanding."
    }
];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section - Simple and Clean */}
            <div className="relative">
                {/* Background gradient similar to homepage */}
                <div 
                    className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-background to-background"
                    style={{
                        backgroundImage: 'radial-gradient(100% 50% at 50% 0%, rgba(168,85,247,0.13) 0%, hsl(var(--background)) 50%, hsl(var(--background)) 100%)'
                    }}
                />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-20 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                        Powerful Features for Modern Sales Teams
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
                        Discover how CallAgent's AI-powered voice automation transforms your sales process with cutting-edge technology and intelligent workflows.
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 px-4">
                        <Link href="/register" className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                            Start Free Trial
                            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#features" className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-foreground bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:bg-card transition-all duration-300">
                            Explore Features
                        </Link>
                    </div>
                </div>
            </div>

            {/* Key Features Grid */}
            <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                            Why Choose CallAgent?
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-xl lg:max-w-2xl mx-auto px-4">
                            Powerful features designed to scale your sales operations and maximize your revenue potential.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">{keyFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-purple-300 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                                    {feature.description}
                                </p>
                                <ul className="space-y-1.5 sm:space-y-2">
                                    {feature.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                            <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 mr-1.5 sm:mr-2 flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline section */}
            <div className="relative">
                <Timeline data={timelineData} />
            </div>

            {/* Pricing Model Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-500/5 to-purple-600/10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                            Transparent Per-Minute Pricing
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-xl lg:max-w-2xl mx-auto px-4">
                            Fair, transparent pricing with 30-second billing increments. No hidden fees, no concurrent call limits.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">{/* Pricing cards here */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 text-center hover:border-purple-500/30 transition-all duration-300"
                        >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">30-Second Billing</h3>
                            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
                                Pay only for the time you use with precise 30-second increment billing. No waste, no overpaying.
                            </p>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1.5 sm:mr-2" />
                                    0-30 seconds = 0.5 minute
                                </div>
                                <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1.5 sm:mr-2" />
                                    31-60 seconds = 1.0 minute
                                </div>
                                <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1.5 sm:mr-2" />
                                    Professional telecom standard
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="bg-card/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 sm:p-8 text-center relative"
                        >
                            <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                                    Most Popular
                                </span>
                            </div>
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">Sequential Calling</h3>
                            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
                                Quality-focused approach with one call at a time. Better conversations, higher conversion rates.
                            </p>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 mr-1.5 sm:mr-2" />
                                    No concurrent call limits
                                </div>
                                <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 mr-1.5 sm:mr-2" />
                                    Better call quality
                                </div>
                                <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 mr-1.5 sm:mr-2" />
                                    Higher conversion rates
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 text-center hover:border-purple-500/30 transition-all duration-300"
                        >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <BrainCircuitIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">Smart Optimization</h3>
                            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
                                AI-powered call timing and routing to maximize connection rates and minimize costs.
                            </p>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-1.5 sm:mr-2" />
                                    Optimal timing detection
                                </div>
                                <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-1.5 sm:mr-2" />
                                    Smart retry logic
                                </div>
                                <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-1.5 sm:mr-2" />
                                    Cost optimization
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Pricing Benefits */}
                    <div className="mt-12 sm:mt-16 bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 sm:p-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-foreground">Why Our Pricing Model Works</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <div className="text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <span className="text-white font-bold text-sm sm:text-base">$</span>
                                </div>
                                <h4 className="font-semibold mb-1 sm:mb-2 text-foreground text-sm sm:text-base">No Hidden Fees</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">Transparent pricing with no setup costs or monthly minimums</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <BarChart3Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <h4 className="font-semibold mb-1 sm:mb-2 text-foreground text-sm sm:text-base">Usage Tracking</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">Real-time minute tracking and detailed usage reports</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <ZapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <h4 className="font-semibold mb-1 sm:mb-2 text-foreground text-sm sm:text-base">Instant Scaling</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">Scale up or down instantly without contract changes</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <h4 className="font-semibold mb-1 sm:mb-2 text-foreground text-sm sm:text-base">Quality Focused</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">Sequential calling ensures quality over quantity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 px-4 bg-card/20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                            CallAgent vs Traditional Methods
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            See how CallAgent compares to traditional sales approaches
                        </p>
                    </div>
                    
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left p-6 font-medium text-muted-foreground">Feature</th>
                                        <th className="text-center p-6 font-bold text-purple-400">CallAgent AI</th>
                                        <th className="text-center p-6 font-medium text-muted-foreground">Traditional Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, index) => (
                                        <tr key={index} className="border-b border-border/30 last:border-b-0">
                                            <td className="p-6 font-medium">{row.feature}</td>
                                            <td className="p-6 text-center">
                                                <div className="flex items-center justify-center">
                                                    <CheckCircleIcon className="w-5 h-5 text-purple-500 mr-2" />
                                                    <span className="text-purple-400 font-medium">{row.callAgent}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center text-muted-foreground">{row.traditional}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                            What Our Customers Say
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground px-4">
                            Real results from real businesses using CallAgent
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:border-purple-500/30 transition-all duration-300"
                            >
                                <div className="flex items-center mb-3 sm:mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">{/* testimonial content continues here */}
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-purple-600/10 to-purple-800/10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        Ready to Transform Your Sales?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Join thousands of businesses already using CallAgent to scale their sales operations and increase revenue.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                            Start Free Trial
                            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/pricing" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-foreground bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:bg-card transition-all duration-300">
                            View Pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            
        </div>
    );
}