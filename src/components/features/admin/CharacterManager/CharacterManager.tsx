'use client'
import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { 
  Dialog, 
  Combobox, 
  Menu, 
  Listbox,
  Transition 
} from '@headlessui/react'
import { Fragment } from 'react'
import CharacterModal from '@/components/features/admin/CharacterModal'

interface Character {
  id: number
  name: string
  aliases?: string[]
  description?: string
  appearance?: string
  height?: string
  weight?: string
  eye_color?: string
  hair_color?: string
  age_range?: string
  personality?: string
  skills?: string[]
  abilities?: string[]
  weaknesses?: string[]
  motivations?: string
  fears?: string
  avatar_url?: string
  images?: any
  status: 'active' | 'inactive' | 'deceased' | 'missing' | 'unknown'
  importance_level: number
  is_main_character: boolean
  is_protagonist: boolean
  is_antagonist: boolean
  universe_id?: number
  series_id?: number
  season_id?: number
  work_id?: number
  first_appearance?: string
  creator?: string
  voice_actor?: string
  tags?: string[]
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  character_relationships?: Array<{
    id: number
    related_character_id: number
    relationship_type: string
    relationship_subtype?: string
    strength: number
    status: string
  }>
}

// View types
type ViewLayout = 'table' | 'grid' | 'list'

// Filter options
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'deceased', label: 'Deceased' },
  { value: 'missing', label: 'Missing' },
  { value: 'unknown', label: 'Unknown' }
]

const importanceOptions = [
  { value: '', label: 'All Importance' },
  { value: 'main', label: 'Main Characters' },
  { value: 'protagonist', label: 'Protagonists' },
  { value: 'antagonist', label: 'Antagonists' },
  { value: '10', label: 'Critical (10)' },
  { value: '9', label: 'Major (9)' },
  { value: '8', label: 'Important (8)' },
  { value: '7', label: 'Notable (7)' },
  { value: '6', label: 'Supporting (6)' },
  { value: '5', label: 'Regular (5)' },
  { value: '4', label: 'Minor (4)' },
  { value: '3', label: 'Background (3)' },
  { value: '2', label: 'Cameo (2)' },
  { value: '1', label: 'Mention (1)' }
]

const affiliationOptions = [
  { value: '', label: 'All Affiliations' },
  { value: 'hero', label: 'Heroes' },
  { value: 'villain', label: 'Villains' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'ally', label: 'Allies' },
  { value: 'enemy', label: 'Enemies' }
]

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch characters')
  }
  const result = await response.json()
  return result.data || result
}

export default function CharacterManager() {
  // State management
  const [showModal, setShowModal] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [viewLayout, setViewLayout] = useState<ViewLayout>('table')
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [importanceFilter, setImportanceFilter] = useState('')
  const [affiliationFilter, setAffiliationFilter] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Build query string for API call
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.append('search', searchTerm)
    if (statusFilter) params.append('status', statusFilter)
    if (importanceFilter) params.append('importance', importanceFilter)
    params.append('limit', '100')
    return params.toString()
  }, [searchTerm, statusFilter, importanceFilter])
  
  // SWR for data fetching
  const { data: charactersData, error, isLoading, mutate } = useSWR(
    `/api/characters?${buildQueryString()}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )
  
  const characters = charactersData || []
  
  // Delete handler with optimistic updates
  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this character? This action cannot be undone.')) return

    try {
      // Optimistic update
      mutate(
        characters.filter((character: Character) => character.id !== id),
        false
      )
      
      const response = await fetch(`/api/characters/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }
      
      // Revalidate to ensure consistency
      mutate()
    } catch (error) {
      console.error('Error deleting character:', error)
      mutate() // Revert on error
      alert('Error deleting character')
    }
  }, [characters, mutate])

  // Status change handler
  const handleStatusChange = useCallback(async (id: number, newStatus: string) => {
    try {
      // Optimistic update
      const updatedCharacters = characters.map((character: Character) => 
        character.id === id ? { ...character, status: newStatus as any } : character
      )
      mutate(updatedCharacters, false)
      
      const response = await fetch(`/api/characters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Status update failed')
      }
      
      mutate()
    } catch (error) {
      console.error('Error updating status:', error)
      mutate() // Revert on error
    }
  }, [characters, mutate])

  // Export to CSV
  const handleExport = useCallback(async () => {
    try {
      const queryString = buildQueryString() + '&format=csv'
      const response = await fetch(`/api/characters?${queryString}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'characters.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting characters:', error)
      alert('Error exporting characters')
    }
  }, [buildQueryString])

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500 text-white',
      inactive: 'bg-gray-500 text-white',
      deceased: 'bg-red-500 text-white',
      missing: 'bg-yellow-500 text-black',
      unknown: 'bg-gray-400 text-white'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500 text-white'
  }

  const getImportanceColor = (level: number, isMain: boolean, isProtagonist: boolean, isAntagonist: boolean) => {
    if (isMain) return 'bg-purple-500/20 text-purple-400 border-purple-400/30'
    if (isProtagonist) return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
    if (isAntagonist) return 'bg-red-500/20 text-red-400 border-red-400/30'
    
    if (level >= 8) return 'bg-orange-500/20 text-orange-400 border-orange-400/30'
    if (level >= 6) return 'bg-green-500/20 text-green-400 border-green-400/30'
    if (level >= 4) return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
    return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
  }
  
  const getImportanceLabel = (character: Character) => {
    if (character.is_main_character) return 'Main'
    if (character.is_protagonist) return 'Protagonist'
    if (character.is_antagonist) return 'Antagonist'
    return `Level ${character.importance_level}`
  }
  
  // Get unique tags from all characters for filter
  const allTags = [...new Set(characters.flatMap((char: Character) => char.tags || []))]
  
  // Filter characters based on current filters
  const filteredCharacters = characters.filter((character: Character) => {
    // Search filter
    const searchMatch = !searchTerm || [
      character.name,
      character.description,
      character.appearance,
      character.personality,
      ...(character.aliases || []),
      ...(character.skills || []),
      ...(character.tags || [])
    ].some(field => 
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // Status filter
    const statusMatch = !statusFilter || character.status === statusFilter
    
    // Importance filter
    let importanceMatch = true
    if (importanceFilter) {
      if (importanceFilter === 'main') {
        importanceMatch = character.is_main_character
      } else if (importanceFilter === 'protagonist') {
        importanceMatch = character.is_protagonist
      } else if (importanceFilter === 'antagonist') {
        importanceMatch = character.is_antagonist
      } else if (!isNaN(parseInt(importanceFilter))) {
        importanceMatch = character.importance_level === parseInt(importanceFilter)
      }
    }
    
    // Tags filter
    const tagsMatch = selectedTags.length === 0 || 
      selectedTags.some(tag => character.tags?.includes(tag))
    
    return searchMatch && statusMatch && importanceMatch && tagsMatch
  })

  if (error) {
    return (
      <div className="text-center text-red-400">
        Error loading characters: {error.message}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-2"></div>
        Loading characters...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with actions and layout toggles */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Character Management</h3>
          <p className="text-slate-400 text-sm">
            Manage characters across your story universe ({filteredCharacters.length} characters)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Layout Toggle */}
          <div className="flex items-center bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setViewLayout('table')}
              className={`p-2 rounded transition-colors ${
                viewLayout === 'table' 
                  ? 'bg-orange-500/20 text-orange-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table view"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-2 rounded transition-colors ${
                viewLayout === 'grid' 
                  ? 'bg-orange-500/20 text-orange-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid view"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-2 rounded transition-colors ${
                viewLayout === 'list' 
                  ? 'bg-orange-500/20 text-orange-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List view"
            >
              <ListBulletIcon className="w-5 h-5 rotate-90" />
            </button>
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            title="Export to CSV"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
          
          {/* Add Character Button */}
          <button
            onClick={() => {
              setEditingCharacter(null)
              setShowModal(true)
            }}
            className="neon-button-orange flex items-center gap-2 px-4 py-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Character
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search characters by name, description, skills, tags..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 text-white border border-slate-600 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-colors"
          />
        </div>
        
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="min-w-48">
            <Listbox value={statusFilter} onChange={setStatusFilter}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer bg-slate-800/50 border border-slate-600 rounded-lg py-3 pl-3 pr-10 text-left text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20">
                  <span className="block truncate">
                    {statusOptions.find(opt => opt.value === statusFilter)?.label || 'All Status'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FunnelIcon className="h-4 w-4 text-slate-400" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-800 border border-slate-600 shadow-lg">
                    {statusOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 px-4 ${
                            active ? 'bg-orange-500/20 text-orange-400' : 'text-white'
                          }`
                        }
                        value={option.value}
                      >
                        <span className="block truncate">{option.label}</span>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          
          {/* Importance Filter */}
          <div className="min-w-52">
            <Listbox value={importanceFilter} onChange={setImportanceFilter}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer bg-slate-800/50 border border-slate-600 rounded-lg py-3 pl-3 pr-10 text-left text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20">
                  <span className="block truncate">
                    {importanceOptions.find(opt => opt.value === importanceFilter)?.label || 'All Importance'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FunnelIcon className="h-4 w-4 text-slate-400" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-800 border border-slate-600 shadow-lg">
                    {importanceOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 px-4 ${
                            active ? 'bg-orange-500/20 text-orange-400' : 'text-white'
                          }`
                        }
                        value={option.value}
                      >
                        <span className="block truncate">{option.label}</span>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          
          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="min-w-48">
              <Combobox value={selectedTags} onChange={setSelectedTags} multiple>
                <div className="relative">
                  <Combobox.Input
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-3 text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                    placeholder="Filter by tags..."
                    displayValue={() => selectedTags.length > 0 ? `${selectedTags.length} tags selected` : 'All tags'}
                  />
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-800 border border-slate-600 shadow-lg">
                    {allTags.map((tag) => (
                      <Combobox.Option
                        key={tag}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 px-4 ${
                            active ? 'bg-orange-500/20 text-orange-400' : 'text-white'
                          }`
                        }
                        value={tag}
                      >
                        <span className="block truncate">{tag}</span>
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </Combobox>
            </div>
          )}
          
          {/* Clear Filters */}
          {(searchTerm || statusFilter || importanceFilter || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setImportanceFilter('')
                setSelectedTags([])
              }}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Characters table */}
      <div className="glass-dark rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-white">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Character</th>
                <th className="px-6 py-4 text-left font-semibold">Role</th>
                <th className="px-6 py-4 text-left font-semibold">Species</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Importance</th>
                <th className="px-6 py-4 text-left font-semibold">Age</th>
                <th className="px-6 py-4 text-left font-semibold">Location</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCharacters.map((character) => (
                <tr key={character.id} className="border-t border-white/10 hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{character.name}</div>
                      <div className="text-slate-400 text-sm">{character.description?.substring(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{character.role || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{character.species || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={character.status}
                      onChange={e => handleStatusChange(character.id, e.target.value)}
                      className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(character.status)}`}
                    >
                      <option value="alive">Alive</option>
                      <option value="dead">Dead</option>
                      <option value="unknown">Unknown</option>
                      <option value="missing">Missing</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getImportanceColor(character.importance)}`}>
                      {character.importance.charAt(0).toUpperCase() + character.importance.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{character.age || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{character.location || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingCharacter(character)
                          setShowModal(true)
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300"
                        title="Edit character"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(character.id)}
                        className="p-2 text-red-400 hover:text-red-300"
                        title="Delete character"
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
        {filteredCharacters.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            No characters found matching your criteria.
          </div>
        )}
      </div>

      {/* Modal for adding/editing characters */}
      {showModal && (
        <CharacterModal
          character={editingCharacter}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false)
            fetchCharacters()
          }}
        />
      )}
    </div>
  )
}
