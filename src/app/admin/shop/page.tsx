'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AdminShop: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push('/admin');
      return;
    }

    // Fetch the shop items
    fetch('/api/admin/shop', { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShopItems(data.data);
          setLoading(false);
        }
      })
      .catch(err => console.error('Error fetching shop data:', err));
  }, [isAuthenticated, user, router]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      fetch(`/api/admin/shop?id=${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setShopItems(shopItems.filter(item => item.id !== id));
            alert('Item deleted successfully');
          }
        })
        .catch(err => console.error('Error deleting shop item:', err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-3xl font-bold text-white mb-8">Shop Management</h1>

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <>
            <Link href="/admin/shop/add" className="neon-button-cyan px-4 py-2 rounded-lg font-semibold mb-8 inline-block">
              ➕ Add New Item
            </Link>

            <div className="glass-dark rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold">Title</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Type</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Price</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          No shop items found. Add your first item to get started!
                        </td>
                      </tr>
                    ) : (
                      shopItems.map((item: any) => (
                        <tr key={item.id} className="border-t border-white/10 hover:bg-slate-800/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {item.coverImage && (
                                <img 
                                  src={item.coverImage} 
                                  alt={item.title}
                                  className="w-10 h-10 rounded object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <div className="text-white font-medium">{item.title}</div>
                                <div className="text-slate-400 text-sm">{item.description?.substring(0, 50)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400 capitalize">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">${item.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                              item.status === 'published' ? 'bg-green-500/20 text-green-400' :
                              item.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Link 
                                href={`/admin/shop/edit/${item.id}`}
                                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(item.id)}
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

export default AdminShop;

