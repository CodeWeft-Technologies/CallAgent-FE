import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

const PRICING_PLANS = [
    {
        name: "Starter",
        description: "Perfect for small teams getting started",
        price: "$0.15",
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
        price: "$0.12",
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
        price: "Custom",
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
        href: "/enterprise",
        popular: false
    }
];

const PricingCards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full py-8">
            {PRICING_PLANS.map((plan, index) => (
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
                            <span className="text-4xl font-bold">{plan.price}</span>
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
            ))}
        </div>
    );
};

export default PricingCards;