"use client";

import AnimationContainer from "../../components/global/animation-container";
import MaxWidthWrapper from "../../components/global/max-width-wrapper";
import MagicBadge from "../../components/ui/magic-badge";
import { Scale, FileText, AlertTriangle, Clock, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";

const TermsPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="overflow-x-hidden scrollbar-hide size-full" style={{ scrollBehavior: 'smooth' }}>
      <MaxWidthWrapper>
        {/* Hero Section */}
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center justify-center w-full text-center py-20">
            <MagicBadge title="Terms & Conditions" />
            <h1 className="text-4xl md:text-6xl !leading-[1.1] font-medium font-heading text-foreground mt-6 mb-8">
              Terms of
              <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text block">
                Service
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Please read these terms carefully before using our AI voice automation platform and services.
            </p>
          </div>
        </AnimationContainer>

        {/* Main Content */}
        <AnimationContainer delay={0.2}>
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            
            {/* Last Updated */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Last updated: November 12, 2025
              </p>
            </div>

            {/* Agreement */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Agreement to Terms</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Voiceze AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            {/* Use License */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Use License</h2>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Permitted Uses</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use the platform for legitimate business communications and customer service</li>
                  <li>• Create and manage voice automation workflows for your organization</li>
                  <li>• Access analytics and reporting features within your subscription limits</li>
                  <li>• Integrate with approved third-party services and applications</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-foreground mt-6">Prohibited Uses</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use the service for spam, harassment, or unsolicited communications</li>
                  <li>• Attempt to reverse engineer, decompile, or hack the platform</li>
                  <li>• Share account credentials or violate security measures</li>
                  <li>• Use the service for illegal activities or content</li>
                  <li>• Exceed usage limits or engage in resource abuse</li>
                </ul>
              </div>
            </section>

            {/* Service Availability */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Service Availability</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Uptime Commitment</h3>
                  <p className="text-muted-foreground text-sm">
                    We strive for 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be communicated in advance.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Service Modifications</h3>
                  <p className="text-muted-foreground text-sm">
                    We reserve the right to modify, suspend, or discontinue features with reasonable notice to users.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Data Backup</h3>
                  <p className="text-muted-foreground text-sm">
                    While we maintain backups, users are responsible for maintaining their own copies of critical data.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Support Services</h3>
                  <p className="text-muted-foreground text-sm">
                    Technical support is provided based on your subscription tier and during business hours.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Payment & Billing</h2>
              </div>
              
              <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Billing Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Payment Schedule</p>
                    <p className="text-sm text-muted-foreground">Subscription fees are billed in advance on a monthly or annual basis</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Late Payments</p>
                    <p className="text-sm text-muted-foreground">Service may be suspended for accounts with overdue payments</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Refund Policy</p>
                    <p className="text-sm text-muted-foreground">Refunds are available within 14 days of initial subscription</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Price Changes</p>
                    <p className="text-sm text-muted-foreground">Price changes will be communicated 30 days in advance</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Limitations & Liability</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Service Limitations</h4>
                    <p className="text-sm text-muted-foreground">The service is provided "as is" without warranties of any kind, express or implied.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-6 h-6 bg-orange-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Liability Cap</h4>
                    <p className="text-sm text-muted-foreground">Our liability is limited to the amount paid for the service in the preceding 12 months.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-6 h-6 bg-yellow-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">User Responsibility</h4>
                    <p className="text-sm text-muted-foreground">Users are responsible for their use of the service and any content created or transmitted.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Indemnification</h4>
                    <p className="text-sm text-muted-foreground">Users agree to indemnify and hold harmless Voiceze AI from claims arising from their use of the service.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Account Termination</h2>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Termination Rights</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Either party may terminate the agreement with 30 days' written notice</p>
                  <p>• We may terminate immediately for breach of terms or illegal activity</p>
                  <p>• Users may cancel subscriptions at any time through their account settings</p>
                  <p>• Upon termination, access to the service will cease and data may be deleted after 30 days</p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Changes to Terms</h2>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. Material changes will be communicated via email or through the platform. 
                  Continued use of the service after changes constitutes acceptance of the new terms. We encourage users to review these terms periodically.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Questions About Terms?</h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">Need Clarification?</h3>
                <p className="text-muted-foreground mb-6">
                  If you have questions about these Terms & Conditions, please don't hesitate to contact our legal team:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact"
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-center"
                  >
                    Contact Legal Team
                  </Link>
                  <a 
                    href="mailto:legal@voiceze.ai"
                    className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors text-center"
                  >
                    legal@voiceze.ai
                  </a>
                </div>
              </div>
            </section>

          </div>
        </AnimationContainer>
      </MaxWidthWrapper>
    </div>
  );
};

export default TermsPage