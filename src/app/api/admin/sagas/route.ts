import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'

// GET /api/admin/sagas - Get all sagas with volume relationships
export async function GET() {
  try {
    const { data: sagas, error } = await adminClient
      .from('sagas')
      .select(`
        *,
        volumes:volume_id (
          id,
          title,
          books:book_id (
            id,
            title
          )
        ),
        arcs (
          id,
          title,
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(sagas)
  } catch (error) {
    console.error('Error fetching sagas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/sagas - Create new saga
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { volume_id, title, description, order_index, status, word_count } = body

    // Validate required fields
    if (!volume_id || !title || !order_index) {
      return NextResponse.json({ error: 'Missing required fields: volume_id, title, order_index' }, { status: 400 })
    }

    // Check if volume exists
    const { data: volume, error: volumeError } = await adminClient
      .from('volumes')
      .select('id')
      .eq('id', volume_id)
      .single()

    if (volumeError || !volume) {
      return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
    }

    // Check for duplicate order_index within the same volume
    const { data: existingSaga, error: checkError } = await adminClient
      .from('sagas')
      .select('id')
      .eq('volume_id', volume_id)
      .eq('order_index', order_index)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking duplicate order_index:', checkError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (existingSaga) {
      return NextResponse.json({ error: 'Order index already exists for this volume' }, { status: 409 })
    }

    const { data: saga, error } = await adminClient
      .from('sagas')
      .insert({
        volume_id,
        title,
        description: description || null,
        order_index,
        status: status || 'draft',
        word_count: word_count || null
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(saga, { status: 201 })
  } catch (error) {
    console.error('Error creating saga:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
