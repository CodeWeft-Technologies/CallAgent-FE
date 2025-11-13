"use client";

import AnimationContainer from "../../components/global/animation-container";
import MaxWidthWrapper from "../../components/global/max-width-wrapper";
import MagicBadge from "../../components/ui/magic-badge";
import { Users, Zap, Globe, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";

const AboutPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="overflow-x-hidden scrollbar-hide size-full" style={{ scrollBehavior: 'smooth' }}>
      <MaxWidthWrapper>
        {/* Hero Section */}
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center justify-center w-full text-center py-20">
            <MagicBadge title="About Us" />
            <h1 className="text-4xl md:text-6xl !leading-[1.1] font-medium font-heading text-foreground mt-6 mb-8">
              Building the Future of
              <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text block">
                Voice Communication
              </span>
            </h1>
          </div>
        </AnimationContainer>

        {/* Main Content */}
        <AnimationContainer delay={0.2}>
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Mission Statement */}
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Experience the cutting-edge solution that transforms how you handle calls. Elevate your conversion rates with our AI-powered platform.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our AI voice callers automate thousands of conversations every day — booking appointments, qualifying leads, collecting feedback, and closing sales — all without human intervention.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                Driven by innovation, accuracy, and empathy, we're creating voice agents that sound natural, think smart, and scale globally.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              <AnimationContainer delay={0.3}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Innovation</h3>
                  <p className="text-muted-foreground">Pushing the boundaries of AI voice technology with cutting-edge solutions.</p>
                </div>
              </AnimationContainer>

              <AnimationContainer delay={0.4}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Accuracy</h3>
                  <p className="text-muted-foreground">Delivering precise, reliable AI conversations that understand context and intent.</p>
                </div>
              </AnimationContainer>

              <AnimationContainer delay={0.5}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Empathy</h3>
                  <p className="text-muted-foreground">Creating human-like interactions that build genuine connections with customers.</p>
                </div>
              </AnimationContainer>

              <AnimationContainer delay={0.6}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Global Scale</h3>
                  <p className="text-muted-foreground">Building solutions that work seamlessly across languages, cultures, and markets.</p>
                </div>
              </AnimationContainer>
            </div>

            {/* What We Do */}
            <AnimationContainer delay={0.7}>
              <div className="mt-20">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
                  What We Do Every Day
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Automate Conversations</h3>
                    <p className="text-muted-foreground">
                      Our AI voice agents handle thousands of customer interactions daily, from initial contact to deal closure, all while maintaining natural, human-like conversations.
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Qualify & Convert</h3>
                    <p className="text-muted-foreground">
                      Smart lead qualification and conversion processes that identify high-value prospects and guide them through your sales funnel automatically.
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Book & Schedule</h3>
                    <p className="text-muted-foreground">
                      Seamless appointment booking and calendar integration that eliminates back-and-forth scheduling and reduces no-shows.
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Collect Insights</h3>
                    <p className="text-muted-foreground">
                      Gather valuable customer feedback and insights that help you improve your products, services, and customer experience.
                    </p>
                  </div>
                </div>
              </div>
            </AnimationContainer>

            {/* Technology Stack */}
            <AnimationContainer delay={0.8}>
              <div className="mt-20">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
                  Powered by Advanced Technology
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto">
                      <span className="text-3xl">🤖</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Artificial Intelligence</h3>
                    <p className="text-muted-foreground">
                      Advanced AI models that understand context, learn from interactions, and adapt to different conversation styles.
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto">
                      <span className="text-3xl">🧠</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Natural Language Processing</h3>
                    <p className="text-muted-foreground">
                      Sophisticated NLP that processes human speech, understands intent, and generates appropriate responses in real-time.
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto">
                      <span className="text-3xl">🎙️</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Voice Automation</h3>
                    <p className="text-muted-foreground">
                      Real-time voice synthesis and recognition that delivers natural, engaging conversations at scale.
                    </p>
                  </div>
                </div>
              </div>
            </AnimationContainer>

            {/* Call to Action */}
            <AnimationContainer delay={0.9}>
              <div className="mt-20 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of businesses that are already using Voiceze AI to automate their customer conversations and drive growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href={user ? "/dashboard" : "/login"}
                    className="px-8 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-center"
                  >
                    Get Started Today
                  </Link>
                  <Link 
                    href="/contact"
                    className="px-8 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors text-center"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </AnimationContainer>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>
    </div>
  );
};

export default AboutPage;