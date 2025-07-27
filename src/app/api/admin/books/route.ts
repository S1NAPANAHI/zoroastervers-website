import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: books, error } = await supabaseAdmin
      .from('books')
      .select(`
        *,
        volumes (
          id,
          title,
          status,
          sagas (
            id,
            title,
            status,
            arcs (
              id,
              title,
              status,
              issues (
                id,
                title,
                status
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

    return NextResponse.json(books)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const { data: newBook, error } = await supabaseAdmin
      .from('books')
      .insert([{
        title: data.title,
        description: data.description,
        price: data.price,
        cover_image: data.cover_image,
        status: data.status || 'draft',
        total_word_count: data.total_word_count || 0,
        is_complete: data.is_complete || false,
        physical_edition: data.physical_edition || {}
      }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newBook[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
