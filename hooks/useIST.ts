import { useCallback } from 'react'

export const useIST = () => {
  // Convert any date string to IST (UTC+5:30)
  const convertToIST = useCallback((dateString: string | Date | null | undefined) => {
    if (!dateString) return null
    
    let date: Date
    if (dateString instanceof Date) {
      date = dateString
    } else {
      date = new Date(dateString)
    }
    
    if (isNaN(date.getTime())) return null
    
    // Convert to IST (UTC+5:30)
    return new Date(date.getTime() + (5.5 * 60 * 60 * 1000))
  }, [])

  // Format date and time in IST
  const formatDateTime = useCallback((dateString: string | Date | null | undefined) => {
    const istDate = convertToIST(dateString)
    if (!istDate) return '—'
    
    return istDate.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' ' + istDate.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }, [convertToIST])

  // Format only time in IST
  const formatTime = useCallback((dateString: string | Date | null | undefined) => {
    const istDate = convertToIST(dateString)
    if (!istDate) return '—'
    
    return istDate.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }, [convertToIST])

  const formatIST = useCallback((dateString: string | Date | null | undefined) => {

    if (!dateString) return '—'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    
    return date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }, [])

  // Format time without timezone conversion (assumes timestamp is already in correct timezone)
  const formatTimeOnly = useCallback((dateString: string | Date | null | undefined) => {
    if (!dateString) return '—'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }, [])

  // Format only date in IST
  const formatDate = useCallback((dateString: string | Date | null | undefined) => {
    const istDate = convertToIST(dateString)
    if (!istDate) return '—'
    
    return istDate.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [convertToIST])

  // Format time with seconds in IST
  const formatTimeWithSeconds = useCallback((dateString: string | Date | null | undefined) => {
    const istDate = convertToIST(dateString)
    if (!istDate) return '—'
    
    return istDate.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }, [convertToIST])

  return {
    convertToIST,
    formatDateTime,
    formatTime,
    formatDate,
    formatTimeWithSeconds,
    formatIST,
    formatTimeOnly
  }
}
