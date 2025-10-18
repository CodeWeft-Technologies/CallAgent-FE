'use client'

import React, { ReactNode, useLayoutEffect, useRef, useCallback } from 'react'
import Lenis from 'lenis'

export interface ScrollStackItemProps {
  itemClassName?: string
  children: ReactNode
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
}) => (
  <div
    className={`scroll-stack-card relative w-full min-h-[320px] sm:min-h-[360px] md:min-h-[400px] lg:h-80 my-4 sm:my-6 md:my-8 p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl sm:rounded-3xl md:rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
    }}
  >
    {children}
  </div>
)

interface ScrollStackProps {
  className?: string
  children: ReactNode
  itemDistance?: number
  itemScale?: number
  itemStackDistance?: number
  stackPosition?: string
  scaleEndPosition?: string
  baseScale?: number
  scaleDuration?: number
  rotationAmount?: number
  blurAmount?: number
  useWindowScroll?: boolean
  onStackComplete?: () => void
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true, // ✅ Default: use main page scroll
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stackCompletedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const cardsRef = useRef<HTMLElement[]>([])
  const lastTransformsRef = useRef(new Map<number, any>())
  const isUpdatingRef = useRef(false)
  const cardPositionsRef = useRef<number[]>([])
  const endElementPositionRef = useRef<number>(0)

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number) => {
      if (scrollTop < start) return 0
      if (scrollTop > end) return 1
      return (scrollTop - start) / (end - start)
    },
    []
  )

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number) => {
      if (typeof value === 'string' && value.includes('%')) {
        return (parseFloat(value) / 100) * containerHeight
      }
      return parseFloat(value as string)
    },
    []
  )

  const getScrollData = useCallback(() => {
    return {
      scrollTop: window.scrollY,
      containerHeight: window.innerHeight,
      scrollContainer: document.documentElement,
    }
  }, [])

  const getElementOffset = useCallback((element: HTMLElement) => {
    let offsetTop = 0
    let currentElement = element as HTMLElement | null
    while (currentElement) {
      offsetTop += currentElement.offsetTop
      currentElement = currentElement.offsetParent as HTMLElement | null
    }
    return offsetTop
  }, [])

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return
    isUpdatingRef.current = true

    const { scrollTop, containerHeight } = getScrollData()
    const stackPositionPx = parsePercentage(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)

    cardsRef.current.forEach((card, i) => {
      const cardTop = cardPositionsRef.current[i] || 0
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i
      const pinEnd = endElementPositionRef.current - containerHeight / 2

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
      const targetScale = baseScale + i * itemScale
      const scale = 1 - scaleProgress * (1 - targetScale)
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

      let blur = 0
      if (blurAmount) {
        let topCardIndex = 0
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j])
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i
          blur = Math.max(0, depthInStack * blurAmount)
        }
      }

      let translateY = 0
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      }

      const lastTransform = lastTransformsRef.current.get(i)
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.5 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.005 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.5 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.5

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg) translateZ(0)`
        card.style.filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : ''
        lastTransformsRef.current.set(i, newTransform)
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false
        }
      }
    })

    isUpdatingRef.current = false
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
  ])

  const cachePositions = useCallback(() => {
    const cards = Array.from(
      document.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[]
    cardsRef.current = cards
    
    // Cache card positions
    cardPositionsRef.current = cards.map(card => getElementOffset(card))
    
    // Cache end element position
    const endElement = document.querySelector('.scroll-stack-end') as HTMLElement | null
    endElementPositionRef.current = endElement ? getElementOffset(endElement) : 0
  }, [getElementOffset])

  useLayoutEffect(() => {
    const cards = Array.from(
      document.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[]
    cardsRef.current = cards
    const transformsCache = lastTransformsRef.current

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`
      }
      card.style.willChange = 'transform, filter'
      card.style.transformOrigin = 'top center'
      card.style.backfaceVisibility = 'hidden'
      card.style.transform = 'translateZ(0)'
      card.style.webkitTransform = 'translateZ(0)'
    })

    // Cache positions initially and on resize with small delay
    setTimeout(() => {
      cachePositions()
      requestAnimationFrame(updateCardTransforms)
    }, 10)
    
    const onScroll = () => requestAnimationFrame(updateCardTransforms)
    const onResize = () => {
      setTimeout(() => {
        cachePositions()
        requestAnimationFrame(updateCardTransforms)
      }, 10)
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current)
      transformsCache.clear()
    }
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    onStackComplete,
    updateCardTransforms,
    cachePositions,
  ])

  return (
    <div
      className={`relative w-full ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: 'none',
        willChange: 'transform',
      }}
    >
      <div className="scroll-stack-inner pt-[15vh] sm:pt-[20vh] px-4 sm:px-8 md:px-12 lg:px-20 pb-[50vh] sm:pb-[75vh] md:pb-[100vh] min-h-screen">
        {children}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  )
}

export default ScrollStack