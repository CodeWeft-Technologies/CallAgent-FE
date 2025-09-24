import { useState, useEffect, useRef, useCallback } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

interface UseDataCacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of cache entries
}

export function useDataCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseDataCacheOptions = {}
) {
  
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options // Default 5 minutes TTL
  const cache = useRef<Map<string, CacheEntry<T>>>(new Map())
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getCachedData = useCallback((cacheKey: string): T | null => {
    const entry = cache.current.get(cacheKey)
    if (!entry) {
      return null
    }

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      cache.current.delete(cacheKey)
      return null
    }

    return entry.data
  }, [])

  const setCachedData = useCallback((cacheKey: string, data: T, customTtl?: number) => {
    
    // Clean up old entries if cache is too large
    if (cache.current.size >= maxSize) {
      const oldestKey = cache.current.keys().next().value
      if (oldestKey) {
        cache.current.delete(oldestKey)
      }
    }

    cache.current.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl
    })
  }, [ttl, maxSize])

  const fetchData = useCallback(async (forceRefresh = false) => {
    const cacheKey = key
    
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached) {
        setData(cached)
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      setCachedData(cacheKey, result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error(`❌ Error fetching data for key: ${key}:`, error)
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, getCachedData, setCachedData])

  const refresh = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    cache.current.clear()
  }, [])

  const clearCacheEntry = useCallback((cacheKey: string) => {
    cache.current.delete(cacheKey)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refresh,
    clearCache,
    clearCacheEntry,
    fetchData
  }
}

// Specialized hooks for common use cases
export function useLeadsCache(token?: string) {
  return useDataCache(
    'leads',
    async () => {
      if (!token) return []
      
      const response = await fetch('/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      return data.success ? data.data : []
    },
    { ttl: 10 * 60 * 1000 } // 10 minutes TTL for leads (increased from 2 min)
  )
}

export function useCallsCache() {
  const API_BASE = process.env.NEXT_PUBLIC_CALL_API_URL || 'https://callagent-be-2.onrender.com'
  return useDataCache(
    'calls',
    async () => {
      const response = await fetch(`${API_BASE}/api/calls`)
      const data = await response.json()
      return data.success ? data.data : []
    },
    { ttl: 5 * 60 * 1000 } // 5 minutes TTL for calls (increased from 1 min)
  )
}

export function useStatsCache() {
  const API_BASE = process.env.NEXT_PUBLIC_CALL_API_URL || 'https://callagent-be-2.onrender.com'
  return useDataCache(
    'stats',
    async () => {
      const response = await fetch(`${API_BASE}/api/calls/stats`)
      const data = await response.json()
      return data.success ? data.data : null
    },
    { ttl: 2 * 60 * 1000 } // 2 minutes TTL for stats (increased from 30s)
  )
}
