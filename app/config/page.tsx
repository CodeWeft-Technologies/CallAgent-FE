'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Settings, RotateCcw, Save, MessageSquare, ArrowRight, FileText, Database, RefreshCw, Languages, Mic, Volume2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import TTSVoiceDemo from '@/components/TTSVoiceDemo'
import ContactSalesModal from '@/components/ContactSalesModal'

interface AgentConfig {
  greeting_message: string
  exit_message: string
  system_prompt: string
  knowledge_base_enabled: boolean
  knowledge_base: string
  max_retries: number
  retry_delay: number
  tts_provider?: string
  stt_provider?: string
  active_template?: string
  agent_number?: string
  google_tts_voice_preference?: string
  google_tts_language_code?: string
}

interface OrganizationConfig {
  llm_tts_enabled: boolean
  feedback_system_enabled: boolean
}

const PROMPT_TEMPLATES = {
  'real-estate': {
    name: 'Real Estate Agent ',
    prompt: 'You are a professional real estate sales agent on a voice call. Your goal is to build rapport, understand needs, and schedule property visits. Provide helpful, detailed responses while keeping them conversational and engaging. Use natural Hindi-English mix when appropriate. Ask thoughtful questions to understand their requirements. Focus on benefits like location, amenities, and investment potential. Show enthusiasm and create urgency around limited availability. Provide specific details about properties, pricing, and offers. Always aim to move the conversation toward scheduling a site visit or meeting with clear next steps.'
  },
  'customer-service': {
    name: 'Customer Service ',
    prompt: 'You are a helpful customer service representative on a voice call. Your goal is to resolve issues quickly and leave customers satisfied. Provide comprehensive solutions and explanations to address their concerns fully. Be empathetic and solution-focused. Ask clarifying questions to understand the complete situation. Acknowledge concerns immediately, offer specific step-by-step solutions, and follow up to ensure satisfaction. Use positive language and turn problems into opportunities to exceed expectations. Explain processes clearly and provide all necessary information.'
  },
  'sales': {
    name: 'Sales Agent ',
    prompt: 'You are a persuasive sales professional on a voice call. Your goal is to identify needs, present solutions, and close deals. Provide detailed information about products, benefits, and ROI to help customers make informed decisions. Focus on customer benefits and value proposition. Ask discovery questions to understand pain points and requirements. Use social proof and create urgency with specific examples. Handle objections with empathy and provide alternative solutions. Always guide toward next steps like demos, trials, or purchases with clear explanations of the process.'
  },
  'appointment': {
    name: 'Appointment Booking',
    prompt: 'You are an efficient appointment scheduler on a voice call. Your goal is to book confirmed appointments quickly while providing excellent service. Be friendly, helpful, and thorough in gathering necessary information. Ask specific questions about availability and preferences. Offer multiple time options and explain the appointment process clearly. Handle scheduling conflicts smoothly and suggest alternatives with detailed explanations. Provide complete information about location, preparation, and what to expect. Always end with clear confirmation and next steps.'
  },
  'healthcare': {
    name: 'Healthcare Assistant ',
    prompt: 'You are a caring healthcare appointment assistant on a voice call. Your goal is to schedule appointments while being sensitive to patient needs and providing comprehensive information. Be compassionate, professional, and thorough in your responses. Ask gentle questions to understand their health concerns and scheduling needs. Prioritize urgent cases and offer flexible scheduling options. Provide clear instructions, preparation guidelines, and reassurance. Explain procedures, costs, and insurance information when relevant. Maintain patient confidentiality and follow HIPAA guidelines while being helpful and informative.'
  },
  'education': {
    name: 'Education Counselor ',
    prompt: 'You are an inspiring education counselor on a voice call. Your goal is to guide students toward enrollment and success by providing comprehensive information about programs and opportunities. Be encouraging, knowledgeable, and detailed in your responses. Ask about career goals, interests, and educational background. Highlight program benefits, career outcomes, success stories, and specific details about curriculum and faculty. Address concerns about fees, duration, job prospects, and admission requirements thoroughly. Provide clear information about application processes, deadlines, and financial aid. Always guide toward application or campus visit with specific next steps.'
  },
  'restaurant': {
    name: 'Restaurant Assistant ',
    prompt: 'You are a welcoming restaurant host on a voice call. Your goal is to secure reservations and promote the dining experience by providing detailed information about the restaurant. Be warm, enthusiastic, and informative about the restaurant offerings. Ask about party size, date, time preferences, and special occasions. Suggest popular dishes, special offers, dietary accommodations, and unique features of the restaurant. Handle busy times by offering alternatives and explaining wait times. Provide complete information about location, parking, dress code, and special services. Confirm reservations with clear details and express excitement to serve them.'
  },
  'generic': {
    name: 'Generic Assistant',
    prompt: 'You are a professional voice assistant helping customers achieve their goals. Provide helpful, comprehensive responses that fully address their needs and questions. Use natural, conversational language with appropriate Hindi-English mix when suitable. Ask thoughtful questions to understand their complete requirements. Listen actively and provide specific, actionable solutions with clear explanations. Be helpful, efficient, and thorough while maintaining a friendly tone. Always guide the conversation toward positive outcomes for the customer with detailed next steps and follow-up information.'
  }
}

const KNOWLEDGE_BASE_FIELDS = {
  'real-estate': [
    { key: 'company_name', label: 'Company Name', placeholder: 'e.g., ABC Real Estate Group - Your brand identity' },
    { key: 'developer_name', label: 'Developer Name', placeholder: 'e.g., XYZ Developers, Premium Builders - Build trust with reputation' },
    { key: 'locations', label: 'Project Locations', placeholder: 'e.g., Mumbai Andheri, Pune Baner, Bangalore Whitefield - Be specific with areas and connectivity' },
    { key: 'property_types', label: 'Property Types', placeholder: 'e.g., 1BHK ₹45L, 2BHK ₹65L, 3BHK ₹95L, Villas ₹2Cr - Include pricing for quick reference' },
    { key: 'price_range', label: 'Price Range & Payment Plans', placeholder: 'e.g., ₹45L-₹2.5Cr, 20% down payment, EMI from ₹25K, Construction-linked payment' },
    { key: 'amenities', label: 'Amenities & Lifestyle', placeholder: 'e.g., Swimming pool, Gym, Kids play area, 24/7 security, Power backup, Clubhouse - Highlight lifestyle benefits' },
    { key: 'possession_date', label: 'Possession & Construction Status', placeholder: 'e.g., Ready to move, Dec 2025 possession, RERA approved, 60% construction complete' },
    { key: 'financing_options', label: 'Financing & Loan Support', placeholder: 'e.g., Pre-approved loans from SBI/HDFC, 80% loan available, Processing fee waived, Loan consultant available' },
    { key: 'investment_benefits', label: 'Investment Benefits', placeholder: 'e.g., 15% appreciation expected, Rental yield 4-6%, Tax benefits under 80C, Prime location advantage' },
    { key: 'site_visit_info', label: 'Site Visit & Sample Flat', placeholder: 'e.g., Free site visit, Sample flat available, Weekend site visits, Pick-up facility from metro station' },
    { key: 'special_offers', label: 'Limited Time Offers', placeholder: 'e.g., Festive discount ₹2L, Early bird offer, No brokerage, Free car parking, Modular kitchen included' },
    { key: 'contact_info', label: 'Contact & Next Steps', placeholder: 'Sales office: 9AM-7PM, Site visit booking, Documentation support, Immediate possession units available' }
  ],
  'customer-service': [
    { key: 'company_name', label: 'Company Name', placeholder: 'Your Company Name - Build brand recognition' },
    { key: 'products', label: 'Products/Services', placeholder: 'Main products with key features - Focus on customer benefits' },
    { key: 'support_hours', label: 'Support Hours & Channels', placeholder: 'e.g., 24/7 phone support, Live chat 9AM-9PM, Email response within 2 hours' },
    { key: 'return_policy', label: 'Return & Exchange Policy', placeholder: 'e.g., 30-day hassle-free return, No questions asked, Free pickup, Instant refund' },
    { key: 'warranty_info', label: 'Warranty & Protection', placeholder: 'e.g., 2-year comprehensive warranty, Extended warranty available, On-site service' },
    { key: 'shipping_info', label: 'Shipping & Delivery', placeholder: 'e.g., Free shipping above ₹500, Same-day delivery in metro cities, Express delivery available' },
    { key: 'payment_methods', label: 'Payment Options', placeholder: 'e.g., All cards accepted, UPI, Net banking, EMI options, Buy now pay later' },
    { key: 'loyalty_program', label: 'Loyalty & Rewards', placeholder: 'e.g., Cashback on purchases, Loyalty points, Member exclusive discounts, Birthday offers' },
    { key: 'escalation_process', label: 'Issue Resolution', placeholder: 'Escalation to manager, Priority support for premium customers, Complaint tracking system' },
    { key: 'contact_info', label: 'Contact Information', placeholder: 'Support phone, WhatsApp, email, live chat - Multiple ways to reach us' }
  ],
  'sales': [
    { key: 'company_name', label: 'Company Name & USP', placeholder: 'Your Company Name - What makes you unique in the market' },
    { key: 'products', label: 'Products/Services Portfolio', placeholder: 'Complete product range with key differentiators and customer benefits' },
    { key: 'pricing_tiers', label: 'Pricing & Packages', placeholder: 'e.g., Starter ₹999/month, Professional ₹2999/month, Enterprise ₹9999/month - Clear value proposition' },
    { key: 'key_benefits', label: 'Unique Selling Points', placeholder: 'Why choose us: Cost savings, time efficiency, better results, proven track record' },
    { key: 'target_audience', label: 'Ideal Customer Profile', placeholder: 'e.g., SMEs with 10-100 employees, Annual revenue ₹1-10Cr, Growth-focused businesses' },
    { key: 'competitors', label: 'Competitive Advantages', placeholder: 'How we beat competition: Better pricing, superior features, faster implementation, local support' },
    { key: 'case_studies', label: 'Success Stories & ROI', placeholder: 'Customer success: 40% cost reduction, 3x faster processing, 99.9% uptime, 500+ happy clients' },
    { key: 'demo_trial', label: 'Trial & Demo Options', placeholder: 'e.g., 14-day free trial, Live demo in 15 minutes, Money-back guarantee, No setup fees' },
    { key: 'sales_process', label: 'Sales Journey', placeholder: 'Demo → Proposal → Trial → Contract → Onboarding - Clear next steps for prospects' },
    { key: 'urgency_factors', label: 'Limited Time Incentives', placeholder: 'e.g., 20% discount this month, Limited slots available, Price increase from next quarter' },
    { key: 'objection_handling', label: 'Common Objections & Responses', placeholder: 'Price concerns: ROI in 6 months, Budget constraints: Flexible payment plans, Competitor comparison' },
    { key: 'contact_info', label: 'Sales Contact & Scheduling', placeholder: 'Sales team direct line, Calendar booking link, WhatsApp for quick queries' }
  ],
  'appointment': [
    { key: 'business_name', label: 'Business Name & Specialty', placeholder: 'e.g., Dr. Smith Clinic - Specialized in Cardiology, 15+ years experience' },
    { key: 'service_types', label: 'Services & Treatments', placeholder: 'e.g., Consultation ₹500, Health checkup ₹1500, Specialized treatments available' },
    { key: 'appointment_duration', label: 'Appointment Duration & Process', placeholder: 'e.g., Consultation 30 mins, Detailed checkup 1 hour, Follow-up 15 mins' },
    { key: 'business_hours', label: 'Available Time Slots', placeholder: 'e.g., Mon-Sat 9AM-7PM, Sunday emergency only, Lunch break 1-2PM' },
    { key: 'location_address', label: 'Location & Accessibility', placeholder: 'Full address, nearest metro station, parking available, wheelchair accessible' },
    { key: 'booking_advance', label: 'Booking Requirements', placeholder: 'e.g., Book 1 day ahead for routine, Same day for urgent, Emergency slots available' },
    { key: 'cancellation_policy', label: 'Cancellation & Rescheduling', placeholder: 'e.g., 4 hours notice required, Free rescheduling once, Cancellation charges after 2 hours' },
    { key: 'payment_info', label: 'Payment & Insurance', placeholder: 'e.g., Cash/Card accepted, Insurance cashless, Online payment available, EMI for treatments' },
    { key: 'preparation_instructions', label: 'Appointment Preparation', placeholder: 'e.g., Bring previous reports, Fasting required for blood tests, Comfortable clothing' },
    { key: 'contact_info', label: 'Contact & Emergency', placeholder: 'Appointment booking: 9AM-6PM, Emergency: 24/7, WhatsApp for quick booking' }
  ],
  'healthcare': [
    { key: 'clinic_name', label: 'Clinic/Hospital Name & Reputation', placeholder: 'e.g., City Medical Center - 25 years of trusted healthcare, NABH accredited' },
    { key: 'doctor_info', label: 'Doctor Credentials & Experience', placeholder: 'e.g., Dr. John Smith - MD Cardiology, AIIMS Delhi, 20+ years, 10000+ successful cases' },
    { key: 'specializations', label: 'Medical Specializations', placeholder: 'e.g., Advanced Cardiology, Minimally invasive surgery, Preventive healthcare, Emergency medicine' },
    { key: 'consultation_fees', label: 'Consultation Fees & Packages', placeholder: 'e.g., First consultation ₹800, Follow-up ₹500, Health packages from ₹2500' },
    { key: 'appointment_slots', label: 'Doctor Availability', placeholder: 'e.g., Dr. Smith: Mon-Wed-Fri 10AM-2PM, Dr. Patel: Tue-Thu-Sat 3PM-7PM' },
    { key: 'emergency_services', label: 'Emergency & Critical Care', placeholder: 'e.g., 24/7 emergency, ICU facility, Ambulance service, Trauma care specialist' },
    { key: 'insurance_accepted', label: 'Insurance & Payment Options', placeholder: 'e.g., Cashless treatment for 50+ insurers, Corporate health packages, EMI available' },
    { key: 'facilities', label: 'Medical Facilities & Equipment', placeholder: 'e.g., Digital X-ray, ECG, 2D Echo, Pathology lab, Pharmacy, Modern operation theater' },
    { key: 'patient_care', label: 'Patient Care Services', placeholder: 'e.g., Dedicated patient coordinator, Home sample collection, Telemedicine available' },
    { key: 'location_info', label: 'Location & Accessibility', placeholder: 'Address, metro connectivity, parking for 50+ cars, wheelchair accessible, patient drop-off area' },
    { key: 'contact_emergency', label: 'Contact & Emergency Numbers', placeholder: 'Appointment: +91-XXXXXXXXXX, Emergency: +91-YYYYYYYYYY, WhatsApp booking available' }
  ],
  'education': [
    { key: 'institute_name', label: 'Institute Name & Accreditation', placeholder: 'e.g., ABC Learning Academy - ISO certified, Government recognized, 15+ years experience' },
    { key: 'courses_offered', label: 'Course Portfolio & Specializations', placeholder: 'e.g., Full Stack Development, Data Science with AI/ML, Digital Marketing with Google certification' },
    { key: 'course_duration', label: 'Course Duration & Format', placeholder: 'e.g., 6-month intensive, Weekend batches available, Online + Offline hybrid mode' },
    { key: 'fees_structure', label: 'Fees & Payment Options', placeholder: 'e.g., ₹45,000 total, ₹15K per installment, 0% EMI available, Scholarship for meritorious students' },
    { key: 'batch_timings', label: 'Batch Schedule & Flexibility', placeholder: 'e.g., Morning 9AM-12PM, Evening 6PM-9PM, Weekend 10AM-5PM, Flexible timing options' },
    { key: 'faculty_info', label: 'Faculty & Industry Experts', placeholder: 'e.g., Industry professionals from Google/Microsoft, 10+ years experience, Live project mentoring' },
    { key: 'placement_support', label: 'Placement & Career Support', placeholder: 'e.g., 95% placement record, Salary range ₹4-12 LPA, Interview preparation, Resume building' },
    { key: 'certification', label: 'Certification & Recognition', placeholder: 'e.g., Industry-recognized certificate, Google/Microsoft partnership, Government skill development certificate' },
    { key: 'practical_training', label: 'Hands-on Training & Projects', placeholder: 'e.g., Live projects, Industry internships, Portfolio development, Real-world case studies' },
    { key: 'demo_classes', label: 'Trial & Demo Options', placeholder: 'e.g., Free demo class this weekend, 1-week trial, Money-back guarantee, Course curriculum preview' },
    { key: 'student_support', label: 'Student Support Services', placeholder: 'e.g., 24/7 doubt clearing, Learning management system, Peer learning groups, Alumni network' },
    { key: 'contact_admission', label: 'Admission Process & Contact', placeholder: 'Admission counselor available 9AM-7PM, Online application, Document verification, Immediate enrollment' }
  ],
  'restaurant': [
    { key: 'restaurant_name', label: 'Restaurant Name & Concept', placeholder: 'e.g., Spice Garden Restaurant - Authentic North Indian cuisine in elegant ambiance' },
    { key: 'cuisine_type', label: 'Cuisine & Specialty Dishes', placeholder: 'e.g., North Indian, Chinese, Continental - Famous for Butter Chicken, Biryani, Live Tandoor' },
    { key: 'menu_highlights', label: 'Signature Dishes & Chef Specials', placeholder: 'e.g., Award-winning Butter Chicken ₹320, Chef special Biryani ₹280, Fresh seafood daily' },
    { key: 'price_range', label: 'Pricing & Value Proposition', placeholder: 'e.g., ₹300-600 per person, Family meals from ₹800, Lunch combos ₹180, Premium dining experience' },
    { key: 'operating_hours', label: 'Operating Hours & Peak Times', placeholder: 'e.g., 11AM-11PM daily, Lunch rush 12-3PM, Dinner peak 7-10PM, Late night menu till 1AM' },
    { key: 'seating_capacity', label: 'Seating & Ambiance Options', placeholder: 'e.g., 80 seats, Family sections, Couple booths, AC dining, Outdoor garden seating, Private party hall' },
    { key: 'special_services', label: 'Special Services & Events', placeholder: 'e.g., Home delivery within 5km, Birthday celebrations, Live music weekends, Corporate lunch packages' },
    { key: 'offers_promotions', label: 'Current Offers & Promotions', placeholder: 'e.g., 20% off on weekdays, Buy 2 get 1 free desserts, Happy hours 4-7PM, Weekend buffet ₹499' },
    { key: 'reservation_info', label: 'Reservation & Booking Policy', placeholder: 'e.g., Table booking recommended for dinner, No reservation fee, Group bookings 15+ people, Advance booking for weekends' },
    { key: 'location_info', label: 'Location & Accessibility', placeholder: 'Address with landmarks, valet parking available, near metro station, wheelchair accessible' },
    { key: 'contact_info', label: 'Contact & Ordering Options', placeholder: 'Phone reservations, WhatsApp ordering, Zomato/Swiggy delivery, Online table booking available' }
  ],
  'generic': [
    { key: 'company_name', label: 'Company Name', placeholder: 'Your Company Name' },
    { key: 'about', label: 'About Us', placeholder: 'Brief company description and mission' },
    { key: 'services', label: 'Services/Products', placeholder: 'What you offer to customers' },
    { key: 'contact', label: 'Contact Information', placeholder: 'Phone, email, address, website' }
  ]
}

const VOICE_OPTIONS: Record<string, { name: string; value: string }[]> = {
  'en-US': [
    { name: 'English (US) - Male', value: 'en-US-Standard-B' },
    { name: 'English (US) - Female', value: 'en-US-Standard-C' },
    { name: 'English (US) - Wavenet Male', value: 'en-US-Wavenet-D' },
    { name: 'English (US) - Wavenet Female', value: 'en-US-Wavenet-F' },
  ],
  'en-IN': [
    { name: 'English (India) - Chirp3 HD Achird', value: 'en-IN-Chirp3-HD-Achird' },
  ],
  'hi-IN': [
    { name: 'Hindi (India) - Female', value: 'hi-IN-Wavenet-A' },
    { name: 'Hindi (India) - Male', value: 'hi-IN-Wavenet-B' },
    { name: 'Hindi (India) - Female (Standard)', value: 'hi-IN-Standard-A' },
    { name: 'Hindi (India) - Male (Standard)', value: 'hi-IN-Standard-B' },
    { name: 'Hindi (India) - Chirp3 HD Sadaltager', value: 'hi-IN-Chirp3-HD-Sadaltager' },
  ],
  'bn-IN': [
    { name: 'Bengali (India) - Female', value: 'bn-IN-Wavenet-A' },
    { name: 'Bengali (India) - Male', value: 'bn-IN-Wavenet-B' },
  ],
  'ta-IN': [
    { name: 'Tamil (India) - Female', value: 'ta-IN-Wavenet-A' },
    { name: 'Tamil (India) - Male', value: 'ta-IN-Wavenet-B' },
  ],
  'te-IN': [
    { name: 'Telugu (India) - Female', value: 'te-IN-Standard-A' },
    { name: 'Telugu (India) - Male', value: 'te-IN-Standard-B' },
  ],
}

// Conversation Strategy Templates for Different Sales Scenarios
const CONVERSATION_STRATEGIES = {
  'cold_calling': {
    name: 'Cold Calling Strategy',
    description: 'Proven techniques for successful cold outreach',
    strategies: [
      'Open with a compelling hook within first 10 seconds',
      'Ask permission to continue: "Do you have 2 minutes?"',
      'Focus on customer pain points, not product features',
      'Use social proof: "Companies like yours are saving 30%"',
      'Ask discovery questions to understand needs',
      'Handle objections with empathy and alternatives',
      'Always end with a clear next step or appointment'
    ],
    sample_openers: [
      'Hi [Name], I help companies like yours reduce costs by 30%. Do you have 2 minutes?',
      'Hi [Name], we just helped [Similar Company] save ₹5 lakhs annually. Interested in hearing how?',
      'Hi [Name], quick question - are you still struggling with [Common Pain Point]?'
    ]
  },
  'warm_leads': {
    name: 'Warm Lead Conversion',
    description: 'Converting interested prospects into customers',
    strategies: [
      'Reference their previous interest or inquiry',
      'Acknowledge their specific needs mentioned before',
      'Provide personalized solutions based on their situation',
      'Share relevant case studies and success stories',
      'Create urgency with limited-time offers',
      'Address any concerns or objections proactively',
      'Guide toward immediate action or commitment'
    ],
    sample_openers: [
      'Hi [Name], thanks for your interest in [Product]. Based on your inquiry about [Specific Need]...',
      'Hi [Name], I saw you downloaded our [Resource]. How can we help you achieve [Their Goal]?',
      'Hi [Name], following up on your request for [Information]. I have some great news...'
    ]
  },
  'follow_up': {
    name: 'Follow-up Strategy',
    description: 'Re-engaging prospects and maintaining momentum',
    strategies: [
      'Reference previous conversation or interaction',
      'Provide new value or information since last contact',
      'Address any concerns raised in previous discussions',
      'Share updates, new features, or special offers',
      'Reconfirm their needs and timeline',
      'Suggest alternative solutions if original didn\'t fit',
      'Set clear expectations for next steps'
    ],
    sample_openers: [
      'Hi [Name], following up on our conversation about [Topic]. I have an update...',
      'Hi [Name], you mentioned [Concern] last time. I found a solution that addresses exactly that...',
      'Hi [Name], I know timing wasn\'t right before. Has your situation changed regarding [Need]?'
    ]
  },
  'objection_handling': {
    name: 'Objection Handling Framework',
    description: 'Professional responses to common objections',
    common_objections: {
      'price_too_high': {
        objection: 'Your price is too high',
        responses: [
          'I understand price is important. Let\'s look at the ROI - you\'ll save ₹X in Y months',
          'What if I could show you how this pays for itself in 6 months?',
          'Many clients felt the same initially. After seeing 40% cost savings, they wished they started sooner'
        ]
      },
      'need_to_think': {
        objection: 'I need to think about it',
        responses: [
          'Of course, it\'s an important decision. What specific aspects would you like to discuss?',
          'I understand. What information would help you make the best decision?',
          'That\'s wise. What\'s your typical decision-making process for investments like this?'
        ]
      },
      'budget_constraints': {
        objection: 'We don\'t have budget right now',
        responses: [
          'I understand budget timing. When do you typically plan for investments like this?',
          'What if we could structure this to fit your current budget with flexible payment terms?',
          'Many clients start with our basic package and upgrade as they see results. Would that work?'
        ]
      },
      'happy_with_current': {
        objection: 'We\'re happy with our current solution',
        responses: [
          'That\'s great to hear. What do you like most about your current setup?',
          'I\'m glad it\'s working. Are there any areas where you\'d like to see improvement?',
          'Excellent. How would you feel about a solution that could enhance what you already have?'
        ]
      }
    }
  },
  'closing_techniques': {
    name: 'Closing Techniques',
    description: 'Effective ways to secure commitment and next steps',
    techniques: [
      {
        name: 'Assumptive Close',
        description: 'Assume they\'re ready to proceed',
        example: 'Great! When would you like to start? This week or next week?'
      },
      {
        name: 'Alternative Close',
        description: 'Offer two positive choices',
        example: 'Would you prefer the standard package or premium package?'
      },
      {
        name: 'Urgency Close',
        description: 'Create time-sensitive motivation',
        example: 'This offer expires Friday. Shall we get you started today?'
      },
      {
        name: 'Summary Close',
        description: 'Recap benefits and ask for commitment',
        example: 'So you\'ll save ₹50K annually and get 24/7 support. Ready to move forward?'
      },
      {
        name: 'Question Close',
        description: 'Ask a question that leads to yes',
        example: 'Does this solution address your main concerns about [pain point]?'
      }
    ]
  },
  'rapport_building': {
    name: 'Rapport Building Techniques',
    description: 'Building trust and connection quickly',
    techniques: [
      'Use their name frequently throughout the conversation',
      'Mirror their communication style and pace',
      'Find common ground or shared experiences',
      'Show genuine interest in their business challenges',
      'Use active listening and repeat back their concerns',
      'Share relevant success stories from similar clients',
      'Be authentic and admit when you don\'t know something'
    ],
    conversation_starters: [
      'How long have you been with [Company]?',
      'What\'s the biggest challenge in your role right now?',
      'I noticed [Company] recently [Achievement/News]. Congratulations!',
      'What made you interested in exploring solutions like ours?'
    ]
  }
}

// Best Practices for Voice Conversations
const VOICE_CONVERSATION_BEST_PRACTICES = {
  'general_guidelines': [
    'Provide helpful, comprehensive responses while maintaining conversational flow',
    'Speak clearly and at moderate pace',
    'Use natural pauses to let information sink in',
    'Ask thoughtful questions to understand customer needs fully',
    'Confirm understanding before moving to next topic',
    'Use positive, enthusiastic tone throughout',
    'End each response with a clear next step or question',
    'Balance being thorough with being conversational and engaging'
  ],
  'language_tips': [
    'Use simple, conversational language',
    'Avoid jargon unless customer uses it first',
    'Use Hindi-English mix when culturally appropriate',
    'Repeat important information like prices and dates',
    'Use numbers clearly: "Forty-five thousand" not "45K"',
    'Spell out important details when needed',
    'Confirm spelling of names and contact information'
  ],
  'engagement_techniques': [
    'Start with energy and enthusiasm',
    'Use customer\'s name at least 3 times in conversation',
    'Ask engaging questions that require more than yes/no',
    'Share brief, relevant success stories',
    'Create mental pictures: "Imagine saving 2 hours daily"',
    'Use social proof: "Most of our clients see results in 30 days"',
    'Build urgency without being pushy'
  ],
  'handling_silence': [
    'Allow 3-5 seconds of silence after important questions',
    'Don\'t rush to fill every pause',
    'If silence extends, gently check: "Are you still there?"',
    'Use silence strategically after presenting offers',
    'Respect thinking time for important decisions',
    'Break long silences with helpful clarifications'
  ]
}

const API_BASE = process.env.NEXT_PUBLIC_CONFIG_API_URL || 'https://callagent-be-2.onrender.com'

export default function ConfigPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  
  const [config, setConfig] = useState<AgentConfig>({
    greeting_message: '',
    exit_message: '',
    system_prompt: '',
    knowledge_base_enabled: false,
    knowledge_base: '{}',
    max_retries: 0,
    retry_delay: 0,
    tts_provider: 'google',
    stt_provider: 'assemblyai',
    google_tts_voice_preference: 'female',
    google_tts_language_code: 'mr-IN'
  })
  const [activeTab, setActiveTab] = useState('greeting')
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('generic')
  const [jsonEditMode, setJsonEditMode] = useState(false)
  const [jsonEditValue, setJsonEditValue] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [availableTtsProviders, setAvailableTtsProviders] = useState<Array<{
    provider: string,
    name: string,
    description: string,
    source?: string,
    requires_own_key?: boolean,
    requires_configuration?: boolean
  }>>([])
  const [hasSuperAdminTtsConfig, setHasSuperAdminTtsConfig] = useState(false)
  const [canSelectTtsProvider, setCanSelectTtsProvider] = useState(false)
  const [contactSalesRequired, setContactSalesRequired] = useState(false)
  const [singleProviderOnly, setSingleProviderOnly] = useState(false)
  const [showContactSalesModal, setShowContactSalesModal] = useState(false)
  
  // Handle contact sales navigation
  const handleContactSales = () => {
    router.push('/contact')
  }
  
  // Organization configuration state
  const [orgConfig, setOrgConfig] = useState<OrganizationConfig>({
    llm_tts_enabled: true,
    feedback_system_enabled: false
  })

  useEffect(() => {
    loadConfig()
    loadOrgConfig()
    loadAvailableTtsProviders()
  }, [])

  const loadConfig = useCallback(async () => {
    if (!user?.organization_id) {
      console.error('No organization ID available')
      toast.error('Organization not found')
      return
    }

    if (!token) {
      console.error('No authentication token available')
      toast.error('Authentication required')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/org-config/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setConfig({
          greeting_message: data.greeting_message || '',
          exit_message: data.exit_message || '',
          system_prompt: data.system_prompt || '',
          knowledge_base_enabled: data.knowledge_base_enabled || false,
          knowledge_base: data.knowledge_base || '{}',
          max_retries: data.max_retries || 0,
          retry_delay: data.retry_delay || 0,
          tts_provider: data.tts_provider || 'google',
          stt_provider: data.stt_provider || 'assemblyai',
          agent_number: data.agent_number || '',
          google_tts_voice_preference: data.google_tts_voice_preference || 'female',
          google_tts_language_code: data.google_tts_language_code || 'mr-IN'
        })
        
        // Restore the selected template if it exists in the backend config
        if (data.active_template && PROMPT_TEMPLATES[data.active_template as keyof typeof PROMPT_TEMPLATES]) {
          setSelectedTemplate(data.active_template)
        }
        
        console.log('✅ Config loaded:', { tts: data.tts_provider, stt: data.stt_provider, template: data.active_template })
      } else {
        console.error('Failed to load config:', response.status)
        toast.error('Failed to load configuration')
      }
    } catch (error) {
      console.error('❌ Error loading config:', error)
      toast.error('Failed to load configuration')
    }
  }, [user?.organization_id, token])

  const loadAvailableTtsProviders = useCallback(async () => {
    if (!token) return

    try {
      const response = await fetch(`${API_BASE}/api/org-config/available-tts-providers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAvailableTtsProviders(data.available_providers || [])
        setHasSuperAdminTtsConfig(data.has_super_admin_config || false)
        setCanSelectTtsProvider(data.can_select_provider || false)
        setContactSalesRequired(data.contact_sales_required || false)
        setSingleProviderOnly(data.single_provider_only || false)
        console.log('✅ Available TTS providers loaded:', data)
      } else {
        console.error('Failed to load TTS providers:', response.status)
        // Set fallback state
        setContactSalesRequired(true)
        setAvailableTtsProviders([])
      }
    } catch (error) {
      console.error('❌ Error loading TTS providers:', error)
      // Set error fallback state
      setContactSalesRequired(true)
      setAvailableTtsProviders([])
    }
  }, [token])

  const loadOrgConfig = useCallback(async () => {
    if (!user?.organization_id || !token) return

    try {
      const response = await fetch(`${API_BASE}/api/org-config/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrgConfig({
          llm_tts_enabled: data.llm_tts_enabled ?? true,
          feedback_system_enabled: data.feedback_system_enabled ?? false
        })
        console.log('✅ Organization config loaded:', data)
      } else {
        console.error('Failed to load organization config:', response.status)
      }
    } catch (error) {
      console.error('❌ Error loading organization config:', error)
    }
  }, [user?.organization_id, token])

  const saveConfig = useCallback(async () => {
    if (!user?.organization_id) {
      console.error('No organization ID available')
      toast.error('Organization not found')
      return
    }

    if (!token) {
      console.error('No authentication token available')
      toast.error('Authentication required')
      return
    }

    setLoading(true)
    try {
      // Parse knowledge_base string to object for backend
      let knowledgeBaseObj = {}
      if (config.knowledge_base) {
        try {
          knowledgeBaseObj = typeof config.knowledge_base === 'string' 
            ? JSON.parse(config.knowledge_base) 
            : config.knowledge_base
        } catch (error) {
          console.error('Error parsing knowledge_base:', error)
          knowledgeBaseObj = {}
        }
      }

      const configToSave = {
        ...config,
        knowledge_base: knowledgeBaseObj,
        active_template: selectedTemplate
      }
      
      const response = await fetch(`${API_BASE}/api/org-config/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(configToSave)
      })
      
      if (response.ok) {
        toast.success('Configuration saved successfully!')
      } else {
        console.error('Failed to save config:', response.status)
        toast.error('Failed to save configuration')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }, [config, selectedTemplate, user?.organization_id, token])

  const saveOrgConfig = useCallback(async () => {
    if (!user?.organization_id || !token) {
      toast.error('Authentication required')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/org-config/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orgConfig)
      })
      
      if (response.ok) {
        toast.success('Call flow settings saved!')
      } else {
        console.error('Failed to save organization config:', response.status)
        toast.error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving organization config:', error)
      toast.error('Failed to save settings')
    }
  }, [orgConfig, user?.organization_id, token])

  const resetConfig = useCallback(() => {
    setConfig({
      greeting_message: '',
      exit_message: '',
      system_prompt: '',
      knowledge_base_enabled: false,
      knowledge_base: '{}',
      max_retries: 0,
      retry_delay: 0,
      tts_provider: 'google',
      stt_provider: 'deepgram',
      agent_number: ''
    })
    setSelectedTemplate('generic') // Reset to default template
    toast.success('Configuration reset to empty')
  }, [])

  const handleTemplateChange = useCallback((template: string) => {
    setSelectedTemplate(template)
    const templateData = PROMPT_TEMPLATES[template as keyof typeof PROMPT_TEMPLATES]
    setConfig(prev => ({
      ...prev,
      system_prompt: templateData.prompt
    }))
  }, [])

  const handleKnowledgeBaseToggle = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      knowledge_base_enabled: !prev.knowledge_base_enabled
    }))
  }, [])

  const handleTTSProviderChange = useCallback(async (provider: string) => {
    setConfig(prev => ({ ...prev, tts_provider: provider }))
    
    try {
      const response = await fetch(`${API_BASE}/api/org-config/tts-provider-preference`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ provider })
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success(`TTS provider preference updated to ${data.provider === 'google' ? 'Google TTS' : 'Cartesia TTS'}`)
        console.log('✅ TTS provider preference updated:', data)
      } else {
        const errorData = await response.json()
        toast.error(errorData.detail || 'Failed to update TTS provider preference')
        console.error('❌ TTS provider update failed:', errorData)
      }
    } catch (error) {
      console.error('❌ Error updating TTS provider:', error)
      toast.error('Failed to update TTS provider')
    }
  }, [token])

  const handleGoogleVoicePreferenceChange = useCallback(async (preference: 'male' | 'female') => {
    setConfig(prev => ({ ...prev, google_tts_voice_preference: preference }))
    try {
      const response = await fetch(`${API_BASE}/api/org-config/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ google_tts_voice_preference: preference })
      })
      if (response.ok) {
        const data = await response.json()
        toast.success(`Google voice set to ${data.google_tts_voice_preference === 'male' ? 'Male' : 'Female'}`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.detail || 'Failed to update Google voice')
      }
    } catch (error) {
      console.error('❌ Error updating Google voice preference:', error)
      toast.error('Failed to update Google voice')
    }
  }, [token])

  const handleSTTProviderChange = useCallback(async (provider: string) => {
    setConfig(prev => ({ ...prev, stt_provider: provider }))
    
    try {
      // Try WebSocket command first for real-time switching
      const wsMessage = {
        type: "switch_service",
        service_type: "stt",
        provider: provider
      }
      
      // Create a temporary WebSocket connection for service switching
      const ws = new WebSocket(`ws://localhost:8000/ws`)
      
      ws.onopen = () => {
        ws.send(JSON.stringify(wsMessage))
        console.log(`📤 Sent STT switch command: ${provider}`)
      }
      
      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data)
          if (response.type === "service_switched" && response.service_type === "stt") {
            toast.success(`STT provider switched to ${provider} (real-time)`)
            ws.close()
          } else if (response.type === "service_switch_error") {
            toast.error(`Failed to switch STT: ${response.message}`)
            ws.close()
          }
        } catch (e) {
          console.error('Error parsing WebSocket response:', e)
        }
      }
      
      ws.onerror = async () => {
        console.log('STT WebSocket failed, falling back to API call')
        ws.close()
        
        // Fallback to API call if WebSocket fails
        try {
          const response = await fetch(`${API_BASE}/api/org-config/`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...config, stt_provider: provider })
          })
          
          if (response.ok) {
            toast.success(`STT provider updated to ${provider} (API)`)
          } else {
            toast.error('Failed to update STT provider')
          }
        } catch (error) {
          console.error('Error updating STT provider via API:', error)
          toast.error('Failed to update STT provider')
        }
      }
      
      // Close WebSocket after 5 seconds if no response
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close()
        }
      }, 5000)
      
    } catch (error) {
      console.error('Error updating STT provider:', error)
      toast.error('Failed to update STT provider')
    }
  }, [])

  const handleKnowledgeBaseFieldChange = useCallback((field: string, value: string) => {
    try {
      let currentKB = {};
      
      if (config.knowledge_base) {
        if (typeof config.knowledge_base === 'object') {
          currentKB = config.knowledge_base;
        } else if (typeof config.knowledge_base === 'string') {
          currentKB = JSON.parse(config.knowledge_base);
        }
      }
      
      const updatedKB = { ...currentKB, [field]: value }
      setConfig(prev => ({
        ...prev,
        knowledge_base: JSON.stringify(updatedKB, null, 2)
      }))
    } catch (error) {
      // If parsing fails, start with a fresh object
      console.error('Error updating knowledge base:', error)
      const updatedKB = { [field]: value }
      setConfig(prev => ({
        ...prev,
        knowledge_base: JSON.stringify(updatedKB, null, 2)
      }))
    }
  }, [config.knowledge_base])

  const handleJsonEdit = useCallback(() => {
    setJsonEditMode(true)
    setJsonEditValue(config.knowledge_base || '{}')
    setJsonError('')
  }, [config.knowledge_base])

  const handleJsonSave = useCallback(() => {
    try {
      // Validate JSON
      JSON.parse(jsonEditValue)
      setConfig(prev => ({
        ...prev,
        knowledge_base: jsonEditValue
      }))
      setJsonEditMode(false)
      setJsonError('')
      toast.success('JSON updated successfully')
    } catch (error) {
      setJsonError('Invalid JSON format. Please check your syntax.')
    }
  }, [jsonEditValue])

  const handleJsonCancel = useCallback(() => {
    setJsonEditMode(false)
    setJsonEditValue('')
    setJsonError('')
  }, [])

  const handleCustomJsonPrompt = useCallback((customJson: string) => {
    try {
      // Validate the custom JSON
      JSON.parse(customJson)
      setConfig(prev => ({
        ...prev,
        knowledge_base: customJson
      }))
      toast.success('Custom JSON prompt applied successfully')
    } catch (error) {
      toast.error('Invalid JSON format in custom prompt')
    }
  }, [])

  const renderKnowledgeBaseField = useCallback((field: { key: string; label: string; placeholder: string }) => {
    let currentValue = ''
    try {
      let kb: Record<string, any> = {};
      if (config.knowledge_base) {
        if (typeof config.knowledge_base === 'object') {
          kb = config.knowledge_base;
        } else if (typeof config.knowledge_base === 'string') {
          kb = JSON.parse(config.knowledge_base);
        }
      }
      currentValue = kb[field.key] || ''
    } catch (error) {
      currentValue = ''
    }

    return (
      <div key={field.key} className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          {field.label}
        </label>
        <input
          type="text"
          value={currentValue}
          onChange={(e) => handleKnowledgeBaseFieldChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
    )
  }, [config.knowledge_base, handleKnowledgeBaseFieldChange])

  const handleGreetingMessageChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, greeting_message: value }))
  }, [])

  const handleExitMessageChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, exit_message: value }))
  }, [])

  const handleSystemPromptChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, system_prompt: value }))
  }, [])

  const handleMaxRetriesChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, max_retries: parseInt(value) }))
  }, [])

  const handleRetryDelayChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, retry_delay: parseInt(value) }))
  }, [])

  const handleAgentNumberChange = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, agent_number: value }))
  }, [])

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
  }, [])

  const tabs = [
    { id: 'greeting', name: 'Greeting', icon: MessageSquare },
    { id: 'exit', name: 'Exit', icon: ArrowRight },
    { id: 'behavior', name: 'Agent Behavior', icon: FileText },
    { id: 'knowledge', name: 'Knowledge Base', icon: Database },
    { id: 'voice', name: 'Voice Settings', icon: Mic },
    { id: 'callflow', name: 'Call Flow', icon: Volume2 },
    { id: 'retry', name: 'Call Retry', icon: RefreshCw },
    { id: 'forwarding', name: 'Call Forwarding', icon: ArrowRight }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Agent Configuration</h1>
          <p className="text-slate-400 mt-1">Customize your AI agent's behavior and responses</p>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center space-x-2 px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none justify-center sm:justify-start
                ${activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/50'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'greeting' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Greeting Message</h3>
                <p className="text-slate-400 mb-4">This message will be played when a call starts</p>
                
                {/* Lead Name Instructions */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-4">
                  <h4 className="text-blue-300 font-medium mb-2">💡 Personalize with Lead Name</h4>
                  <p className="text-blue-200 text-sm mb-3">
                    You can include the caller's name in your greeting message by using the variable <code className="bg-blue-800/50 px-2 py-1 rounded text-blue-100">{'{{lead_name}}'}</code>
                  </p>
                  <div className="space-y-2">
                    <p className="text-blue-200 text-sm font-medium">Examples:</p>
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                       <p className="text-slate-300 text-sm">• "Hello {'{{lead_name}}'}, thank you for calling ABC Real Estate!"</p>
                       <p className="text-slate-300 text-sm">• "Hi {'{{lead_name}}'}, I'm here to help you with your property needs."</p>
                       <p className="text-slate-300 text-sm">• "Good day {'{{lead_name}}'}, how can I assist you today?"</p>
                     </div>
                    <p className="text-blue-200 text-xs mt-2">
                      <strong>Note:</strong> If no lead name is available, the variable will be replaced with a generic greeting.
                    </p>
                  </div>
                </div>
                
                <textarea
                  value={config.greeting_message || ''}
                  onChange={(e) => handleGreetingMessageChange(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your greeting message... Use {lead_name} to include the caller's name"
                />
                <p className="text-sm text-slate-500 mt-2">Character count: {(config.greeting_message || '').length}</p>
              </div>
            </div>
          )}

          {activeTab === 'exit' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Exit Message</h3>
                <p className="text-slate-400 mb-4">This message will be played when a call ends</p>
                <textarea
                  value={config.exit_message || ''}
                  onChange={(e) => handleExitMessageChange(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your exit message..."
                />
                <p className="text-sm text-slate-500 mt-2">Character count: {(config.exit_message || '').length}</p>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">System Prompt Template</h3>
                <p className="text-slate-400 mb-4">Choose a template or customize your system prompt</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {Object.entries(PROMPT_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => handleTemplateChange(key)}
                      className={`
                        p-4 rounded-xl border-2 transition-all text-left
                        ${selectedTemplate === key
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                        }
                      `}
                    >
                      <div className="font-medium text-white mb-1">{template.name}</div>
                      <div className="text-sm text-slate-400">{template.prompt.substring(0, 80)}...</div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Custom System Prompt
                  </label>
                  <textarea
                    value={config.system_prompt || ''}
                    onChange={(e) => handleSystemPromptChange(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter your custom system prompt..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Knowledge Base</h3>
                  <p className="text-slate-400">Enable and configure custom knowledge for your agent</p>
                </div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.knowledge_base_enabled || false}
                    onChange={handleKnowledgeBaseToggle}
                    className="w-5 h-5 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-200">Enable Knowledge Base</span>
                </label>
              </div>

              {config.knowledge_base_enabled && (
                <div className="space-y-6">
                  {selectedTemplate === 'generic' ? (
                    // Generic template with JSON editor functionality
                    <div className="space-y-6">
                      <div className="bg-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-semibold text-white flex items-center">
                            <Database className="w-4 h-4 mr-2" />
                            Knowledge Base Configuration
                          </h4>
                          <div className="flex space-x-2">
                            {!jsonEditMode ? (
                              <button
                                onClick={handleJsonEdit}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                              >
                                Edit JSON
                              </button>
                            ) : (
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleJsonSave}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleJsonCancel}
                                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {jsonEditMode ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-200 mb-2">
                                Edit Knowledge Base JSON
                              </label>
                              <textarea
                                value={jsonEditValue}
                                onChange={(e) => setJsonEditValue(e.target.value)}
                                rows={12}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                placeholder="Enter your JSON configuration..."
                              />
                              {jsonError && (
                                <p className="text-red-400 text-sm mt-2">{jsonError}</p>
                              )}
                            </div>
                            
                            <div className="bg-slate-700/50 rounded-lg p-4">
                               <h5 className="text-sm font-medium text-slate-200 mb-2">Custom JSON Prompt Example:</h5>
                               <pre className="text-xs text-slate-400 whitespace-pre-wrap">
{`{
  "company_name": "Your Company Name",
  "services": "Your main services or products",
  "contact_info": "Phone, email, website",
  "business_hours": "Operating hours",
  "special_offers": "Current promotions",
  "key_benefits": "What makes you unique"
}`}
                               </pre>
                               <div className="mt-3 pt-3 border-t border-slate-600">
                                 <h6 className="text-xs font-medium text-slate-300 mb-2">Quick Actions:</h6>
                                 <div className="flex flex-wrap gap-2">
                                   <button
                                     onClick={() => handleCustomJsonPrompt('{"company_name": "Sample Company", "services": "Professional services", "contact_info": "contact@company.com", "business_hours": "9 AM - 6 PM", "special_offers": "Free consultation", "key_benefits": "Expert solutions"}')}
                                     className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs rounded border border-blue-600/30 transition-colors"
                                   >
                                     Load Sample
                                   </button>
                                   <button
                                     onClick={() => setJsonEditValue('{}')}
                                     className="px-2 py-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 text-xs rounded border border-gray-600/30 transition-colors"
                                   >
                                     Clear All
                                   </button>
                                   <button
                                     onClick={() => setJsonEditValue(JSON.stringify(JSON.parse(jsonEditValue), null, 2))}
                                     className="px-2 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-xs rounded border border-green-600/30 transition-colors"
                                   >
                                     Format JSON
                                   </button>
                                 </div>
                               </div>
                             </div>
                          </div>
                        ) : (
                          <div className="bg-slate-700 rounded-lg p-4">
                            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
                              {(() => {
                                try {
                                  if (!config.knowledge_base) return '{}';
                                  // If it's already an object, stringify it directly
                                  if (typeof config.knowledge_base === 'object') {
                                    return JSON.stringify(config.knowledge_base, null, 2);
                                  }
                                  // If it's a string, try to parse and re-stringify
                                  return JSON.stringify(JSON.parse(config.knowledge_base), null, 2);
                                } catch (error) {
                                  // If parsing fails, return the raw string or empty object
                                  return typeof config.knowledge_base === 'string' ? config.knowledge_base : '{}';
                                }
                              })()}
                            </pre>
                          </div>
                        )}
                        
                        <div className="flex items-start space-x-3 text-sm text-slate-400 mt-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p>
                            For the generic template, you can directly edit the JSON configuration. 
                            This allows you to add custom fields and structure your knowledge base 
                            exactly as needed for your specific use case.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Other templates with form fields
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {KNOWLEDGE_BASE_FIELDS[selectedTemplate as keyof typeof KNOWLEDGE_BASE_FIELDS]?.map(renderKnowledgeBaseField)}
                      </div>
                      
                      <div className="bg-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-semibold text-white flex items-center">
                            <Database className="w-4 h-4 mr-2" />
                            Knowledge Base Preview
                          </h4>
                          <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                            Auto-generated from form fields
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-slate-700 rounded-lg p-4">
                            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
                              {(() => {
                                try {
                                  if (!config.knowledge_base) return '{}';
                                  // If it's already an object, stringify it directly
                                  if (typeof config.knowledge_base === 'object') {
                                    return JSON.stringify(config.knowledge_base, null, 2);
                                  }
                                  // If it's a string, try to parse and re-stringify
                                  return JSON.stringify(JSON.parse(config.knowledge_base), null, 2);
                                } catch (error) {
                                  // If parsing fails, return the raw string or empty object
                                  return typeof config.knowledge_base === 'string' ? config.knowledge_base : '{}';
                                }
                              })()}
                            </pre>
                          </div>
                          
                          <div className="flex items-start space-x-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p>
                              This knowledge base is automatically generated from the form fields above. 
                              Your AI agent will use this structured information to provide accurate, 
                              business-specific responses to customers.
                            </p>
                          </div>
                          
                          <div className="flex items-start space-x-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p>
                              Fill out the form fields above to automatically populate this knowledge base 
                              with your business information. No JSON knowledge required!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Voice Settings</h3>
                <p className="text-slate-400 mb-4">Configure Text-to-Speech (TTS) and Speech-to-Text (STT) providers</p>
                
                {/* Current Status Display */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Current Active Services
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Text-to-Speech (TTS)</p>
                        <p className="text-xs text-slate-400">Converting text to speech</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-400">
                          {(Array.isArray(availableTtsProviders) ? availableTtsProviders.find(p => p.provider === config.tts_provider) : null)?.name || 
                           (config.tts_provider === 'cartesia' ? 'Cartesia TTS' : 'Google TTS')}
                        </p>
                        <div className="flex items-center text-xs text-green-400">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                          Active
                          {hasSuperAdminTtsConfig && ' (Admin Configured)'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Speech-to-Text (STT)</p>
                        <p className="text-xs text-slate-400">Converting speech to text</p>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-medium text-green-400">
                           {config.stt_provider === 'cartesia' ? 'Cartesia STT' : 'AssemblyAI STT'}
                         </p>
                        <div className="flex items-center text-xs text-green-400">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                          Active
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Contact Sales Message */}
                  {contactSalesRequired && (
                    <div className="p-4 bg-blue-900/20 border border-blue-600 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm">💬</span>
                        </div>
                        <div>
                          <h4 className="text-blue-200 font-medium mb-2">Contact Sales Team for Voice Access</h4>
                          <p className="text-blue-100 text-sm mb-3">
                            No TTS (Text-to-Speech) providers have been configured for your organization. 
                            To enable voice capabilities for your AI agent, please contact our sales team.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button 
                              onClick={handleContactSales}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                            >
                              Contact Sales Team
                            </button>
                            <button className="px-4 py-2 bg-blue-900/50 hover:bg-blue-800/50 text-blue-200 rounded-lg text-sm transition-colors">
                              Learn More About Voice Features
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Single Provider Message */}
                  {singleProviderOnly && availableTtsProviders.length === 1 && (
                    <div className="p-4 bg-green-900/20 border border-green-600 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          <h4 className="text-green-200 font-medium mb-2">Voice Provider Configured</h4>
                          <p className="text-green-100 text-sm mb-3">
                            Your organization has access to <strong>{availableTtsProviders[0]?.name}</strong> for voice synthesis.
                            For additional voice options, contact our sales team to upgrade your plan.
                          </p>
                          <button 
                            onClick={handleContactSales}
                            className="px-4 py-2 bg-green-900/50 hover:bg-green-800/50 text-green-200 rounded-lg text-sm transition-colors"
                          >
                            Contact Sales for More Options
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TTS Provider Selection (only when multiple providers available) */}
                  {canSelectTtsProvider && availableTtsProviders.length > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Choose Your Voice Provider
                        <span className="ml-2 px-2 py-1 text-xs bg-green-600 text-white rounded-full">
                          Super Admin Configured
                        </span>
                      </label>
                      <select
                        value={config.tts_provider || availableTtsProviders[0]?.provider || ''}
                        onChange={(e) => handleTTSProviderChange(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        {availableTtsProviders.map((provider) => (
                          <option key={provider.provider} value={provider.provider}>
                            {provider.name}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 space-y-1">
                        {(Array.isArray(availableTtsProviders) ? availableTtsProviders.find(p => p.provider === config.tts_provider) : null) && (
                          <p className="text-sm text-slate-500">
                            {(Array.isArray(availableTtsProviders) ? availableTtsProviders.find(p => p.provider === config.tts_provider) : null)?.description}
                          </p>
                        )}
                        <p className="text-sm text-green-400">
                          ✅ Both providers configured by super admin - choose your preference
                        </p>
                      </div>
                      
                      {config.tts_provider === 'google' && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            Google Voice: Male or Female
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="radio"
                                name="googleVoice"
                                value="female"
                                checked={(config.google_tts_voice_preference || 'female') === 'female'}
                                onChange={() => handleGoogleVoicePreferenceChange('female')}
                              />
                              <span className="text-slate-300 text-sm">Female (mr-IN-Chirp3-HD-Achernar)</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="radio"
                                name="googleVoice"
                                value="male"
                                checked={(config.google_tts_voice_preference || 'female') === 'male'}
                                onChange={() => handleGoogleVoicePreferenceChange('male')}
                              />
                              <span className="text-slate-300 text-sm">Male (mr-IN-Chirp3-HD-Orus)</span>
                            </label>
                          </div>
                          <p className="text-xs text-slate-500 mt-2">
                            Multi-tenant: stored per organization, applies to live calls immediately.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Current Provider Display (when only one option) */}
                  {!canSelectTtsProvider && availableTtsProviders.length === 1 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Current Voice Provider
                      </label>
                      <div className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white">
                        {availableTtsProviders[0]?.name}
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-slate-500">
                          {availableTtsProviders[0]?.description}
                        </p>
                        <p className="text-sm text-green-400">
                          ✅ Configured and ready to use
                        </p>
                      </div>
                      
                      {availableTtsProviders[0]?.provider === 'google' && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-slate-200 mb-2">
                            Google Voice: Male or Female
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="radio"
                                name="googleVoiceSingle"
                                value="female"
                                checked={(config.google_tts_voice_preference || 'female') === 'female'}
                                onChange={() => handleGoogleVoicePreferenceChange('female')}
                              />
                              <span className="text-slate-300 text-sm">Female (mr-IN-Chirp3-HD-Achernar)</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="radio"
                                name="googleVoiceSingle"
                                value="male"
                                checked={(config.google_tts_voice_preference || 'female') === 'male'}
                                onChange={() => handleGoogleVoicePreferenceChange('male')}
                              />
                              <span className="text-slate-300 text-sm">Male (mr-IN-Chirp3-HD-Orus)</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Voice Demos Section */}
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-slate-200 mb-4 flex items-center space-x-2">
                      <Volume2 className="w-5 h-5 text-blue-400" />
                      <span>Voice Demos</span>
                    </h4>
                    <p className="text-sm text-slate-400 mb-4">
                      Listen to voice samples from our TTS providers to choose the best fit for your needs.
                    </p>
                    
                    <div className="space-y-3">
                      {/* Google TTS Demo */}
                      <TTSVoiceDemo
                        provider="google"
                        providerName="Google TTS"
                        demoText="In English: I will sound clear and natural — just like this! In Hindi: अब मैं हिंदी में बोलूँगा — मेरी आवाज़ सहज और स्पष्ट लगेगी। In Marathi: आता मी मराठीत बोलेन — माझा आवाज नैसर्गिक आणि गोड वाटेल."
                        isAvailable={availableTtsProviders.some(p => p.provider === 'google')}
                        onContactSales={handleContactSales}
                      />
                      
                      {/* Cartesia TTS Demo */}
                      <TTSVoiceDemo
                        provider="cartesia"
                        providerName="Cartesia TTS"
                        demoText="In English: I will sound clear and natural — just like this! In Hindi: अब मैं हिंदी में बोलूँगा — मेरी आवाज़ सहज और स्पष्ट लगेगी। In Marathi: आता मी मराठीत बोलेन — माझा आवाज नैसर्गिक आणि गोड वाटेल."
                        isAvailable={availableTtsProviders.some(p => p.provider === 'cartesia')}
                        onContactSales={handleContactSales}
                      />
                    </div>

                    {/* Contact Sales CTA for non-configured providers */}
                    {(!hasSuperAdminTtsConfig || availableTtsProviders.length === 0) && (
                      <div className="mt-4 p-4 bg-orange-900/20 border border-orange-600/30 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <Volume2 className="w-5 h-5 text-orange-400 mt-0.5" />
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-orange-200 mb-1">
                              Want More Voice Options?
                            </h5>
                            <p className="text-sm text-orange-300/80 mb-3">
                              Get access to premium voice providers, custom voice training, and enterprise features.
                            </p>
                            <button
                              onClick={handleContactSales}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                            >
                              Contact Sales for Enterprise Features
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Provider Information */}
                <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <h4 className="text-md font-medium text-white mb-3">Available Provider Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {/* TTS Providers */}
                    {availableTtsProviders.map((provider) => (
                      <div key={provider.provider}>
                        <h5 className="font-medium text-slate-300 mb-2 flex items-center flex-wrap gap-1">
                          {provider.name}
                          {provider.provider === config.tts_provider && (
                            <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">
                              Active
                            </span>
                          )}
                          {provider.source === 'super_admin' && (
                            <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                              Admin Configured
                            </span>
                          )}
                          {provider.source === 'organization' && (
                            <span className="px-2 py-1 text-xs bg-purple-600 text-white rounded-full">
                              Own Key
                            </span>
                          )}
                          {provider.requires_configuration && (
                            <span className="px-2 py-1 text-xs bg-amber-600 text-white rounded-full">
                              Needs Setup
                            </span>
                          )}
                        </h5>
                        <ul className="text-slate-400 space-y-1">
                          {provider.provider === 'google' && (
                            <>
                              <li>• Multiple language support</li>
                              <li>• High-quality voices</li>
                              <li>• Reliable and stable</li>
                            </>
                          )}
                          {provider.provider === 'cartesia' && (
                            <>
                              <li>• Ultra-low latency</li>
                              <li>• Natural-sounding voices</li>
                              <li>• Real-time streaming</li>
                            </>
                          )}
                          <li>• {provider.description}</li>
                          {provider.source === 'super_admin' && (
                            <li>• ✅ Ready to use (super admin configured)</li>
                          )}
                          {provider.source === 'organization' && (
                            <li>• 🔑 Using your organization's API key</li>
                          )}
                        </ul>
                      </div>
                    ))}

                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'retry' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Call Retry Configuration</h3>
                <p className="text-slate-400 mb-6">Configure automatic retry behavior for missed calls</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Max Retries */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Maximum Retries
                    </label>
                    <select
                      value={config.max_retries}
                      onChange={(e) => handleMaxRetriesChange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value={0}>No retries</option>
                      <option value={1}>1 retry</option>
                      <option value={2}>2 retries</option>
                      <option value={3}>3 retries (recommended)</option>
                      <option value={4}>4 retries</option>
                      <option value={5}>5 retries</option>
                      <option value={6}>6 retries</option>
                      <option value={7}>7 retries</option>
                      <option value={8}>8 retries</option>
                      <option value={9}>9 retries</option>
                      <option value={10}>10 retries (maximum)</option>
                    </select>
                    <p className="text-sm text-slate-500 mt-2">
                      Number of times to retry a missed call before giving up
                    </p>
                  </div>

                  {/* Retry Delay */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Retry Delay (seconds)
                    </label>
                    <select
                      value={config.retry_delay}
                      onChange={(e) => handleRetryDelayChange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value={5}>5 seconds</option>
                      <option value={10}>10 seconds (recommended)</option>
                      <option value={15}>15 seconds</option>
                      <option value={20}>20 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={45}>45 seconds</option>
                      <option value={60}>1 minute</option>
                      <option value={120}>2 minutes</option>
                      <option value={300}>5 minutes</option>
                    </select>
                    <p className="text-sm text-slate-500 mt-2">
                      Time to wait between retry attempts
                    </p>
                  </div>
                </div>

                {/* Retry Info */}
                <div className="bg-slate-800 rounded-xl p-6 mt-6">
                  <h4 className="text-md font-semibold text-white mb-3 flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    How Call Retry Works
                  </h4>
                  <div className="space-y-3 text-slate-400">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>When a call is missed (no answer, busy, or rejected), the system automatically schedules a retry</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Retries happen after the configured delay period</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Maximum retry limit prevents infinite calling loops</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Works for both individual calls and sequential calling sessions</p>
                    </div>
                  </div>

                  {/* Current Configuration Display */}
                  <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                    <h5 className="text-sm font-medium text-white mb-2">Current Configuration:</h5>
                    <div className="text-sm text-slate-300">
                      <p>• Maximum retries: <span className="text-blue-400 font-medium">{config.max_retries}</span></p>
                      <p>• Retry delay: <span className="text-blue-400 font-medium">{config.retry_delay} seconds</span></p>
                      <p className="mt-2 text-slate-400">
                        {config.max_retries === 0 
                          ? "⚠️ Retries are disabled - missed calls will not be retried"
                          : `✅ Missed calls will be retried up to ${config.max_retries} times with ${config.retry_delay}s delay`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'callflow' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Call Flow Settings</h3>
                <p className="text-slate-400 mb-4">Configure how calls are handled by the system</p>
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <h4 className="text-blue-300 font-medium mb-2">� How Call Flow Works</h4>
                  <div className="space-y-2 text-blue-200 text-sm">
                    <p><strong>LLM + TTS Enabled:</strong> Normal AI conversation with full interactive features</p>
                    <p><strong>LLM + TTS Disabled:</strong> Only plays greeting message and ends the call</p>
                    <p>• When disabled, callers will hear the greeting message and the call will automatically terminate</p>
                    <p>• When enabled, callers can have full conversation with the AI assistant</p>
                    <p>• Feedback system remains separate and works independently</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Enable LLM + TTS */}
                  <div className="bg-slate-800/50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-1">
                          Enable LLM + TTS
                        </label>
                        <p className="text-sm text-slate-400">
                          When enabled, normal AI conversation flow. When disabled, only greeting and hang up.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={orgConfig.llm_tts_enabled}
                          onChange={(e) => setOrgConfig(prev => ({ 
                            ...prev, 
                            llm_tts_enabled: e.target.checked 
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Enable Feedback System */}
                  <div className="bg-slate-800/50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-1">
                          Enable Feedback System
                        </label>
                        <p className="text-sm text-slate-400">
                          When enabled, calls will play feedback content instead of normal AI conversation
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={orgConfig.feedback_system_enabled}
                          onChange={(e) => setOrgConfig(prev => ({ 
                            ...prev, 
                            feedback_system_enabled: e.target.checked 
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Note about greeting message */}
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-600/50">
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-400 mt-0.5">ℹ️</div>
                      <div>
                        <h4 className="text-slate-200 font-medium mb-1">Greeting Message Configuration</h4>
                        <p className="text-sm text-slate-400">
                          When LLM+TTS is disabled, the system will play the <strong>Greeting Message</strong> configured in the AI Configuration tab, then automatically end the call.
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          To customize this message, go to the "AI Configuration" tab and update the "Greeting Message" field.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={saveOrgConfig}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Call Flow Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forwarding' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Call Forwarding</h3>
                <p className="text-slate-400 mb-4">Configure agent number for call forwarding when needed</p>
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <h4 className="text-blue-300 font-medium mb-2">📞 How Call Forwarding Works</h4>
                  <div className="space-y-2 text-blue-200 text-sm">
                    <p>• When an agent number is configured, incoming calls can be forwarded to that number</p>
                    <p>• If no agent number is set, calls will be handled by the AI assistant</p>
                    <p>• Forwarded calls have a 5-minute duration limit with 20-second timeout</p>
                    <p>• System will retry forwarding up to 2 times if the agent doesn't answer</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Agent Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">+91</span>
                    <input
                      type="tel"
                      value={config.agent_number ? config.agent_number.replace(/^\+91/, '') : ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, ''); // Only allow digits
                        handleAgentNumberChange(value ? `+91${value}` : '');
                      }}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Enter 10-digit mobile number. +91 prefix will be added automatically. Leave empty to disable call forwarding.
                  </p>
                </div>

                {/* Current Configuration Display */}
                <div className="bg-slate-800 rounded-xl p-6 mt-6">
                  <h4 className="text-md font-semibold text-white mb-3 flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Current Forwarding Configuration
                  </h4>
                  <div className="text-sm text-slate-300">
                    <p>• Agent Number: <span className="text-blue-400 font-medium">{config.agent_number || 'Not configured'}</span></p>
                    <p className="mt-2 text-slate-400">
                      {!config.agent_number || config.agent_number.trim() === ''
                        ? "🤖 Calls will be handled by AI assistant"
                        : `📞 Calls will be forwarded to ${config.agent_number}`
                      }
                    </p>
                  </div>
                </div>

                {/* Forwarding Settings Info */}
                <div className="bg-slate-800 rounded-xl p-6 mt-6">
                  <h4 className="text-md font-semibold text-white mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Forwarding Settings
                  </h4>
                  <div className="space-y-3 text-slate-400">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong>Duration:</strong> 5 minutes maximum call duration</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong>Timeout:</strong> 20 seconds ring time before considering no answer</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong>Retries:</strong> Up to 2 retry attempts if agent doesn't answer</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p><strong>Fallback:</strong> If forwarding fails, call will be handled by AI assistant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={resetConfig}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Empty</span>
        </button>

        <button
          onClick={saveConfig}
          disabled={loading}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* How it works */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
        <div className="space-y-3 text-slate-400">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Greeting messages are played when calls start to welcome callers</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Exit messages are played when calls end to provide closure</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>System prompts define your agent's personality and behavior for voice calls</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Voice-optimized prompts keep responses short and natural for real conversations</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Knowledge base provides specific information for your agent to reference</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Use contractions (I'll, we're, that's) and simple language for phone calls</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Call retry settings automatically retry missed calls to improve contact rates</p>
          </div>
        </div>
      </div>

      {/* Contact Sales Modal */}
      <ContactSalesModal
        isOpen={showContactSalesModal}
        onClose={() => setShowContactSalesModal(false)}
        feature="Advanced TTS Voice Options"
      />
    </div>
  )
}
 
