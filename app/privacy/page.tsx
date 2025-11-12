"use client";

import AnimationContainer from "../../components/global/animation-container";
import MaxWidthWrapper from "../../components/global/max-width-wrapper";
import MagicBadge from "../../components/ui/magic-badge";
import { Shield, Eye, Lock, Users, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";

const PrivacyPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="overflow-x-hidden scrollbar-hide size-full" style={{ scrollBehavior: 'smooth' }}>
      <MaxWidthWrapper>
        {/* Hero Section */}
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center justify-center w-full text-center py-20">
            <MagicBadge title="Privacy Policy" />
            <h1 className="text-4xl md:text-6xl !leading-[1.1] font-medium font-heading text-foreground mt-6 mb-8">
              Your Privacy is
              <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text block">
                Our Priority
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We are committed to protecting your privacy and handling your data with transparency and care.
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

            {/* Introduction */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Introduction</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                At Voiceze AI ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI voice automation platform and related services.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Information We Collect</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Personal Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Name, email address, and contact information</li>
                    <li>• Account credentials and authentication data</li>
                    <li>• Organization and business information</li>
                    <li>• Payment and billing information</li>
                  </ul>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Usage Data</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Call recordings and transcripts (when enabled)</li>
                    <li>• Platform usage statistics and analytics</li>
                    <li>• Performance metrics and system logs</li>
                    <li>• Device and browser information</li>
                  </ul>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Voice Data</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Audio recordings of customer interactions</li>
                    <li>• Voice patterns and speech analytics</li>
                    <li>• Call metadata and conversation insights</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">How We Use Your Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Service Delivery</h3>
                  <p className="text-muted-foreground text-sm">
                    Provide and maintain our AI voice automation services, process customer interactions, and improve system performance.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Analytics & Improvement</h3>
                  <p className="text-muted-foreground text-sm">
                    Analyze usage patterns, enhance AI capabilities, and develop new features to improve user experience.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Communication</h3>
                  <p className="text-muted-foreground text-sm">
                    Send service updates, security alerts, and respond to customer support requests.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Legal Compliance</h3>
                  <p className="text-muted-foreground text-sm">
                    Comply with applicable laws, regulations, and legal processes.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Data Protection & Security</h2>
              </div>
              
              <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Our Security Measures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Encryption</p>
                    <p className="text-sm text-muted-foreground">End-to-end encryption for all data transmission and storage</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Access Control</p>
                    <p className="text-sm text-muted-foreground">Role-based access and multi-factor authentication</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Regular Audits</p>
                    <p className="text-sm text-muted-foreground">Continuous security monitoring and compliance checks</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Data Backup</p>
                    <p className="text-sm text-muted-foreground">Secure backup systems with disaster recovery protocols</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Your Rights</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Access & Portability</h4>
                    <p className="text-sm text-muted-foreground">Request access to your personal data and receive a copy in a portable format.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Correction & Updates</h4>
                    <p className="text-sm text-muted-foreground">Update or correct inaccurate personal information in your account.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Deletion</h4>
                    <p className="text-sm text-muted-foreground">Request deletion of your personal data, subject to legal retention requirements.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-6 h-6 bg-orange-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Processing Restrictions</h4>
                    <p className="text-sm text-muted-foreground">Request limitations on how we process your personal data.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Contact Us</h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">Questions About Privacy?</h3>
                <p className="text-muted-foreground mb-6">
                  If you have questions about this Privacy Policy or how we handle your data, please contact us:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact"
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-center"
                  >
                    Contact Privacy Team
                  </Link>
                  <a 
                    href="mailto:privacy@voiceze.ai"
                    className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors text-center"
                  >
                    privacy@voiceze.ai
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

export default PrivacyPage