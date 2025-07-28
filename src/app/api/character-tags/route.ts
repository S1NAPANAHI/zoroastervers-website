import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/supabaseAdmin'

// GET /api/character-tags - Get all character tags with optional search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = adminDb
      .from('character_tags')
      .select('*')

    // Apply search filter
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    // Apply category filter
    if (category) {
      query = query.eq('category', category)
    }

    // Apply pagination and ordering
    query = query
      .order('usage_count', { ascending: false })
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1)

    const { data: tags, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: tags,
      pagination: {
        offset,
        limit,
        total: count || 0
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/character-tags - Create a new character tag
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Check if tag already exists
    const { data: existingTag } = await adminDb
      .from('character_tags')
      .select('id')
      .eq('name', data.name.trim())
      .single()

    if (existingTag) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 409 })
    }

    const tagData = {
      name: data.name.trim(),
      description: data.description || null,
      category: data.category || null,
      color: data.color || null,
      icon: data.icon || null,
      is_system_tag: data.is_system_tag || false,
      created_by: data.created_by || null
    }

    const { data: newTag, error } = await adminDb
      .from('character_tags')
      .insert([tagData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newTag[0], { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
