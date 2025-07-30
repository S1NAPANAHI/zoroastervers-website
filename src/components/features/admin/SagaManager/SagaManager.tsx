'use client'
import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { SagaModal } from '../SagaModal'

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
  volumes?: {
    id: number
    title: string
    books?: {
      id: number
      title: string
    }
  }
  arcs?: Array<{
    id: number
    title: string
    status: string
  }>
}

export default function SagaManager() {
  const [sagas, setSagas] = useState<Saga[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSaga, setEditingSaga] = useState<Saga | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [volumeFilter, setVolumeFilter] = useState('all')

  useEffect(() => {
    fetchSagas()
  }, [])

  const fetchSagas = async () => {
    try {
      const response = await fetch('/api/admin/sagas')
      if (response.ok) {
        const data = await response.json()
        setSagas(data)
      } else {
        console.error('Failed to fetch sagas')
      }
    } catch (error) {
      console.error('Error fetching sagas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this saga? This will also delete all associated arcs and issues.')) return

    try {
      const response = await fetch(`/api/admin/sagas/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSagas(sagas.filter(saga => saga.id !== id))
        alert('Saga deleted successfully')
      } else {
        alert('Failed to delete saga')
      }
    } catch (error) {
      console.error('Error deleting saga:', error)
      alert('Error deleting saga')
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/sagas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setSagas(sagas.map(saga => 
          saga.id === id ? { ...saga, status: newStatus as any } : saga
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

  const filteredSagas = sagas.filter(saga => {
    const matchesSearch = saga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saga.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saga.volumes?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saga.volumes?.books?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || saga.status === statusFilter
    const matchesVolume = volumeFilter === 'all' || saga.volume_id.toString() === volumeFilter
    return matchesSearch && matchesStatus && matchesVolume
  })

  const uniqueVolumes = Array.from(new Set(sagas.map(saga => saga.volumes).filter(Boolean)))

  if (isLoading) {
    return (
      <div className="text-center text-white">
        Loading sagas...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Saga Management</h3>
          <p className="text-slate-400 text-sm">Manage sagas within your volumes</p>
        </div>
        <button
          onClick={() => {
            setEditingSaga(null)
            setShowModal(true)
          }}
          className="neon-button-green flex items-center gap-2 px-4 py-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Saga
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search sagas..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={volumeFilter}
          onChange={e => setVolumeFilter(e.target.value)}
          className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400"
        >
          <option value="all">All Volumes</option>
          {uniqueVolumes.map(volume => (
            <option key={volume?.id} value={volume?.id}>
              {volume?.title} ({volume?.books?.title})
            </option>
          ))}
        </select>
      </div>

      {/* Sagas table */}
      <div className="glass-dark rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-white">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Saga</th>
                <th className="px-6 py-4 text-left font-semibold">Volume</th>
                <th className="px-6 py-4 text-left font-semibold">Book</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Order</th>
                <th className="px-6 py-4 text-left font-semibold">Word Count</th>
                <th className="px-6 py-4 text-left font-semibold">Arcs</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSagas.map((saga) => (
                <tr key={saga.id} className="border-t border-white/10 hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{saga.title}</div>  
                      <div className="text-slate-400 text-sm">{saga.description?.substring(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                      {saga.volumes?.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400">
                      {saga.volumes?.books?.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={saga.status}
                      onChange={e => handleStatusChange(saga.id, e.target.value)}
                      className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(saga.status)}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">#{saga.order_index}</td>
                  <td className="px-6 py-4">{saga.word_count?.toLocaleString() || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
                      {saga.arcs?.length || 0} arcs
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingSaga(saga)
                          setShowModal(true)
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300"
                        title="Edit saga"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(saga.id)}
                        className="p-2 text-red-400 hover:text-red-300"
                        title="Delete saga"
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
        {filteredSagas.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            No sagas found matching your criteria.
          </div>
        )}
      </div>

      {/* Modal for adding/editing sagas */}
      {showModal && (
        <SagaModal
          saga={editingSaga}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false)
            fetchSagas()
          }}
        />
      )}
    </div>
  )
}
