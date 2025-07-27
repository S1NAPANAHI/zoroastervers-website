import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if user is admin (simplified check - you may want to implement proper auth)
    const { data: issues, error } = await supabaseAdmin
      .from('issues')
      .select(`
        *,
        arcs (
          id,
          title,
          sagas (
            id,
            title,
            volumes (
              id,
              title,
              books (
                id,
                title
              )
            )
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(issues)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const { data: newIssue, error } = await supabaseAdmin
      .from('issues')
      .insert([{
        title: data.title,
        description: data.description,
        price: data.price,
        arc_id: data.arc_id,
        word_count: data.word_count || 40000,
        status: data.status || 'draft',
        release_date: data.release_date,
        cover_image: data.cover_image,
        tags: data.tags || [],
        order_index: data.order_index || 0
      }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newIssue[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
