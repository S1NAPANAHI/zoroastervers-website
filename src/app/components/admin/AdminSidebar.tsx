'use client'
import { BookOpenIcon, DocumentTextIcon, FolderIcon, CollectionIcon, NewspaperIcon, ChartBarIcon } from '@heroicons/react/24/outline'

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'books', name: 'Books', icon: BookOpenIcon },
    { id: 'volumes', name: 'Volumes', icon: CollectionIcon },
    { id: 'sagas', name: 'Sagas', icon: FolderIcon },
    { id: 'arcs', name: 'Arcs', icon: DocumentTextIcon },
    { id: 'issues', name: 'Issues', icon: NewspaperIcon },
  ]

  return (
    <div className="w-64 glass-dark border-r border-white/20 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Admin Panel</h2>
        <p className="text-gray-400 text-sm">Content Management</p>
      </div>
      
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
