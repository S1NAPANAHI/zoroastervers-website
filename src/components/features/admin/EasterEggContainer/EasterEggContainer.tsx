'use client';

import { ReactNode } from 'react';
import { EasterEgg } from '@/components/features/admin/EasterEgg';
import { useEasterEggs } from '@/lib/hooks/useEasterEggs';

interface EasterEggContainerProps {
  children: ReactNode;
  itemId: number;
  itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  adminMode?: boolean;
  showInInlineMode?: boolean;
  className?: string;
}

export default function EasterEggContainer({ 
  children, 
  itemId, 
  itemType, 
  adminMode = false,
  showInInlineMode = false,
  className = ""
}: EasterEggContainerProps) {
  const { easterEggs, isLoading, error } = useEasterEggs({ 
    itemId, 
    itemType, 
    adminMode,
    showInInlineMode 
  });

  return (
    <div className={`relative ${className}`}>
      {children}
      
      {/* Render easter eggs */}
      {!isLoading && !error && easterEggs.map(egg => (
        <EasterEgg
          key={egg.id}
          id={egg.id}
          itemId={itemId}
          itemType={itemType}
          icon={egg.icon}
          position={egg.position}
          showInInlineMode={showInInlineMode}
          adminMode={adminMode}
        />
      ))}
      
      {/* Admin debug info */}
      {adminMode && (
        <div className="absolute top-0 right-0 bg-black/70 text-white text-xs p-1 rounded">
          Eggs: {easterEggs.length}
        </div>
      )}
    </div>
  );
}
