'use client';

import Link from 'next/link';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  // Test button to debug clicks
  const handleTestClick = () => {
    console.log('TEST BUTTON CLICKED!');
    alert('Test button works!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Cosmic background with floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/cosmic-bg.jpg')] bg-cover bg-center bg-fixed opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse -top-20 -left-20"></div>
          <div className="absolute w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl animate-pulse top-1/2 -right-10"></div>
          <div className="absolute w-80 h-80 rounded-full bg-pink-500/10 blur-3xl animate-pulse -bottom-20 left-1/2"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pointer-events-auto">
        <div className="container mx-auto px-4">
          {/* DEBUG: Test Button */}
          <div className="text-center mb-8">
            <button 
              onClick={handleTestClick}
              className="neon-button-red px-6 py-3 rounded-lg font-semibold"
              style={{ zIndex: 999999, position: 'relative' }}
            >
              🧪 TEST BUTTON - CLICK ME!
            </button>
          </div>
          
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="mb-6">
              <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-serif drop-shadow-2xl mb-2">
                ZOROASTER
              </h1>
              <p className="text-lg text-slate-400 font-serif-elegant italic tracking-wide">
                by Sina Panahi
              </p>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Dive into an immersive universe where magic meets technology, and every choice shapes destiny.
              Join our community to track your reading journey, unlock achievements, and connect with fellow explorers.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup" className="neon-button-cyan px-8 py-4 rounded-lg text-lg font-semibold">
                  🚀 Join the Universe
                </Link>
                <Link href="/login" className="glass px-8 py-4 rounded-lg border border-white/20 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-all font-semibold">
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="glass-dark p-6 rounded-2xl border border-white/20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome back, {user?.username}! 🎉</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{user?.progress.booksRead}</div>
                    <div className="text-sm text-slate-300">Books Read</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{user?.achievements.length}</div>
                    <div className="text-sm text-slate-300">Achievements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{user?.progress.timelineExplored}%</div>
                    <div className="text-sm text-slate-300">Timeline</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400">{user?.notes.length}</div>
                    <div className="text-sm text-slate-300">Notes</div>
                  </div>
                </div>
                <Link href="/profile" className="neon-button-purple px-6 py-3 rounded-lg font-semibold">
                  View Full Profile
                </Link>
              </div>
            )}
          </section>

          {/* Features Grid */}
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="glass-dark p-8 rounded-2xl border border-white/20 text-center hover:border-gradient-to-r hover:from-cyan-400/30 hover:to-purple-400/30 transition-all group col-span-full lg:col-span-1">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌌</div>
              <h3 className="text-xl font-bold text-white mb-3">Series Overview</h3>
              <p className="text-slate-300 mb-4">Discover the complete universe without spoilers. Your gateway to understanding the world, magic system, and story structure.</p>
              <Link href="/overview" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Explore Universe →</Link>
            </div>
            
            <div className="glass-dark p-8 rounded-2xl border border-white/20 text-center hover:border-cyan-400/30 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📚</div>
              <h3 className="text-xl font-bold text-white mb-3">Track Your Journey</h3>
              <p className="text-slate-300 mb-4">Monitor your reading progress across all books in the series with detailed statistics and achievements.</p>
              <div className="text-sm text-cyan-400">Progress bars • Achievements • Stats</div>
            </div>

            <div className="glass-dark p-8 rounded-2xl border border-white/20 text-center hover:border-purple-400/30 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⏰</div>
              <h3 className="text-xl font-bold text-white mb-3">Explore Timeline</h3>
              <p className="text-slate-300 mb-4">Navigate through key historical events with our interactive branching timeline visualization.</p>
              <Link href="/timeline" className="text-sm text-purple-400 hover:text-purple-300">Explore Timeline →</Link>
            </div>

            <div className="glass-dark p-8 rounded-2xl border border-white/20 text-center hover:border-pink-400/30 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
              <h3 className="text-xl font-bold text-white mb-3">Share Theories</h3>
              <p className="text-slate-300 mb-4">Create and share your theories about plot developments, character arcs, and world-building.</p>
              <div className="text-sm text-pink-400">Notes • Tags • Community</div>
            </div>

            <div className="glass-dark p-8 rounded-2xl border border-white/20 text-center hover:border-green-400/30 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-xl font-bold text-white mb-3">Unlock Achievements</h3>
              <p className="text-slate-300 mb-4">Earn badges and achievements for exploring content, sharing theories, and engaging with the community.</p>
              <div className="text-sm text-green-400">Badges • Rankings • Rewards</div>
            </div>

            <div className="glass-dark p-8 rounded-2xl border border-white/20 text-center hover:border-cyan-400/30 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">❤️</div>
              <h3 className="text-xl font-bold text-white mb-3">Curate Favorites</h3>
              <p className="text-slate-300 mb-4">Bookmark your favorite characters, locations, and timeline events to build your personal collection.</p>
              <div className="text-sm text-cyan-400">Characters • Locations • Events</div>
            </div>

            <div className="glass-dark p-8 rounded-2xl border border-white/20 text-center hover:border-yellow-400/30 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
              <h3 className="text-xl font-bold text-white mb-3">Join Community</h3>
              <p className="text-slate-300 mb-4">Connect with fellow readers, follow other users, and participate in discussions about the universe.</p>
              <div className="text-sm text-yellow-400">Follow • Discuss • Share</div>
            </div>
          </section>

          {/* Call to Action */}
          {!isAuthenticated && (
            <section className="text-center">
              <div className="glass-dark p-8 rounded-2xl border border-white/20 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
                <p className="text-lg text-slate-300 mb-6">
                  Create your account today and unlock the full potential of our worldbuilding universe. 
                  Track your progress, share your theories, and connect with a community of passionate readers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup" className="neon-button-cyan px-8 py-4 rounded-lg text-lg font-semibold">
                    Create Free Account
                  </Link>
                  <Link href="/login" className="glass px-8 py-4 rounded-lg border border-white/20 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-all font-semibold">
                    I Already Have an Account
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
