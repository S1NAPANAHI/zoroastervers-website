'use client';

import Link from 'next/link';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Floating particles for enhanced cosmic effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 rounded-full bg-primary-500/10 blur-3xl animate-pulse -top-20 -left-20"></div>
          <div className="absolute w-64 h-64 rounded-full bg-accent-cyan-500/10 blur-3xl animate-pulse top-1/2 -right-10"></div>
          <div className="absolute w-80 h-80 rounded-full bg-accent-purple-500/10 blur-3xl animate-pulse -bottom-20 left-1/2"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-20 pointer-events-auto">
        
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Hero Content */}
              <div className="text-center lg:text-left">
                <div className="mb-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-purple-400 to-accent-cyan-400 font-serif drop-shadow-2xl mb-2">
                    ZOROASTER
                  </h1>
                  <p className="text-lg text-secondary-400 font-serif-elegant italic tracking-wide">
                    by Sina Panahi
                  </p>
                </div>
                <p className="text-lg sm:text-xl text-secondary-300 mb-8 leading-relaxed">
                  Where ancient wisdom meets modern magic.
                  <br />
                  Track your journey through an epic universe.
                </p>
                
                {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/signup" className="neon-button-cyan px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold">
                    🚀 Start Your Journey
                  </Link>
                  <Link href="/login" className="glass px-6 sm:px-8 py-3 sm:py-4 rounded-lg border border-white/20 text-secondary-300 hover:text-primary-400 hover:border-primary-400/30 transition-all font-semibold">
                    Sign In
                  </Link>
                </div>
                ) : (
                  <div className="glass-dark p-6 rounded-2xl border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-4">Welcome back, {user?.username}! 🎉</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-400">{user?.progress.booksRead}</div>
                        <div className="text-sm text-secondary-300">Books Read</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-purple-400">{user?.achievements.length}</div>
                        <div className="text-sm text-secondary-300">Achievements</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-green-400">{user?.progress.timelineExplored}%</div>
                        <div className="text-sm text-secondary-300">Timeline</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-cyan-400">{user?.notes.length}</div>
                        <div className="text-sm text-secondary-300">Notes</div>
                      </div>
                    </div>
                    <Link href="/profile" className="neon-button-purple px-6 py-3 rounded-lg font-semibold">
                      View Full Profile
                    </Link>
                  </div>
                )}
              </div>

              {/* Hero Illustration */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                  {/* Cosmic SVG Illustration */}
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 400 400" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Circle */}
                    <circle 
                      cx="200" 
                      cy="200" 
                      r="180" 
                      fill="url(#cosmic-bg)" 
                      opacity="0.8"
                    />
                    
                    {/* Central Orb */}
                    <circle 
                      cx="200" 
                      cy="200" 
                      r="80" 
                      fill="url(#orb-gradient)" 
                      className="animate-pulse"
                    />
                    
                    {/* Orbital Rings */}
                    <circle 
                      cx="200" 
                      cy="200" 
                      r="120" 
                      stroke="url(#ring-gradient)" 
                      strokeWidth="2" 
                      fill="none" 
                      opacity="0.6"
                      className="animate-spin" 
                      style={{animationDuration: '20s'}}
                    />
                    <circle 
                      cx="200" 
                      cy="200" 
                      r="150" 
                      stroke="url(#ring-gradient-2)" 
                      strokeWidth="1" 
                      fill="none" 
                      opacity="0.4"
                      className="animate-spin" 
                      style={{animationDuration: '30s', animationDirection: 'reverse'}}
                    />
                    
                    {/* Floating Elements */}
                    <circle cx="120" cy="100" r="6" fill="#38bdf8" opacity="0.8" className="animate-pulse" />
                    <circle cx="320" cy="150" r="4" fill="#a855f7" opacity="0.6" className="animate-pulse" />
                    <circle cx="80" cy="280" r="5" fill="#06b6d4" opacity="0.7" className="animate-pulse" />
                    <circle cx="350" cy="320" r="3" fill="#22c55e" opacity="0.5" className="animate-pulse" />
                    
                    {/* Gradients */}
                    <defs>
                      <radialGradient id="cosmic-bg" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#312e81" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#1f2937" stopOpacity="0.2" />
                      </radialGradient>
                      <radialGradient id="orb-gradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </radialGradient>
                      <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="ring-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-secondary-950/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-purple-400 mb-4">
                Explore the Universe
              </h2>
              <p className="text-lg sm:text-xl text-secondary-300 max-w-2xl mx-auto">
                Immerse yourself in an interactive worldbuilding experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/20 text-center hover:border-primary-400/30 transition-all group">
                <div className="text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform">🌌</div>
                <h3 className="text-lg sm:text-xl font-bold text-secondary-50 mb-3">Universe Explorer</h3>
                <p className="text-secondary-300 mb-4">
                  Navigate the complete cosmology without spoilers.
                  Discover worlds, magic systems, and lore.
                </p>
                <Link href="/overview" className="text-sm text-primary-400 hover:text-primary-300 font-medium">
                  Explore Universe →
                </Link>
              </div>
              
              <div className="glass-dark p-6 rounded-2xl border border-white/20 text-center hover:border-accent-purple-400/30 transition-all group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⏰</div>
                <h3 className="text-xl font-bold text-secondary-50 mb-3">Interactive Timeline</h3>
                <p className="text-secondary-300 mb-4">
                  Journey through pivotal moments in history.
                  Witness the rise and fall of civilizations.
                </p>
                <Link href="/timeline" className="text-sm text-accent-purple-400 hover:text-accent-purple-300">
                  Explore Timeline →
                </Link>
              </div>

              <div className="glass-dark p-6 rounded-2xl border border-white/20 text-center hover:border-accent-cyan-400/30 transition-all group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📚</div>
                <h3 className="text-xl font-bold text-secondary-50 mb-3">Reading Companion</h3>
                <p className="text-secondary-300 mb-4">
                  Track progress, unlock achievements.
                  Connect with fellow readers worldwide.
                </p>
                <div className="text-sm text-accent-cyan-400">Progress • Achievements • Community</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-purple-400 to-accent-cyan-400 mb-4">
                Reader Experiences
              </h2>
              <p className="text-xl text-secondary-300">
                Join thousands exploring the Zoroaster universe
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-accent-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div className="ml-3">
                    <div className="text-secondary-50 font-semibold">Sarah Chen</div>
                    <div className="text-secondary-400 text-sm">Fantasy Enthusiast</div>
                  </div>
                </div>
                <p className="text-secondary-300 italic">
                  "The timeline feature is incredible! Finally understanding how everything connects across the series."
                </p>
              </div>
              
              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-green-400 to-accent-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="ml-3">
                    <div className="text-secondary-50 font-semibold">Marcus Rivera</div>
                    <div className="text-secondary-400 text-sm">Book Club Leader</div>
                  </div>
                </div>
                <p className="text-secondary-300 italic">
                  "Perfect for our reading group. The spoiler-free exploration keeps everyone engaged at different stages."
                </p>
              </div>
              
              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-purple-400 to-primary-400 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="ml-3">
                    <div className="text-secondary-50 font-semibold">Aisha Patel</div>
                    <div className="text-secondary-400 text-sm">Worldbuilding Fan</div>
                  </div>
                </div>
                <p className="text-secondary-300 italic">
                  "The depth of detail is amazing. Every character and location feels alive and interconnected."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        {!isAuthenticated && (
          <section className="py-20 px-4 bg-gradient-to-r from-secondary-900/50 to-secondary-800/50">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="glass-dark p-12 rounded-3xl border border-white/20">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-purple-400 mb-6">
                  Begin Your Epic Journey
                </h2>
                <p className="text-xl text-secondary-300 mb-8 leading-relaxed">
                  Join our community of readers and unlock the complete Zoroaster experience.
                  <br />
                  Track progress, share theories, and connect with fellow explorers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup" className="neon-button-cyan px-10 py-4 rounded-lg text-lg font-semibold">
                    Create Free Account
                  </Link>
                  <Link href="/login" className="glass px-10 py-4 rounded-lg border border-white/20 text-secondary-300 hover:text-primary-400 hover:border-primary-400/30 transition-all font-semibold">
                    I Already Have an Account
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
