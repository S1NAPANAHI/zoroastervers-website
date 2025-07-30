'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface DragDropContextValue {
  draggedItem: any;
  isDragging: boolean;
  dragOverTarget: string | null;
  startDrag: (item: any) => void;
  endDrag: () => void;
  setDragOverTarget: (target: string | null) => void;
}

const DragDropContext = createContext<DragDropContextValue | null>(null);

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}

interface DragDropProviderProps {
  children: React.ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  const startDrag = useCallback((item: any) => {
    setDraggedItem(item);
    setIsDragging(true);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedItem(null);
    setIsDragging(false);
    setDragOverTarget(null);
  }, []);

  const value: DragDropContextValue = {
    draggedItem,
    isDragging,
    dragOverTarget,
    startDrag,
    endDrag,
    setDragOverTarget,
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
}

interface DraggableProps {
  item: any;
  children: React.ReactNode;
  className?: string;
  onDragStart?: (item: any) => void;
  onDragEnd?: () => void;
}

export function Draggable({ item, children, className = '', onDragStart, onDragEnd }: DraggableProps) {
  const { startDrag, endDrag, isDragging, draggedItem } = useDragDrop();
  const isCurrentlyDragging = isDragging && draggedItem === item;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    startDrag(item);
    onDragStart?.(item);
  };

  const handleDragEnd = () => {
    endDrag();
    onDragEnd?.();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        draggable-item
        ${isCurrentlyDragging ? 'dragging' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface DropZoneProps {
  onDrop: (item: any, dropTarget: string) => void;
  dropTarget: string;
  children: React.ReactNode;
  className?: string;
  acceptTypes?: string[];
}

export function DropZone({ onDrop, dropTarget, children, className = '', acceptTypes = [] }: DropZoneProps) {
  const { dragOverTarget, setDragOverTarget, draggedItem, endDrag } = useDragDrop();
  const isOver = dragOverTarget === dropTarget;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget(dropTarget);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to null if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom
    ) {
      setDragOverTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = e.dataTransfer.getData('application/json');
      const item = data ? JSON.parse(data) : draggedItem;
      
      if (item) {
        onDrop(item, dropTarget);
        
        // Add drop animation to the drop zone
        const element = e.currentTarget as HTMLElement;
        element.classList.add('drop-animation');
        setTimeout(() => {
          element.classList.remove('drop-animation');
        }, 500);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }

    setDragOverTarget(null);
    endDrag();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        drop-zone
        ${isOver ? 'drag-over' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
