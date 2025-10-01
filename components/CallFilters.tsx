'use client'

import { useState, useCallback, useEffect } from 'react'
import { Search, Filter, Calendar, Clock, Phone, X, RotateCcw } from 'lucide-react'

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

interface FilterOptions {
  statuses: string[]
  directions: string[]
  interest_statuses: string[]
  predefined_ranges: Array<{ value: string; label: string }>
}

interface CallFiltersProps {
  filters: CallFilters
  onFiltersChange: (filters: Partial<CallFilters>) => void
  onClearFilters: () => void
  filterOptions?: FilterOptions
  loading?: boolean
}

export default function CallFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  filterOptions,
  loading = false
}: CallFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [localFilters, setLocalFilters] = useState<CallFilters>(filters)

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = useCallback((key: keyof CallFilters, value: any) => {
    const newValue = value === '' || value === 'all' ? undefined : value
    setLocalFilters(prev => ({ ...prev, [key]: newValue }))
    onFiltersChange({ [key]: newValue })
  }, [onFiltersChange])

  const handleSearchChange = useCallback((value: string) => {
    setLocalFilters(prev => ({ ...prev, search: value }))
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFiltersChange({ search: value || undefined })
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [onFiltersChange])

  const handleDateRangeChange = useCallback((range: string) => {
    if (range === 'custom') {
      setShowAdvanced(true)
      return
    }
    
    handleFilterChange('date_range', range)
    // Clear manual date filters when using predefined range
    if (range !== 'all') {
      setLocalFilters(prev => ({ 
        ...prev, 
        date_from: undefined, 
        date_to: undefined,
        date_range: range 
      }))
      onFiltersChange({ 
        date_from: undefined, 
        date_to: undefined,
        date_range: range === 'all' ? undefined : range
      })
    }
  }, [handleFilterChange, onFiltersChange])

  const handleClearFilters = useCallback(() => {
    setLocalFilters({})
    setShowAdvanced(false)
    onClearFilters()
  }, [onClearFilters])

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== null && value !== ''
  )

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by phone number or lead name..."
            value={localFilters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={loading}
          />
        </div>
        
        {/* Basic Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Status Filter */}
          <select
            value={localFilters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={loading}
          >
            <option value="all">All Status</option>
            {filterOptions?.statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          
          {/* Direction Filter */}
          <select
            value={localFilters.direction || 'all'}
            onChange={(e) => handleFilterChange('direction', e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={loading}
          >
            <option value="all">All Directions</option>
            {filterOptions?.directions.map(direction => (
              <option key={direction} value={direction}>
                {direction.charAt(0).toUpperCase() + direction.slice(1)} Calls
              </option>
            ))}
          </select>
          
          {/* Interest Filter */}
          <select
            value={localFilters.interest_status || 'all'}
            onChange={(e) => handleFilterChange('interest_status', e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={loading}
          >
            <option value="all">All Interest</option>
            {filterOptions?.interest_statuses.map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
            <option value="no_analysis">No Analysis</option>
          </select>
          
          {/* Date Range Filter */}
          <select
            value={localFilters.date_range || 'all'}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={loading}
          >
            <option value="all">All Time</option>
            {filterOptions?.predefined_ranges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
            <option value="custom">Custom Range...</option>
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <Filter className="w-4 h-4" />
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Filters</span>
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
              disabled={loading}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t border-slate-700 pt-4 space-y-4">
            {/* Custom Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1">From Date</label>
                <input
                  type="date"
                  value={localFilters.date_from || ''}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">To Date</label>
                <input
                  type="date"
                  value={localFilters.date_to || ''}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1">From Time</label>
                <input
                  type="time"
                  value={localFilters.time_from || ''}
                  onChange={(e) => handleFilterChange('time_from', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">To Time</label>
                <input
                  type="time"
                  value={localFilters.time_to || ''}
                  onChange={(e) => handleFilterChange('time_to', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Duration Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Min Duration (seconds)</label>
                <input
                  type="number"
                  min="0"
                  value={localFilters.duration_min || ''}
                  onChange={(e) => handleFilterChange('duration_min', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="e.g. 30"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Max Duration (seconds)</label>
                <input
                  type="number"
                  min="0"
                  value={localFilters.duration_max || ''}
                  onChange={(e) => handleFilterChange('duration_max', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="e.g. 300"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone Number Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Specific Phone Number</label>
              <input
                type="tel"
                value={localFilters.phone_number || ''}
                onChange={(e) => handleFilterChange('phone_number', e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="e.g. +1234567890"
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700">
            <span className="text-xs text-slate-400">Active filters:</span>
            {Object.entries(localFilters).map(([key, value]) => {
              if (!value || value === 'all') return null
              return (
                <span
                  key={key}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-md border border-blue-500/30"
                >
                  <span>{key.replace('_', ' ')}: {value}</span>
                  <button
                    onClick={() => handleFilterChange(key as keyof CallFilters, undefined)}
                    className="hover:text-blue-300"
                    disabled={loading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}