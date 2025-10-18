'use client'

import React, { ReactNode, useLayoutEffect, useRef, useCallback } from 'react';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full h-80 my-8 p-12 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </div>
);

interface SimpleScrollStackProps {
  className?: string;
  children: ReactNode;
}

const SimpleScrollStack: React.FC<SimpleScrollStackProps> = ({
  children,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) {
      console.log('No cards found for transform update'); // Debug log
      return;
    }

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const viewportCenter = scrollTop + viewportHeight / 2;

    console.log('Updating transforms, scroll:', scrollTop, 'cards:', cardsRef.current.length); // Debug log

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const cardCenter = scrollTop + rect.top + rect.height / 2;
      const distanceFromCenter = cardCenter - viewportCenter;
      
      // Simple scaling based on position relative to viewport center
      const maxDistance = viewportHeight;
      const progress = Math.max(0, Math.min(1, Math.abs(distanceFromCenter) / maxDistance));
      const scale = Math.max(0.85, 1 - progress * 0.15); // Scale from 1 to 0.85
      
      // Simple stacking effect
      let translateY = 0;
      if (distanceFromCenter < 0) {
        // Card is above center - apply stacking
        const stackProgress = Math.max(0, Math.min(1, -distanceFromCenter / (viewportHeight * 0.5)));
        translateY = stackProgress * i * -30; // Stack with 30px offset per card
      }

      const transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      card.style.transform = transform;
      
      if (i === 0) {
        console.log(`Card ${i}: scale=${scale.toFixed(2)}, translateY=${translateY.toFixed(1)}`); // Debug log
      }
    });
  }, []);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(updateCardTransforms);
  }, [updateCardTransforms]);

  useLayoutEffect(() => {
    // Wait for DOM to be ready
    const initializeCards = () => {
      const cards = Array.from(
        containerRef.current?.querySelectorAll('.scroll-stack-card') || []
      ) as HTMLElement[];
      
      console.log('Found cards:', cards.length); // Debug log
      cardsRef.current = cards;

      cards.forEach((card, i) => {
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'top center';
        card.style.backfaceVisibility = 'hidden';
        card.style.transform = 'translateZ(0)';
      });

      // Initial update
      updateCardTransforms();
    };

    // Initialize immediately and after a short delay
    initializeCards();
    setTimeout(initializeCards, 100);

    const scrollHandler = () => {
      requestAnimationFrame(updateCardTransforms);
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [updateCardTransforms]);

  return (
    <div className={`relative w-full ${className}`.trim()} ref={containerRef}>
      <div className="pt-[20vh] px-4 md:px-20 pb-[50vh] min-h-[150vh]">
        {children}
      </div>
    </div>
  );
};

export default SimpleScrollStack;