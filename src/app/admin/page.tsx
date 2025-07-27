'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalBooks: number;
  totalOrders: number;
  totalRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1248,
    totalBooks: 5,
    totalOrders: 89,
    totalRevenue: 4567.89
  });

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Check if user is admin (you can implement this check in AuthContext)
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="glass-dark p-8 rounded-2xl border border-red-400/30">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-slate-300">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">Welcome back, {user.username}! Manage your ZOROASTER universe.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-dark p-6 rounded-2xl border border-cyan-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-purple-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Books Published</p>
                <p className="text-2xl font-bold text-purple-400">{stats.totalBooks}</p>
              </div>
              <div className="text-3xl">📚</div>
            </div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-green-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-green-400">{stats.totalOrders}</p>
              </div>
              <div className="text-3xl">🛒</div>
            </div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-yellow-400">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Shop Management */}
          <Link href="/admin/shop" className="glass-dark p-8 rounded-2xl border border-white/20 hover:border-cyan-400/30 transition-all group">
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🛍️</div>
              <h3 className="text-xl font-bold text-white mb-3">Shop Management</h3>
              <p className="text-slate-300 mb-4">
                Add, edit, and organize books, volumes, arcs, and individual issues. 
                Update pricing, descriptions, and cover images.
              </p>
              <div className="text-sm text-cyan-400 font-medium">Manage Products →</div>
            </div>
          </Link>

          {/* Timeline Management */}
          <Link href="/admin/timeline" className="glass-dark p-8 rounded-2xl border border-white/20 hover:border-purple-400/30 transition-all group">
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⏰</div>
              <h3 className="text-xl font-bold text-white mb-3">Timeline Management</h3>
              <p className="text-slate-300 mb-4">
                Create and edit historical events, manage branching storylines, 
                and update timeline visualizations.
              </p>
              <div className="text-sm text-purple-400 font-medium">Edit Timeline →</div>
            </div>
          </Link>

          {/* Content Management */}
          <Link href="/admin/content" className="glass-dark p-8 rounded-2xl border border-white/20 hover:border-pink-400/30 transition-all group">
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📝</div>
              <h3 className="text-xl font-bold text-white mb-3">Content Management</h3>
              <p className="text-slate-300 mb-4">
                Update book descriptions, character profiles, world-building details, 
                and overview content.
              </p>
              <div className="text-sm text-pink-400 font-medium">Edit Content →</div>
            </div>
          </Link>

          {/* Media Management */}
          <Link href="/admin/media" className="glass-dark p-8 rounded-2xl border border-white/20 hover:border-green-400/30 transition-all group">
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🖼️</div>
              <h3 className="text-xl font-bold text-white mb-3">Media Management</h3>
              <p className="text-slate-300 mb-4">
                Upload and manage book covers, background images, character art, 
                and other visual assets.
              </p>
              <div className="text-sm text-green-400 font-medium">Manage Media →</div>
            </div>
          </Link>

          {/* User Management */}
          <Link href="/admin/users" className="glass-dark p-8 rounded-2xl border border-white/20 hover:border-yellow-400/30 transition-all group">
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👤</div>
              <h3 className="text-xl font-bold text-white mb-3">User Management</h3>
              <p className="text-slate-300 mb-4">
                View user accounts, manage permissions, track user progress, 
                and handle community moderation.
              </p>
              <div className="text-sm text-yellow-400 font-medium">Manage Users →</div>
            </div>
          </Link>

          {/* Site Settings */}
          <Link href="/admin/settings" className="glass-dark p-8 rounded-2xl border border-white/20 hover:border-orange-400/30 transition-all group">
            <div className="text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
              <h3 className="text-xl font-bold text-white mb-3">Site Settings</h3>
              <p className="text-slate-300 mb-4">
                Configure site-wide settings, update countdown timers, 
                manage announcements, and customize themes.
              </p>
              <div className="text-sm text-orange-400 font-medium">Edit Settings →</div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/shop/add" className="neon-button-cyan px-6 py-3 rounded-lg font-semibold">
              ➕ Add New Book
            </Link>
            <Link href="/admin/timeline/add" className="neon-button-purple px-6 py-3 rounded-lg font-semibold">
              📅 Add Timeline Event
            </Link>
            <Link href="/admin/media/upload" className="neon-button-green px-6 py-3 rounded-lg font-semibold">
              📤 Upload Media
            </Link>
            <Link href="/admin/settings" className="glass px-6 py-3 rounded-lg border border-white/20 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-all font-semibold">
              🔧 Site Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
