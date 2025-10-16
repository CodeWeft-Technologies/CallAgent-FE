'use client';

import { useEffect, useRef } from 'react';

interface BasicParticlesProps {
  count?: number;
  colors?: string[];
}

interface ParticleData {
  element: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalVx: number;
  originalVy: number;
}

const BasicParticles = ({ count = 50, colors = ['#ffffff', '#B19EEF', '#5227FF'] }: BasicParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<ParticleData[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Create particles as DOM elements with physics
    particlesRef.current = [];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '2px';
      particle.style.height = '2px';
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.opacity = (Math.random() * 0.4 + 0.3).toString();
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1';
      particle.style.transition = 'transform 0.1s ease-out';
      
      const x = Math.random() * container.clientWidth;
      const y = Math.random() * container.clientHeight;
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.5;
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      container.appendChild(particle);
      
      particlesRef.current.push({
        element: particle,
        x,
        y,
        vx,
        vy,
        originalVx: vx,
        originalVy: vy
      });
    }

    // Animation loop
    const animate = () => {
      particlesRef.current.forEach(particle => {
        // Mouse interaction
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;

        if (distance < maxDistance && distance > 0) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.vx = particle.originalVx + Math.cos(angle) * force * 2;
          particle.vy = particle.originalVy + Math.sin(angle) * force * 2;
        } else {
          // Gradually return to original velocity
          particle.vx += (particle.originalVx - particle.vx) * 0.05;
          particle.vy += (particle.originalVy - particle.vy) * 0.05;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = container.clientWidth;
        if (particle.x > container.clientWidth) particle.x = 0;
        if (particle.y < 0) particle.y = container.clientHeight;
        if (particle.y > container.clientHeight) particle.y = 0;

        // Update DOM element position
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current.forEach(particle => {
        if (container.contains(particle.element)) {
          container.removeChild(particle.element);
        }
      });
    };
  }, [count, colors]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ 
        background: 'transparent'
      }}
    />
  );
};

export default BasicParticles;