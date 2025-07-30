'use client'
import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import VolumeModal from '../VolumeModal/VolumeModal'

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
  books?: {
    id: number
    title: string
  }
  sagas?: Array<{
    id: number
    title: string
    status: string
  }>
}

export default function VolumeManager() {
  const [volumes, setVolumes] = useState<Volume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVolume, setEditingVolume] = useState<Volume | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchVolumes()
  }, [])

  const fetchVolumes = async () => {
    try {
      const response = await fetch('/api/admin/volumes')
      if (response.ok) {
        const data = await response.json()
        setVolumes(data)
      } else {
        console.error('Failed to fetch volumes')
      }
    } catch (error) {
      console.error('Error fetching volumes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this volume? This will also delete all associated sagas, arcs, and issues.')) return

    try {
      const response = await fetch(`/api/admin/volumes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setVolumes(volumes.filter(volume => volume.id !== id))
        alert('Volume deleted successfully')
      } else {
        alert('Failed to delete volume')
      }
    } catch (error) {
      console.error('Error deleting volume:', error)
      alert('Error deleting volume')
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/volumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setVolumes(volumes.map(volume => 
          volume.id === id ? { ...volume, status: newStatus as any } : volume
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

  const filteredVolumes = volumes.filter(volume => {
    const matchesSearch = volume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volume.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volume.books?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || volume.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="text-center text-white">
        Loading volumes...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Volume Management</h3>
          <p className="text-slate-400 text-sm">Manage volumes within your book series</p>
        </div>
        <button
          onClick={() => {
            setEditingVolume(null)
            setShowModal(true)
          }}
          className="neon-button-purple flex items-center gap-2 px-4 py-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Volume
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search volumes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-400"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-400"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Volumes table */}
      <div className="glass-dark rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-white">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Volume</th>
                <th className="px-6 py-4 text-left font-semibold">Book</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Price</th>
                <th className="px-6 py-4 text-left font-semibold">Order</th>
                <th className="px-6 py-4 text-left font-semibold">Sagas</th>
                <th className="px-6 py-4 text-left font-semibold">Physical</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolumes.map((volume) => (
                <tr key={volume.id} className="border-t border-white/10 hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{volume.title}</div>  
                      <div className="text-slate-400 text-sm">{volume.description?.substring(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400">
                      {volume.books?.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={volume.status}
                      onChange={e => handleStatusChange(volume.id, e.target.value)}
                      className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(volume.status)}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">${volume.price?.toFixed(2) || 'Free'}</td>
                  <td className="px-6 py-4">#{volume.order_index}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                      {volume.sagas?.length || 0} sagas
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      volume.physical_available 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {volume.physical_available ? 'Available' : 'Digital Only'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingVolume(volume)
                          setShowModal(true)
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300"
                        title="Edit volume"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(volume.id)}
                        className="p-2 text-red-400 hover:text-red-300"
                        title="Delete volume"
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
        {filteredVolumes.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            No volumes found matching your criteria.
          </div>
        )}
      </div>

      {/* Modal for adding/editing volumes */}
      {showModal && (
        <VolumeModal
          volume={editingVolume}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false)
            fetchVolumes()
          }}
        />
      )}
    </div>
  )
}
