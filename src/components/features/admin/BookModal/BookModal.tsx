'use client'
import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Book {
  id?: number
  title: string
  description?: string
  price?: number
  cover_image?: string
  status: 'draft' | 'published' | 'archived'
  total_word_count?: number
  is_complete: boolean
  physical_edition?: any
}

interface BookModalProps {
  book: Book | null
  onClose: () => void
  onSave: () => void
}

export default function BookModal({ book, onClose, onSave }: BookModalProps) {
  const [formData, setFormData] = useState<Book>({
    title: '',
    description: '',
    price: 0,
    cover_image: '',
    status: 'draft',
    total_word_count: 0,
    is_complete: false,
    physical_edition: {}
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (book) {
      setFormData(book)
    }
  }, [book])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = book ? `/api/admin/books/${book.id}` : '/api/admin/books'
      const method = book ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSave()
      } else {
        alert('Failed to save book')
      }
    } catch (error) {
      console.error('Error saving book:', error)
      alert('Error saving book')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass-dark rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price || 0}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2">Total Word Count</label>
            <input
              type="number"
              name="total_word_count"
              value={formData.total_word_count || 0}
              onChange={handleChange}
              min="0"
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Cover Image URL</label>
            <input
              type="url"
              name="cover_image"
              value={formData.cover_image || ''}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_complete"
              checked={formData.is_complete}
              onChange={handleChange}
              className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
            />
            <label className="text-white">Mark as Complete</label>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="neon-button-cyan px-6 py-2"
            >
              {isLoading ? 'Saving...' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
