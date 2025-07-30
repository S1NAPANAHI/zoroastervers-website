'use client'
import { useState } from 'react'
import { CharacterForm } from '@components/features/admin'
import { Character } from '@/lib/supabase'

export default function CharacterFormDemo() {
  const [showForm, setShowForm] = useState(false)
  const [editCharacter, setEditCharacter] = useState<Character | null>(null)

  // Mock data for demonstration
  const mockCharacter: Character = {
    id: 1,
    name: 'John Doe',
    description: 'A mysterious protagonist with a dark past.',
    appearance: 'Tall and lean with striking blue eyes.',
    personality: 'Introverted but determined. Has trust issues but is fiercely loyal to those he cares about.',
    avatar_url: '',
    status: 'active',
    importance_level: 8,
    is_main_character: true,
    is_protagonist: true,
    is_antagonist: false,
    height: '6\'2"',
    weight: '180lbs',
    eye_color: 'Blue',
    hair_color: 'Black',
    age_range: '25-30',
    motivations: 'Seeking redemption for past mistakes.',
    fears: 'Losing the people he cares about.',
    first_appearance: 'Chapter 1',
    skills: ['Combat', 'Investigation', 'Leadership'],
    weaknesses: ['Trust issues', 'Reckless when angry'],
    abilities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const mockAvailableCharacters: Character[] = [
    {
      id: 2,
      name: 'Jane Smith',
      description: 'Skilled detective and John\'s partner.',
      status: 'active',
      importance_level: 7,
      is_main_character: true,
      is_protagonist: false,
      is_antagonist: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Marcus Black',
      description: 'The main antagonist with mysterious powers.',
      status: 'active',
      importance_level: 9,
      is_main_character: true,
      is_protagonist: false,
      is_antagonist: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  const handleSave = () => {
    console.log('Character saved!')
    setShowForm(false)
    setEditCharacter(null)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditCharacter(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Character Form Demo</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Demo Actions</h2>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setEditCharacter(null)
                  setShowForm(true)
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Create New Character
              </button>
              <button
                onClick={() => {
                  setEditCharacter(mockCharacter)
                  setShowForm(true)
                }}
                className="px-6 py-3 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
              >
                Edit Sample Character
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Features Demonstrated</h2>
            <ul className="text-gray-300 space-y-2">
              <li>✅ <strong>Controlled Form:</strong> Using react-hook-form with Zod validation</li>
              <li>✅ <strong>Sectioned Layout:</strong> Basic, Appearance, Personality, History, Abilities, Affiliations</li>
              <li>✅ <strong>Markdown Editor:</strong> Rich-text editing with preview for long fields</li>
              <li>✅ <strong>Image Upload:</strong> Avatar upload with Supabase storage integration</li>
              <li>✅ <strong>Drag-and-Drop Relationships:</strong> Sortable relationship management</li>
              <li>✅ <strong>Form Validation:</strong> Client-side validation with error messages</li>
              <li>✅ <strong>Responsive Design:</strong> Mobile-friendly collapsible sections</li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Component Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">Form Sections</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Basic Information (name, avatar, description)</li>
                  <li>• Appearance (height, weight, colors, physical description)</li>
                  <li>• Personality (traits, motivations, fears)</li>
                  <li>• History (background, first appearance)</li>
                  <li>• Abilities (powers, skills, weaknesses)</li>
                  <li>• Affiliations (organizations, relationships)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Interactive Elements</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Collapsible sections with toggle</li>
                  <li>• Markdown editor with live preview</li>
                  <li>• Drag-and-drop relationship ordering</li>
                  <li>• File upload with image preview</li>
                  <li>• Multi-select character relationships</li>
                  <li>• Form validation and error handling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <CharacterForm
          character={editCharacter}
          onClose={handleClose}
          onSave={handleSave}
          availableCharacters={mockAvailableCharacters}
        />
      )}
    </div>
  )
}
