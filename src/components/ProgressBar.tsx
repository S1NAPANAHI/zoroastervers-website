'use client';

import React from 'react';
import { GamificationService, LevelData } from '@/services/gamificationService';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md',
  animated = true,
  className = ''
}) => {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    cyan: 'from-cyan-500 to-cyan-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-slate-400">{current}/{total} ({percentage}%)</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500 ${
            animated ? 'ease-out' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface LevelProgressBarProps {
  levelData: LevelData;
  showDetails?: boolean;
  className?: string;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
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

interface AggregateProgressBarProps {
  children: Array<{
    id: number;
    title: string;
    progress: number; // 0-100
    total?: number;
  }>;
  title: string;
  className?: string;
}

export const AggregateProgressBar: React.FC<AggregateProgressBarProps> = ({
  children,
  title,
  className = ''
}) => {
  const totalItems = children.length;
  const completedItems = children.filter(child => child.progress >= 100).length;
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  // Calculate weighted average progress
  const averageProgress = totalItems > 0 
    ? Math.round(children.reduce((sum, child) => sum + child.progress, 0) / totalItems)
    : 0;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <span className="text-xs text-slate-400">
          {completedItems}/{totalItems} complete
        </span>
      </div>
      
      {/* Overall completion progress */}
      <ProgressBar
        current={completedItems}
        total={totalItems}
        color="green"
        size="md"
        showPercentage={false}
      />
      
      {/* Average reading progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Reading Progress</span>
          <span className="text-slate-300">{averageProgress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div
            className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${averageProgress}%` }}
          />
        </div>
      </div>

      {/* Individual child progress (collapsed view) */}
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {children.map((child) => (
          <div key={child.id} className="flex items-center space-x-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${
              child.progress >= 100 ? 'bg-green-500' : 
              child.progress > 0 ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
            <span className="flex-1 text-slate-300 truncate">{child.title}</span>
            <span className="text-slate-400">{Math.round(child.progress)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
