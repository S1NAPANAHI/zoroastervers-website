'use client'
import { BookOpenIcon, DocumentTextIcon, FolderIcon, RectangleStackIcon, NewspaperIcon, ChartBarIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'books', name: 'Books', icon: BookOpenIcon },
    { id: 'volumes', name: 'Volumes', icon: RectangleStackIcon },
    { id: 'sagas', name: 'Sagas', icon: FolderIcon },
    { id: 'arcs', name: 'Arcs', icon: DocumentTextIcon },
    { id: 'issues', name: 'Issues', icon: NewspaperIcon },
    { id: 'characters', name: 'Characters', icon: UserGroupIcon },
    { id: 'easter-eggs', name: 'Easter Eggs', icon: SparklesIcon },
  ]

  return (
    <div className="w-64 glass-dark border-r border-white/20 p-6">
      <div className="mb-8 slide-expand-down">
        <h2 className="text-xl font-bold text-white mb-2">Admin Panel</h2>
        <p className="text-gray-400 text-sm">Content Management</p>
      </div>
      
      <nav className="space-y-2" role="navigation" aria-label="Admin navigation">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left smooth-transition btn-keyboard-focus hover-lift scale-expand ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 smooth-transition" />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
