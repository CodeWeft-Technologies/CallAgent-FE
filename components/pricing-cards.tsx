
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { CheckIcon, Globe, DollarSign, IndianRupee, Loader2 } from "lucide-react";
import Link from "next/link";

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

// Supported currencies for our pricing
const SUPPORTED_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP'];

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
    const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Fetch real-time exchange rates
    useEffect(() => {
        const fetchExchangeRates = async () => {
            setIsLoading(true);
            setError('');
            
            try {
                const response = await fetch('https://api.freeapi.app/api/v1/public/currency?base=USD', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Exchange rate data:', data);
                
                if (data.success && data.data && data.data.rates) {
                    // Extract only the currencies we support
                    const supportedRates = {
                        USD: 1,
                        INR: data.data.rates.INR || 83.50,
                        EUR: data.data.rates.EUR || 0.92,
                        GBP: data.data.rates.GBP || 0.80,
                    };
                    setExchangeRates(supportedRates);
                } else {
                    throw new Error('Failed to fetch rates: Invalid response format');
                }
            } catch (err) {
                console.error('Currency API error:', err);
                setError('');
                // Fallback to static rates
                setExchangeRates({
                    USD: 1,
                    INR: 88.78,
                    EUR: 0.86,
                    GBP: 0.80,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchExchangeRates();
        // Refresh rates every 10 minutes
        const interval = setInterval(fetchExchangeRates, 10 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, []);

    const convertPrice = (usdPrice: number | null) => {
        if (usdPrice === null) return { amount: "Custom", symbol: "", currency: selectedCurrency };
        
        const rate = exchangeRates[selectedCurrency] || 1;
        const converted = usdPrice * rate;
        return {
            amount: converted.toFixed(2),
            symbol: CURRENCY_SYMBOLS[selectedCurrency as keyof typeof CURRENCY_SYMBOLS] || '$',
            currency: selectedCurrency
        };
    };

    const IconComponent = CURRENCY_ICONS[selectedCurrency as keyof typeof CURRENCY_ICONS] || DollarSign;

    return (
        <div className="w-full">
            {/* Currency Converter */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span>Currency:</span>
                    {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                </div>
                
                <div className="relative">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 min-w-[80px]"
                        disabled={isLoading}
                    >
                        <IconComponent className="w-4 h-4" />
                        <span>{selectedCurrency}</span>
                    </Button>
                    
                    {isDropdownOpen && (
                        <Card className="absolute top-full left-0 mt-1 z-50 min-w-[120px] shadow-lg">
                            <CardContent className="p-1">
                                {SUPPORTED_CURRENCIES.map((currency) => {
                                    const CurrencyIcon = CURRENCY_ICONS[currency as keyof typeof CURRENCY_ICONS];
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
                                                {CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]}
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