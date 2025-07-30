'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../app/contexts/AuthContext';

interface InlineAdminModeContextType {
  isInlineAdminMode: boolean;
  toggleInlineAdminMode: () => void;
  isEditing: string | null;
  setIsEditing: (id: string | null) => void;
  editingData: Record<string, any>;
  setEditingData: (id: string, data: any) => void;
  clearEditingData: (id: string) => void;
}

const InlineAdminModeContext = createContext<InlineAdminModeContextType | undefined>(undefined);

export const useInlineAdminMode = () => {
  const context = useContext(InlineAdminModeContext);
  if (context === undefined) {
    throw new Error('useInlineAdminMode must be used within an InlineAdminModeProvider');
  }
  return context;
};

export const InlineAdminModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isInlineAdminMode, setIsInlineAdminMode] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingData, setEditingDataState] = useState<Record<string, any>>({});

  // Load admin mode state from localStorage
  useEffect(() => {
    if (user?.isAdmin) {
      const savedMode = localStorage.getItem('inlineAdminMode') === 'true';
      setIsInlineAdminMode(savedMode);
    }
  }, [user?.isAdmin]);

  const toggleInlineAdminMode = () => {
    if (!user?.isAdmin) return;
    
    const newMode = !isInlineAdminMode;
    setIsInlineAdminMode(newMode);
    localStorage.setItem('inlineAdminMode', newMode.toString());
    
    // Clear any active editing when toggling mode
    if (!newMode) {
      setIsEditing(null);
      setEditingDataState({});
    }
  };

  const setEditingData = (id: string, data: any) => {
    setEditingDataState(prev => ({
      ...prev,
      [id]: { ...prev[id], ...data }
    }));
  };

  const clearEditingData = (id: string) => {
    setEditingDataState(prev => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  const value: InlineAdminModeContextType = {
    isInlineAdminMode: user?.isAdmin ? isInlineAdminMode : false,
    toggleInlineAdminMode,
    isEditing,
    setIsEditing,
    editingData,
    setEditingData,
    clearEditingData,
  };

  return (
    <InlineAdminModeContext.Provider value={value}>
      {children}
    </InlineAdminModeContext.Provider>
  );
};
