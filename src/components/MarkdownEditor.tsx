'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 text-sm rounded flex items-center space-x-1 ${
              !isPreview 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            <PencilIcon className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 text-sm rounded flex items-center space-x-1 ${
              isPreview 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            <EyeIcon className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
        <span className="text-xs text-gray-400">Supports Markdown</span>
      </div>

      {isPreview ? (
        <div className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 min-h-[120px] prose prose-invert max-w-none">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">No content to preview</p>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-orange-400 min-h-[120px] resize-y"
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
