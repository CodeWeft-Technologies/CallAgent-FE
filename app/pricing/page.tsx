"use client";

import React from 'react';
import AnimationContainer from "../../components/global/animation-container";
import MaxWidthWrapper from "../../components/global/max-width-wrapper";
import PricingCards from "../../components/pricing-cards";
import MagicBadge from "../../components/ui/magic-badge";
import { LampContainer } from "../../components/ui/lamp";
import { Button } from "../../components/ui/button";
import { ArrowRightIcon, CheckIcon, CreditCardIcon } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  "AI Voice Agents",
  "Real-time Analytics",
  "CRM Integration",
  "Campaign Management",
  "Call Recording",
  "Custom Scripts",
  "A/B Testing",
  "24/7 Support"
];

const FAQ = [
  {
    question: "How does per-minute pricing work?",
    answer: "You only pay for the actual minutes your AI agents spend on calls. No monthly fees, no hidden costs. If your agent makes 100 minutes of calls, you pay for 100 minutes."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! We offer a free trial with 100 minutes included so you can test our AI voice agents before committing to a paid plan."
  },
  {
    question: "Can I upgrade or downgrade anytime?",
    answer: "Absolutely. You can change your plan at any time. Changes take effect immediately and you'll be billed accordingly."
  },
  {
    question: "What's included in all plans?",
    answer: "All plans include AI voice agents, basic analytics, email support, and standard integrations. Higher tiers include advanced features and priority support."
  }
];

const PricingPage = () => {
  return (
    <div className="overflow-x-hidden scrollbar-hide size-full">
      {/* Hero Section */}
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-background">
          <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
            <MagicBadge title="Simple Pricing" />
            <h1 className="text-foreground text-center py-6 text-5xl font-medium tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
              Choose the <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text inline-bloc">
                Perfect Plan
              </span>
            </h1>
            <p className="mb-12 text-lg tracking-tight text-muted-foreground md:text-xl text-balance max-w-2xl">
              Start with our free plan and scale as you grow.
              <br className="hidden md:block" />
              <span className="hidden md:block">Pay only for what you use with transparent per-minute pricing.</span>
            </p>
          </AnimationContainer>
        </div>
      </MaxWidthWrapper>

      {/* Pricing Cards Section */}
      <MaxWidthWrapper className="py-10">
        <AnimationContainer delay={0.2}>
          <PricingCards />
        </AnimationContainer>
        <AnimationContainer delay={0.3}>
          <div className="flex flex-wrap items-start md:items-center justify-center lg:justify-evenly gap-6 mt-12 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5 text-foreground" />
              <span className="text-muted-foreground">
                No credit card required
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground">
                Cancel anytime
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground">
                Free trial included
              </span>
            </div>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>

      {/* Features Comparison */}
      <MaxWidthWrapper className="py-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
            <MagicBadge title="All Plans Include" />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              Every plan comes with these essential features to help you convert more leads.
            </p>
          </div>
        </AnimationContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {FEATURES.map((feature, index) => (
            <AnimationContainer delay={0.1 * index} key={index}>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-card/50">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-foreground font-medium">{feature}</span>
              </div>
            </AnimationContainer>
          ))}
        </div>
      </MaxWidthWrapper>

      {/* FAQ Section */}
      <MaxWidthWrapper className="py-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
            <MagicBadge title="FAQ" />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              Got questions? We've got answers.
            </p>
          </div>
        </AnimationContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 max-w-4xl mx-auto">
          {FAQ.map((faq, index) => (
            <AnimationContainer delay={0.1 * index} key={index}>
              <div className="p-6 rounded-lg border border-border/60 bg-card/50">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </AnimationContainer>
          ))}
        </div>
      </MaxWidthWrapper>

      {/* CTA Section */}
      <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
        <AnimationContainer delay={0.1}>
          <LampContainer>
            <div className="flex flex-col items-center justify-center relative w-full text-center">
              <h2 className="bg-gradient-to-b from-neutral-200 to-neutral-400 py-4 bg-clip-text text-center text-4xl md:text-7xl !leading-[1.15] font-medium font-heading tracking-tight text-transparent mt-8">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                Join thousands of businesses already using Audixa AI to automate their sales calls and boost conversions.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/register">
                    Start free trial
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/features">
                    Learn more
                  </Link>
                </Button>
              </div>
            </div>
          </LampContainer>
        </AnimationContainer>
      </MaxWidthWrapper>
    </div>
  )
};

export default PricingPage