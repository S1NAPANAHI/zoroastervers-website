'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Character {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('/api/characters');
        if (response.ok) {
          const data = await response.json();
          setCharacters(data);
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading characters...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Characters</h1>
        <Link 
          href="/characters/relationships" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Relationships
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character) => (
          <Link
            key={character.id}
            href={`/characters/${character.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block"
          >
            <h3 className="text-xl font-semibold mb-2">{character.name}</h3>
            <p className="text-gray-600 mb-3 line-clamp-3">{character.description}</p>
            <div className="flex flex-wrap gap-1">
              {character.tags?.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {character.tags?.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{character.tags.length - 3} more
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      {characters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No characters found.</p>
        </div>
      )}
    </div>
  );
}
