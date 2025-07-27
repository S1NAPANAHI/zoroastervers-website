'use client'

interface AdminStats {
  totalUsers: number
  totalBooks: number
  totalOrders: number
  totalRevenue: number
}

interface AdminOverviewProps {
  stats: AdminStats
}

export default function AdminOverview({ stats }: AdminOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Quick Actions */}
      <div className="glass-dark p-8 rounded-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="neon-button-cyan p-4 rounded-lg font-semibold text-left">
            <div className="text-2xl mb-2">📖</div>
            <div className="font-bold">Add New Issue</div>
            <div className="text-sm text-cyan-200">Create a new story issue</div>
          </button>
          
          <button className="neon-button-purple p-4 rounded-lg font-semibold text-left">
            <div className="text-2xl mb-2">📅</div>
            <div className="font-bold">Add Timeline Event</div>
            <div className="text-sm text-purple-200">Create historical event</div>
          </button>
          
          <button className="neon-button-green p-4 rounded-lg font-semibold text-left">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-bold">View Analytics</div>
            <div className="text-sm text-green-200">Check performance metrics</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-dark p-8 rounded-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-slate-800/30 rounded-lg">
            <div className="text-2xl">📝</div>
            <div>
              <p className="text-white font-medium">New issue "The Final Confrontation" published</p>
              <p className="text-slate-400 text-sm">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-slate-800/30 rounded-lg">
            <div className="text-2xl">👤</div>
            <div>
              <p className="text-white font-medium">New user registration: john.doe@example.com</p>
              <p className="text-slate-400 text-sm">4 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-slate-800/30 rounded-lg">
            <div className="text-2xl">⏰</div>
            <div>
              <p className="text-white font-medium">Timeline event "The Great War" updated</p>
              <p className="text-slate-400 text-sm">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
