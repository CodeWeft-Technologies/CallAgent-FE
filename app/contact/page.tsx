"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    PhoneIcon, 
    MailIcon, 
    MapPinIcon, 
    ClockIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    MessageCircleIcon,
    UsersIcon,
    HeadphonesIcon,
    CalendarIcon,
    StarIcon,
    SendIcon
} from 'lucide-react';
import Link from 'next/link';

const contactMethods = [
    {
        icon: PhoneIcon,
        title: "Phone Support",
        description: "Speak directly with our experts",
        contact: "+1 (555) 123-4567",
        availability: "Mon-Fri 9AM-6PM IST",
        color: "from-blue-500 to-blue-600"
    },
    {
        icon: MailIcon,
        title: "Email Support",
        description: "Get detailed help via email",
        contact: "support@voiceze.ai",
        availability: "24/7 Response",
        color: "from-purple-500 to-purple-600"
    },
    {
        icon: MessageCircleIcon,
        title: "Live Chat",
        description: "Instant help when you need it",
        contact: "Chat Widget",
        availability: "24/7 Available",
        color: "from-green-500 to-green-600"
    }
];

const officeLocations = [
    {
        city: "Mumbai",
        address: "Mumbai, MH, India",
        zipCode: "",
        phone: "+91 22 1234 5678",
        isHeadquarters: true
    }
];

const supportTypes = [
    {
        icon: HeadphonesIcon,
        title: "Technical Support",
        description: "Get help with setup, integrations, and troubleshooting"
    },
    {
        icon: UsersIcon,
        title: "Sales Inquiries",
        description: "Learn about pricing, features, and custom solutions"
    },
    {
        icon: CalendarIcon,
        title: "Demo Request",
        description: "Schedule a personalized demo of our platform"
    }
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Prepare form data for Web3Forms
            const formDataToSend = new FormData();
            formDataToSend.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '');
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('company', formData.company || 'Not provided');
            formDataToSend.append('phone', formData.phone || 'Not provided');
            formDataToSend.append('subject', `Contact Form: ${formData.subject}`);
            formDataToSend.append('message', `
Inquiry Type: ${formData.inquiryType}

${formData.message}
            `);
            formDataToSend.append('from_name', 'Voiceze AI Contact Form');
            formDataToSend.append('to_email', 'sales-support@codeweft.in');
            
            // Submit to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formDataToSend
            });
            
            const result = await response.json();
            
            if (result.success) {
                setIsSubmitted(true);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Sorry, there was an error sending your message. Please try again or contact us directly at support@voiceze.ai');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircleIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Message Sent Successfully!</h1>
                    <p className="text-muted-foreground mb-6">
                        Thank you for contacting us! Your message has been sent successfully and we'll get back to you within 24 hours.
                    </p>
                    <Link 
                        href="/" 
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        Back to Home
                        <ArrowRightIcon className="ml-2 w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-background to-background"
                    style={{
                        backgroundImage: 'radial-gradient(100% 50% at 50% 0%, rgba(168,85,247,0.13) 0%, hsl(var(--background)) 50%, hsl(var(--background)) 100%)'
                    }}
                />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                        <motion.h1 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent leading-tight px-4"
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4"
                        >
                            Have questions about CallAgent? Need help getting started? Our team is here to help you transform your sales process with AI-powered voice automation.
                        </motion.p>
                    </div>

                    {/* Contact Methods */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
                        {contactMethods.map((method, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 text-center hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                            >
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6`}>
                                    <method.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                                </div>
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-foreground">{method.title}</h3>
                                <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3 px-2">{method.description}</p>
                                <p className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">{method.contact}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">{method.availability}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 sm:p-8">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">Send us a Message</h2>
                                <p className="text-muted-foreground mb-6 sm:mb-8">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                                placeholder="Your Company"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="inquiryType" className="block text-sm font-medium text-foreground mb-2">
                                            Inquiry Type
                                        </label>
                                        <select
                                            id="inquiryType"
                                            name="inquiryType"
                                            value={formData.inquiryType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="sales">Sales & Pricing</option>
                                            <option value="support">Technical Support</option>
                                            <option value="demo">Demo Request</option>
                                            <option value="partnership">Partnership</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                            placeholder="Tell us more about what you need..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <SendIcon className="ml-2 w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Right Side Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            {/* Support Types */}
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">How Can We Help?</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {supportTypes.map((type, index) => (
                                        <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl hover:border-purple-500/30 transition-all duration-300">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <type.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{type.title}</h4>
                                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{type.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Office Locations */}
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">Our Offices</h3>
                                <div className="space-y-4 sm:space-y-6">
                                    {officeLocations.map((office, index) => (
                                        <div key={index} className="p-4 sm:p-6 bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl">
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="font-bold text-foreground flex items-center text-sm sm:text-base">
                                                    <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-500 flex-shrink-0" />
                                                    {office.city}
                                                </h4>
                                                {office.isHeadquarters && (
                                                    <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                        HQ
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{office.address}</p>
                                            <p className="text-xs sm:text-sm text-muted-foreground mb-3">{office.zipCode}</p>
                                            <p className="text-xs sm:text-sm font-medium text-foreground flex items-center">
                                                <PhoneIcon className="w-3 h-3 mr-2 text-purple-500 flex-shrink-0" />
                                                {office.phone}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-500/5 to-purple-600/10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12">
                            Find quick answers to common questions about CallAgent
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 text-left">
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6">
                                <h3 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">How quickly can I get started?</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    You can be up and running in under 5 minutes. Simply sign up, configure your campaign, and start making calls.
                                </p>
                            </div>
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6">
                                <h3 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Do you offer integrations?</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Yes! We integrate with popular CRMs, calendars, and business tools. Check our integrations page for the full list.
                                </p>
                            </div>
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6">
                                <h3 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Is there a free trial?</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Absolutely! Start with our 14-day free trial. No credit card required, and you can cancel anytime.
                                </p>
                            </div>
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6">
                                <h3 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">What kind of support do you offer?</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    We provide 24/7 chat support, email support, and phone support, plus comprehensive documentation.
                                </p>
                            </div>
                        </div>

                        {/* <div className="mt-8 sm:mt-12">
                            <Link 
                                href="/help" 
                                className="inline-flex items-center px-6 py-3 border border-purple-500/30 hover:border-purple-500 text-foreground hover:text-purple-400 font-semibold rounded-xl transition-all duration-300 hover:bg-purple-500/5"
                            >
                                View All FAQs
                                <ArrowRightIcon className="ml-2 w-4 h-4" />
                            </Link>
                        </div> */}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}