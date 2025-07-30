'use client';

import React from 'react';
import { GamificationService, LevelData } from '@/services/gamificationService';

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
  const progress = GamificationService.getLevelProgress(levelData);
  const isMaxLevel = levelData.level >= GamificationService.LEVELS[GamificationService.LEVELS.length - 1].level;

  return (
    <div className={`space-y-2 ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{levelData.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-white">Level {levelData.level}</h3>
              <p className="text-sm text-slate-300">{levelData.title}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-cyan-400">
              {levelData.currentXP.toLocaleString()} XP
            </div>
            {!isMaxLevel && (
              <div className="text-xs text-slate-400">
                {levelData.xpForNext.toLocaleString()} to next level
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {showDetails && !isMaxLevel && (
        <div className="text-center text-xs text-slate-400">
          {progress}% to Level {levelData.level + 1}
        </div>
      )}
      
      {isMaxLevel && showDetails && (
        <div className="text-center text-xs text-yellow-400 font-medium">
          ⭐ Max Level Reached! ⭐
        </div>
      )}
    </div>
  );
};

export default LevelProgressBar;
