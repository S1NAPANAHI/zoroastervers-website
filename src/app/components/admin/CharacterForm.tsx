'use client'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { XMarkIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Character, CharacterRelationship } from '@/lib/supabase'
import ImageUploader from '@/components/ImageUploader'
import RelationshipSelector from '@/components/RelationshipSelector'
import RelationshipGraph from '@/components/RelationshipGraph'
import MarkdownEditor from '@/components/MarkdownEditor'
import MultiTagInput from '@/app/components/ui/MultiTagInput'
import AssociationPicker from '@/app/components/ui/AssociationPicker'

// Define form schema using Zod
const characterSchema = z.object({
  // Basic Information
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  
  // Appearance
  appearance: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  eye_color: z.string().optional(),
  hair_color: z.string().optional(),
  age_range: z.string().optional(),
  avatar_url: z.string().optional(),
  
  // Personality & Traits
  personality: z.string().optional(),
  motivations: z.string().optional(),
  fears: z.string().optional(),
  
  // History
  history: z.string().optional(),
  first_appearance: z.string().optional(),
  
  // Abilities
  abilities: z.string().optional(),
  skills: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
  
  // Affiliations
  affiliations: z.string().optional(),
  
  // Relationships
  relationships: z.array(z.object({
    related_character_id: z.number(),
    relationship_type: z.string(),
    description: z.string().optional(),
    strength: z.number().min(1).max(10).optional(),
    status: z.enum(['active', 'past', 'complicated', 'unknown']).optional(),
  })).optional(),
  
  // Status & Metadata
  status: z.enum(['active', 'inactive', 'deceased', 'unknown']).default('active'),
  importance_level: z.number().min(1).max(10).default(5),
  is_main_character: z.boolean().default(false),
  is_protagonist: z.boolean().default(false),
  is_antagonist: z.boolean().default(false),
})

type CharacterFormData = z.infer<typeof characterSchema>

interface CharacterFormProps {
  character?: Character | null
  onClose: () => void
  onSave: () => void
  availableCharacters?: Character[]
}

interface SectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function Section({ title, isOpen, onToggle, children }: SectionProps) {
  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-800 text-white font-medium flex items-center justify-between hover:bg-gray-700 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDownIcon className="w-5 h-5" />
        ) : (
          <ChevronRightIcon className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-900 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default function CharacterForm({ character, onClose, onSave, availableCharacters = [] }: CharacterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<any[]>([])
  const [selectedAssociations, setSelectedAssociations] = useState<any[]>([])
  const [openSections, setOpenSections] = useState({
    basic: true,
    appearance: false,
    personality: false,
    history: false,
    abilities: false,
    tags: false,
    associations: false,
    affiliations: false,
    relationships: false,
  })

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: character?.name || '',
      description: character?.description || '',
      appearance: character?.appearance || '',
      personality: character?.personality || '',
      history: '', // Add history field mapping
      abilities: character?.abilities?.join(', ') || '',
      affiliations: '', // Add affiliations field mapping
      avatar_url: character?.avatar_url || '',
      relationships: [], // Add relationships mapping
      status: character?.status || 'active',
      importance_level: character?.importance_level || 5,
      is_main_character: character?.is_main_character || false,
      is_protagonist: character?.is_protagonist || false,
      is_antagonist: character?.is_antagonist || false,
      height: character?.height || '',
      weight: character?.weight || '',
      eye_color: character?.eye_color || '',
      hair_color: character?.hair_color || '',
      age_range: character?.age_range || '',
      motivations: character?.motivations || '',
      fears: character?.fears || '',
      first_appearance: character?.first_appearance || '',
      skills: character?.skills || [],
      weaknesses: character?.weaknesses || [],
    },
  })

  // Load existing tags and associations when editing
  useEffect(() => {
    if (character?.id) {
      // Load existing tag assignments
      fetch(`/api/character-tags/assignments?character_id=${character.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(assignments => {
          const tags = assignments.map((assignment: any) => assignment.character_tags)
          setSelectedTags(tags)
        })
        .catch(console.error)
    }
  }, [character?.id])

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const onSubmit = async (data: CharacterFormData) => {
    setIsLoading(true)
    try {
      const payload = {
        ...data,
        abilities: data.abilities ? data.abilities.split(',').map(s => s.trim()) : [],
        skills: data.skills || [],
        weaknesses: data.weaknesses || [],
      }

      const url = character 
        ? `/api/characters/${character.id}`
        : '/api/characters'
      
      const method = character ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        // Save tag assignments
        fetch('/api/character-tags/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            character_id: character.id,
            tag_ids: selectedTags.map(tag => tag.id)
          })
        }).catch(console.error)

        onSave()
      } else {
        alert('Failed to save character')
      }
    } catch (error) {
      console.error('Error saving character:', error)
      alert('Error saving character')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-dark rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {character ? 'Edit Character' : 'Create New Character'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <Section
              title="Basic Information"
              isOpen={openSections.basic}
              onToggle={() => toggleSection('basic')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Character Name *
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                        placeholder="Enter character name"
                      />
                    )}
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Avatar
                  </label>
                  <ImageUploader 
                    onUpload={(url) => setValue('avatar_url', url)} 
                    avatarUrl={watch('avatar_url')} 
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Brief character description"
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 col-span-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="deceased">Deceased</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Importance Level (1-10)
                    </label>
                    <Controller
                      name="importance_level"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="number"
                          min="1"
                          max="10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Character Type
                    </label>
                    <div className="space-y-1">
                      <Controller
                        name="is_main_character"
                        control={control}
                        render={({ field }) => (
                          <label className="flex items-center text-sm text-gray-300">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="mr-2 rounded"
                            />
                            Main Character
                          </label>
                        )}
                      />
                      <Controller
                        name="is_protagonist"
                        control={control}
                        render={({ field }) => (
                          <label className="flex items-center text-sm text-gray-300">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="mr-2 rounded"
                            />
                            Protagonist
                          </label>
                        )}
                      />
                      <Controller
                        name="is_antagonist"
                        control={control}
                        render={({ field }) => (
                          <label className="flex items-center text-sm text-gray-300">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="mr-2 rounded"
                            />
                            Antagonist
                          </label>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Appearance Section */}
            <Section
              title="Appearance"
              isOpen={openSections.appearance}
              onToggle={() => toggleSection('appearance')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Physical Description
                  </label>
                  <Controller
                    name="appearance"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Detailed physical appearance description"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Height
                  </label>
                  <Controller
                    name="height"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                        placeholder="e.g., 5'8", 170cm"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weight
                  </label>
                  <Controller
                    name="weight"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                        placeholder="e.g., 150lbs, 70kg"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Eye Color
                  </label>
                  <Controller
                    name="eye_color"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                        placeholder="e.g., Brown, Green, Blue"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hair Color
                  </label>
                  <Controller
                    name="hair_color"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                        placeholder="e.g., Black, Blonde, Red"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age Range
                  </label>
                  <Controller
                    name="age_range"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                        placeholder="e.g., 25-30, Young Adult, Ancient"
                      />
                    )}
                  />
                </div>
              </div>
            </Section>

            {/* Personality Section */}
            <Section
              title="Personality"
              isOpen={openSections.personality}
              onToggle={() => toggleSection('personality')}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Personality Traits
                  </label>
                  <Controller
                    name="personality"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Character personality, quirks, and behavioral patterns"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Motivations
                  </label>
                  <Controller
                    name="motivations"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="What drives this character? Goals, desires, and aspirations"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fears
                  </label>
                  <Controller
                    name="fears"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="What scares this character? Phobias, anxieties, and weaknesses"
                      />
                    )}
                  />
                </div>
              </div>
            </Section>

            {/* History Section */}
            <Section
              title="History"
              isOpen={openSections.history}
              onToggle={() => toggleSection('history')}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background History
                  </label>
                  <Controller
                    name="history"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Character's backstory, important life events, and formative experiences"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Appearance
                  </label>
                  <Controller
                    name="first_appearance"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                        placeholder="Chapter, episode, or scene where character first appears"
                      />
                    )}
                  />
                </div>
              </div>
            </Section>

            {/* Abilities Section */}
            <Section
              title="Abilities"
              isOpen={openSections.abilities}
              onToggle={() => toggleSection('abilities')}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Powers & Abilities
                  </label>
                  <Controller
                    name="abilities"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Special powers, magical abilities, and unique talents"
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Skills (comma-separated)
                    </label>
                    <Controller
                      name="skills"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="text"
                          value={field.value?.join(', ') || ''}
                          onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                          placeholder="e.g., Swordsmanship, Magic, Stealth"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Weaknesses (comma-separated)
                    </label>
                    <Controller
                      name="weaknesses"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="text"
                          value={field.value?.join(', ') || ''}
                          onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
                          placeholder="e.g., Arrogance, Fire vulnerability, Trust issues"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* Tags Section */}
            <Section
              title="Character Tags"
              isOpen={openSections.tags}
              onToggle={() => toggleSection('tags')}
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <MultiTagInput
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                  placeholder="Search and select character tags..."
                  maxTags={15}
                  allowCreate={true}
                />
              </div>
            </Section>

            {/* Associations Section */}
            <Section
              title="Story Associations"
              isOpen={openSections.associations}
              onToggle={() => toggleSection('associations')}
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Book/Volume/Saga/Arc/Issue Associations
                </label>
                <AssociationPicker
                  selectedAssociations={selectedAssociations}
                  onAssociationsChange={setSelectedAssociations}
                  maxAssociations={10}
                />
              </div>
            </Section>

            {/* Affiliations Section */}
            <Section
              title="Affiliations"
              isOpen={openSections.affiliations}
              onToggle={() => toggleSection('affiliations')}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Organizations & Groups
                  </label>
                  <Controller
                    name="affiliations"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Groups, organizations, guilds, or factions the character belongs to or is associated with"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Character Relationships
                  </label>
                  <Controller
                    name="relationships"
                    control={control}
                    render={({ field }) => (
                      <RelationshipSelector
                        relationships={field.value || []}
                        onChange={field.onChange}
                        availableCharacters={availableCharacters}
                      />
                    )}
                  />
                </div>
              </div>
            </Section>

{/* Relationship Graph Section */}
            <Section
              title="Relationship Map"
              isOpen={openSections.relationships}
              onToggle={() => toggleSection('relationships')}
            >
              <RelationshipGraph 
                characters={availableCharacters.map(c => ({ id: c.id, name: c.name }))}
                relationships={(watch('relationships') || []).map((r: any) => ({
                  source: r.related_character_id, 
                  target: character?.id || 0, 
                  relationship_type: r.relationship_type
                }))}
              />
            </Section>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="neon-button-orange px-6 py-3 flex-1 font-medium"
              >
                {isLoading ? 'Saving...' : (character ? 'Update Character' : 'Create Character')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors flex-1 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
