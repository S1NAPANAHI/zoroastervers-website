'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const AddTimelineEvent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    year: '',
    category: 'magical',
    importance: 'medium',
    connections: '',
    characters: '',
    locations: '',
    image: '',
    tags: '',
    spoilerLevel: 'none',
    isPublished: false
  });

  // Check if user is admin
  React.useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push('/admin');
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert string arrays to arrays
      const processedData = {
        ...formData,
        connections: formData.connections.split(',').map(s => s.trim()).filter(s => s),
        characters: formData.characters.split(',').map(s => s.trim()).filter(s => s),
        locations: formData.locations.split(',').map(s => s.trim()).filter(s => s),
        tags: formData.tags.split(',').map(s => s.trim()).filter(s => s),
        year: parseInt(formData.year)
      };

      const response = await fetch('/api/admin/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Timeline event created successfully!');
        router.push('/admin/timeline');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating timeline event:', error);
      alert('Failed to create timeline event');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user?.isAdmin) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white">Access Denied</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Add New Timeline Event</h1>

          <form onSubmit={handleSubmit} className="glass-dark p-8 rounded-2xl border border-white/20">
            <div className="mb-6">
              <label htmlFor="title" className="block text-white text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="Enter event title"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-white text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors resize-vertical"
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="year" className="block text-white text-sm font-medium mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Enter year"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-white text-sm font-medium mb-2">
                  Date Display
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="e.g., Year 847 of the Dawn Age"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="category" className="block text-white text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                >
                  <option value="magical">Magical</option>
                  <option value="political">Political</option>
                  <option value="technological">Technological</option>
                  <option value="cultural">Cultural</option>
                  <option value="catastrophic">Catastrophic</option>
                </select>
              </div>

              <div>
                <label htmlFor="importance" className="block text-white text-sm font-medium mb-2">
                  Importance
                </label>
                <select
                  id="importance"
                  name="importance"
                  value={formData.importance}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="image" className="block text-white text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="connections" className="block text-white text-sm font-medium mb-2">
                Connected Events (comma-separated IDs)
              </label>
              <input
                type="text"
                id="connections"
                name="connections"
                value={formData.connections}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="dawn-age, crystal-catastrophe"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="characters" className="block text-white text-sm font-medium mb-2">
                  Characters (comma-separated)
                </label>
                <input
                  type="text"
                  id="characters"
                  name="characters"
                  value={formData.characters}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Character 1, Character 2"
                />
              </div>

              <div>
                <label htmlFor="locations" className="block text-white text-sm font-medium mb-2">
                  Locations (comma-separated)
                </label>
                <input
                  type="text"
                  id="locations"
                  name="locations"
                  value={formData.locations}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Location 1, Location 2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="tags" className="block text-white text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="magic, war, transformation"
                />
              </div>

              <div>
                <label htmlFor="spoilerLevel" className="block text-white text-sm font-medium mb-2">
                  Spoiler Level
                </label>
                <select
                  id="spoilerLevel"
                  name="spoilerLevel"
                  value={formData.spoilerLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                >
                  <option value="none">None</option>
                  <option value="minimal">Minimal</option>
                  <option value="moderate">Moderate</option>
                  <option value="major">Major</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border border-white/20 bg-slate-800/50 text-cyan-400 focus:ring-cyan-400"
                />
                <span className="text-white text-sm font-medium">Publish immediately</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="neon-button-cyan px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/timeline')}
                className="glass px-8 py-3 rounded-lg border border-white/20 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTimelineEvent;
