'use client'
import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Saga {
  id: number
  title: string
  volumes?: {
    id: number
    title: string
    books?: {
      id: number
      title: string
    }
  }
}

interface Arc {
  id: number
  saga_id: number
  title: string
  description?: string
  order_index: number
  status: 'draft' | 'published' | 'archived'
  word_count?: number
  created_at: string
  updated_at: string
}

interface ArcModalProps {
  arc: Arc | null
  onClose: () => void
  onSave: () => void
}

export default function ArcModal({ arc, onClose, onSave }: ArcModalProps) {
  const [sagas, setSagas] = useState<Saga[]>([])
  const [formData, setFormData] = useState({
    saga_id: '',
    title: '',
    description: '',
    order_index: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    word_count: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchSagas()
    
    if (arc) {
      setFormData({
        saga_id: arc.saga_id.toString(),
        title: arc.title,
        description: arc.description || '',
        order_index: arc.order_index.toString(),
        status: arc.status,
        word_count: arc.word_count?.toString() || ''
      })
    }
  }, [arc])

  const fetchSagas = async () => {
    try {
      const response = await fetch('/api/admin/sagas')
      if (response.ok) {
        const data = await response.json()
        setSagas(data)
      }
    } catch (error) {
      console.error('Error fetching sagas:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = arc ? `/api/admin/arcs/${arc.id}` : '/api/admin/arcs'
      const method = arc ? 'PUT' : 'POST'
      
      const payload = {
        saga_id: parseInt(formData.saga_id),
        title: formData.title,
        description: formData.description || null,
        order_index: parseInt(formData.order_index),
        status: formData.status,
        word_count: formData.word_count ? parseInt(formData.word_count) : null
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        onSave()
        alert(arc ? 'Arc updated successfully!' : 'Arc created successfully!')
      } else {
        const error = await response.text()
        alert(`Error: ${error}`)
      }
    } catch (error) {
      console.error('Error saving arc:', error)
      alert('Error saving arc')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-dark border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {arc ? 'Edit Arc' : 'Add New Arc'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Saga Selection */}
            <div>
              <label className="block text-white font-semibold mb-2">Saga *</label>
              <select
                name="saga_id"
                value={formData.saga_id}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
              >
                <option value="">Select a saga</option>
                {sagas.map(saga => (
                  <option key={saga.id} value={saga.id}>
                    {saga.title} ({saga.volumes?.title} - {saga.volumes?.books?.title})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-white font-semibold mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                placeholder="Enter arc title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                placeholder="Enter arc description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Order Index */}
              <div>
                <label className="block text-white font-semibold mb-2">Order Index *</label>
                <input
                  type="number"
                  name="order_index"
                  value={formData.order_index}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                  placeholder="1"
                />
              </div>

              {/* Word Count */}
              <div>
                <label className="block text-white font-semibold mb-2">Word Count</label>
                <input
                  type="number"
                  name="word_count"
                  value={formData.word_count}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-white font-semibold mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="neon-button-orange px-6 py-2 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (arc ? 'Update Arc' : 'Create Arc')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
