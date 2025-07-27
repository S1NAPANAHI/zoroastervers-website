'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount, getCartTotal } = useCart();

  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const nextIssueDate = new Date('2025-10-27T00:00:00');
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetTime = nextIssueDate.getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []); // Empty dependency array since we don't need to re-run when anything changes

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5" style={{
      background: 'rgba(15, 23, 42, 0.6)',
      boxShadow: '0 0 30px rgba(34, 211, 238, 0.15), 0 0 60px rgba(168, 85, 247, 0.1)'
    }}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand & Countdown */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex flex-col items-start">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-serif">
                ZOROASTER
              </div>
              <div className="text-xs text-slate-400 font-light tracking-wide mt-0.5">
                by Sina Panahi
              </div>
            </Link>
            
            {/* Countdown Timer */}
            <div className="hidden lg:flex">
              {isExpired ? (
                <div className="glass px-3 py-2 rounded-lg border border-green-400/30 bg-green-500/10">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-sm">🎉</span>
                    <span className="text-green-400 text-sm font-medium">New Issue Available!</span>
                  </div>
                </div>
              ) : (
                <div className="glass px-3 py-2 rounded-lg border border-purple-400/30 bg-purple-500/10">
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-400 text-xs font-medium">Next Issue:</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-white text-sm font-bold">{timeLeft.days.toString().padStart(2, '0')}</span>
                      <span className="text-purple-300 text-xs">d</span>
                      <span className="text-purple-400">:</span>
                      <span className="text-white text-sm font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                      <span className="text-purple-300 text-xs">h</span>
                      <span className="text-purple-400">:</span>
                      <span className="text-white text-sm font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                      <span className="text-purple-300 text-xs">m</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/overview" 
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Overview
            </Link>
            <Link 
              href="/books" 
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Books
            </Link>
            <Link 
              href="/timeline" 
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Timeline
            </Link>
            <Link 
              href="/behind-the-scenes" 
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Behind the Scenes
            </Link>
            <Link 
              href="/shop"
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Shop
            </Link>
            {user?.isAdmin && (
              <Link 
                href="/admin" 
                className="text-slate-300 hover:text-red-400 transition-colors font-medium"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Cart Indicator */}
          <Link 
            href="/shop" 
            className="relative glass px-3 py-2 rounded-lg border border-white/10 hover:border-cyan-400/30 transition-all group"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">🛒</span>
              <div className="text-slate-300 group-hover:text-cyan-400">
                <div className="text-sm font-medium">${getCartTotal().toFixed(2)}</div>
                <div className="text-xs">{getCartItemCount()} items</div>
              </div>
            </div>
            {getCartItemCount() > 0 && (
              <div className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                {getCartItemCount()}
              </div>
            )}
          </Link>

          {/* Authentication Section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <>
                {/* User Info */}
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 glass px-3 py-2 rounded-lg border border-white/10 hover:border-cyan-400/30 transition-all group"
                >
                  <span className="text-xl">{user.avatar}</span>
                  <span className="text-slate-300 group-hover:text-cyan-400 font-medium">
                    {user.username}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="neon-button-red px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login/Signup Buttons */}
                <Link 
                  href="/login" 
                  className="glass px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-all font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="neon-button-cyan px-4 py-2 rounded-lg font-medium"
                >
                  Join Universe
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button (placeholder) */}
          <button className="md:hidden glass px-3 py-2 rounded-lg border border-white/10 text-slate-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick User Stats (when logged in) */}
      {isAuthenticated && user && (
        <div className="hidden lg:block border-t border-white/5">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-8 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-cyan-400">📚</span>
                <span className="text-slate-400">Books: {user.progress.booksRead}/{user.progress.totalBooks}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-purple-400">🏆</span>
                <span className="text-slate-400">Achievements: {user.achievements.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-green-400">⏰</span>
                <span className="text-slate-400">Timeline: {user.progress.timelineExplored}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-pink-400">📝</span>
                <span className="text-slate-400">Notes: {user.notes.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
