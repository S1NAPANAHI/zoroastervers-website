import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function BehindTheScenesPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category || null

  let query = supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)

  const { data: posts } = await query

  const categories = [
    { value: '', label: 'All' },
    { value: 'worldbuilding', label: 'World Building' },
    { value: 'characters', label: 'Characters' },
    { value: 'plot', label: 'Plot' },
    { value: 'writing-process', label: 'Writing Process' },
    { value: 'general', label: 'General' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 text-slate-200 pt-28 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">Behind the Scenes</h1>
        <p className="text-slate-400 mb-8 max-w-2xl">
          Deep-dive notes on world-building, characters, and my writing process.
        </p>

        {/* Category filter */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={{ pathname: '/behind-the-scenes', query: cat.value ? { category: cat.value } : {} }}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                category === cat.value || (!category && !cat.value)
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'border-white/20 hover:border-cyan-400 hover:text-cyan-300'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/behind-the-scenes/${post.slug}`}
                className="glass-dark p-4 rounded-lg border border-white/10 hover:border-cyan-400/30 transition shadow-md flex flex-col"
              >
                {post.featured_image && (
                  <div className="relative w-full h-48 mb-3 rounded overflow-hidden">
                    <Image src={post.featured_image} alt={post.title} fill className="object-cover object-center" />
                  </div>
                )}
                <span className="text-xs uppercase tracking-wide text-cyan-400 mb-1">{post.category}</span>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-slate-400 text-sm flex-grow">{post.excerpt || post.content.slice(0, 120) + '…'}</p>
                <span className="mt-3 text-xs text-slate-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  )
}

