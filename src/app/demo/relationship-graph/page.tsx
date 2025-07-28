'use client'
import { useState } from 'react'
import RelationshipGraph from '@/components/RelationshipGraph'
import Link from 'next/link'

export default function RelationshipGraphDemo() {
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null)

  // Mock data for demonstration
  const characters = [
    { id: 1, name: 'Alice', importance: 8, type: 'protagonist' },
    { id: 2, name: 'Bob', importance: 6, type: 'supporting' },
    { id: 3, name: 'Charlie', importance: 9, type: 'antagonist' },
    { id: 4, name: 'Diana', importance: 7, type: 'supporting' },
    { id: 5, name: 'Eve', importance: 5, type: 'supporting' },
  ]

  const relationships = [
    { source: 1, target: 2, relationship_type: 'friend', strength: 8 },
    { source: 1, target: 3, relationship_type: 'enemy', strength: 9 },
    { source: 2, target: 4, relationship_type: 'romantic', strength: 10 },
    { source: 3, target: 4, relationship_type: 'rival', strength: 7 },
    { source: 4, target: 5, relationship_type: 'family', strength: 9 },
    { source: 1, target: 5, relationship_type: 'ally', strength: 6 },
  ]

  const handleNodeClick = (node: any) => {
    setSelectedCharacter(node)
    console.log('Node clicked:', node)
  }

  const handleNodeDrag = (node: any, translate: any) => {
    console.log('Node dragged:', node.name, translate)
  }

  const handleCreateRelationship = (sourceId: number, targetId: number) => {
    console.log('Create relationship between:', sourceId, 'and', targetId)
    // Here you would typically open a modal to select relationship type
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Relationship Graph Demo</h1>
            <p className="text-gray-400">Interactive character relationship visualization</p>
          </div>
          <Link 
            href="/demo" 
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to Demos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Graph Visualization */}
          <div className="lg:col-span-3">
            <RelationshipGraph
              characters={characters}
              relationships={relationships}
              onNodeClick={handleNodeClick}
              onNodeDrag={handleNodeDrag}
              onCreateRelationship={handleCreateRelationship}
              editable={true}
            />

            {/* Instructions */}
            <div className="mt-6 bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-3">Demo Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">Interactions</h4>
                  <ul className="space-y-1">
                    <li>• Click and drag nodes to move them</li>
                    <li>• Scroll to zoom in/out</li>
                    <li>• Click nodes to see details</li>
                    <li>• Hover over links for relationship info</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Visual Elements</h4>
                  <ul className="space-y-1">
                    <li>• Node size = character importance</li>
                    <li>• Node color = character type</li>
                    <li>• Link color = relationship type</li>
                    <li>• Animated particles show direction</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Character Details Sidebar */}
          <div className="space-y-6">
            {selectedCharacter ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">{selectedCharacter.name}</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Character Type:</span>
                    <p className="text-white capitalize">{selectedCharacter.type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Importance Level:</span>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-orange-400 h-2 rounded-full" 
                        style={{ width: `${(selectedCharacter.importance / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{selectedCharacter.importance}/10</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Connections:</span>
                    <p className="text-white">
                      {relationships.filter(r => 
                        r.source === selectedCharacter.id || r.target === selectedCharacter.id
                      ).length} relationships
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-gray-400 mb-2">👤</div>
                <p className="text-gray-400">Click on a character to see their details</p>
              </div>
            )}

            {/* Character List */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Characters</h3>
              <div className="space-y-2">
                {characters.map(char => (
                  <div 
                    key={char.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCharacter?.id === char.id 
                        ? 'bg-orange-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedCharacter(char)}
                  >
                    <div className="font-medium text-white">{char.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{char.type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationship Types Legend */}
            <div className="bg-gray-800 rounded-lg p-6">
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
