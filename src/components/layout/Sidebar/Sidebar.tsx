'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { ProgressBar } from '@components/ui';
import { LevelProgressBar } from '@components/ui';
import { GamificationService } from '@/services/gamificationService';

interface SidebarProps {
  user?: {
    username: string;
    avatar: string;
    progress: {
      booksRead: number;
      totalBooks: number;
      timelineExplored: number;
      xp?: number;
    };
    achievements: string[];
    notes: string[];
    isAdmin?: boolean;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button - Vertical bookmark-style tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${
          isOpen ? 'translate-x-64' : 'translate-x-0'
        }`}
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed'
        }}
      >
        <div className="glass-dark px-2 py-4 rounded-r-lg border border-white/10 hover:border-cyan-400/30 transition-all group">
          <span className="text-2xl text-cyan-400 group-hover:text-purple-400 transition-colors">📑</span>
        </div>
      </button>

      {/* Backdrop */}
      <Transition
        show={isOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      </Transition>

      {/* Sidebar */}
      <Transition
        show={isOpen}
        enter="transition-transform duration-300 ease-out"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300 ease-in"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <aside 
          ref={sidebarRef}
          className="fixed inset-y-0 left-0 w-80 glass-dark border-r border-white/10 backdrop-blur-xl z-40 overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-serif">
              ZOROASTER
            </h2>
            <p className="text-slate-400 text-sm mt-1">Navigation Hub</p>
          </div>

          {/* Main Navigation Tree */}
          <nav className="p-6">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-4">Main Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/5 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">🏠</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/overview" className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/5 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">📋</span>
                  <span>Overview</span>
                </Link>
              </li>
              <li>
                <Link href="/books" className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/5 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">📚</span>
                  <span>Books</span>
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/5 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">⏰</span>
                  <span>Timeline</span>
                </Link>
              </li>
              <li>
                <Link href="/behind-the-scenes" className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/5 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">🎬</span>
                  <span>Behind the Scenes</span>
                </Link>
              </li>
              <li>
                <Link href="/shop" className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/5 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">🛒</span>
                  <span>Shop</span>
                </Link>
              </li>
              {user?.isAdmin && (
                <li>
                  <Link href="/admin" className="flex items-center space-x-3 text-slate-300 hover:text-red-400 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/5 group">
                    <span className="text-xl group-hover:scale-110 transition-transform">⚙️</span>
                    <span>Admin</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Quick Links */}
          <div className="px-6 pb-6">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/characters" className="flex items-center space-x-3 text-slate-300 hover:text-purple-400 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/5 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">👥</span>
                  <span>Characters</span>
                </Link>
              </li>
              <li>
                <Link href="/world" className="flex items-center space-x-3 text-slate-300 hover:text-purple-400 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/5 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">🌍</span>
                  <span>World Building</span>
                </Link>
              </li>
              <li>
                <Link href="/universe" className="flex items-center space-x-3 text-slate-300 hover:text-purple-400 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/5 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">🌌</span>
                  <span>Universe Explorer</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* User Stats */}
          {user && (
            <div className="px-6 pb-6 border-t border-white/5 pt-6">
              <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-4">Your Progress</h3>
              <div className="space-y-4">
                {/* Level Progress */}
                {(() => {
                  const totalXP = (user.progress?.xp || 0);
                  const levelData = GamificationService.calculateLevel(totalXP);
                  return (
                    <LevelProgressBar 
                      levelData={levelData}
                      showDetails={false}
                      className="glass px-3 py-2 rounded-lg border border-white/10"
                    />
                  );
                })()}

                {/* Resume Reading Button */}
                {(() => {
                  const resumeData = GamificationService.getResumeData();
                  return resumeData ? (
                    <Link
                      href={resumeData.path}
                      className="flex items-center space-x-2 glass px-3 py-2 rounded-lg border border-green-400/30 bg-green-400/10 hover:bg-green-400/20 transition-all group"
                    >
                      <span className="text-green-400 group-hover:scale-110 transition-transform">▶️</span>
                      <span className="text-green-400 text-sm font-medium">Resume Reading</span>
                    </Link>
                  ) : null;
                })()}

                {/* Reading Progress */}
                <ProgressBar
                  current={user.progress.booksRead}
                  total={user.progress.totalBooks}
                  label="Books Read"
                  color="cyan"
                  size="sm"
                  className="glass px-3 py-2 rounded-lg border border-white/10"
                />

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="glass px-2 py-1 rounded border border-white/10 text-center">
                    <div className="text-purple-400 font-bold text-sm">{user.achievements.length}</div>
                    <div className="text-slate-400 text-xs">🏆</div>
                  </div>
                  <div className="glass px-2 py-1 rounded border border-white/10 text-center">
                    <div className="text-green-400 font-bold text-sm">{user.progress.timelineExplored}%</div>
                    <div className="text-slate-400 text-xs">⏰</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="px-6 pb-6 border-t border-white/5 pt-6">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-4">Connect</h3>
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="#" 
                className="flex items-center justify-center space-x-2 glass px-3 py-2 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all group"
              >
                <span className="text-blue-400 group-hover:scale-110 transition-transform">📘</span>
                <span className="text-slate-300 group-hover:text-blue-400 text-sm">Facebook</span>
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center space-x-2 glass px-3 py-2 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all group"
              >
                <span className="text-blue-400 group-hover:scale-110 transition-transform">🐦</span>
                <span className="text-slate-300 group-hover:text-blue-400 text-sm">Twitter</span>
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center space-x-2 glass px-3 py-2 rounded-lg border border-white/10 hover:border-pink-400/30 transition-all group"
              >
                <span className="text-pink-400 group-hover:scale-110 transition-transform">📷</span>
                <span className="text-slate-300 group-hover:text-pink-400 text-sm">Instagram</span>
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center space-x-2 glass px-3 py-2 rounded-lg border border-white/10 hover:border-purple-400/30 transition-all group"
              >
                <span className="text-purple-400 group-hover:scale-110 transition-transform">💬</span>
                <span className="text-slate-300 group-hover:text-purple-400 text-sm">Discord</span>
              </a>
            </div>
          </div>
        </aside>
      </Transition>
    </>
  );
};

export default Sidebar;

