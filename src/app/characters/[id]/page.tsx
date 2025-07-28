'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { PencilIcon, StarIcon, HeartIcon, UserGroupIcon, MapPinIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useAuth } from '@/app/contexts/AuthContext'
import CharacterForm from '@/app/components/admin/CharacterForm'

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
  motivations?: string
  fears?: string
  skills?: string[]
  abilities?: string[]
  weaknesses?: string[]
  avatar_url?: string
  images?: any
  status: string
  importance_level: number
  is_main_character: boolean
  is_protagonist: boolean
  is_antagonist: boolean
  first_appearance?: string
  creator?: string
  voice_actor?: string
  tags?: string[]
  created_at: string
  updated_at: string
  // Related data
  character_relationships?: any[]
  related_relationships?: any[]
  character_associations?: any[]
  appearance_timeline?: AppearanceEntry[]
}

interface AppearanceEntry {
  id: string
  book: string
  volume?: string
  saga?: string
  arc?: string
  issue?: string
  order_index: number
  description?: string
  significance?: string
}

interface TabButtonProps {
  id: string
  label: string
  isActive: boolean
  onClick: (id: string) => void
}

function TabButton({ id, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? 'bg-orange-400/20 text-orange-400 border border-orange-400/30'
          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
      }`}
    >
      {label}
    </button>
  )
}

function QuickFacts({ character }: { character: Character }) {
  const facts = [
    { label: 'Status', value: character.status, icon: '⚡' },
    { label: 'Importance', value: `${character.importance_level}/10`, icon: '⭐' },
    { label: 'Height', value: character.height, icon: '📏' },
    { label: 'Eye Color', value: character.eye_color, icon: '👁️' },
    { label: 'Hair Color', value: character.hair_color, icon: '💇' },
    { label: 'Age Range', value: character.age_range, icon: '🎂' },
    { label: 'First Appearance', value: character.first_appearance, icon: '📖' },
  ].filter(fact => fact.value && fact.value.trim() !== '')

  const characterTypes = []
  if (character.is_main_character) characterTypes.push('Main Character')
  if (character.is_protagonist) characterTypes.push('Protagonist')
  if (character.is_antagonist) characterTypes.push('Antagonist')

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-3">Quick Facts</h3>
      
      {characterTypes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Character Type</h4>
          <div className="flex flex-wrap gap-2">
            {characterTypes.map((type, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-orange-400/20 text-orange-400 rounded-full text-xs border border-orange-400/30"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {facts.map((fact, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-300">
              <span className="mr-2">{fact.icon}</span>
              {fact.label}:
            </span>
            <span className="text-white font-medium text-right max-w-[120px] truncate" title={fact.value}>
              {fact.value}
            </span>
          </div>
        ))}
      </div>

      {character.aliases && character.aliases.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Known As</h4>
          <div className="flex flex-wrap gap-1">
            {character.aliases.map((alias, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
              >
                {alias}
              </span>
            ))}
          </div>
        </div>
      )}

      {character.tags && character.tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-1">
            {character.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded text-xs border border-blue-400/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AppearanceTimeline({ character }: { character: Character }) {
  // Use appearance timeline data from the character object
  const appearances = character.appearance_timeline || []

  const groupedAppearances = appearances.reduce((acc, appearance) => {
    const key = appearance.book
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(appearance)
    return acc
  }, {} as Record<string, AppearanceEntry[]>)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Appearance Timeline</h3>
      
      {Object.entries(groupedAppearances).map(([book, appearances]) => (
        <div key={book} className="glass-dark rounded-lg p-4">
          <h4 className="text-orange-400 font-semibold mb-3 flex items-center">
            <BookOpenIcon className="w-5 h-5 mr-2" />
            {book}
          </h4>
          
          <div className="space-y-3">
            {appearances.sort((a, b) => a.order_index - b.order_index).map((appearance) => (
              <div key={appearance.id} className="border-l-2 border-orange-400/30 pl-4 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-300 mb-1">
                      {[appearance.volume, appearance.saga, appearance.arc, appearance.issue]
                        .filter(Boolean)
                        .join(' → ')}
                    </div>
                    {appearance.description && (
                      <p className="text-white text-sm mb-2">{appearance.description}</p>
                    )}
                    {appearance.significance && (
                      <p className="text-gray-400 text-xs italic">{appearance.significance}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">#{appearance.order_index}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {Object.keys(groupedAppearances).length === 0 && (
        <div className="glass-dark rounded-lg p-6 text-center">
          <BookOpenIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No appearance timeline data available</p>
        </div>
      )}
    </div>
  )
}

export default function CharacterPage() {
  const params = useParams()
  const { user } = useAuth()
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditForm, setShowEditForm] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/characters/${params.id}?include_relationships=true&include_associations=true&include_timeline=true`)
        
        if (!response.ok) {
          throw new Error('Character not found')
        }
        
        const data = await response.json()
        setCharacter(data)
        
        // Check if character is in user's favorites
        if (user && user.favorites.characters.includes(data.name)) {
          setIsFavorite(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load character')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCharacter()
    }
  }, [params.id, user])

  const toggleFavorite = () => {
    if (!user || !character) return
    
    // This would typically make an API call to update favorites
    setIsFavorite(!isFavorite)
    // Add to user context favorites
    // user.addFavorite('characters', character.name) or removeFavorite
  }

  const handleEditSave = () => {
    setShowEditForm(false)
    // Refresh character data
    if (params.id) {
      const fetchCharacter = async () => {
        const response = await fetch(`/api/characters/${params.id}?include_relationships=true&include_associations=true&include_timeline=true`)
        if (response.ok) {
          const data = await response.json()
          setCharacter(data)
        }
      }
      fetchCharacter()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="glass-dark rounded-2xl border border-white/20 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Character Not Found</h1>
            <p className="text-gray-400 mb-6">{error || 'The requested character could not be found.'}</p>
            <button
              onClick={() => window.history.back()}
              className="neon-button-orange px-6 py-3"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'personality', label: 'Personality' },
    { id: 'abilities', label: 'Abilities' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'timeline', label: 'Timeline' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Avatar & Basic Info Card */}
            <div className="glass-dark rounded-2xl border border-white/20 p-6">
              <div className="text-center mb-4">
                {character.avatar_url ? (
                  <img
                    src={character.avatar_url}
                    alt={character.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-orange-400/30"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-orange-400/20 to-purple-500/20 border-4 border-orange-400/30 flex items-center justify-center">
                    <UserGroupIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                <h1 className="text-2xl font-bold text-white mb-2">{character.name}</h1>
                
                {/* Action Buttons */}
                <div className="flex justify-center space-x-2 mb-4">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorite
                        ? 'bg-red-500/20 text-red-400 border border-red-400/30'
                        : 'bg-gray-700/50 text-gray-400 hover:text-red-400'
                    }`}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorite ? <HeartIconSolid className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
                  </button>
                  
                  {user?.isAdmin && (
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="p-2 rounded-lg bg-orange-400/20 text-orange-400 border border-orange-400/30 hover:bg-orange-400/30 transition-colors"
                      title="Edit character"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <QuickFacts character={character} />
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            <div className="glass-dark rounded-2xl border border-white/20 p-6">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    id={tab.id}
                    label={tab.label}
                    isActive={activeTab === tab.id}
                    onClick={setActiveTab}
                  />
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {character.description || 'No description available.'}
                      </div>
                    </div>

                    {character.motivations && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Motivations</h3>
                        <div className="text-gray-300 whitespace-pre-wrap">
                          {character.motivations}
                        </div>
                      </div>
                    )}

                    {character.fears && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Fears</h3>
                        <div className="text-gray-300 whitespace-pre-wrap">
                          {character.fears}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Physical Description</h3>
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {character.appearance || 'No appearance description available.'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {character.height && (
                        <div className="glass-dark rounded-lg p-3">
                          <div className="text-sm text-gray-400">Height</div>
                          <div className="text-white font-medium">{character.height}</div>
                        </div>
                      )}
                      {character.weight && (
                        <div className="glass-dark rounded-lg p-3">
                          <div className="text-sm text-gray-400">Weight</div>
                          <div className="text-white font-medium">{character.weight}</div>
                        </div>
                      )}
                      {character.eye_color && (
                        <div className="glass-dark rounded-lg p-3">
                          <div className="text-sm text-gray-400">Eye Color</div>
                          <div className="text-white font-medium">{character.eye_color}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'personality' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Personality Traits</h3>
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {character.personality || 'No personality description available.'}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'abilities' && (
                  <div className="space-y-6">
                    {character.abilities && character.abilities.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Abilities</h3>
                        <div className="flex flex-wrap gap-2">
                          {character.abilities.map((ability, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-400/20 text-purple-400 rounded-full text-sm border border-purple-400/30"
                            >
                              {ability}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {character.skills && character.skills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {character.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm border border-green-400/30"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {character.weaknesses && character.weaknesses.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Weaknesses</h3>
                        <div className="flex flex-wrap gap-2">
                          {character.weaknesses.map((weakness, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-400/20 text-red-400 rounded-full text-sm border border-red-400/30"
                            >
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!character.abilities || character.abilities.length === 0) &&
                     (!character.skills || character.skills.length === 0) &&
                     (!character.weaknesses || character.weaknesses.length === 0) && (
                      <div className="text-center py-8">
                        <div className="text-gray-400">No abilities or skills information available.</div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'relationships' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Character Relationships</h3>
                    
                    {character.character_relationships && character.character_relationships.length > 0 ? (
                      <div className="space-y-4">
                        {character.character_relationships.map((rel, index) => (
                          <div key={index} className="glass-dark rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-white font-medium">
                                {rel.relationship_type} ({rel.relationship_subtype || 'Unspecified'})
                              </div>
                              <div className="text-sm text-gray-400">
                                Strength: {rel.strength}/10
                              </div>
                            </div>
                            {rel.description && (
                              <p className="text-gray-300 text-sm">{rel.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <UserGroupIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <div className="text-gray-400">No relationships documented yet.</div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'timeline' && <AppearanceTimeline character={character} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && user?.isAdmin && (
        <CharacterForm
          character={character}
          onClose={() => setShowEditForm(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  )
}
