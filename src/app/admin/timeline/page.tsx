'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AdminTimeline: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push('/admin');
      return;
    }

    // Fetch the timeline events
    fetch('/api/admin/timeline', { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTimelineEvents(data.data);
          setLoading(false);
        }
      })
      .catch(err => console.error('Error fetching timeline events:', err));
  }, [isAuthenticated, user, router]);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      fetch(`/api/admin/timeline?id=${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTimelineEvents(timelineEvents.filter(event => event.id !== id));
            alert('Event deleted successfully');
          }
        })
        .catch(err => console.error('Error deleting timeline event:', err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-3xl font-bold text-white mb-8">Timeline Management</h1>

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <>
            <Link href="/admin/timeline/add" className="neon-button-cyan px-4 py-2 rounded-lg font-semibold mb-8 inline-block">
              ➕ Add New Event
            </Link>

            <div className="glass-dark rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold">Event</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Year</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Category</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Importance</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timelineEvents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                          No timeline events found. Add your first event to get started!
                        </td>
                      </tr>
                    ) : (
                      timelineEvents.map((event: any) => (
                        <tr key={event.id} className="border-t border-white/10 hover:bg-slate-800/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {event.image && (
                                <img 
                                  src={event.image} 
                                  alt={event.title}
                                  className="w-10 h-10 rounded object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <div className="text-white font-medium">{event.title}</div>
                                <div className="text-slate-400 text-sm">{event.description?.substring(0, 50)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">{event.year}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                              event.category === 'magical' ? 'bg-purple-500/20 text-purple-400' :
                              event.category === 'political' ? 'bg-blue-500/20 text-blue-400' :
                              event.category === 'technological' ? 'bg-green-500/20 text-green-400' :
                              event.category === 'cultural' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {event.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                              event.importance === 'critical' ? 'bg-red-500/20 text-red-400' :
                              event.importance === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              event.importance === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {event.importance}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              event.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {event.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Link 
                                href={`/admin/timeline/edit/${event.id}`}
                                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTimeline;

