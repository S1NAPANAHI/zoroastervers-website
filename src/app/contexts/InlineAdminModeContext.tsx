'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface EditingData {
  [fieldId: string]: {
    [fieldName: string]: any;
  };
}

interface InlineAdminModeContextType {
  isInlineAdminMode: boolean;
  setIsInlineAdminMode: (enabled: boolean) => void;
  isEditing: string | null;
  setIsEditing: (fieldId: string | null) => void;
  editingData: EditingData;
  setEditingData: (fieldId: string, data: { [fieldName: string]: any }) => void;
  clearEditingData: (fieldId: string) => void;
  clearAllEditingData: () => void;
}

const InlineAdminModeContext = createContext<InlineAdminModeContextType | undefined>(undefined);

interface InlineAdminModeProviderProps {
  children: React.ReactNode;
}

export function InlineAdminModeProvider({ children }: InlineAdminModeProviderProps) {
  const [isInlineAdminMode, setIsInlineAdminMode] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingData, setEditingDataState] = useState<EditingData>({});

  const setEditingData = useCallback((fieldId: string, data: { [fieldName: string]: any }) => {
    setEditingDataState(prev => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], ...data }
    }));
  }, []);

  const clearEditingData = useCallback((fieldId: string) => {
    setEditingDataState(prev => {
      const newData = { ...prev };
      delete newData[fieldId];
      return newData;
    });
  }, []);

  const clearAllEditingData = useCallback(() => {
    setEditingDataState({});
  }, []);

  return (
    <InlineAdminModeContext.Provider
      value={{
        isInlineAdminMode,
        setIsInlineAdminMode,
        isEditing,
        setIsEditing,
        editingData,
        setEditingData,
        clearEditingData,
        clearAllEditingData,
      }}
    >
      {children}
    </InlineAdminModeContext.Provider>
  );
}

export function useInlineAdminMode() {
  const context = useContext(InlineAdminModeContext);
  if (context === undefined) {
    // During SSG or if no provider is available, return default values
    // This prevents errors during static generation
    return {
      isInlineAdminMode: false,
      setIsInlineAdminMode: () => {},
      isEditing: null,
      setIsEditing: () => {},
      editingData: {},
      setEditingData: () => {},
      clearEditingData: () => {},
      clearAllEditingData: () => {},
    };
  }
  return context;
}
