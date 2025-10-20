"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  PhoneIcon, 
  BrainCircuitIcon, 
  CalendarIcon, 
  BarChart3Icon,
  ClockIcon,
  UsersIcon,
  MessageSquareIcon,
  TrendingUpIcon
} from 'lucide-react';

export const FeaturesList = () => {
  const features = [
    {
      icon: PhoneIcon,
      title: "AI Voice Agents",
      description: "Human-like AI agents that handle calls with natural conversation flow, objection handling, and appointment booking.",
      benefits: ["Natural conversation", "Objection handling", "24/7 availability"]
    },
    {
      icon: BrainCircuitIcon,
      title: "Smart Lead Qualification",
      description: "Automatically qualify leads based on custom criteria, ensuring your sales team focuses on high-value prospects.",
      benefits: ["Custom qualification", "Lead scoring", "Automated routing"]
    },
    {
      icon: CalendarIcon,
      title: "Appointment Booking",
      description: "Seamlessly book appointments directly into your calendar with real-time availability checking and confirmations.",
      benefits: ["Real-time booking", "Calendar sync", "Automated reminders"]
    },
    {
      icon: BarChart3Icon,
      title: "Advanced Analytics",
      description: "Comprehensive insights into call performance, conversion rates, and ROI with detailed reporting dashboards.",
      benefits: ["Performance metrics", "Conversion tracking", "ROI analysis"]
    },
    {
      icon: ClockIcon,
      title: "24/7 Operations",
      description: "Your AI agents work around the clock, handling calls across different time zones without breaks or holidays.",
      benefits: ["Always available", "Global coverage", "No downtime"]
    },
    {
      icon: UsersIcon,
      title: "Multi-Tenant Support",
      description: "Manage multiple organizations and teams with role-based access control and isolated data environments.",
      benefits: ["Team management", "Role permissions", "Data isolation"]
    },
    {
      icon: MessageSquareIcon,
      title: "Custom Scripts",
      description: "Create and customize conversation flows, scripts, and responses to match your brand voice and sales process.",
      benefits: ["Brand consistency", "Custom flows", "A/B testing"]
    },
    {
      icon: TrendingUpIcon,
      title: "Scalable Infrastructure",
      description: "Handle thousands of simultaneous calls with our cloud-based infrastructure that scales automatically.",
      benefits: ["Auto-scaling", "High availability", "Global reach"]
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to automate your sales process and scale your business with AI-powered voice agents.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 h-full hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Ready to Transform Your Sales Process?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses already using CallAgent to automate their sales and scale their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};