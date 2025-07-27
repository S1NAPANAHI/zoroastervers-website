'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AdminSidebar from '../components/admin/AdminSidebar'
import BookManager from '../components/admin/BookManager'
import VolumeManager from '../components/admin/VolumeManager'
import SagaManager from '../components/admin/SagaManager'
import ArcManager from '../components/admin/ArcManager'
import IssueManager from '../components/admin/IssueManager'
import AdminOverview from '../components/admin/AdminOverview'

interface AdminStats {
  totalUsers: number
  totalBooks: number
  totalOrders: number
  totalRevenue: number
}

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1248,
    totalBooks: 5,
    totalOrders: 89,
    totalRevenue: 4567.89
  })

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
      <div className="flex pt-24">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-400">Manage your ZOROASTER universe with full hierarchical control.</p>
          </div>
          
          {activeTab === 'overview' && <AdminOverview stats={stats} />}
{activeTab === 'books' && <BookManager />}
{activeTab === 'volumes' && <VolumeManager />}
{activeTab === 'sagas' && <SagaManager />}
          {activeTab === 'arcs' && <ArcManager />}
          {activeTab === 'issues' && <IssueManager />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
