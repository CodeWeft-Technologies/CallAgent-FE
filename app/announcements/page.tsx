'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AnnouncementModal from '../../components/AnnouncementModal'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Megaphone, 
  MessageSquare, 
  AlertCircle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react'

interface AnnouncementContent {
  id?: number
  organization_id?: string | number
  content_type: 'announcement' | 'feedback'
  title: string
  content: string
  keywords: string[]
  is_active: boolean
  created_at?: string
  updated_at?: string
}

const AnnouncementsPage = () => {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<AnnouncementContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'announcement' | 'feedback'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<AnnouncementContent | null>(null)

  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    if (!user?.organization_id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/announcements/${user.organization_id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch announcements')
      }

      const data = await response.json()
      if (data.success) {
        setAnnouncements(data.data || [])
      } else {
        setError(data.message || 'Failed to load announcements')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Error fetching announcements:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [user?.organization_id])

  // Filter and search logic
  const filteredAnnouncements = announcements.filter(item => {
    const matchesFilter = filter === 'all' || item.content_type === filter
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Delete announcement
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/announcements/${user?.organization_id}/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAnnouncements(prev => prev.filter(item => item.id !== id))
      } else {
        throw new Error('Failed to delete item')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
    }
  }

  // Toggle active status
  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const item = announcements.find(a => a.id === id)
      if (!item) return

      const response = await fetch(`/api/announcements/${user?.organization_id}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...item,
          is_active: !currentStatus
        })
      })

      if (response.ok) {
        setAnnouncements(prev => 
          prev.map(item => 
            item.id === id ? { ...item, is_active: !currentStatus } : item
          )
        )
      } else {
        throw new Error('Failed to update status')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  // Handle create/update
  const handleSave = async (data: AnnouncementContent) => {
    try {
      const url = editingItem 
        ? `/api/announcements/${user?.organization_id}/${editingItem.id}`
        : `/api/announcements/`
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingItem ? 'update' : 'create'} content`)
      }

      const result = await response.json()
      
      if (result.success) {
        if (editingItem) {
          // Update existing item
          setAnnouncements(prev => 
            prev.map(item => 
              item.id === editingItem.id ? result.data : item
            )
          )
        } else {
          // Add new item
          setAnnouncements(prev => [result.data, ...prev])
        }
        
        setEditingItem(null)
        setShowCreateModal(false)
      } else {
        throw new Error(result.message || 'Failed to save')
      }
    } catch (err) {
      throw err // Re-throw to be handled by modal
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Please log in to access announcements</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Megaphone className="h-8 w-8 text-blue-600" />
                Announcements & Feedback
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your announcement messages and feedback responses for automated call handling
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="announcement">Announcements</option>
              <option value="feedback">Feedback Responses</option>
            </select>
          </div>
          
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading announcements...</span>
          </div>
        ) : (
          /* Content Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAnnouncements.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                <p className="text-gray-500 mb-4">
                  {filter === 'all' 
                    ? "You haven't created any announcements or feedback responses yet."
                    : `No ${filter}s found matching your criteria.`
                  }
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First {filter === 'all' ? 'Content' : filter}
                </button>
              </div>
            ) : (
              filteredAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow ${
                    item.content_type === 'announcement' ? 'border-l-blue-500' : 'border-l-green-500'
                  } ${!item.is_active ? 'opacity-60' : ''}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {item.content_type === 'announcement' ? (
                        <Megaphone className="h-5 w-5 text-blue-500" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-green-500" />
                      )}
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.content_type === 'announcement' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.content_type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => item.id && toggleActive(item.id, item.is_active)}
                        className={`p-1 rounded ${
                          item.is_active 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={item.is_active ? 'Active' : 'Inactive'}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => item.id && handleDelete(item.id)}
                        className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {item.content}
                  </p>

                  {/* Keywords for Feedback */}
                  {item.content_type === 'feedback' && item.keywords?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Trigger Keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.keywords.slice(0, 3).map((keyword, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                        {item.keywords.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{item.keywords.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Created {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}</span>
                    <span className={`font-medium ${item.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnnouncementModal
        isOpen={showCreateModal || !!editingItem}
        onClose={() => {
          setShowCreateModal(false)
          setEditingItem(null)
        }}
        onSave={handleSave}
        editingItem={editingItem}
        organizationId={user?.organization_id?.toString()}
      />
    </div>
  )
}

export default AnnouncementsPage