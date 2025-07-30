'use client'
import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { IssueModal } from '@/components/features/admin/IssueModal'

interface Issue {
  id: number
  title: string
  description: string
  price: number
  status: 'draft' | 'published' | 'pre-order' | 'coming-soon'
  word_count: number
  release_date: string
  arc_id: number
  arcs: {
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
}

export default function IssueManager() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/admin/issues')
      if (response.ok) {
        const data = await response.json()
        setIssues(data)
      } else {
        console.error('Failed to fetch issues')
      }
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this issue?')) return

    try {
      const response = await fetch(`/api/admin/issues/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setIssues(issues.filter(issue => issue.id !== id))
      } else {
        alert('Failed to delete issue')
      }
    } catch (error) {
      console.error('Error deleting issue:', error)
      alert('Error deleting issue')
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/issues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setIssues(issues.map(issue => 
          issue.id === id ? { ...issue, status: newStatus as any } : issue
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
      'pre-order': 'bg-blue-500',
      'coming-soon': 'bg-yellow-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="text-center text-white">
        Loading issues...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Issue Management</h3>
        <button
          onClick={() => {
            setEditingIssue(null)
            setShowModal(true)
          }}
          className="neon-button-cyan flex items-center gap-2 px-4 py-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Issue
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search issues..."
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
          <option value="pre-order">Pre-order</option>
          <option value="coming-soon">Coming Soon</option>
        </select>
      </div>

      {/* Issues table */}
      <table className="min-w-full text-white">
        <thead>
          <tr className="bg-slate-800/50">
            <th className="px-6 py-4 text-left font-semibold">Title</th>
            <th className="px-6 py-4 text-left font-semibold">Hierarchy</th>
            <th className="px-6 py-4 text-left font-semibold">Status</th>
            <th className="px-6 py-4 text-left font-semibold">Price</th>
            <th className="px-6 py-4 text-left font-semibold">Words</th>
            <th className="px-6 py-4 text-left font-semibold">Release</th>
            <th className="px-6 py-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredIssues.map((issue) => (
            <tr key={issue.id} className="border-t border-white/10 hover:bg-slate-800/20 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium">{issue.title}</div>
                <div className="text-slate-400 text-sm">{issue.description}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <div>{issue.arcs?.sagas?.volumes?.books?.title}</div>
                  <div className="text-slate-400">{issue.arcs?.sagas?.volumes?.title} → {issue.arcs?.sagas?.title} → {issue.arcs?.title}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <select
                  value={issue.status}
                  onChange={e => handleStatusChange(issue.id, e.target.value)}
                  className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(issue.status)}`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="pre-order">Pre-order</option>
                  <option value="coming-soon">Coming Soon</option>
                </select>
              </td>
              <td className="px-6 py-4">${issue.price}</td>
              <td className="px-6 py-4">{issue.word_count?.toLocaleString()}</td>
              <td className="px-6 py-4">{issue.release_date ? new Date(issue.release_date).toLocaleDateString() : 'TBD'}</td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingIssue(issue)
                      setShowModal(true)
                    }}
                    className="p-2 text-blue-400 hover:text-blue-300"
                    title="Edit issue"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(issue.id)}
                    className="p-2 text-red-400 hover:text-red-300"
                    title="Delete issue"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredIssues.length === 0 && (
        <div className="text-center text-slate-400 mt-4">No issues found matching your criteria.</div>
      )}

      {/* Modal for adding/editing issues */}
      {showModal && (
        <IssueModal
          issue={editingIssue}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false)
            fetchIssues()
          }}
        />
      )}
    </div>
  )
}

