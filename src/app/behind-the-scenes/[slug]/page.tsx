import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Error loading post.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 text-slate-200 pt-28 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <button onClick={() => history.back()} className="text-cyan-400 mb-6 hover:underline">
          ← Back
        </button>

        <span className="text-xs uppercase tracking-wide text-cyan-400 mb-1 block">{post.category}</span>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <span className="text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString()}</span>

        {post.featured_image && (
          <div className="relative w-full h-80 mt-6 mb-8 rounded overflow-hidden">
            <Image src={post.featured_image} alt={post.title} fill className="object-cover object-center" />
    </div>
        )}

        <ReactMarkdown className="prose prose-invert max-w-none">
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

