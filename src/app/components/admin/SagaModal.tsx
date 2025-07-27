'use client'
import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Volume {
  id: number
  title: string
  books?: {
    id: number
    title: string
  }
}

interface Saga {
  id: number
  volume_id: number
  title: string
  description?: string
  order_index: number
  status: 'draft' | 'published' | 'archived'
  word_count?: number
  created_at: string
  updated_at: string
}

interface SagaModalProps {
  saga: Saga | null
  onClose: () => void
  onSave: () => void
}

export default function SagaModal({ saga, onClose, onSave }: SagaModalProps) {
  const [volumes, setVolumes] = useState<Volume[]>([])
  const [formData, setFormData] = useState({
    volume_id: '',
    title: '',
    description: '',
    order_index: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    word_count: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchVolumes()
    
    if (saga) {
      setFormData({
        volume_id: saga.volume_id.toString(),
        title: saga.title,
        description: saga.description || '',
        order_index: saga.order_index.toString(),
        status: saga.status,
        word_count: saga.word_count?.toString() || ''
      })
    }
  }, [saga])

  const fetchVolumes = async () => {
    try {
      const response = await fetch('/api/admin/volumes')
      if (response.ok) {
        const data = await response.json()
        setVolumes(data)
      }
    } catch (error) {
      console.error('Error fetching volumes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = saga ? `/api/admin/sagas/${saga.id}` : '/api/admin/sagas'
      const method = saga ? 'PUT' : 'POST'
      
      const payload = {
        volume_id: parseInt(formData.volume_id),
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
        alert(saga ? 'Saga updated successfully!' : 'Saga created successfully!')
      } else {
        const error = await response.text()
        alert(`Error: ${error}`)
      }
    } catch (error) {
      console.error('Error saving saga:', error)
      alert('Error saving saga')
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
              {saga ? 'Edit Saga' : 'Add New Saga'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Volume Selection */}
            <div>
              <label className="block text-white font-semibold mb-2">Volume *</label>
              <select
                name="volume_id"
                value={formData.volume_id}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400"
              >
                <option value="">Select a volume</option>
                {volumes.map(volume => (
                  <option key={volume.id} value={volume.id}>
                    {volume.title} ({volume.books?.title})
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
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400"
                placeholder="Enter saga title"
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
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400"
                placeholder="Enter saga description"
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
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400"
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
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400"
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
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400"
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
                className="neon-button-green px-6 py-2 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (saga ? 'Update Saga' : 'Create Saga')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
