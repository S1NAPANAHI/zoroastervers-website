'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile, addNote, unlockAchievement } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '🧙‍♂️'
  });

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
    isPrivate: false
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-dark p-8 rounded-2xl border border-white/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-6">Please sign in to view your profile.</p>
          <Link href="/login" className="neon-button-cyan px-6 py-3 rounded-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleEditProfile = () => {
    if (isEditing) {
      updateProfile({
        username: editForm.username,
        bio: editForm.bio,
        avatar: editForm.avatar
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      addNote({
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPrivate: newNote.isPrivate
      });
      setNewNote({ title: '', content: '', tags: '', isPrivate: false });
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    if (percentage >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const ProgressBar = ({ label, current, total, color }: { label: string; current: number; total: number; color: string }) => {
    const percentage = Math.round((current / total) * 100);
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-300">{label}</span>
          <span className="text-sm text-slate-400">{current}/{total}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-slate-400 mt-1">{percentage}% Complete</div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '🏠' },
    { id: 'progress', name: 'Progress', icon: '📊' },
    { id: 'favorites', name: 'Favorites', icon: '❤️' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
    { id: 'notes', name: 'Notes', icon: '📝' },
    { id: 'community', name: 'Community', icon: '👥' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen">
      {/* Floating particles for enhanced cosmic effect */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse -top-20 -left-20"></div>
          <div className="absolute w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl animate-pulse top-1/2 -right-10"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="neon-button-purple px-4 py-2 rounded-lg text-sm">
            ← Back to Universe
          </Link>
          <button 
            onClick={handleLogout}
            className="neon-button-red px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        {/* Profile Header */}
        <div className="glass-dark p-6 rounded-2xl border border-white/20 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-6xl">{user.avatar}</div>
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-2xl font-bold"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-slate-300 w-full"
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                    <input
                      type="text"
                      value={editForm.avatar}
                      onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                      className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white w-20"
                      placeholder="🧙‍♂️"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                    <p className="text-slate-300 mb-2">{user.bio || 'A passionate explorer of fictional universes.'}</p>
                    <p className="text-sm text-slate-400">Member since {user.joinDate}</p>
                  </>
                )}
              </div>
            </div>
            <button 
              onClick={handleEditProfile}
              className={`px-4 py-2 rounded-lg text-sm ${isEditing ? 'neon-button-green' : 'neon-button-cyan'}`}
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{user.progress.booksRead}</div>
              <div className="text-sm text-slate-300">Books Read</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{user.achievements.length}</div>
              <div className="text-sm text-slate-300">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">{user.notes.length}</div>
              <div className="text-sm text-slate-300">Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{user.progress.timelineExplored}%</div>
              <div className="text-sm text-slate-300">Timeline Explored</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'neon-button-cyan' 
                  : 'glass border border-white/10 text-slate-300 hover:border-cyan-400/30'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="text-white text-sm">Unlocked "Timeline Master"</p>
                      <p className="text-slate-400 text-xs">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                    <span className="text-2xl">📝</span>
                    <div>
                      <p className="text-white text-sm">Added new theory note</p>
                      <p className="text-slate-400 text-xs">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                    <span className="text-2xl">❤️</span>
                    <div>
                      <p className="text-white text-sm">Favorited "Crystal Catastrophe"</p>
                      <p className="text-slate-400 text-xs">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/timeline" className="neon-button-purple p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">⏰</div>
                    <div className="text-sm">Explore Timeline</div>
                  </Link>
                  <Link href="/books" className="neon-button-cyan p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">📚</div>
                    <div className="text-sm">Browse Books</div>
                  </Link>
                  <button 
                    onClick={() => unlockAchievement('theory-crafter')}
                    className="neon-button-green p-4 rounded-lg text-center"
                  >
                    <div className="text-2xl mb-2">🧠</div>
                    <div className="text-sm">Add Theory</div>
                  </button>
                  <Link href="/" className="neon-button-pink p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">🗺️</div>
                    <div className="text-sm">Universe Map</div>
                  </Link>
                </div>
              </div>

              {/* Favorite Characters Preview */}
              <div className="glass-dark p-6 rounded-2xl border border-white/20 lg:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">Favorite Characters</h3>
                <div className="grid grid-cols-3 gap-4">
                  {user.favorites.characters.map((character, index) => (
                    <div key={index} className="glass p-4 rounded-lg border border-white/10 text-center">
                      <div className="text-3xl mb-2">⭐</div>
                      <p className="text-white font-medium">{character}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Reading Progress</h3>
                <ProgressBar 
                  label="Books Completed" 
                  current={user.progress.booksRead} 
                  total={user.progress.totalBooks}
                  color={getProgressColor((user.progress.booksRead / user.progress.totalBooks) * 100)}
                />
                <ProgressBar 
                  label="Timeline Explored" 
                  current={user.progress.timelineExplored} 
                  total={100}
                  color={getProgressColor(user.progress.timelineExplored)}
                />
                <ProgressBar 
                  label="Characters Discovered" 
                  current={user.progress.charactersDiscovered} 
                  total={50}
                  color={getProgressColor((user.progress.charactersDiscovered / 50) * 100)}
                />
                <ProgressBar 
                  label="Locations Explored" 
                  current={user.progress.locationsExplored} 
                  total={30}
                  color={getProgressColor((user.progress.locationsExplored / 30) * 100)}
                />
              </div>

              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Exploration Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                    <span className="text-slate-300">Universe Completion</span>
                    <span className="text-cyan-400 font-bold">72%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                    <span className="text-slate-300">Theories Created</span>
                    <span className="text-purple-400 font-bold">{user.notes.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                    <span className="text-slate-300">Custom Paths</span>
                    <span className="text-pink-400 font-bold">{user.customPaths.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                    <span className="text-slate-300">Days Active</span>
                    <span className="text-green-400 font-bold">42</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="glass-dark p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Achievements Unlocked</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.achievements.map((achievement) => (
                  <div key={achievement.id} className="glass p-4 rounded-lg border border-white/10">
                    <div className="text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h4 className="text-white font-bold mb-2">{achievement.name}</h4>
                      <p className="text-slate-300 text-sm mb-2">{achievement.description}</p>
                      <p className="text-slate-400 text-xs">Unlocked: {achievement.unlockedAt}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                        achievement.category === 'timeline' ? 'bg-purple-500/20 text-purple-300' :
                        achievement.category === 'exploration' ? 'bg-cyan-500/20 text-cyan-300' :
                        achievement.category === 'community' ? 'bg-green-500/20 text-green-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {achievement.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Add New Note */}
              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Create New Theory</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Theory title..."
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-slate-400"
                  />
                  <textarea
                    placeholder="Share your theory or observations..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Tags (comma separated)..."
                    value={newNote.tags}
                    onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-slate-400"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input
                        type="checkbox"
                        checked={newNote.isPrivate}
                        onChange={(e) => setNewNote({...newNote, isPrivate: e.target.checked})}
                        className="rounded"
                      />
                      <span>Keep private</span>
                    </label>
                    <button onClick={handleAddNote} className="neon-button-cyan px-6 py-2 rounded-lg">
                      Add Theory
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Notes */}
              <div className="grid gap-4">
                {user.notes.map((note) => (
                  <div key={note.id} className="glass-dark p-6 rounded-2xl border border-white/20">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-white font-bold text-lg">{note.title}</h4>
                      <div className="flex items-center space-x-2">
                        {note.isPrivate && <span className="text-yellow-400">🔒</span>}
                        <span className="text-slate-400 text-sm">{note.createdAt}</span>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-3">{note.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="grid gap-6">
              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Favorite Characters</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {user.favorites.characters.map((character, index) => (
                    <div key={index} className="glass p-4 rounded-lg border border-white/10 text-center">
                      <div className="text-3xl mb-2">👤</div>
                      <p className="text-white font-medium">{character}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Favorite Locations</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {user.favorites.locations.map((location, index) => (
                    <div key={index} className="glass p-4 rounded-lg border border-white/10 text-center">
                      <div className="text-3xl mb-2">🏛️</div>
                      <p className="text-white font-medium">{location}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-dark p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Favorite Books</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {user.favorites.books.map((book, index) => (
                    <div key={index} className="glass p-4 rounded-lg border border-white/10 text-center">
                      <div className="text-3xl mb-2">📖</div>
                      <p className="text-white font-medium">{book}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <div className="glass-dark p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Community Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-cyan-400">Contributions</h4>
                  <div className="p-4 bg-black/20 rounded-lg">
                    <p className="text-slate-300 mb-2">Theories Shared: <span className="text-white font-bold">{user.notes.filter(n => !n.isPrivate).length}</span></p>
                    <p className="text-slate-300 mb-2">Community Rank: <span className="text-purple-400 font-bold">Lore Scholar</span></p>
                    <p className="text-slate-300">Reputation: <span className="text-green-400 font-bold">⭐⭐⭐⭐</span></p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-pink-400">Social</h4>
                  <div className="p-4 bg-black/20 rounded-lg">
                    <p className="text-slate-300 mb-2">Following: <span className="text-white font-bold">12</span></p>
                    <p className="text-slate-300 mb-2">Followers: <span className="text-white font-bold">8</span></p>
                    <p className="text-slate-300">Discussion Posts: <span className="text-cyan-400 font-bold">23</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="glass-dark p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <span className="text-slate-300">Theme</span>
                      <select className="bg-black/30 border border-white/20 rounded px-3 py-1 text-white">
                        <option value="dark">Dark Mode</option>
                        <option value="light">Light Mode</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <span className="text-slate-300">Spoiler Level</span>
                      <select className="bg-black/30 border border-white/20 rounded px-3 py-1 text-white">
                        <option value="none">No Spoilers</option>
                        <option value="minimal">Minimal Spoilers</option>
                        <option value="full">Full Content</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <span className="text-slate-300">Email Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={user.preferences.notifications} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Privacy</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <span className="text-slate-300">Profile Visibility</span>
                      <select className="bg-black/30 border border-white/20 rounded px-3 py-1 text-white">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <span className="text-slate-300">Show Reading Progress</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
