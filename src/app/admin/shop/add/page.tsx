'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const AddShopItem: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'book',
    coverImage: '',
    status: 'draft',
    releaseDate: ''
  });

  // Check if user is admin
  React.useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push('/admin');
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Shop item created successfully!');
        router.push('/admin/shop');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating shop item:', error);
      alert('Failed to create shop item');
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
          <h1 className="text-3xl font-bold text-white mb-8">Add New Shop Item</h1>

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
                placeholder="Enter item title"
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
                placeholder="Enter item description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="price" className="block text-white text-sm font-medium mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-white text-sm font-medium mb-2">
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                >
                  <option value="book">Book</option>
                  <option value="volume">Volume</option>
                  <option value="arc">Arc</option>
                  <option value="issue">Issue</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="coverImage" className="block text-white text-sm font-medium mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="https://example.com/cover.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="status" className="block text-white text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label htmlFor="releaseDate" className="block text-white text-sm font-medium mb-2">
                  Release Date
                </label>
                <input
                  type="date"
                  id="releaseDate"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/20 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="neon-button-cyan px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Item'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/shop')}
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

export default AddShopItem;
