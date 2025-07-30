'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ImageUploaderProps {
  onUpload: (url: string) => void
  avatarUrl?: string
}

export default function ImageUploader({ onUpload, avatarUrl }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('character-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('character-images')
        .getPublicUrl(filePath)

      onUpload(data.publicUrl)
    } catch (error) {
      alert('Error uploading image!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    onUpload('')
  }

  return (
    <div className="space-y-2">
      {avatarUrl ? (
        <div className="relative inline-block">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-24 h-24 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center">
          <PhotoIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      <div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
            className="hidden"
          />
          <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
            {uploading ? 'Uploading...' : 'Choose Image'}
          </span>
        </label>
      </div>
    </div>
  )
}
