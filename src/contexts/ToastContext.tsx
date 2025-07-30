'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  const className = "w-5 h-5";
  
  switch (type) {
    case 'success':
      return <CheckCircleIcon className={`${className} text-green-400`} />;
    case 'error':
      return <XCircleIcon className={`${className} text-red-400`} />;
    case 'warning':
      return <ExclamationTriangleIcon className={`${className} text-yellow-400`} />;
    case 'info':
      return <InformationCircleIcon className={`${className} text-blue-400`} />;
  }
};

const ToastComponent = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const bgColorMap = {
    success: 'bg-green-500/20 border-green-500/30',
    error: 'bg-red-500/20 border-red-500/30',
    warning: 'bg-yellow-500/20 border-yellow-500/30',
    info: 'bg-blue-500/20 border-blue-500/30'
  };

  const textColorMap = {
    success: 'text-green-100',
    error: 'text-red-100',
    warning: 'text-yellow-100',
    info: 'text-blue-100'
  };

  return (
    <div className={`
      max-w-sm w-full glass-dark rounded-lg border p-4 shadow-lg transform transition-all duration-300 ease-in-out
      ${bgColorMap[toast.type]}
    `}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ToastIcon type={toast.type} />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textColorMap[toast.type]}`}>
            {toast.title}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {toast.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => onRemove(toast.id)}
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const showError = useCallback((title: string, message: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const showWarning = useCallback((title: string, message: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
