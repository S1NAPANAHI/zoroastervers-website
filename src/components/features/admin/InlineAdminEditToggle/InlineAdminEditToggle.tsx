'use client';

import React from 'react';
import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useInlineAdminMode } from '@/contexts/InlineAdminModeContext';
import { useAuth } from '../../../../app/contexts/AuthContext';

export default function InlineAdminEditToggle() {
  const { user } = useAuth();
  const { isInlineAdminMode, toggleInlineAdminMode } = useInlineAdminMode();

  // Only show for admin users
  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleInlineAdminMode}
        className={`
          flex items-center gap-2 px-4 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg backdrop-blur-sm border
          ${isInlineAdminMode 
            ? 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30' 
            : 'bg-gray-800/80 border-white/20 text-slate-300 hover:bg-gray-700/80'
          }
        `}
        title={isInlineAdminMode ? "Disable inline editing" : "Enable inline editing"}
      >
        {isInlineAdminMode ? (
          <>
            <EyeIcon className="w-5 h-5" />
            <span className="text-sm">✏️ Edit Mode</span>
          </>
        ) : (
          <>
            <PencilIcon className="w-5 h-5" />
            <span className="text-sm">✏️ Edit</span>
          </>
        )}
      </button>
    </div>
  );
}
