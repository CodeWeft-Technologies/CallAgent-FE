"use client";

import Link from 'next/link';
import AnimationContainer from "../global/animation-container";

const Footer = () => {
    return (
        <footer className="flex flex-col relative items-center justify-center border-t border-border pt-16 pb-8 md:pb-0 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-32 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]">

            <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>

            <div className="grid gap-8 xl:grid-cols-3 xl:gap-8 w-full">

                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-start justify-start md:max-w-[200px]">
                        <div className="flex items-start">
                            <span className="text-lg font-bold">Audixa AI</span>
                        </div>
                        <p className="text-muted-foreground mt-4 text-sm text-start">
                            Automate your outbound sales with AI voice agents.
                        </p>
                        <span className="mt-4 text-neutral-200 text-sm flex items-center">
                            Made with ❤️ for sales teams
                        </span>
                    </div>
                </AnimationContainer>

                <div className="grid-cols-2 gap-8 grid mt-16 xl:col-span-2 xl:mt-0">
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <AnimationContainer delay={0.2}>
                            <div className="">
                                <h3 className="text-base font-medium text-white">
                                    Product
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground">
                                    <li className="mt-2">
                                        <Link href="/features" className="hover:text-foreground transition-all duration-300">
                                            Features
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <Link href="/pricing" className="hover:text-foreground transition-all duration-300">
                                            Pricing
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                        <AnimationContainer delay={0.3}>
                            <div className="mt-10 md:mt-0 flex flex-col">
                                <h3 className="text-base font-medium text-white">
                                    Account
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground">
                                    <li className="">
                                        <Link href="/login" className="hover:text-foreground transition-all duration-300">
                                            Login
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <Link href="/register" className="hover:text-foreground transition-all duration-300">
                                            Sign Up
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <AnimationContainer delay={0.4}>
                            <div className="">
                                <h3 className="text-base font-medium text-white">
                                    Company
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground">
                                    <li className="mt-2">
                                        <Link href="/about" className="hover:text-foreground transition-all duration-300">
                                            About Us
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <Link href="/contact" className="hover:text-foreground transition-all duration-300">
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                        <AnimationContainer delay={0.5}>
                            <div className="mt-10 md:mt-0 flex flex-col">
                                <h3 className="text-base font-medium text-white">
                                    Legal
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground">
                                    <li className="">
                                        <Link href="/privacy" className="hover:text-foreground transition-all duration-300">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <Link href="/terms" className="hover:text-foreground transition-all duration-300">
                                            Terms of Service
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </AnimationContainer>
                    </div>
                </div>

            </div>

            <div className="mt-8 border-t border-border/40 pt-4 md:pt-8 md:flex md:items-center md:justify-between w-full">
                <AnimationContainer delay={0.6}>
                    <p className="text-sm text-muted-foreground mt-8 md:mt-0">
                        &copy; {new Date().getFullYear()} Audixa AI. All rights reserved.
                    </p>
                </AnimationContainer>
            </div>

            <div className="h-[20rem] lg:h-[20rem] hidden md:flex items-center justify-center relative overflow-hidden">
                <div 
                    className="text-[6rem] md:text-[10rem] lg:text-[14rem] xl:text-[16rem] font-black select-none tracking-[-0.05em] leading-[0.9] whitespace-nowrap transition-colors duration-300 ease-out footer-text-hover cursor-pointer"
                >
                    AUDIXA AI
                </div>
            </div>
        </footer>
    )
}

export default Footer