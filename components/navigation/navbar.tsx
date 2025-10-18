"use client";

import { buttonVariants } from "../ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { PlayIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import MaxWidthWrapper from "../global/max-width-wrapper";
import MobileNavbar from "./mobile-navbar";
import AnimationContainer from "../global/animation-container";
import DemoForm from "../DemoForm";

const NAV_LINKS = [
    {
        title: "Features",
        href: "/features",
        menu: [
            {
                title: "AI Voice Agents",
                href: "/features",
                tagline: "Advanced conversational AI that sounds human",
                icon: () => (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">🤖</span>
                    </div>
                )
            },
            {
                title: "Real-time Analytics",
                href: "/features",
                tagline: "Track performance and ROI instantly",
                icon: () => (
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">📊</span>
                    </div>
                )
            },
            {
                title: "CRM Integration",
                href: "/features",
                tagline: "Connect with your existing tools",
                icon: () => (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">🔗</span>
                    </div>
                )
            },
            {
                title: "Campaign Management",
                href: "/features",
                tagline: "Schedule and manage calling campaigns",
                icon: () => (
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">📅</span>
                    </div>
                )
            }
        ]
    },
    {
        title: "Pricing",
        href: "/pricing"
    },

];

const Navbar = () => {
    const { user } = useAuth();
    const [scroll, setScroll] = useState(false);
    const [isDemoFormOpen, setIsDemoFormOpen] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 8) {
            setScroll(true);
        } else {
            setScroll(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <header className={cn(
                "sticky top-0 inset-x-0 h-16 w-full border-b border-transparent z-[99999] select-none transition-all duration-300",
                scroll && "border-border/40 bg-background/80 backdrop-blur-xl shadow-sm"
            )}>
                <AnimationContainer reverse delay={0.1} className="size-full">
                    <MaxWidthWrapper className="flex items-center justify-between h-full">
                        <div className="flex items-center space-x-12">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">A</span>
                                </div>
                                <span className="text-xl font-bold font-heading !leading-none">
                                    Audixa AI
                                </span>
                            </Link>

                            <NavigationMenu className="hidden lg:flex">
                                <NavigationMenuList>
                                    {NAV_LINKS.map((link) => (
                                        <NavigationMenuItem key={link.title}>
                                            {link.menu ? (
                                                <>
                                                    <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground data-[state=open]:text-foreground">
                                                        {link.title}
                                                    </NavigationMenuTrigger>
                                                    <NavigationMenuContent>
                                                        <div className="w-[600px] p-0 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                                                            <div className="grid grid-cols-2 gap-0">
                                                                {link.menu.map((menuItem, index) => (
                                                                    <ListItem
                                                                        key={menuItem.title}
                                                                        title={menuItem.title}
                                                                        href={menuItem.href}
                                                                        icon={menuItem.icon}
                                                                        className={`${index % 2 === 1 ? 'border-l border-border/30' : ''} ${index < 2 ? 'border-b border-border/30' : ''}`}
                                                                    >
                                                                        {menuItem.tagline}
                                                                    </ListItem>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </NavigationMenuContent>
                                                </>
                                            ) : (
                                                <Link href={link.href} legacyBehavior passHref>
                                                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-sm font-medium text-muted-foreground hover:text-foreground")}>
                                                        {link.title}
                                                    </NavigationMenuLink>
                                                </Link>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="hidden lg:flex items-center">
                            {user ? (
                                <div className="flex items-center gap-x-3">
                                    <Link href="/dashboard" className={buttonVariants({ size: "sm", variant: "outline" })}>
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-x-3">
                                    <Link href="/login" className={buttonVariants({ size: "sm", variant: "ghost" })}>
                                        Sign In
                                    </Link>
                                    <button
                                        onClick={() => setIsDemoFormOpen(true)}
                                        className={buttonVariants({ size: "sm", className: "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0" })}
                                    >
                                        See Demo
                                        <PlayIcon className="size-3.5 ml-1.5 text-white" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <MobileNavbar />
                    </MaxWidthWrapper>
                </AnimationContainer>
            </header>

            <DemoForm
                isOpen={isDemoFormOpen}
                onClose={() => setIsDemoFormOpen(false)}
            />
        </>
    )
};

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string; icon: () => React.ReactNode }
>(({ className, title, href, icon: Icon, children, ...props }, ref) => {
    return (
        <NavigationMenuLink asChild>
            <Link
                href={href!}
                ref={ref}
                className={cn(
                    "group block select-none p-6 leading-none no-underline outline-none transition-all duration-200 ease-out hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground",
                    className
                )}
                {...props}
            >
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                        <Icon />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="text-base font-semibold !leading-tight text-foreground group-hover:text-accent-foreground">
                            {title}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-accent-foreground/80">
                            {children}
                        </p>
                    </div>
                </div>
            </Link>
        </NavigationMenuLink>
    )
})
ListItem.displayName = "ListItem"

export default Navbar