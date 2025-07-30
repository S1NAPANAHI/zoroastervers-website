'use client';

import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon as GripVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useInlineAdminMode } from '@/app/contexts/InlineAdminModeContext';
import { useToast } from '@/app/contexts/ToastContext';
import { InlineEditableField } from '../InlineEditableField';
import { mutate } from 'swr';

interface SortableItem {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  [key: string]: any;
}

interface SortableItemComponentProps {
  item: SortableItem;
  apiEndpoint: string;
  onDelete?: (id: string) => void;
  renderCustomFields?: (item: SortableItem) => React.ReactNode;
  className?: string;
}

function SortableItemComponent({ 
  item, 
  apiEndpoint, 
  onDelete, 
  renderCustomFields,
  className = ''
}: SortableItemComponentProps) {
  const { isInlineAdminMode } = useInlineAdminMode();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} bg-slate-800/50 border border-slate-600 rounded-lg p-4 ${
        isInlineAdminMode ? 'hover:ring-2 hover:ring-cyan-400/50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {isInlineAdminMode && (
          <div className="flex flex-col gap-2 mt-1">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-white cursor-move p-1"
              title="Drag to reorder"
            >
              <GripVerticalIcon className="w-5 h-5" />
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="text-red-400 hover:text-red-300 p-1"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <InlineEditableField
            id={item.id}
            value={item.title}
            apiEndpoint={`${apiEndpoint}/${item.id}`}
            fieldName="title"
            className="text-lg font-semibold text-white"
            placeholder="Enter title..."
          />
          
          {item.description !== undefined && (
            <InlineEditableField
              id={item.id}
              value={item.description || ''}
              apiEndpoint={`${apiEndpoint}/${item.id}`}
              fieldName="description"
              className="text-slate-300 text-sm"
              placeholder="Enter description..."
              multiline
            />
          )}
          
          {renderCustomFields && renderCustomFields(item)}
          
          <div className="text-xs text-slate-500">
            Order: {item.order_index}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InlineEditableSortableListProps {
  items: SortableItem[];
  apiEndpoint: string;
  onReorder?: (items: SortableItem[]) => void;
  onDelete?: (id: string) => void;
  renderCustomFields?: (item: SortableItem) => React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export default function InlineEditableSortableList({
  items,
  apiEndpoint,
  onReorder,
  onDelete,
  renderCustomFields,
  className = '',
  itemClassName = ''
}: InlineEditableSortableListProps) {
  const { isInlineAdminMode } = useInlineAdminMode();
  const { showSuccess, showError } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sortedItems, setSortedItems] = useState(items);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setSortedItems(items);
  }, [items]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedItems.findIndex(item => item.id === active.id);
    const newIndex = sortedItems.findIndex(item => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const newItems = arrayMove(sortedItems, oldIndex, newIndex);
    
    // Update order_index for each item based on new position
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order_index: index + 1
    }));

    setSortedItems(updatedItems);

    // Save the new order to the backend
    if (isInlineAdminMode && !isSaving) {
      setIsSaving(true);
      try {
        const updatePromises = updatedItems.map((item, index) => 
          fetch(`${apiEndpoint}/${item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              order_index: index + 1
            })
          })
        );

        await Promise.all(updatePromises);
        
        // Update SWR cache
        mutate(apiEndpoint);
        
        showSuccess('Reordered', 'Items have been reordered successfully');
        
        if (onReorder) {
          onReorder(updatedItems);
        }
      } catch (error) {
        console.error('Error saving new order:', error);
        showError('Reorder Failed', 'Failed to save new order');
        // Revert to original order
        setSortedItems(items);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // Update local state
      setSortedItems(prev => prev.filter(item => item.id !== id));
      
      // Update SWR cache
      mutate(apiEndpoint);
      
      showSuccess('Deleted', 'Item deleted successfully');
      
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showError('Delete Failed', 'Failed to delete item');
    }
  };

  const activeItem = activeId ? sortedItems.find(item => item.id === activeId) : null;

  if (!isInlineAdminMode) {
    // Normal display mode - no drag and drop
    return (
      <div className={`space-y-3 ${className}`}>
        {sortedItems.map(item => (
          <SortableItemComponent
            key={item.id}
            item={item}
            apiEndpoint={apiEndpoint}
            renderCustomFields={renderCustomFields}
            className={itemClassName}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sortedItems.map(item => (
              <SortableItemComponent
                key={item.id}
                item={item}
                apiEndpoint={apiEndpoint}
                onDelete={handleDelete}
                renderCustomFields={renderCustomFields}
                className={itemClassName}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem && (
            <SortableItemComponent
              item={activeItem}
              apiEndpoint={apiEndpoint}
              renderCustomFields={renderCustomFields}
              className={`${itemClassName} shadow-2xl border-cyan-400`}
            />
          )}
        </DragOverlay>
      </DndContext>

      {isSaving && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500/20 border border-blue-500/50 text-blue-400 px-4 py-2 rounded-lg">
          Saving new order...
        </div>
      )}
    </div>
  );
}
