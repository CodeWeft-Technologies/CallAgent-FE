"use client";

import React from 'react';
import { HeroSection } from '../../components/features/HeroSectionSimple';
import { Timeline } from '../../components/Timeline';

const timelineData = [
    {
        title: "AI Voice Technology",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                    Built on cutting-edge AI voice technology that delivers human-like conversations. Our agents can handle complex dialogues, understand context, and respond naturally to customer inquiries.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <img
                        src="/dashboard.png"
                        alt="AI Voice Technology"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34_42_53_0.06),_0_1px_1px_rgba(0_0_0_0.05),_0_0_0_1px_rgba(34_42_53_0.04),_0_0_4px_rgba(34_42_53_0.08),_0_16px_68px_rgba(47_48_55_0.05),_0_1px_0_rgba(255_255_255_0.1)_inset]"
                    />
                    <img
                        src="/dashboard.png"
                        alt="Voice Analytics"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34_42_53_0.06),_0_1px_1px_rgba(0_0_0_0.05),_0_0_0_1px_rgba(34_42_53_0.04),_0_0_4px_rgba(34_42_53_0.08),_0_16px_68px_rgba(47_48_55_0.05),_0_1px_0_rgba(255_255_255_0.1)_inset]"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Smart Automation",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                    Automate your entire sales pipeline with intelligent workflows. From lead qualification to appointment booking, our AI handles it all while you focus on closing deals.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <img
                        src="/dashboard.png"
                        alt="Automation Dashboard"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34_42_53_0.06),_0_1px_1px_rgba(0_0_0_0.05),_0_0_0_1px_rgba(34_42_53_0.04),_0_0_4px_rgba(34_42_53_0.08),_0_16px_68px_rgba(47_48_55_0.05),_0_1px_0_rgba(255_255_255_0.1)_inset]"
                    />
                    <img
                        src="/dashboard.png"
                        alt="Workflow Builder"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34_42_53_0.06),_0_1px_1px_rgba(0_0_0_0.05),_0_0_0_1px_rgba(34_42_53_0.04),_0_0_4px_rgba(34_42_53_0.08),_0_16px_68px_rgba(47_48_55_0.05),_0_1px_0_rgba(255_255_255_0.1)_inset]"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Real-time Analytics",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                    Monitor your campaigns in real-time with comprehensive analytics. Track conversion rates, call quality, customer sentiment, and ROI with detailed insights and reporting.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <img
                        src="/dashboard.png"
                        alt="Analytics Dashboard"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34_42_53_0.06),_0_1px_1px_rgba(0_0_0_0.05),_0_0_0_1px_rgba(34_42_53_0.04),_0_0_4px_rgba(34_42_53_0.08),_0_16px_68px_rgba(47_48_55_0.05),_0_1px_0_rgba(255_255_255_0.1)_inset]"
                    />
                    <img
                        src="/dashboard.png"
                        alt="Performance Metrics"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34_42_53_0.06),_0_1px_1px_rgba(0_0_0_0.05),_0_0_0_1px_rgba(34_42_53_0.04),_0_0_4px_rgba(34_42_53_0.08),_0_16px_68px_rgba(47_48_55_0.05),_0_1px_0_rgba(255_255_255_0.1)_inset]"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Seamless Integration",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                    Connect with your existing CRM, calendar, and business tools. Our platform integrates seamlessly with popular services to fit into your current workflow without disruption.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <img
                        src="/dashboard.png"
                        alt="CRM Integration"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34_42_53_0.06),_0_1px_1px_rgba(0_0_0_0.05),_0_0_0_1px_rgba(34_42_53_0.04),_0_0_4px_rgba(34_42_53_0.08),_0_16px_68px_rgba(47_48_55_0.05),_0_1px_0_rgba(255_255_255_0.1)_inset]"
                    />
                    <img
                        src="/dashboard.png"
                        alt="API Connections"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34_42_53_0.06),_0_1px_1px_rgba(0_0_0_0.05),_0_0_0_1px_rgba(34_42_53_0.04),_0_0_4px_rgba(34_42_53_0.08),_0_16px_68px_rgba(47_48_55_0.05),_0_1px_0_rgba(255_255_255_0.1)_inset]"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Enterprise Security",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                    Enterprise-grade security with end-to-end encryption, compliance certifications, and robust data protection. Your customer data and conversations are always secure and private.
                </p>
                <div className="mb-8">
                    <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                        ✅ SOC 2 Type II Certified
                    </div>
                    <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                        ✅ GDPR Compliant
                    </div>
                    <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                        ✅ End-to-End Encryption
                    </div>
                    <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                        ✅ 99.9% Uptime SLA
                    </div>
                </div>
                <img
                    src="/dashboard.png"
                    alt="Security Dashboard"
                    width={500}
                    height={500}
                    className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34_42_53_0.06),_0_1px_1px_rgba(0_0_0_0.05),_0_0_0_1px_rgba(34_42_53_0.04),_0_0_4px_rgba(34_42_53_0.08),_0_16px_68px_rgba(47_48_55_0.05),_0_1px_0_rgba(255_255_255_0.1)_inset]"
                />
            </div>
        ),
    },
];

export default function FeaturesPage() {
    return (
        <div className="bg-black text-white overflow-x-hidden features-page">
            <HeroSection />

            {/* Timeline section - now displays immediately */}
            <div
                className="relative z-30"
                style={{
                    background: 'linear-gradient(to bottom, #000000, #ffffff)',
                    minHeight: '100vh'
                }}
            >
                <div className="pt-20">
                    <Timeline data={timelineData} />
                </div>
            </div>
        </div>
    );
}