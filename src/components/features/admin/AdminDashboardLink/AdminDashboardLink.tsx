'use client';

import React from 'react';
import Link from 'next/link';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useInlineAdminMode } from '@/contexts/InlineAdminModeContext';
import { useAuth } from '../../../../app/contexts/AuthContext';

export default function AdminDashboardLink() {
  const { user } = useAuth();
  const { isInlineAdminMode } = useInlineAdminMode();

  // Only show for admin users when inline admin mode is active
  if (!user?.isAdmin || !isInlineAdminMode) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Link
        href="/admin"
        className="flex items-center gap-2 px-4 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg backdrop-blur-sm border bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
        title="Open Admin Dashboard for bulk operations"
      >
        <Cog6ToothIcon className="w-5 h-5" />
        <span className="text-sm">Bulk Ops</span>
      </Link>
    </div>
  );
}
