'use client'
import { useState, useEffect } from 'react'
import { Character } from '@/lib/supabase'
import RelationshipGraph from '@/components/RelationshipGraph'
import { ArrowLeftIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface CharacterRelationship {
  id: number
  character_id: number
  related_character_id: number
  relationship_type: string
  strength: number
  status: string
}

export default function RelationshipsPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [relationships, setRelationships] = useState<CharacterRelationship[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch characters
      const charactersResponse = await fetch('/api/characters')
      const charactersData = await charactersResponse.json()
      setCharacters(charactersData)

      // Fetch relationships (mock data for now)
      const mockRelationships: CharacterRelationship[] = [
        { id: 1, character_id: 1, related_character_id: 2, relationship_type: 'friend', strength: 8, status: 'active' },
        { id: 2, character_id: 1, related_character_id: 3, relationship_type: 'enemy', strength: 9, status: 'active' },
        { id: 3, character_id: 2, related_character_id: 3, relationship_type: 'rival', strength: 7, status: 'active' },
        { id: 4, character_id: 2, related_character_id: 4, relationship_type: 'romantic', strength: 10, status: 'active' },
        { id: 5, character_id: 3, related_character_id: 4, relationship_type: 'ally', strength: 6, status: 'active' },
      ]
      setRelationships(mockRelationships)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCharacters = characters.filter(char => 
    char.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || 
     (filterType === 'main' && char.is_main_character) ||
     (filterType === 'protagonist' && char.is_protagonist) ||
     (filterType === 'antagonist' && char.is_antagonist))
  )

  const graphRelationships = relationships.map(rel => ({
    source: rel.character_id,
    target: rel.related_character_id,
    relationship_type: rel.relationship_type,
    strength: rel.strength
  }))

  const handleNodeClick = (node: any) => {
    const character = characters.find(c => c.id === node.id)
    setSelectedCharacter(character || null)
  }

  const handleNodeDrag = (node: any, translate: { x: number; y: number }) => {
    console.log(`Character ${node.name} moved to:`, translate)
    // Here you could save the position to local storage or backend
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/characters" 
              className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Character Relationships</h1>
              <p className="text-gray-400">Interactive network visualization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search characters..."
                className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-400 focus:outline-none"
              />
            </div>
            
            {/* Filter */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded-lg border border-gray-600 focus:border-orange-400 focus:outline-none"
              >
                <option value="all">All Characters</option>
                <option value="main">Main Characters</option>
                <option value="protagonist">Protagonists</option>
                <option value="antagonist">Antagonists</option>
              </select>
              <AdjustmentsHorizontalIcon className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-orange-400">{filteredCharacters.length}</div>
            <div className="text-sm text-gray-400">Characters</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">{relationships.length}</div>
            <div className="text-sm text-gray-400">Relationships</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-green-400">
              {[...new Set(relationships.map(r => r.relationship_type))].length}
            </div>
            <div className="text-sm text-gray-400">Relationship Types</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-purple-400">
              {(relationships.reduce((sum, r) => sum + r.strength, 0) / relationships.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Avg. Strength</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Graph Visualization */}
          <div className="lg:col-span-3">
            <RelationshipGraph
              characters={filteredCharacters.map(c => ({
                id: c.id,
                name: c.name,
                importance: c.importance_level,
                type: c.is_protagonist ? 'protagonist' : c.is_antagonist ? 'antagonist' : 'supporting'
              }))}
              relationships={graphRelationships}
              onNodeClick={handleNodeClick}
              onNodeDrag={handleNodeDrag}
            />
            
            {/* Instructions */}
            <div className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-2">How to Use</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• <strong>Click and drag</strong> nodes to rearrange the network</li>
                <li>• <strong>Scroll</strong> to zoom in and out</li>
                <li>• <strong>Click</strong> on a character to see details</li>
                <li>• <strong>Hover</strong> over connections to see relationship details</li>
              </ul>
            </div>
          </div>
          
          {/* Character Details Sidebar */}
          <div className="space-y-6">
            {selectedCharacter ? (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center space-x-4 mb-4">
                  {selectedCharacter.avatar_url ? (
                    <img
                      src={selectedCharacter.avatar_url}
                      alt={selectedCharacter.name}
                      className="w-16 h-16 rounded-full border-2 border-orange-400"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-2xl">{selectedCharacter.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedCharacter.name}</h3>
                    <p className="text-gray-400">
                      {selectedCharacter.is_protagonist ? 'Protagonist' : 
                       selectedCharacter.is_antagonist ? 'Antagonist' : 'Supporting Character'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Importance Level:</span>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-orange-400 h-2 rounded-full" 
                        style={{ width: `${(selectedCharacter.importance_level / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{selectedCharacter.importance_level}/10</span>
                  </div>
                  
                  {selectedCharacter.description && (
                    <div>
                      <span className="text-sm text-gray-400">Description:</span>
                      <p className="text-sm text-gray-300 mt-1">
                        {selectedCharacter.description.length > 150 
                          ? selectedCharacter.description.substring(0, 150) + '...'
                          : selectedCharacter.description
                        }
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Link
                      href={`/characters/${selectedCharacter.id}`}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center block"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                <div className="text-gray-400 mb-2">👤</div>
                <p className="text-gray-400">Click on a character in the network to see their details</p>
              </div>
            )}
            
            {/* Relationship Types Legend */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Relationship Types</h3>
              <div className="space-y-2 text-sm">
                {[
                  { type: 'family', color: 'bg-red-400', label: 'Family' },
                  { type: 'friend', color: 'bg-green-400', label: 'Friend' },
                  { type: 'enemy', color: 'bg-red-600', label: 'Enemy' },
                  { type: 'romantic', color: 'bg-pink-400', label: 'Romantic' },
                  { type: 'ally', color: 'bg-blue-400', label: 'Ally' },
                  { type: 'rival', color: 'bg-orange-400', label: 'Rival' },
                  { type: 'mentor', color: 'bg-purple-400', label: 'Mentor' },
                ].map(({ type, color, label }) => (
                  <div key={type} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${color}`}></div>
                    <span className="text-gray-300">{label}</span>
                    <span className="text-gray-500 text-xs ml-auto">
                      {relationships.filter(r => r.relationship_type === type).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
