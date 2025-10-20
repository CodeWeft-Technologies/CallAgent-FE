"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

const projects = [
  {
    title: "Upload Your Leads",
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=center",
    description: "Import your contact list via CSV or connect your CRM directly. Our system validates and organizes your data automatically.",
  },
  {
    title: "Configure AI Agent",
    src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop&crop=center",
    description: "Customize your agent's voice, script, conversation flow, and objection handling. No technical skills required.",
  },
  {
    title: "Launch Campaign",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center",
    description: "Start calling and watch your AI agents convert leads automatically. Monitor performance in real-time.",
  },
  {
    title: "Track Results",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
    description: "Get detailed analytics on call performance, conversion rates, and lead quality insights.",
  },
  {
    title: "Scale Success",
    src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop&crop=center",
    description: "Expand your campaigns with proven strategies and optimize for maximum ROI.",
  },
];

const StickyCard_001 = ({
  i,
  title,
  src,
  description,
  progress,
  range,
  targetScale,
}: {
  i: number;
  title: string;
  src: string;
  description: string;
  progress: any;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center h-screen"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="relative flex h-[500px] w-full max-w-[800px] origin-top flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-background/95 to-background/80 ring-1 ring-border shadow-2xl"
      >
        <div className="relative h-full w-full">
          {/* Background Image */}
          <img 
            src={src} 
            alt={title} 
            className="h-full w-full object-cover opacity-30" 
          />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-white text-3xl font-bold">{i + 1}</span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-6">{title}</h3>
            <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </motion.div>
    </div>
  );
};

const Skiper16 = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={container}
      className="relative w-full"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div className="sticky top-20 left-1/2 transform -translate-x-1/2 z-50 text-center mb-8">
        <span className="text-sm uppercase tracking-wide text-muted-foreground bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border">
          Scroll to see how it works
        </span>
      </div>
      
      {projects.map((project, i) => {
        const targetScale = Math.max(0.8, 1 - (projects.length - i - 1) * 0.05);
        return (
          <StickyCard_001
            key={`p_${i}`}
            i={i}
            {...project}
            progress={scrollYProgress}
            range={[i * 0.2, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
};

export { Skiper16, StickyCard_001 };