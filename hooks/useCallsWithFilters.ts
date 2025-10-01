import { useState, useEffect, useCallback, useMemo } from 'react'

interface CallFilters {
  phone_number?: string
  lead_id?: string
  status?: string
  direction?: string
  interest_status?: string
  date_from?: string
  date_to?: string
  time_from?: string
  time_to?: string
  duration_min?: number
  duration_max?: number
  date_range?: string
  search?: string
}

interface UseCallsWithFiltersOptions {
  limit?: number
  skip?: number
  autoFetch?: boolean
}

interface CallsResponse {
  success: boolean
  data: any[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export function useCallsWithFilters(
  token?: string,
  options: UseCallsWithFiltersOptions = {}
) {
  const { limit = 50, skip = 0, autoFetch = true } = options
  const API_BASE = process.env.NEXT_PUBLIC_CALL_API_URL || 'https://callagent-be-2.onrender.com'
  
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<CallFilters>({})
  const [currentSkip, setCurrentSkip] = useState(skip)
  const [currentLimit, setCurrentLimit] = useState(limit)
  
  const buildQueryString = useCallback((filters: CallFilters, limit: number, skip: number) => {
    const params = new URLSearchParams()
    
    // Add pagination
    params.append('limit', limit.toString())
    params.append('skip', skip.toString())
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        params.append(key, value.toString())
      }
    })
    
    return params.toString()
  }, [])
  
  const fetchCalls = useCallback(async (
    currentFilters: CallFilters = {},
    currentLimit: number = limit,
    currentSkip: number = skip,
    forceRefresh: boolean = false
  ) => {
    if (!token) return
    
    setLoading(true)
    setError(null)
    
    try {
      const queryString = buildQueryString(currentFilters, currentLimit, currentSkip)
      const url = `${API_BASE}/api/calls?${queryString}`
      
      console.log('🔍 Fetching calls with filters:', url)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result: CallsResponse = await response.json()
      
      if (result.success) {
        setData(result.data || [])
        setTotal(result.total || 0)
      } else {
        throw new Error('Failed to fetch calls')
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('❌ Error fetching calls:', error)
    } finally {
      setLoading(false)
    }
  }, [token, API_BASE, buildQueryString, limit, skip])
  
  const updateFilters = useCallback((newFilters: Partial<CallFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])
  
  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])
  
  const refresh = useCallback(() => {
    fetchCalls(filters, currentLimit, currentSkip, true)
  }, [fetchCalls, filters, currentLimit, currentSkip])
  
  const setPage = useCallback((page: number) => {
    const newSkip = (page - 1) * currentLimit
    setCurrentSkip(newSkip)
  }, [currentLimit])
  
  const setPageSize = useCallback((newLimit: number) => {
    setCurrentLimit(newLimit)
    setCurrentSkip(0) // Reset to first page
  }, [])
  
  // Auto-fetch when filters change
  useEffect(() => {
    if (autoFetch && token) {
      fetchCalls(filters, currentLimit, currentSkip)
    }
  }, [filters, currentLimit, currentSkip, token, autoFetch, fetchCalls])
  
  return {
    data,
    loading,
    error,
    total,
    filters,
    updateFilters,
    clearFilters,
    refresh,
    fetchCalls,
    setPage,
    setPageSize,
    currentPage: Math.floor(currentSkip / currentLimit) + 1,
    pageSize: currentLimit
  }
}

// Hook for getting filter options from the backend
export function useFilterOptions(token?: string) {
  const API_BASE = process.env.NEXT_PUBLIC_CALL_API_URL || 'https://callagent-be-2.onrender.com'
  const [options, setOptions] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const fetchOptions = useCallback(async () => {
    if (!token) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/api/calls/filters/options`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setOptions(result.data)
      } else {
        throw new Error('Failed to fetch filter options')
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('❌ Error fetching filter options:', error)
    } finally {
      setLoading(false)
    }
  }, [token, API_BASE])
  
  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])
  
  return {
    options,
    loading,
    error,
    refresh: fetchOptions
  }
}