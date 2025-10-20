"use client";

import React, { useState, useEffect } from 'react';
import { HeroSection } from '../../components/features/HeroSectionSimple';
import { FeaturesList } from '../../components/features/FeaturesList';

export default function FeaturesPage() {
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 3; // Hero section is 300vh
      
      // Show features when user scrolls past the hero section
      if (scrollY > heroHeight * 0.85) {
        setShowFeatures(true);
      } else {
        setShowFeatures(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black text-white overflow-x-hidden features-page">
      <HeroSection />
      
      {/* Features section that appears after scroll animation */}
      <div 
        className={`relative z-30 transition-all duration-1000 ${
          showFeatures 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-20'
        }`}
        style={{ 
          background: 'linear-gradient(to bottom, #000000, #0f172a)',
          minHeight: '100vh'
        }}
      >
        {showFeatures && <FeaturesList />}
      </div>
    </div>
  );
}