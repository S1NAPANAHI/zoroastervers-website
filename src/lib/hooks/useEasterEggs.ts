'use client';

import { useState, useEffect } from 'react';
import { EasterEgg } from '@/lib/types';

interface UseEasterEggsOptions {
  itemId: number;
  itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  adminMode?: boolean;
  showInInlineMode?: boolean;
}

interface EasterEggWithPosition extends EasterEgg {
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  icon: string;
}

export function useEasterEggs({ itemId, itemType, adminMode = false, showInInlineMode = false }: UseEasterEggsOptions) {
  const [easterEggs, setEasterEggs] = useState<EasterEggWithPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEasterEggs();
  }, [itemId, itemType]);

  const fetchEasterEggs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, we'll create some mock easter eggs
      // In a real implementation, you'd fetch from your API
      const mockEggs: EasterEggWithPosition[] = [
        {
          id: 1,
          item_id: itemId,
          item_type: itemType,
          title: "Hidden Treasure",
          clue: "Look closely at the book cover",
          reward: "You found the author's secret note!",
          trigger_type: "click",
          trigger_conditions: null,
          difficulty_level: 1,
          discovery_rate: 0.15,
          hint_level: 1,
          reward_type: "points",
          reward_data: { points: 50, exclusive_art: null },
          is_active: true,
          available_from: null,
          available_until: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          position: { top: "15%", left: "25%" },
          icon: "🗝️"
        },
        {
          id: 2,
          item_id: itemId,
          item_type: itemType,
          title: "Secret Symbol",
          clue: "Hidden in the description",
          reward: "Unlocked exclusive character art!",
          trigger_type: "click",
          trigger_conditions: null,
          difficulty_level: 2,
          discovery_rate: 0.08,
          hint_level: 2,
          reward_type: "art",
          reward_data: { 
            points: 100, 
            exclusive_art: "/api/placeholder/300/200"
          },
          is_active: true,
          available_from: null,
          available_until: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          position: { bottom: "20%", right: "15%" },
          icon: "🔮"
        },
        {
          id: 3,
          item_id: itemId,
          item_type: itemType,
          title: "Ancient Rune",
          clue: "A mystical symbol waits to be discovered",
          reward: "You've discovered an ancient secret!",
          trigger_type: "click",
          trigger_conditions: null,
          difficulty_level: 3,
          discovery_rate: 0.05,
          hint_level: 3,
          reward_type: "special",
          reward_data: { points: 200 },
          is_active: true,
          available_from: null,
          available_until: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          position: { top: "60%", left: "80%" },
          icon: "⚡"
        }
      ];

      // Filter eggs based on visibility settings
      const visibleEggs = mockEggs.filter(egg => {
        if (adminMode) return true; // Admin sees all eggs
        if (!showInInlineMode && itemType !== 'book') return false; // Only show on books unless inline mode
        return egg.is_active;
      });

      setEasterEggs(visibleEggs);
    } catch (err) {
      setError('Failed to load easter eggs');
      console.error('Error fetching easter eggs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEggVisibility = (eggId: number) => {
    setEasterEggs(eggs => 
      eggs.map(egg => 
        egg.id === eggId 
          ? { ...egg, is_active: !egg.is_active }
          : egg
      )
    );
  };

  return {
    easterEggs,
    isLoading,
    error,
    toggleEggVisibility,
    refetch: fetchEasterEggs
  };
}
