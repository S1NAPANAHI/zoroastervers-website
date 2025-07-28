'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, BookOpenIcon, FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'

interface ShopItem {
  id: string
  title: string
  type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
  parent_id?: string
  order_index: number
  children?: ShopItem[]
}

interface Association {
  book?: ShopItem
  volume?: ShopItem
  saga?: ShopItem
  arc?: ShopItem
  issue?: ShopItem
}

interface AssociationPickerProps {
  selectedAssociations: Association[]
  onAssociationsChange: (associations: Association[]) => void
  maxAssociations?: number
  className?: string
}

export default function AssociationPicker({
  selectedAssociations,
  onAssociationsChange,
  maxAssociations = 10,
  className = ""
}: AssociationPickerProps) {
  const [books, setBooks] = useState<ShopItem[]>([])
  const [volumes, setVolumes] = useState<ShopItem[]>([])
  const [sagas, setSagas] = useState<ShopItem[]>([])
  const [arcs, setArcs] = useState<ShopItem[]>([])
  const [issues, setIssues] = useState<ShopItem[]>([])
  
  const [selectedBook, setSelectedBook] = useState<string>('')
  const [selectedVolume, setSelectedVolume] = useState<string>('')
  const [selectedSaga, setSelectedSaga] = useState<string>('')
  const [selectedArc, setSelectedArc] = useState<string>('')
  const [selectedIssue, setSelectedIssue] = useState<string>('')
  
  const [isLoading, setIsLoading] = useState(false)

  // Load books on mount
  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      const response = await fetch('/api/shop-items/hierarchy?type=book&parent_id=null')
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      }
    } catch (error) {
      console.error('Error loading books:', error)
    }
  }

  const loadVolumes = async (bookId: string) => {
    if (!bookId) {
      setVolumes([])
      return
    }

    try {
      const response = await fetch(`/api/shop-items/hierarchy?type=volume&parent_id=${bookId}`)
      if (response.ok) {
        const data = await response.json()
        setVolumes(data)
      }
    } catch (error) {
      console.error('Error loading volumes:', error)
    }
  }

  const loadSagas = async (volumeId: string) => {
    if (!volumeId) {
      setSagas([])
      return
    }

    try {
      const response = await fetch(`/api/shop-items/hierarchy?type=saga&parent_id=${volumeId}`)
      if (response.ok) {
        const data = await response.json()
        setSagas(data)
      }
    } catch (error) {
      console.error('Error loading sagas:', error)
    }
  }

  const loadArcs = async (sagaId: string) => {
    if (!sagaId) {
      setArcs([])
      return
    }

    try {
      const response = await fetch(`/api/shop-items/hierarchy?type=arc&parent_id=${sagaId}`)
      if (response.ok) {
        const data = await response.json()
        setArcs(data)
      }
    } catch (error) {
      console.error('Error loading arcs:', error)
    }
  }

  const loadIssues = async (arcId: string) => {
    if (!arcId) {
      setIssues([])
      return
    }

    try {
      const response = await fetch(`/api/shop-items/hierarchy?type=issue&parent_id=${arcId}`)
      if (response.ok) {
        const data = await response.json()
        setIssues(data)
      }
    } catch (error) {
      console.error('Error loading issues:', error)
    }
  }

  // Handle selection changes
  const handleBookChange = (bookId: string) => {
    setSelectedBook(bookId)
    setSelectedVolume('')
    setSelectedSaga('')
    setSelectedArc('')
    setSelectedIssue('')
    
    setVolumes([])
    setSagas([])
    setArcs([])
    setIssues([])
    
    if (bookId) {
      loadVolumes(bookId)
    }
  }

  const handleVolumeChange = (volumeId: string) => {
    setSelectedVolume(volumeId)
    setSelectedSaga('')
    setSelectedArc('')
    setSelectedIssue('')
    
    setSagas([])
    setArcs([])
    setIssues([])
    
    if (volumeId) {
      loadSagas(volumeId)
    }
  }

  const handleSagaChange = (sagaId: string) => {
    setSelectedSaga(sagaId)
    setSelectedArc('')
    setSelectedIssue('')
    
    setArcs([])
    setIssues([])
    
    if (sagaId) {
      loadArcs(sagaId)
    }
  }

  const handleArcChange = (arcId: string) => {
    setSelectedArc(arcId)
    setSelectedIssue('')
    
    setIssues([])
    
    if (arcId) {
      loadIssues(arcId)
    }
  }

  const handleIssueChange = (issueId: string) => {
    setSelectedIssue(issueId)
  }

  const addAssociation = () => {
    if (!selectedBook) return

    const association: Association = {}
    
    // Find selected items
    const book = books.find(b => b.id === selectedBook)
    const volume = volumes.find(v => v.id === selectedVolume)
    const saga = sagas.find(s => s.id === selectedSaga)
    const arc = arcs.find(a => a.id === selectedArc)
    const issue = issues.find(i => i.id === selectedIssue)

    if (book) association.book = book
    if (volume) association.volume = volume
    if (saga) association.saga = saga
    if (arc) association.arc = arc
    if (issue) association.issue = issue

    // Check if this association already exists
    const exists = selectedAssociations.some(existing => 
      existing.book?.id === book?.id &&
      existing.volume?.id === volume?.id &&
      existing.saga?.id === saga?.id &&
      existing.arc?.id === arc?.id &&
      existing.issue?.id === issue?.id
    )

    if (!exists && selectedAssociations.length < maxAssociations) {
      onAssociationsChange([...selectedAssociations, association])
      
      // Reset selections
      setSelectedBook('')
      setSelectedVolume('')
      setSelectedSaga('')
      setSelectedArc('')
      setSelectedIssue('')
      setVolumes([])
      setSagas([])
      setArcs([])
      setIssues([])
    }
  }

  const removeAssociation = (index: number) => {
    const newAssociations = selectedAssociations.filter((_, i) => i !== index)
    onAssociationsChange(newAssociations)
  }

  const getAssociationPath = (association: Association) => {
    const path = []
    if (association.book) path.push(association.book.title)
    if (association.volume) path.push(association.volume.title)
    if (association.saga) path.push(association.saga.title)
    if (association.arc) path.push(association.arc.title)
    if (association.issue) path.push(association.issue.title)
    return path.join(' → ')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'book': return <BookOpenIcon className="w-4 h-4" />
      case 'volume': case 'saga': return <FolderIcon className="w-4 h-4" />
      case 'arc': case 'issue': return <DocumentIcon className="w-4 h-4" />
      default: return <DocumentIcon className="w-4 h-4" />
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected Associations */}
      {selectedAssociations.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Selected Associations ({selectedAssociations.length}/{maxAssociations})
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedAssociations.map((association, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600"
              >
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  {getIcon(association.issue?.type || association.arc?.type || association.saga?.type || association.volume?.type || association.book?.type || 'book')}
                  <span>{getAssociationPath(association)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAssociation(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Association */}
      {selectedAssociations.length < maxAssociations && (
        <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
          <h4 className="text-sm font-medium text-gray-300">Add New Association</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Book Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Book</label>
              <div className="relative">
                <select
                  value={selectedBook}
                  onChange={(e) => handleBookChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-orange-400 focus:outline-none appearance-none"
                >
                  <option value="">Select Book</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Volume Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Volume</label>
              <div className="relative">
                <select
                  value={selectedVolume}
                  onChange={(e) => handleVolumeChange(e.target.value)}
                  disabled={!selectedBook || volumes.length === 0}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-orange-400 focus:outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Volume</option>
                  {volumes.map((volume) => (
                    <option key={volume.id} value={volume.id}>
                      {volume.title}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Saga Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Saga</label>
              <div className="relative">
                <select
                  value={selectedSaga}
                  onChange={(e) => handleSagaChange(e.target.value)}
                  disabled={!selectedVolume || sagas.length === 0}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-orange-400 focus:outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Saga</option>
                  {sagas.map((saga) => (
                    <option key={saga.id} value={saga.id}>
                      {saga.title}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Arc Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Arc</label>
              <div className="relative">
                <select
                  value={selectedArc}
                  onChange={(e) => handleArcChange(e.target.value)}
                  disabled={!selectedSaga || arcs.length === 0}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-orange-400 focus:outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Arc</option>
                  {arcs.map((arc) => (
                    <option key={arc.id} value={arc.id}>
                      {arc.title}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Issue Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Issue</label>
              <div className="relative">
                <select
                  value={selectedIssue}
                  onChange={(e) => handleIssueChange(e.target.value)}
                  disabled={!selectedArc || issues.length === 0}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-orange-400 focus:outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Issue</option>
                  {issues.map((issue) => (
                    <option key={issue.id} value={issue.id}>
                      {issue.title}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addAssociation}
              disabled={!selectedBook}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Association
            </button>
          </div>
        </div>
      )}

      {/* Association count indicator */}
      <div className="text-sm text-gray-400">
        {selectedAssociations.length} / {maxAssociations} associations selected
      </div>
    </div>
  )
}
