'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Character {
  id: string;
  name: string;
  description: string;
  // Add all other character fields from your API
}

export default function CharacterDetailPage() {
  const params = useParams();
  const { id } = params;
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCharacter = async () => {
        try {
          const response = await fetch(`/api/characters/${id}`);
          if (response.ok) {
            const data = await response.json();
            setCharacter(data);
          }
        } catch (error) {
          console.error('Error fetching character:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCharacter();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading character details...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Character not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/characters" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Characters
      </Link>
      <h1 className="text-4xl font-bold mb-4">{character.name}</h1>
      <p className="text-lg text-gray-600">{character.description}</p>
      {/* Render other character details here */}
    </div>
  );
}
