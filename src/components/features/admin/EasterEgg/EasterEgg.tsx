'use client';

import { useState } from 'react';

interface EasterEggProps {
  id: number;
  itemId: number;
  itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  showInInlineMode?: boolean;
  adminMode?: boolean;
}

interface RewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  reward: {
    title: string;
    message: string;
    points: number;
    exclusiveArt?: string;
  };
}

function RewardPopup({ isOpen, onClose, reward }: RewardPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="glass-dark rounded-2xl p-6 max-w-md w-full mx-4 text-center easter-egg-modal">
        <div className="mb-4">
          <div className="text-6xl mb-4 easter-egg-reveal">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-2 slide-expand-down">Easter Egg Found!</h3>
          <h4 className="text-xl text-cyan-400 mb-3 slide-expand-down" style={{animationDelay: '0.1s'}}>{reward.title}</h4>
        </div>
        
        <div className="mb-4 scale-expand" style={{animationDelay: '0.2s'}}>
          <p className="text-white mb-4">{reward.message}</p>
          
          {reward.points > 0 && (
            <div className="flex items-center justify-center mb-4">
              <div className="glass p-3 rounded-lg hover-lift easter-egg-sparkle">
                <span className="text-yellow-400 text-lg font-bold">
                  +{reward.points} Points!
                </span>
              </div>
            </div>
          )}
          
          {reward.exclusiveArt && (
            <div className="mb-4">
              <img 
                src={reward.exclusiveArt} 
                alt="Exclusive reward art" 
                className="max-w-full max-h-48 mx-auto rounded-lg hover-lift transition-all duration-300"
              />
              <p className="text-purple-400 text-sm mt-2 easter-egg-sparkle">Exclusive artwork unlocked!</p>
            </div>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="neon-button-cyan px-6 py-2 btn-keyboard-focus ripple-effect"
          autoFocus
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

export default function EasterEgg({ 
  id, 
  itemId, 
  itemType, 
  icon = '🎁', 
  size = 'md',
  position = { top: '20%', left: '20%' },
  showInInlineMode = false,
  adminMode = false
}: EasterEggProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [reward, setReward] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6 text-lg',
    md: 'w-8 h-8 text-xl',
    lg: 'w-10 h-10 text-2xl'
  };

  const handleClick = async () => {
    if (isClicked || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/easter_eggs/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          egg_id: id,
          item_id: itemId,
          item_type: itemType,
          discovery_method: 'click'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsClicked(true);
        setReward({
          title: data.egg.title,
          message: data.egg.reward,
          points: data.egg.points,
          exclusiveArt: data.egg.exclusive_art
        });
        setShowReward(true);
      } else {
        console.error('Failed to unlock easter egg:', data.error);
      }
    } catch (error) {
      console.error('Error unlocking easter egg:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseOpacity = adminMode ? 'opacity-50' : 'opacity-20';
  const hoverOpacity = adminMode ? 'hover:opacity-75' : 'hover:opacity-40';
  
  return (
    <>
      <button
        onClick={handleClick}
        disabled={isClicked || isLoading}
        className={`
          absolute ${sizeClasses[size]} 
          flex items-center justify-center
          ${baseOpacity} ${hoverOpacity}
          smooth-transition
          transform hover:scale-110
          ${isClicked ? 'opacity-100 text-green-400 easter-egg-sparkle' : ''}
          ${isLoading ? 'animate-pulse' : 'easter-egg-float'}
          cursor-pointer select-none
          z-10
          btn-keyboard-focus
          ripple-effect
        `}
        style={{
          top: position.top,
          bottom: position.bottom,
          left: position.left,
          right: position.right,
        }}
        title={adminMode ? `Easter Egg #${id}` : undefined}
        aria-label={adminMode ? `Easter Egg #${id}` : 'Hidden easter egg - click to discover!'}
      >
        {isLoading ? '⏳' : isClicked ? '✨' : icon}
      </button>

      <RewardPopup
        isOpen={showReward}
        onClose={() => setShowReward(false)}
        reward={reward || { title: '', message: '', points: 0 }}
      />
    </>
  );
}
