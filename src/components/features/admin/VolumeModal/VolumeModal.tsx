'use client'
import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Book {
  id: number
  title: string
}

interface Volume {
  id: number
  book_id: number
  title: string
  description?: string
  price?: number
  order_index: number
  status: 'draft' | 'published' | 'archived'
  physical_available: boolean
  digital_bundle: boolean
  created_at: string
  updated_at: string
}

interface VolumeModalProps {
  volume: Volume | null
  onClose: () => void
  onSave: () => void
}

export default function VolumeModal({ volume, onClose, onSave }: VolumeModalProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [formData, setFormData] = useState({
    book_id: '',
    title: '',
    description: '',
    price: '',
    order_index: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    physical_available: false,
    digital_bundle: false
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchBooks()
    
    if (volume) {
      setFormData({
        book_id: volume.book_id.toString(),
        title: volume.title,
        description: volume.description || '',
        price: volume.price?.toString() || '',
        order_index: volume.order_index.toString(),
        status: volume.status,
        physical_available: volume.physical_available,
        digital_bundle: volume.digital_bundle
      })
    }
  }, [volume])

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/admin/books')
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      }
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = volume ? `/api/admin/volumes/${volume.id}` : '/api/admin/volumes'
      const method = volume ? 'PUT' : 'POST'
      
      const payload = {
        book_id: parseInt(formData.book_id),
        title: formData.title,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        order_index: parseInt(formData.order_index),
        status: formData.status,
        physical_available: formData.physical_available,
        digital_bundle: formData.digital_bundle
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        onSave()
        alert(volume ? 'Volume updated successfully!' : 'Volume created successfully!')
      } else {
        const error = await response.text()
        alert(`Error: ${error}`)
      }
    } catch (error) {
      console.error('Error saving volume:', error)
      alert('Error saving volume')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-dark border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {volume ? 'Edit Volume' : 'Add New Volume'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Selection */}
            <div>
              <label className="block text-white font-semibold mb-2">Book *</label>
              <select
                name="book_id"
                value={formData.book_id}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-400"
              >
                <option value="">Select a book</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>{book.title}</option>
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
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-400"
                placeholder="Enter volume title"
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
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-400"
                placeholder="Enter volume description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-white font-semibold mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-400"
                  placeholder="0.00"
                />
              </div>

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
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-400"
                  placeholder="1"
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
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-400"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="physical_available"
                  checked={formData.physical_available}
                  onChange={handleInputChange}
                  className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <label className="text-white">Physical copy available</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="digital_bundle"
                  checked={formData.digital_bundle}
                  onChange={handleInputChange}
                  className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <label className="text-white">Include in digital bundle</label>
              </div>
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
                className="neon-button-purple px-6 py-2 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (volume ? 'Update Volume' : 'Create Volume')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
