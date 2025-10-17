import { buttonVariants } from "./button";
import { cn } from "../../lib/utils";
import { ArrowRightIcon, Link2Icon, SearchIcon, WaypointsIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

export const CARDS = [
    {
        Icon: Link2Icon,
        name: "AI Voice Agents",
        description: "Advanced conversational AI that handles calls naturally and professionally.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-1",
        background: (
            <Card className="absolute top-10 left-10 origin-top rounded-none rounded-tl-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105 border border-border border-r-0">
                <CardHeader>
                    <CardTitle>
                        AI Voice Agents
                    </CardTitle>
                    <CardDescription>
                        Create intelligent voice agents that sound human.
                    </CardDescription>
                </CardHeader>
                <CardContent className="-mt-4">
                    <div className="w-full h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🤖</span>
                    </div>
                </CardContent>
            </Card>
        ),
    },
    {
        Icon: SearchIcon,
        name: "Real-time Analytics",
        description: "Track performance, conversion rates, and ROI in real-time.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-2",
        background: (
            <div className="absolute right-10 top-10 w-[70%] origin-to translate-x-0 border border-border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10 p-4 bg-card rounded-lg">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Calls Made</span>
                        <span className="text-sm font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="text-sm font-medium text-green-400">23.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Revenue</span>
                        <span className="text-sm font-medium">$12,450</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        Icon: WaypointsIcon,
        name: "CRM Integration",
        description: "Seamlessly integrate with your existing CRM and tools.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-2 max-w-full overflow-hidden",
        background: (
            <div className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
                <div className="grid grid-cols-3 gap-4 p-4">
                    <div className="bg-card border border-border rounded-lg p-3 text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-xs text-muted-foreground">Salesforce</div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3 text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="text-xs text-muted-foreground">HubSpot</div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3 text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <div className="text-xs text-muted-foreground">Zapier</div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        Icon: CalendarIcon,
        name: "Campaign Scheduling",
        description: "Schedule and manage your calling campaigns efficiently.",
        className: "col-span-3 lg:col-span-1",
        href: "#",
        cta: "Learn more",
        background: (
            <div className="absolute right-0 top-10 origin-top rounded-md border border-border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105 bg-card p-4">
                <div className="text-center space-y-2">
                    <div className="text-lg font-semibold">December 2024</div>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                        <div className="p-1">S</div>
                        <div className="p-1">M</div>
                        <div className="p-1">T</div>
                        <div className="p-1">W</div>
                        <div className="p-1">T</div>
                        <div className="p-1">F</div>
                        <div className="p-1">S</div>
                        <div className="p-1">1</div>
                        <div className="p-1">2</div>
                        <div className="p-1">3</div>
                        <div className="p-1">4</div>
                        <div className="p-1">5</div>
                        <div className="p-1">6</div>
                        <div className="p-1">7</div>
                        <div className="p-1 bg-primary text-primary-foreground rounded">8</div>
                        <div className="p-1">9</div>
                        <div className="p-1">10</div>
                        <div className="p-1">11</div>
                        <div className="p-1">12</div>
                        <div className="p-1">13</div>
                        <div className="p-1">14</div>
                    </div>
                </div>
            </div>
        ),
    },
];

const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
                className,
            )}
        >
            {children}
        </div>
    );
};

const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
}: {
    name: string;
    className: string;
    background: ReactNode;
    Icon: any;
    description: string;
    href: string;
    cta: string;
}) => (
    <div
        key={name}
        className={cn(
            "group relative col-span-3 flex flex-col justify-between border border-border/60 overflow-hidden rounded-xl",
            "bg-black [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            className,
        )}
    >
        <div>{background}</div>
        <div className="pointer-events-none z-10 flex flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
            <Icon className="h-12 w-12 origin-left text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
            <h3 className="text-xl font-semibold text-neutral-300">
                {name}
            </h3>
            <p className="max-w-lg text-neutral-400">{description}</p>
        </div>

        <div
            className={cn(
                "absolute bottom-0 flex w-full translate-y-10 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
            )}
        >
            <Link href={href} className={buttonVariants({ size: "sm", variant: "ghost", className: "cursor-pointer" })}>
                {cta}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
        </div>
        <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </div>
);

export { BentoCard, BentoGrid };