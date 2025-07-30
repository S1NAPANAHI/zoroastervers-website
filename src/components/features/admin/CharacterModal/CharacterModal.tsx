'use client'
import { Character } from '@/lib/supabase'
import CharacterForm from '@/components/features/admin/CharacterForm'

interface CharacterModalProps {
  character: Character | null
  onClose: () => void
  onSave: () => void
  availableCharacters?: Character[]
}

export default function CharacterModal({ character, onClose, onSave, availableCharacters = [] }: CharacterModalProps) {
  return (
    <CharacterForm
      character={character}
      onClose={onClose}
      onSave={onSave}
      availableCharacters={availableCharacters}
    />
  )
}
