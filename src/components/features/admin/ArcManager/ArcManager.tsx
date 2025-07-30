'use client'
import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import ArcModal from '@/components/features/admin/ArcModal'

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
  sagas?: {
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
  issues?: Array<{
    id: number
    title: string
    status: string
  }>
}

export default function ArcManager() {
  const [arcs, setArcs] = useState<Arc[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingArc, setEditingArc] = useState<Arc | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sagaFilter, setSagaFilter] = useState('all')

  useEffect(() => {
    fetchArcs()
  }, [])

  const fetchArcs = async () => {
    try {
      const response = await fetch('/api/admin/arcs')
      if (response.ok) {
        const data = await response.json()
        setArcs(data)
      } else {
        console.error('Failed to fetch arcs')
      }
    } catch (error) {
      console.error('Error fetching arcs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this arc? This will also delete all associated issues.')) return

    try {
      const response = await fetch(`/api/admin/arcs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setArcs(arcs.filter(arc => arc.id !== id))
        alert('Arc deleted successfully')
      } else {
        alert('Failed to delete arc')
      }
    } catch (error) {
      console.error('Error deleting arc:', error)
      alert('Error deleting arc')
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/arcs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setArcs(arcs.map(arc => 
          arc.id === id ? { ...arc, status: newStatus as any } : arc
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

  const filteredArcs = arcs.filter(arc => {
    const matchesSearch = arc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         arc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         arc.sagas?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         arc.sagas?.volumes?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         arc.sagas?.volumes?.books?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || arc.status === statusFilter
    const matchesSaga = sagaFilter === 'all' || arc.saga_id.toString() === sagaFilter
    return matchesSearch && matchesStatus && matchesSaga
  })

  const uniqueSagas = Array.from(new Set(arcs.map(arc => arc.sagas).filter(Boolean)))

  if (isLoading) {
    return (
      <div className="text-center text-white">
        Loading arcs...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Arc Management</h3>
          <p className="text-slate-400 text-sm">Manage arcs within your sagas</p>
        </div>
        <button
          onClick={() => {
            setEditingArc(null)
            setShowModal(true)
          }}
          className="neon-button-orange flex items-center gap-2 px-4 py-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Arc
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search arcs..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={sagaFilter}
          onChange={e => setSagaFilter(e.target.value)}
          className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
        >
          <option value="all">All Sagas</option>
          {uniqueSagas.map(saga => (
            <option key={saga?.id} value={saga?.id}>
              {saga?.title} ({saga?.volumes?.title})
            </option>
          ))}
        </select>
      </div>

      {/* Arcs table */}
      <div className="glass-dark rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-white">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Arc</th>
                <th className="px-6 py-4 text-left font-semibold">Saga</th>
                <th className="px-6 py-4 text-left font-semibold">Volume</th>
                <th className="px-6 py-4 text-left font-semibold">Book</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Order</th>
                <th className="px-6 py-4 text-left font-semibold">Word Count</th>
                <th className="px-6 py-4 text-left font-semibold">Issues</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArcs.map((arc) => (
                <tr key={arc.id} className="border-t border-white/10 hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{arc.title}</div>  
                      <div className="text-slate-400 text-sm">{arc.description?.substring(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                      {arc.sagas?.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                      {arc.sagas?.volumes?.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400">
                      {arc.sagas?.volumes?.books?.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={arc.status}
                      onChange={e => handleStatusChange(arc.id, e.target.value)}
                      className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(arc.status)}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">#{arc.order_index}</td>
                  <td className="px-6 py-4">{arc.word_count?.toLocaleString() || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      {arc.issues?.length || 0} issues
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingArc(arc)
                          setShowModal(true)
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300"
                        title="Edit arc"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(arc.id)}
                        className="p-2 text-red-400 hover:text-red-300"
                        title="Delete arc"
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
        {filteredArcs.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            No arcs found matching your criteria.
          </div>
        )}
      </div>

      {/* Modal for adding/editing arcs */}
      {showModal && (
        <ArcModal
          arc={editingArc}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false)
            fetchArcs()
          }}
        />
      )}
    </div>
  )
}
