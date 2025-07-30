'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { XMarkIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'

interface Tag {
  id: number
  name: string
  description?: string
  category?: string
  color?: string
  icon?: string
  usage_count: number
}

interface MultiTagInputProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  placeholder?: string
  maxTags?: number
  allowCreate?: boolean
  className?: string
}

export default function MultiTagInput({
  selectedTags,
  onTagsChange,
  placeholder = "Search and select tags...",
  maxTags = 10,
  allowCreate = true,
  className = ""
}: MultiTagInputProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/character-tags?search=${encodeURIComponent(searchQuery)}&limit=20`)
        if (response.ok) {
          const data = await response.json()
          // Filter out already selected tags
          const availableTags = data.data.filter((tag: Tag) => 
            !selectedTags.some(selected => selected.id === tag.id)
          )
          setSuggestions(availableTags)
        }
      } catch (error) {
        console.error('Error searching tags:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [selectedTags]
  )

  useEffect(() => {
    if (query) {
      debouncedSearch(query)
    } else {
      setSuggestions([])
    }
  }, [query, debouncedSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = highlightedIndex < suggestions.length - 1 ? highlightedIndex + 1 : 0
        setHighlightedIndex(nextIndex)
        break

      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : suggestions.length - 1
        setHighlightedIndex(prevIndex)
        break

      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleTagSelect(suggestions[highlightedIndex])
        } else if (allowCreate && query.trim()) {
          handleCreateTag()
        }
        break

      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const handleTagSelect = (tag: Tag) => {
    if (selectedTags.length >= maxTags) {
      return
    }

    onTagsChange([...selectedTags, tag])
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  const handleTagRemove = (tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagToRemove.id))
  }

  const handleCreateTag = async () => {
    if (!query.trim() || !allowCreate) return

    try {
      const response = await fetch('/api/character-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: query.trim(),
          category: 'custom'
        })
      })

      if (response.ok) {
        const newTag = await response.json()
        handleTagSelect(newTag)
      }
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'personality': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
      case 'appearance': return 'bg-green-500/20 text-green-400 border-green-400/30'
      case 'role': return 'bg-purple-500/20 text-purple-400 border-purple-400/30'
      case 'archetype': return 'bg-orange-500/20 text-orange-400 border-orange-400/30'
      case 'custom': return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
      default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getCategoryColor(tag.category)}`}
            >
              {tag.icon && <span className="mr-1">{tag.icon}</span>}
              {tag.name}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="ml-2 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedTags.length >= maxTags ? `Maximum ${maxTags} tags selected` : placeholder}
            disabled={selectedTags.length >= maxTags}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-orange-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-orange-400"></div>
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && (query || suggestions.length > 0) && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto"
          >
            {suggestions.length > 0 ? (
              suggestions.map((tag, index) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagSelect(tag)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                    index === highlightedIndex ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {tag.icon && <span className="mr-2">{tag.icon}</span>}
                      <div>
                        <div className="text-white font-medium">{tag.name}</div>
                        {tag.description && (
                          <div className="text-gray-400 text-sm">{tag.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {tag.category && (
                        <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(tag.category)}`}>
                          {tag.category}
                        </span>
                      )}
                      <span className="text-gray-500 text-xs">{tag.usage_count}</span>
                    </div>
                  </div>
                </button>
              ))
            ) : query && allowCreate ? (
              <button
                type="button"
                onClick={handleCreateTag}
                className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center text-green-400">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create tag "{query}"
                </div>
              </button>
            ) : query ? (
              <div className="px-4 py-3 text-gray-400 text-center">
                No tags found
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Tag count indicator */}
      <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
        <div>
          {selectedTags.length} / {maxTags} tags selected
        </div>
        {allowCreate && (
          <div className="text-xs">
            Type to search or create new tags
          </div>
        )}
      </div>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
