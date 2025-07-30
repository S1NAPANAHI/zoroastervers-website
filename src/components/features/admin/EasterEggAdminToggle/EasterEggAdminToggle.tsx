'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface EasterEggAdminToggleProps {
  onToggleInlineMode: (enabled: boolean) => void;
  onToggleAdminMode: (enabled: boolean) => void;
  initialInlineMode?: boolean;
  initialAdminMode?: boolean;
}

export default function EasterEggAdminToggle({ 
  onToggleInlineMode,
  onToggleAdminMode,
  initialInlineMode = false,
  initialAdminMode = false
}: EasterEggAdminToggleProps) {
  const [inlineModeEnabled, setInlineModeEnabled] = useState(initialInlineMode);
  const [adminModeEnabled, setAdminModeEnabled] = useState(initialAdminMode);

  useEffect(() => {
    // Load settings from localStorage
    const savedInlineMode = localStorage.getItem('easterEggInlineMode') === 'true';
    const savedAdminMode = localStorage.getItem('easterEggAdminMode') === 'true';
    
    setInlineModeEnabled(savedInlineMode);
    setAdminModeEnabled(savedAdminMode);
    
    onToggleInlineMode(savedInlineMode);
    onToggleAdminMode(savedAdminMode);
  }, [onToggleInlineMode, onToggleAdminMode]);

  const handleInlineModeToggle = () => {
    const newValue = !inlineModeEnabled;
    setInlineModeEnabled(newValue);
    localStorage.setItem('easterEggInlineMode', newValue.toString());
    onToggleInlineMode(newValue);
  };

  const handleAdminModeToggle = () => {
    const newValue = !adminModeEnabled;
    setAdminModeEnabled(newValue);
    localStorage.setItem('easterEggAdminMode', newValue.toString());
    onToggleAdminMode(newValue);
  };

  return (
    <div className="glass-dark p-4 rounded-lg border border-white/20">
      <h3 className="text-lg font-bold text-white mb-4">🥚 Easter Egg Controls</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Inline Mode</label>
            <p className="text-slate-400 text-sm">Show eggs on all content types</p>
          </div>
          <button
            onClick={handleInlineModeToggle}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-all
              ${inlineModeEnabled 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gray-700 text-gray-400 border border-gray-600'
              }
            `}
          >
            {inlineModeEnabled ? (
              <>
                <EyeIcon className="w-4 h-4" />
                Enabled
              </>
            ) : (
              <>
                <EyeSlashIcon className="w-4 h-4" />
                Disabled
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Admin Visibility</label>
            <p className="text-slate-400 text-sm">Make eggs more visible (opacity 50%)</p>
          </div>
          <button
            onClick={handleAdminModeToggle}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-all
              ${adminModeEnabled 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'bg-gray-700 text-gray-400 border border-gray-600'
              }
            `}
          >
            {adminModeEnabled ? (
              <>
                <EyeIcon className="w-4 h-4" />
                Visible
              </>
            ) : (
              <>
                <EyeSlashIcon className="w-4 h-4" />
                Hidden
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-400 text-sm">
          <strong>Note:</strong> Easter eggs have 20% opacity by default. Admin mode increases this to 50% for easier testing.
        </p>
      </div>
    </div>
  );
}
