"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = ({ onScrollProgress }: { onScrollProgress?: (progress: number) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    stars: THREE.Points[];
    animationId: number | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    stars: [],
    animationId: null
  });

  // Initialize Three.js
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;

      // Scene setup
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000011, 0.0008);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.set(0, 0, 100);

      // Renderer
      if (!canvasRef.current) return;
      
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create stars
      createStarField();
      
      // Start animation
      animate();
      setIsReady(true);
    };

    const createStarField = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const starCount = 3000;
      
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.2, 0.5, 0.5 + Math.random() * 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });

      const stars = new THREE.Points(geometry, material);
      refs.scene.add(stars);
      refs.stars.push(stars);
    };    
    const animate = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene || !refs.camera || !refs.renderer) return;
      
      refs.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.0005;

      // Rotate stars
      refs.stars.forEach((starField) => {
        starField.rotation.x = time * 0.1;
        starField.rotation.y = time * 0.05;
      });

      // Camera movement based on scroll
      refs.camera.position.z = 100 - scrollProgress * 50;
      refs.camera.position.y = scrollProgress * 20;

      refs.renderer.render(refs.scene, refs.camera);
    };

    initThree();

    // Handle resize
    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      const { current: refs } = threeRefs;
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }
      window.removeEventListener('resize', handleResize);
      
      refs.stars.forEach(starField => {
        starField.geometry.dispose();
        if (Array.isArray(starField.material)) {
          starField.material.forEach(material => material.dispose());
        } else {
          starField.material.dispose();
        }
      });
      
      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, [scrollProgress]);

  // GSAP Animations
  useEffect(() => {
    if (!isReady) return;

    gsap.set([titleRef.current, subtitleRef.current], {
      visibility: 'visible'
    });

    const tl = gsap.timeline();

    if (titleRef.current) {
      const titleChars = titleRef.current.querySelectorAll('.title-char');
      tl.from(titleChars, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.03,
        ease: "power4.out"
      });
    }

    if (subtitleRef.current) {
      const subtitleLines = subtitleRef.current.querySelectorAll('.subtitle-line');
      tl.from(subtitleLines, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.6");
    }

    return () => {
      tl.kill();
    };
  }, [isReady]); 
 // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      
      setScrollProgress(progress);
      setCurrentSection(Math.floor(progress * 3));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const splitTitle = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="title-char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const sections = [
    {
      title: 'AI VOICE AGENTS',
      subtitle: {
        line1: 'Transform your business with intelligent',
        line2: 'voice automation that never sleeps'
      }
    },
    {
      title: 'SMART AUTOMATION',
      subtitle: {
        line1: 'Qualify leads, book appointments,',
        line2: 'and follow up automatically'
      }
    },
    {
      title: 'INFINITE SCALE',
      subtitle: {
        line1: 'Handle thousands of calls simultaneously',
        line2: 'with human-like precision'
      }
    }
  ];

  const currentSectionData = sections[currentSection] || sections[0];

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-black text-white overflow-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-screen z-0" />
      
      {/* Fixed content */}
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div className="text-center max-w-4xl px-6">
          <h1 
            ref={titleRef} 
            className="text-4xl md:text-6xl lg:text-8xl font-bold mb-8 tracking-wider"
            style={{ visibility: 'hidden' }}
          >
            {splitTitle(currentSectionData.title)}
          </h1>
          
          <div 
            ref={subtitleRef} 
            className="text-lg md:text-xl lg:text-2xl text-gray-300 space-y-2"
            style={{ visibility: 'hidden' }}
          >
            <p className="subtitle-line">{currentSectionData.subtitle.line1}</p>
            <p className="subtitle-line">{currentSectionData.subtitle.line2}</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <div className="text-xs uppercase tracking-widest mb-4 text-gray-400">
          Scroll to explore
        </div>
        <div className="w-px h-16 bg-gradient-to-b from-white to-transparent mx-auto"></div>
      </div>

      {/* Progress indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20">
        <div className="text-xs text-gray-400 mb-2">
          {String(currentSection + 1).padStart(2, '0')} / 03
        </div>
        <div className="w-px h-32 bg-gray-800">
          <div 
            className="w-full bg-white transition-all duration-300 ease-out"
            style={{ height: `${(scrollProgress * 100) % 33.33}%` }}
          />
        </div>
      </div>

      {/* Spacer divs for scrolling */}
      <div className="h-screen"></div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
    </div>
  );
};