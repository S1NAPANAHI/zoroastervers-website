'use client';

import { useState } from 'react';
import EasterEggAdminToggle from '@/components/features/admin/EasterEggAdminToggle';
import BookStore from '@/components/features/shop/BookStore';
import BookNavigator from '@/components/features/shop/BookNavigator';

export default function EasterEggAdminPanel() {
  const [inlineModeEnabled, setInlineModeEnabled] = useState(false);
  const [adminModeEnabled, setAdminModeEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Easter Egg Management</h3>
        <p className="text-slate-400">
          Control easter egg visibility and behavior across the site. Test and manage hidden interactive elements.
        </p>
      </div>

      {/* Admin Controls */}
      <EasterEggAdminToggle
        onToggleInlineMode={setInlineModeEnabled}
        onToggleAdminMode={setAdminModeEnabled}
      />

      {/* Preview Sections */}
      <div className="space-y-8">
        <div>
          <h4 className="text-xl font-bold text-white mb-4">📚 Book Store Preview</h4>
          <p className="text-slate-400 mb-4">
            Preview how easter eggs appear on the book store page:
          </p>
          <BookStore />
        </div>

        <div>
          <h4 className="text-xl font-bold text-white mb-4">📖 Book Navigator Preview</h4>
          <p className="text-slate-400 mb-4">
            Preview how easter eggs appear on the book navigation component:
          </p>
          <BookNavigator />
        </div>
      </div>

      {/* Stats & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-dark p-4 rounded-lg border border-white/20">
          <h4 className="text-lg font-bold text-white mb-2">Total Eggs</h4>
          <p className="text-3xl font-bold text-cyan-400">12</p>
          <p className="text-slate-400 text-sm">Active easter eggs</p>
        </div>
        
        <div className="glass-dark p-4 rounded-lg border border-white/20">
          <h4 className="text-lg font-bold text-white mb-2">Discovery Rate</h4>
          <p className="text-3xl font-bold text-green-400">8.5%</p>
          <p className="text-slate-400 text-sm">Average discovery rate</p>
        </div>

        <div className="glass-dark p-4 rounded-lg border border-white/20">
          <h4 className="text-lg font-bold text-white mb-2">Total Finds</h4>
          <p className="text-3xl font-bold text-purple-400">347</p>
          <p className="text-slate-400 text-sm">Eggs discovered by users</p>
        </div>

        <div className="glass-dark p-4 rounded-lg border border-white/20">
          <h4 className="text-lg font-bold text-white mb-2">Points Awarded</h4>
          <p className="text-3xl font-bold text-yellow-400">12,450</p>
          <p className="text-slate-400 text-sm">Total points given</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="glass-dark p-6 rounded-lg border border-blue-500/20">
        <h4 className="text-lg font-bold text-blue-400 mb-3">🔧 How It Works</h4>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• <strong>Normal Mode:</strong> Easter eggs are nearly invisible (20% opacity) - users must discover them naturally</p>
          <p>• <strong>Admin Mode:</strong> Easter eggs are semi-visible (50% opacity) for testing and demonstration</p>
          <p>• <strong>Inline Mode:</strong> Shows easter eggs on all content types (volumes, sagas, arcs, issues), not just books</p>
          <p>• <strong>Clicking an egg:</strong> Calls /api/easter_eggs/unlock with points/rewards popup</p>
          <p>• <strong>Positioning:</strong> Each egg has random or preset positions across covers and descriptions</p>
        </div>
      </div>
    </div>
  );
}
