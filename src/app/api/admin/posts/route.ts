import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Post } from '@/lib/supabase'
import slugify from '@/utils/slugify'

// GET all posts (admin – includes drafts)
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data as Post[])
}

// POST create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.title)

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert([
        {
          title: body.title,
          slug,
          content: body.content,
          excerpt: body.excerpt || null,
          category: body.category || 'general',
          status: body.status || 'draft',
          tags: body.tags || [],
          featured_image: body.featured_image || null,
        },
      ])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

