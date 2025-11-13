
"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { CheckIcon, Globe, DollarSign, IndianRupee } from "lucide-react";
import Link from "next/link";

// Exchange rates (in real app, fetch from API)
const EXCHANGE_RATES = {
  USD: 1,
  INR: 83.50, // 1 USD = 83.50 INR (approximate)
  EUR: 0.92,  // 1 USD = 0.92 EUR (approximate)
  GBP: 0.80,  // 1 USD = 0.80 GBP (approximate)
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
};

const CURRENCY_ICONS = {
  USD: DollarSign,
  INR: IndianRupee,
  EUR: DollarSign,
  GBP: DollarSign,
};

const PRICING_PLANS = [
    {
        name: "Starter",
        description: "Perfect for small teams getting started",
        priceUSD: 0.15,
        period: "per minute",
        features: [
            "Up to 1,000 minutes/month",
            "Basic AI voice agents",
            "Email support",
            "Standard integrations",
            "Basic analytics"
        ],
        cta: "Get Started",
        href: "/register",
        popular: false
    },
    {
        name: "Professional",
        description: "Best for growing sales teams",
        priceUSD: 0.12,
        period: "per minute",
        features: [
            "Up to 10,000 minutes/month",
            "Advanced AI voice agents",
            "Priority support",
            "All integrations",
            "Advanced analytics",
            "Custom scripts",
            "A/B testing"
        ],
        cta: "Start Free Trial",
        href: "/register",
        popular: true
    },
    {
        name: "Enterprise",
        description: "For large organizations with custom needs",
        priceUSD: null, // Custom pricing
        period: "pricing",
        features: [
            "Unlimited minutes",
            "Custom AI training",
            "Dedicated support",
            "Custom integrations",
            "White-label solution",
            "SLA guarantee",
            "Advanced security"
        ],
        cta: "Contact Sales",
        href: "/contact",
        popular: false
    }
];

const PricingCards = () => {
    const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof EXCHANGE_RATES>('USD');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const currencies = Object.keys(EXCHANGE_RATES) as Array<keyof typeof EXCHANGE_RATES>;

    const convertPrice = (usdPrice: number | null) => {
        if (usdPrice === null) return { amount: "Custom", symbol: "", currency: selectedCurrency };
        
        const converted = usdPrice * EXCHANGE_RATES[selectedCurrency];
        return {
            amount: converted.toFixed(2),
            symbol: CURRENCY_SYMBOLS[selectedCurrency],
            currency: selectedCurrency
        };
    };

    const IconComponent = CURRENCY_ICONS[selectedCurrency];

    return (
        <div className="w-full">
            {/* Currency Converter */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span>Currency:</span>
                </div>
                
                <div className="relative">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 min-w-[80px]"
                    >
                        <IconComponent className="w-4 h-4" />
                        <span>{selectedCurrency}</span>
                    </Button>
                    
                    {isDropdownOpen && (
                        <Card className="absolute top-full left-0 mt-1 z-50 min-w-[120px] shadow-lg">
                            <CardContent className="p-1">
                                {currencies.map((currency) => {
                                    const CurrencyIcon = CURRENCY_ICONS[currency];
                                    return (
                                        <Button
                                            key={currency}
                                            variant={selectedCurrency === currency ? "default" : "ghost"}
                                            size="sm"
                                            className="w-full justify-start gap-2 text-xs"
                                            onClick={() => {
                                                setSelectedCurrency(currency);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            <CurrencyIcon className="w-3 h-3" />
                                            <span>{currency}</span>
                                            <span className="ml-auto text-muted-foreground">
                                                {CURRENCY_SYMBOLS[currency]}
                                            </span>
                                        </Button>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Click outside to close */}
                {isDropdownOpen && (
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsDropdownOpen(false)}
                    />
                )}
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full py-8">
                {PRICING_PLANS.map((plan, index) => {
                    const convertedPrice = convertPrice(plan.priceUSD);
                    
                    return (
                        <Card 
                            key={plan.name} 
                            className={`relative flex flex-col ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <CardHeader className="text-center pb-8">
                                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {plan.description}
                                </CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">
                                        {convertedPrice.symbol}{convertedPrice.amount}
                                    </span>
                                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center">
                                            <CheckIcon className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                                    <Link href={plan.href}>
                                        {plan.cta}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default PricingCards;