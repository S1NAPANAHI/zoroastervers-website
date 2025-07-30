'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CheckIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useInlineAdminMode } from '../contexts/InlineAdminModeContext';
import { useToast } from '../contexts/ToastContext';
import { mutate } from 'swr';

interface InlineEditableFieldProps {
  id: string;
  value: string;
  apiEndpoint: string;
  fieldName: string;
  type?: 'text' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  onSave?: (value: string) => void;
  validateValue?: (value: string) => string | null; // Returns error message or null
}

export default function InlineEditableField({
  id,
  value,
  apiEndpoint,
  fieldName,
  type = 'text',
  options = [],
  className = '',
  placeholder = '',
  multiline = false,
  onSave,
  validateValue
}: InlineEditableFieldProps) {
  const { isInlineAdminMode, isEditing, setIsEditing, editingData, setEditingData, clearEditingData } = useInlineAdminMode();
  const { showSuccess, showError } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const editRef = useRef<HTMLDivElement | HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  const fieldId = `${id}-${fieldName}`;
  const isCurrentlyEditing = isEditing === fieldId;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isCurrentlyEditing && editRef.current) {
      editRef.current.focus();
      if (editRef.current.tagName === 'DIV') {
        // For contenteditable divs, set cursor to end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(editRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [isCurrentlyEditing]);

  const handleStartEdit = () => {
    if (!isInlineAdminMode) return;
    setIsEditing(fieldId);
    setEditingData(fieldId, { [fieldName]: localValue });
  };

  const handleCancel = () => {
    setLocalValue(value); // Reset to original value
    setIsEditing(null);
    clearEditingData(fieldId);
  };

  const handleSave = async () => {
    if (isSaving) return;

    const newValue = editingData[fieldId]?.[fieldName] || localValue;
    
    // Validate if validator provided
    if (validateValue) {
      const error = validateValue(newValue);
      if (error) {
        showError('Validation Error', error);
        return;
      }
    }

    // Don't save if value hasn't changed
    if (newValue === value) {
      handleCancel();
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [fieldName]: newValue
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${fieldName}`);
      }

      // Update SWR cache
      mutate(apiEndpoint);
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(newValue);
      }

      showSuccess('Saved', `${fieldName} updated successfully`);
      setIsEditing(null);
      clearEditingData(fieldId);
      setLocalValue(newValue);

    } catch (error) {
      console.error('Error saving field:', error);
      showError('Save Failed', `Failed to update ${fieldName}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleContentChange = (newValue: string) => {
    setLocalValue(newValue);
    setEditingData(fieldId, { [fieldName]: newValue });
  };

  // Show admin edit indicator when in admin mode but not editing
  const showEditIndicator = isInlineAdminMode && !isCurrentlyEditing;

  if (!isInlineAdminMode) {
    // Normal display mode
    if (multiline) {
      return (
        <div className={className} dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br>') }} />
      );
    }
    return <span className={className}>{value || placeholder}</span>;
  }

  if (isCurrentlyEditing) {
    return (
      <div className="inline-flex items-center gap-2 group scale-expand">
        {type === 'select' ? (
          <select
            ref={editRef as React.RefObject<HTMLSelectElement>}
            value={localValue}
            onChange={(e) => handleContentChange(e.target.value)}
            className={`${className} admin-input`}
            onKeyDown={handleKeyDown}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : multiline ? (
          <textarea
            ref={editRef as React.RefObject<HTMLTextAreaElement>}
            value={localValue}
            onChange={(e) => handleContentChange(e.target.value)}
            className={`${className} admin-input min-h-[80px] resize-y`}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <input
            ref={editRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={localValue}
            onChange={(e) => handleContentChange(e.target.value)}
            className={`${className} admin-input`}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
          />
        )}
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-1 text-green-400 hover:text-green-300 disabled:opacity-50 btn-keyboard-focus smooth-transition ripple-effect"
            title="Save (Enter)"
            aria-label="Save changes"
          >
            <CheckIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50 btn-keyboard-focus smooth-transition"
            title="Cancel (Escape)"
            aria-label="Cancel changes"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Admin mode, not editing - show with edit indicator
  return (
    <div 
      className={`${className} relative group cursor-pointer inline-block smooth-transition hover-lift`}
      onClick={handleStartEdit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStartEdit();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Edit ${fieldName}: ${value || placeholder}`}
    >
      {multiline ? (
        <div dangerouslySetInnerHTML={{ __html: (value || placeholder).replace(/\n/g, '<br>') }} />
      ) : (
        <span>{value || placeholder}</span>
      )}
      
      {showEditIndicator && (
        <PencilIcon className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-focus:opacity-100 smooth-transition absolute -top-1 -right-1 bg-slate-800 rounded p-0.5 easter-egg-sparkle" />
      )}
    </div>
  );
}
