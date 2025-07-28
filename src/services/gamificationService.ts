export interface GamificationData {
  xp: number;
  level: number;
  achievements: Achievement[];
  badges: Badge[];
  streak: number;
  totalReadingTime: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'reading' | 'exploration' | 'community' | 'milestone';
  xpReward: number;
  criteria: {
    type: 'progress' | 'completion' | 'streak' | 'time';
    target: number;
    itemType?: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  };
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  unlockedAt: string;
}

export interface LevelData {
  level: number;
  currentXP: number;
  xpForNext: number;
  xpTotal: number;
  title: string;
  icon: string;
  perks: string[];
}

export class GamificationService {
  // XP rewards for different actions
  static XP_REWARDS = {
    START_READING: 5,
    COMPLETE_ISSUE: 20,
    COMPLETE_ARC: 50,
    COMPLETE_SAGA: 100,
    COMPLETE_VOLUME: 200,
    COMPLETE_BOOK: 500,
    DAILY_STREAK: 10,
    FIRST_TIME_READ: 15,
  };

  // Level thresholds and titles
  static LEVELS = [
    { level: 1, xpRequired: 0, title: 'Novice Reader', icon: '📖', perks: ['Basic progress tracking'] },
    { level: 2, xpRequired: 100, title: 'Apprentice Scholar', icon: '🎓', perks: ['Achievement badges', 'Reading stats'] },
    { level: 3, xpRequired: 300, title: 'Dedicated Explorer', icon: '🧭', perks: ['Timeline access', 'Character notes'] },
    { level: 4, xpRequired: 600, title: 'Lore Keeper', icon: '📚', perks: ['Advanced search', 'Custom tags'] },
    { level: 5, xpRequired: 1000, title: 'Universe Scholar', icon: '🌌', perks: ['Theory crafting', 'Community features'] },
    { level: 6, xpRequired: 1500, title: 'Master Theorist', icon: '🧠', perks: ['Advanced theories', 'Discussion forums'] },
    { level: 7, xpRequired: 2200, title: 'Cosmic Sage', icon: '⭐', perks: ['Premium content', 'Early access'] },
    { level: 8, xpRequired: 3000, title: 'Timeline Guardian', icon: '⏰', perks: ['Timeline editing', 'Beta features'] },
    { level: 9, xpRequired: 4000, title: 'Universe Architect', icon: '🏗️', perks: ['Content creation', 'Mod privileges'] },
    { level: 10, xpRequired: 5500, title: 'Eternal Chronicler', icon: '👑', perks: ['All features', 'Special recognition'] },
  ];

  // Predefined achievements
  static ACHIEVEMENTS: Achievement[] = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Start reading your first issue',
      icon: '👶',
      category: 'reading',
      xpReward: 15,
      criteria: { type: 'progress', target: 1, itemType: 'issue' }
    },
    {
      id: 'issue-master',
      name: 'Issue Master',
      description: 'Complete 10 issues',
      icon: '📄',
      category: 'reading',
      xpReward: 50,
      criteria: { type: 'completion', target: 10, itemType: 'issue' }
    },
    {
      id: 'arc-explorer',
      name: 'Arc Explorer',
      description: 'Complete your first arc',
      icon: '🌉',
      category: 'reading',
      xpReward: 75,
      criteria: { type: 'completion', target: 1, itemType: 'arc' }
    },
    {
      id: 'saga-champion',
      name: 'Saga Champion',
      description: 'Complete an entire saga',
      icon: '🏆',
      category: 'reading',
      xpReward: 150,
      criteria: { type: 'completion', target: 1, itemType: 'saga' }
    },
    {
      id: 'speed-reader',
      name: 'Speed Reader',
      description: 'Read for 5 hours in a single day',
      icon: '⚡',
      category: 'milestone',
      xpReward: 100,
      criteria: { type: 'time', target: 300 } // 300 minutes
    },
    {
      id: 'dedicated-reader',
      name: 'Dedicated Reader',
      description: 'Maintain a 7-day reading streak',
      icon: '🔥',
      category: 'milestone',
      xpReward: 80,
      criteria: { type: 'streak', target: 7 }
    },
    {
      id: 'theory-crafter',
      name: 'Theory Crafter',
      description: 'Create 5 theories or notes',
      icon: '🧠',
      category: 'community',
      xpReward: 60,
      criteria: { type: 'progress', target: 5 }
    },
    {
      id: 'completionist',
      name: 'Completionist',
      description: 'Achieve 100% completion on any volume',
      icon: '💯',
      category: 'milestone',
      xpReward: 200,
      criteria: { type: 'completion', target: 1, itemType: 'volume' }
    }
  ];

  /**
   * Calculate current level based on total XP
   */
  static calculateLevel(totalXP: number): LevelData {
    let currentLevel = this.LEVELS[0];
    
    for (let i = this.LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= this.LEVELS[i].xpRequired) {
        currentLevel = this.LEVELS[i];
        break;
      }
    }

    const nextLevel = this.LEVELS.find(l => l.level === currentLevel.level + 1);
    const xpForNext = nextLevel ? nextLevel.xpRequired - totalXP : 0;

    return {
      level: currentLevel.level,
      currentXP: totalXP - currentLevel.xpRequired,
      xpForNext,
      xpTotal: totalXP,
      title: currentLevel.title,
      icon: currentLevel.icon,
      perks: currentLevel.perks
    };
  }

  /**
   * Award XP for completing an action
   */
  static awardXP(
    action: keyof typeof GamificationService.XP_REWARDS,
    currentData: GamificationData
  ): { newXP: number; levelUp: boolean; newLevel?: LevelData } {
    const xpGained = this.XP_REWARDS[action];
    const newTotalXP = currentData.xp + xpGained;
    
    const oldLevel = this.calculateLevel(currentData.xp);
    const newLevel = this.calculateLevel(newTotalXP);
    
    const levelUp = newLevel.level > oldLevel.level;

    return {
      newXP: newTotalXP,
      levelUp,
      newLevel: levelUp ? newLevel : undefined
    };
  }

  /**
   * Check if user has unlocked any new achievements
   */
  static checkAchievements(
    progressData: {
      completedIssues: number;
      completedArcs: number;
      completedSagas: number;
      completedVolumes: number;
      totalReadingTime: number;
      currentStreak: number;
      notesCreated: number;
    },
    currentAchievements: Achievement[]
  ): Achievement[] {
    const unlockedIds = new Set(currentAchievements.map(a => a.id));
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of this.ACHIEVEMENTS) {
      if (unlockedIds.has(achievement.id)) continue;

      let unlocked = false;

      switch (achievement.criteria.type) {
        case 'completion':
          switch (achievement.criteria.itemType) {
            case 'issue':
              unlocked = progressData.completedIssues >= achievement.criteria.target;
              break;
            case 'arc':
              unlocked = progressData.completedArcs >= achievement.criteria.target;
              break;
            case 'saga':
              unlocked = progressData.completedSagas >= achievement.criteria.target;
              break;
            case 'volume':
              unlocked = progressData.completedVolumes >= achievement.criteria.target;
              break;
          }
          break;
        case 'time':
          unlocked = progressData.totalReadingTime >= achievement.criteria.target;
          break;
        case 'streak':
          unlocked = progressData.currentStreak >= achievement.criteria.target;
          break;
        case 'progress':
          if (achievement.id === 'theory-crafter') {
            unlocked = progressData.notesCreated >= achievement.criteria.target;
          } else if (achievement.id === 'first-steps') {
            unlocked = progressData.completedIssues >= achievement.criteria.target;
          }
          break;
      }

      if (unlocked) {
        newlyUnlocked.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
      }
    }

    return newlyUnlocked;
  }

  /**
   * Generate trophy icons based on achievement category
   */
  static getTrophyIcon(category: Achievement['category']): string {
    const trophies = {
      reading: '🏆',
      exploration: '🗺️',
      community: '🤝',
      milestone: '⭐'
    };
    return trophies[category] || '🏅';
  }

  /**
   * Get level progress percentage
   */
  static getLevelProgress(levelData: LevelData): number {
    if (levelData.level >= this.LEVELS[this.LEVELS.length - 1].level) {
      return 100; // Max level
    }
    
    const currentLevelXP = levelData.currentXP;
    const totalXPForNextLevel = currentLevelXP + levelData.xpForNext;
    
    return Math.round((currentLevelXP / totalXPForNextLevel) * 100);
  }

  /**
   * Get resume data from localStorage
   */
  static getResumeData(): {
    itemId: number;
    itemType: string;
    position: string;
    path: string;
    timestamp: string;
  } | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem('lastReadProgress');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Clear resume data
   */
  static clearResumeData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lastReadProgress');
    }
  }
}
