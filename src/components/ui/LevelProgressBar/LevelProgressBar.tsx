import React from 'react';

interface LevelData {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  totalXP: number;
  progressPercentage: number;
}

interface LevelProgressBarProps {
  levelData: LevelData;
  showDetails?: boolean;
  className?: string;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({ 
  levelData, 
  showDetails = true, 
  className = '' 
}) => {
  const { currentLevel, xpInCurrentLevel, xpNeededForNextLevel, progressPercentage } = levelData;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-300">
          Level {currentLevel}
        </div>
        {showDetails && (
          <div className="text-xs text-slate-400">
            {xpInCurrentLevel} / {xpNeededForNextLevel} XP
          </div>
        )}
      </div>
      
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-400 to-cyan-400 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="h-full w-full bg-white/20 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {showDetails && (
        <div className="text-xs text-slate-400 text-center">
          {Math.round(progressPercentage)}% to Level {currentLevel + 1}
        </div>
      )}
    </div>
  );
};

export default LevelProgressBar;
