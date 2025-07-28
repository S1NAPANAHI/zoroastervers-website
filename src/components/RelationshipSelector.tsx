'use client'
import { useState, useEffect } from 'react'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TrashIcon, PlusIcon, GripVerticalIcon } from '@heroicons/react/24/outline'
import { Character, CharacterRelationship } from '@/lib/supabase'

interface RelationshipSelectorProps {
  relationships: Partial<CharacterRelationship>[]
  onChange: (relationships: Partial<CharacterRelationship>[]) => void
  availableCharacters: Character[]
}

interface SortableItemProps {
  id: string
  relationship: Partial<CharacterRelationship>
  availableCharacters: Character[]
  onUpdate: (id: string, relationship: Partial<CharacterRelationship>) => void
  onRemove: (id: string) => void
}

function SortableItem({ id, relationship, availableCharacters, onUpdate, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const relationshipTypes = [
    'family', 'friend', 'enemy', 'romantic', 'ally', 'rival', 'mentor', 'student', 'colleague', 'other'
  ]

  const selectedCharacter = availableCharacters.find(char => char.id === relationship.related_character_id)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800 border border-gray-600 rounded-lg p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-white cursor-move"
          >
            <GripVerticalIcon className="w-5 h-5" />
          </button>
          <span className="text-white font-medium">
            {selectedCharacter?.name || 'Select Character'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="text-red-400 hover:text-red-300"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Character
          </label>
          <select
            value={relationship.related_character_id || ''}
            onChange={(e) => onUpdate(id, { 
              ...relationship, 
              related_character_id: parseInt(e.target.value) 
            })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
          >
            <option value="">Select a character</option>
            {availableCharacters.map(char => (
              <option key={char.id} value={char.id}>
                {char.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Relationship Type
          </label>
          <select
            value={relationship.relationship_type || ''}
            onChange={(e) => onUpdate(id, { 
              ...relationship, 
              relationship_type: e.target.value 
            })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
          >
            <option value="">Select type</option>
            {relationshipTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description (Optional)
        </label>
        <input
          type="text"
          value={relationship.description || ''}
          onChange={(e) => onUpdate(id, { 
            ...relationship, 
            description: e.target.value 
          })}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
          placeholder="Describe the relationship..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Strength (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={relationship.strength || 5}
            onChange={(e) => onUpdate(id, { 
              ...relationship, 
              strength: parseInt(e.target.value) 
            })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Status
          </label>
          <select
            value={relationship.status || 'active'}
            onChange={(e) => onUpdate(id, { 
              ...relationship, 
              status: e.target.value as 'active' | 'past' | 'complicated' | 'unknown'
            })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400"
          >
            <option value="active">Active</option>
            <option value="past">Past</option>
            <option value="complicated">Complicated</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default function RelationshipSelector({ relationships, onChange, availableCharacters }: RelationshipSelectorProps) {
  const [items, setItems] = useState<string[]>([])

  useEffect(() => {
    setItems(relationships.map((_, index) => `relationship-${index}`))
  }, [relationships])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string)
      const newIndex = items.indexOf(over.id as string)

      const newItems = arrayMove(items, oldIndex, newIndex)
      const newRelationships = arrayMove(relationships, oldIndex, newIndex)
      
      setItems(newItems)
      onChange(newRelationships)
    }
  }

  const addRelationship = () => {
    const newRelationship: Partial<CharacterRelationship> = {
      relationship_type: '',
      strength: 5,
      status: 'active',
      is_mutual: true,
    }
    
    const newRelationships = [...relationships, newRelationship]
    onChange(newRelationships)
  }

  const updateRelationship = (id: string, relationship: Partial<CharacterRelationship>) => {
    const index = items.indexOf(id)
    if (index !== -1) {
      const newRelationships = [...relationships]
      newRelationships[index] = relationship
      onChange(newRelationships)
    }
  }

  const removeRelationship = (id: string) => {
    const index = items.indexOf(id)
    if (index !== -1) {
      const newRelationships = relationships.filter((_, i) => i !== index)
      onChange(newRelationships)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Character Relationships</h3>
        <button
          type="button"
          onClick={addRelationship}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Relationship</span>
        </button>
      </div>

      {relationships.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No relationships defined yet.</p>
          <p className="text-sm">Click "Add Relationship" to get started.</p>
        </div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((id, index) => (
                <SortableItem
                  key={id}
                  id={id}
                  relationship={relationships[index]}
                  availableCharacters={availableCharacters}
                  onUpdate={updateRelationship}
                  onRemove={removeRelationship}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
