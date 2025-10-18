"use client";

import AnimationContainer from "../components/global/animation-container";
import MaxWidthWrapper from "../components/global/max-width-wrapper";
import PricingCards from "../components/pricing-cards";
import { BentoCard, BentoGrid, CARDS } from "../components/ui/bento-grid";
import { BorderBeam } from "../components/ui/border-beam";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { LampContainer } from "../components/ui/lamp";
import MagicBadge from "../components/ui/magic-badge";
import MagicCard from "../components/ui/magic-card";
import { ArrowRightIcon, CreditCardIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import Threads from "../components/Threads";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";

const COMPANIES = [
  {
    name: "Microsoft",
    logo: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="12" height="12" fill="#F25022" />
        <rect x="18" y="2" width="12" height="12" fill="#7FBA00" />
        <rect x="2" y="18" width="12" height="12" fill="#00A4EF" />
        <rect x="18" y="18" width="12" height="12" fill="#FFB900" />
      </svg>
    )
  },
  {
    name: "Google",
    logo: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 6.4c2.6 0 4.9.9 6.7 2.4l5-5C24.4 1.1 20.5 0 16 0 9.7 0 4.4 3.9 1.7 9.6l5.8 4.5C9.1 9.9 12.2 6.4 16 6.4z" fill="#4285F4" />
        <path d="M32 16.4c0-1-.1-2-.3-2.9H16v5.5h9c-.4 2.1-1.6 3.9-3.4 5.1l5.5 4.3c3.2-3 5.1-7.4 5.1-12z" fill="#34A853" />
        <path d="M7.5 19.1c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7L1.7 5.2C.6 7.6 0 10.7 0 14s.6 6.4 1.7 8.8l5.8-3.7z" fill="#FBBC04" />
        <path d="M16 32c4.5 0 8.3-1.5 11.1-4l-5.5-4.3c-1.5 1-3.4 1.6-5.6 1.6-3.8 0-7-2.6-8.1-6.1l-5.8 4.5C4.4 28.1 9.7 32 16 32z" fill="#EA4335" />
      </svg>
    )
  },
  {
    name: "Amazon",
    logo: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.3 24.5c-3.1 2.3-7.6 3.5-11.5 3.5-5.4 0-10.3-2-14-5.3-.3-.3 0-.7.3-.5 4.2 2.4 9.4 3.9 14.8 3.9 3.6 0 7.6-.7 11.3-2.2.5-.2.9.4.4.6z" fill="#FF9900" />
        <path d="M21.8 22.8c-.4-.5-2.6-.2-3.6-.1-.3 0-.4-.2-.1-.4 1.8-1.3 4.7-.9 5-.5.3.5-.1 3.7-1.9 5.3-.3.2-.5.1-.4-.1.4-.9 1.2-3 1-4.2z" fill="#FF9900" />
      </svg>
    )
  },
  {
    name: "Salesforce",
    logo: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5 8.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 .8-.2 1.5-.6 2.1 1.4.4 2.4 1.7 2.4 3.2 0 1.9-1.5 3.4-3.4 3.4-.5 0-1-.1-1.4-.3-.4 1.2-1.5 2.1-2.8 2.1-1.6 0-2.9-1.3-2.9-2.9 0-.4.1-.8.2-1.1-1.3-.5-2.2-1.7-2.2-3.1 0-1.9 1.5-3.4 3.4-3.4.1 0 .2 0 .3 0z" fill="#00A1E0" />
        <circle cx="8" cy="12" r="3" fill="#00A1E0" />
        <circle cx="24" cy="16" r="2.5" fill="#00A1E0" />
        <circle cx="6" cy="20" r="2" fill="#00A1E0" />
        <circle cx="26" cy="24" r="2" fill="#00A1E0" />
      </svg>
    )
  },
  {
    name: "HubSpot",
    logo: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#FF7A59" />
        <circle cx="16" cy="16" r="8" fill="white" />
        <circle cx="16" cy="16" r="4" fill="#FF7A59" />
        <path d="M16 2v4M16 26v4M2 16h4M26 16h4M6.3 6.3l2.8 2.8M22.9 22.9l2.8 2.8M6.3 25.7l2.8-2.8M22.9 9.1l2.8-2.8" stroke="white" strokeWidth="1.5" />
      </svg>
    )
  }
];

const PROCESS = [
  {
    icon: () => <span className="text-2xl">📤</span>,
    title: "Upload Your Leads",
    description: "Import your contact list via CSV or connect your CRM directly. Our system validates and organizes your data automatically.",
    videoPlaceholder: "Upload Demo"
  },
  {
    icon: () => <span className="text-2xl">🤖</span>,
    title: "Configure AI Agent",
    description: "Customize your agent's voice, script, conversation flow, and objection handling. No technical skills required.",
    videoPlaceholder: "Configuration Demo"
  },
  {
    icon: () => <span className="text-2xl">🚀</span>,
    title: "Launch Campaign",
    description: "Start calling and watch your AI agents convert leads automatically. Monitor performance in real-time.",
    videoPlaceholder: "Campaign Demo"
  }
];

const REVIEWS = [
  {
    name: "Sarah Johnson",
    username: "@sarahj_sales",
    review: "Audixa AI transformed our outbound sales process. We've seen a 300% increase in qualified leads and our team can focus on closing deals.",
    rating: 5
  },
  {
    name: "Michael Chen",
    username: "@mikec_ceo",
    review: "The AI voice agents are incredibly natural. Our customers can't tell the difference from human agents.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    username: "@emily_growth",
    review: "Setup was incredibly easy. We were running campaigns within minutes of signing up.",
    rating: 5
  },
  {
    name: "David Kim",
    username: "@davidk_startup",
    review: "The ROI has been incredible. We're converting 40% more leads with half the effort.",
    rating: 5
  },
  {
    name: "Lisa Thompson",
    username: "@lisa_marketing",
    review: "Customer support is outstanding. They helped us optimize our campaigns immediately.",
    rating: 5
  },
  {
    name: "James Wilson",
    username: "@jameswilson_biz",
    review: "The integration with our existing CRM was seamless. Our sales team loves it.",
    rating: 5
  },
  {
    name: "Alex Rivera",
    username: "@alex_startup",
    review: "Game-changer for our sales team. The AI handles objections better than most humans.",
    rating: 5
  },
  {
    name: "Maria Garcia",
    username: "@maria_sales",
    review: "Incredible results in just the first month. Our conversion rates doubled.",
    rating: 5
  },
  {
    name: "Tom Anderson",
    username: "@tom_bizdev",
    review: "The analytics dashboard gives us insights we never had before. Highly recommended.",
    rating: 5
  }
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="overflow-x-hidden scrollbar-hide size-full" style={{ scrollBehavior: 'smooth' }}>
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Threads Background - Fixed */}
        <div className="fixed inset-0 w-full h-full z-0">
          <Threads
            amplitude={1.5}
            distance={0.3}
            enableMouseInteraction={true}
            color={[0.8, 0.6, 1]}
          />
        </div>

        {/* Hero Content */}
        <MaxWidthWrapper className="relative z-10">
          <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-background/80 to-transparent min-h-screen">
            <AnimationContainer className="flex flex-col items-center justify-center w-full text-center relative z-10">
              <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
                <span>
                  <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                </span>
                <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
                <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/20"></span>
                <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1">
                  ✨ AI-Powered Voice Automation
                  <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </span>
              </button>
              <h1 className="text-foreground text-center py-6 text-5xl font-medium tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
                Smart Calls with <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text inline-bloc">
                  Precision
                </span>
              </h1>
              <p className="mb-12 text-lg tracking-tight text-muted-foreground md:text-xl text-balance">
                Effortlessly automate your outbound sales with Audixa AI.
                <br className="hidden md:block" />
                <span className="hidden md:block">Convert leads 24/7 with AI voice agents that sound human.</span>
              </p>
              <div className="flex items-center justify-center whitespace-nowrap gap-4 z-50">
                <Button asChild>
                  <Link href={user ? "/dashboard" : "/register"} className="flex items-center">
                    Start creating for free
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </AnimationContainer>

            <AnimationContainer delay={0.2} className="relative pt-20 pb-20 md:py-32 px-2 bg-black w-full">
              <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[5rem] animate-image-glow"></div>
              <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
                <BorderBeam
                  size={250}
                  duration={12}
                  delay={9}
                />
                <Image
                  src="/dashboard.png"
                  alt="Audixa AI Dashboard"
                  width={1200}
                  height={1200}
                  quality={100}
                  className="rounded-md lg:rounded-xl bg-foreground/10 ring-1 ring-border"
                />
                <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-black z-40"></div>
                <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-black z-50"></div>

              </div>
            </AnimationContainer>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Companies Section */}
      <MaxWidthWrapper>
        <AnimationContainer delay={0.4}>
          <div className="py-10 sm:py-12 md:py-14">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              <h2 className="text-center text-xs sm:text-sm font-medium font-heading text-neutral-400 uppercase tracking-wider">
                Trusted by the best in the industry
              </h2>
              <div className="mt-6 sm:mt-8">
                <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-6 sm:gap-x-8 sm:gap-y-8 md:gap-x-12 md:gap-y-10 lg:gap-x-16 lg:gap-y-12">
                  {COMPANIES.map((company) => (
                    <li key={company.name} className="opacity-70 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex items-center justify-center p-2 sm:p-3 md:p-4 rounded-lg hover:bg-muted/20 transition-colors duration-300">
                        {company.logo}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>

      {/* Features Section */}
      <MaxWidthWrapper className="pt-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col w-full items-center lg:items-center justify-center py-8">
            <MagicBadge title="Features" />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              Manage Calls Like a Pro
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              Audixa AI is a powerful voice automation tool that helps you convert leads with AI-powered conversations.
            </p>
          </div>
        </AnimationContainer>
        <AnimationContainer delay={0.2}>
          <BentoGrid className="py-8">
            {CARDS.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </AnimationContainer>
      </MaxWidthWrapper>

      {/* Process Section with ScrollStack */}
      <ScrollStack className="bg-transparent">
        <MaxWidthWrapper>
          <div className="flex flex-col items-center justify-center w-full py-6 sm:py-8 max-w-xl mx-auto px-4 sm:px-6">
            <MagicBadge title="The Process" />
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-4 sm:mt-6">
              Effortless automation in 3 steps
            </h2>
            <p className="mt-3 sm:mt-4 text-center text-base sm:text-lg text-muted-foreground max-w-lg">
              Follow these simple steps to optimize, organize, and automate your outbound calls with ease.
            </p>
          </div>
        </MaxWidthWrapper>

        <MaxWidthWrapper>
          {PROCESS.map((process, id) => (
            <ScrollStackItem key={id} itemClassName="bg-gradient-to-br from-background/80 to-muted/20 border border-border backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center w-full h-full">
                {/* Text Content */}
                <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="border-2 border-primary text-primary font-medium text-lg sm:text-xl md:text-2xl rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                      {id + 1}
                    </span>
                    <div className="text-2xl sm:text-3xl">
                      <process.icon />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground mb-2 sm:mb-3 md:mb-4 leading-tight">
                      {process.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </div>

                {/* Video Content */}
                <div className="relative order-1 lg:order-2">
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl relative overflow-hidden ring-1 ring-border shadow-xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <h4 className="text-white text-xs sm:text-sm font-medium mb-1">{process.videoPlaceholder}</h4>
                        <p className="text-gray-400 text-xs">Watch step {id + 1}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>

                  {/* Decorative elements - hidden on mobile for cleaner look */}
                  <div className="hidden sm:block absolute -top-2 -right-2 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-xl"></div>
                  <div className="hidden sm:block absolute -bottom-2 -left-2 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </MaxWidthWrapper>
      </ScrollStack>

      {/* Video Demo Section */}
      <MaxWidthWrapper className="py-20">
        <AnimationContainer delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <MagicBadge title="See It In Action" />
              <h2 className="text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground">
                Watch Our AI Agent
                <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text block">
                  Convert Leads Live
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                See how our AI voice agents handle real conversations, overcome objections, and convert prospects into customers with human-like precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/register" className="flex items-center">
                    Start Your Campaign
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/features" className="flex items-center">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>

            {/* Video Content */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl relative overflow-hidden ring-1 ring-border shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">Demo Video</h3>
                    <p className="text-gray-400 text-sm">Watch our AI agent in action</p>
                  </div>
                </div>
                {/* Video placeholder - replace with actual video later */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>

      {/* Pricing Section */}
      <MaxWidthWrapper className="py-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
            <MagicBadge title="Simple Pricing" />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              Choose a plan that works for you
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              Get started with Audixa AI today and enjoy transparent per-minute pricing.
            </p>
          </div>
        </AnimationContainer>
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
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>

      {/* Reviews Section */}
      <MaxWidthWrapper className="py-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
            <MagicBadge title="Our Customers" />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              What our users are saying
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              Here&apos;s what some of our users have to say about Audixa AI.
            </p>
          </div>
        </AnimationContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 md:gap-8 py-10">
          <div className="flex flex-col items-start h-min gap-6">
            {REVIEWS.slice(0, 3).map((review, index) => (
              <AnimationContainer delay={0.2 * index} key={index}>
                <MagicCard key={index} className="md:p-0">
                  <Card className="flex flex-col w-full border-none h-min">
                    <CardHeader className="space-y-0">
                      <CardTitle className="text-lg font-medium text-muted-foreground">
                        {review.name}
                      </CardTitle>
                      <CardDescription>
                        {review.username}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-4">
                      <p className="text-muted-foreground">
                        {review.review}
                      </p>
                    </CardContent>
                    <CardFooter className="w-full space-x-1 mt-auto">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </CardFooter>
                  </Card>
                </MagicCard>
              </AnimationContainer>
            ))}
          </div>
          <div className="flex flex-col items-start h-min gap-6">
            {REVIEWS.slice(3, 6).map((review, index) => (
              <AnimationContainer delay={0.2 * index} key={index}>
                <MagicCard key={index} className="md:p-0">
                  <Card className="flex flex-col w-full border-none h-min">
                    <CardHeader className="space-y-0">
                      <CardTitle className="text-lg font-medium text-muted-foreground">
                        {review.name}
                      </CardTitle>
                      <CardDescription>
                        {review.username}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-4">
                      <p className="text-muted-foreground">
                        {review.review}
                      </p>
                    </CardContent>
                    <CardFooter className="w-full space-x-1 mt-auto">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </CardFooter>
                  </Card>
                </MagicCard>
              </AnimationContainer>
            ))}
          </div>
          <div className="flex flex-col items-start h-min gap-6">
            {REVIEWS.slice(6, 9).map((review, index) => (
              <AnimationContainer delay={0.2 * index} key={index}>
                <MagicCard key={index} className="md:p-0">
                  <Card className="flex flex-col w-full border-none h-min">
                    <CardHeader className="space-y-0">
                      <CardTitle className="text-lg font-medium text-muted-foreground">
                        {review.name}
                      </CardTitle>
                      <CardDescription>
                        {review.username}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-4">
                      <p className="text-muted-foreground">
                        {review.review}
                      </p>
                    </CardContent>
                    <CardFooter className="w-full space-x-1 mt-auto">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </CardFooter>
                  </Card>
                </MagicCard>
              </AnimationContainer>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>

      {/* CTA Section */}
      <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
        <AnimationContainer delay={0.1}>
          <LampContainer>
            <div className="flex flex-col items-center justify-center relative w-full text-center">
              <h2 className="bg-gradient-to-b from-neutral-200 to-neutral-400 py-4 bg-clip-text text-center text-4xl md:text-7xl !leading-[1.15] font-medium font-heading tracking-tight text-transparent mt-8">
                Step into the future of sales automation
              </h2>
              <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                Experience the cutting-edge solution that transforms how you handle outbound sales. Elevate your conversion rates with our AI-powered platform.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/register">
                    Get started for free
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
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

export default HomePage