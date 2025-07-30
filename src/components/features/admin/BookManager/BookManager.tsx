'use client'
import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { BookModal } from '@/components/features/admin/BookModal'

interface Book {
  id: number
  title: string
  description?: string
  price?: number
  cover_image?: string
  status: 'draft' | 'published' | 'archived'
  total_word_count?: number
  is_complete: boolean
  physical_edition?: any
  created_at: string
  updated_at: string
  volumes?: Array<{
    id: number
    title: string
    status: string
  }>
}

export default function BookManager() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/admin/books')
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      } else {
        console.error('Failed to fetch books')
      }
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this book? This will also delete all associated volumes, sagas, arcs, and issues.')) return

    try {
      const response = await fetch(`/api/admin/books/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setBooks(books.filter(book => book.id !== id))
        alert('Book deleted successfully')
      } else {
        alert('Failed to delete book')
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      alert('Error deleting book')
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setBooks(books.map(book => 
          book.id === id ? { ...book, status: newStatus as any } : book
        ))
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      published: 'bg-green-500',
      archived: 'bg-red-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="text-center text-white">
        Loading books...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Book Management</h3>
          <p className="text-slate-400 text-sm">Manage your top-level book series</p>
        </div>
        <button
          onClick={() => {
            setEditingBook(null)
            setShowModal(true)
          }}
          className="neon-button-cyan flex items-center gap-2 px-4 py-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Book
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-400"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Books table */}
      <div className="glass-dark rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-white">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Book</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Price</th>
                <th className="px-6 py-4 text-left font-semibold">Word Count</th>
                <th className="px-6 py-4 text-left font-semibold">Volumes</th>
                <th className="px-6 py-4 text-left font-semibold">Complete</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="border-t border-white/10 hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {book.cover_image && (
                        <img 
                          src={book.cover_image} 
                          alt={book.title}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-slate-400 text-sm">{book.description?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={book.status}
                      onChange={e => handleStatusChange(book.id, e.target.value)}
                      className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(book.status)}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">${book.price?.toFixed(2) || 'Free'}</td>
                  <td className="px-6 py-4">{book.total_word_count?.toLocaleString() || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                      {book.volumes?.length || 0} volumes
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      book.is_complete 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {book.is_complete ? 'Complete' : 'In Progress'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingBook(book)
                          setShowModal(true)
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300"
                        title="Edit book"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="p-2 text-red-400 hover:text-red-300"
                        title="Delete book"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBooks.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            No books found matching your criteria.
          </div>
        )}
      </div>

      {/* Modal for adding/editing books */}
      {showModal && (
        <BookModal
          book={editingBook}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false)
            fetchBooks()
          }}
        />
      )}
    </div>
  )
}
