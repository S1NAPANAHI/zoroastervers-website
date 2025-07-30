'use client'
import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Issue {
  id?: number
  title: string
  description: string
  price: number
  status: 'draft' | 'published' | 'pre-order' | 'coming-soon'
  word_count: number
  release_date: string
  arc_id: number
  cover_image?: string
  tags?: string[]
  order_index?: number
}

interface Arc {
  id: number
  title: string
  sagas: {
    title: string
    volumes: {
      title: string
      books: {
        title: string
      }
    }
  }
}

interface IssueModalProps {
  issue: Issue | null
  onClose: () => void
  onSave: () => void
}

export default function IssueModal({ issue, onClose, onSave }: IssueModalProps) {
  const [formData, setFormData] = useState<Issue>({
    title: '',
    description: '',
    price: 0,
    status: 'draft',
    word_count: 40000,
    release_date: '',
    arc_id: 0,
    cover_image: '',
    tags: [],
    order_index: 0
  })
  const [arcs, setArcs] = useState<Arc[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchArcs()
    if (issue) {
      setFormData(issue)
    }
  }, [issue])

  const fetchArcs = async () => {
    try {
      const response = await fetch('/api/admin/arcs')
      if (response.ok) {
        const data = await response.json()
        setArcs(data)
      }
    } catch (error) {
      console.error('Error fetching arcs:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = issue ? `/api/admin/issues/${issue.id}` : '/api/admin/issues'
      const method = issue ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSave()
      } else {
        alert('Failed to save issue')
      }
    } catch (error) {
      console.error('Error saving issue:', error)
      alert('Error saving issue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass-dark rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {issue ? 'Edit Issue' : 'Add New Issue'}
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
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Arc *</label>
              <select
                name="arc_id"
                value={formData.arc_id}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
              >
                <option value="">Select Arc</option>
                {arcs.map(arc => (
                  <option key={arc.id} value={arc.id}>
                    {arc.sagas?.volumes?.books?.title} → {arc.sagas?.volumes?.title} → {arc.sagas?.title} → {arc.title}
                  </option>
                ))}
              </select>
            </div>

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
                <option value="pre-order">Pre-order</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Word Count</label>
              <input
                type="number"
                name="word_count"
                value={formData.word_count}
                onChange={handleChange}
                min="0"
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Order Index</label>
              <input
                type="number"
                name="order_index"
                value={formData.order_index || 0}
                onChange={handleChange}
                min="0"
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2">Release Date</label>
            <input
              type="datetime-local"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
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
              {isLoading ? 'Saving...' : 'Save Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
