import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'

// GET /api/admin/volumes - Get all volumes with book relationships
export async function GET() {
  try {
    const { data: volumes, error } = await adminClient
      .from('volumes')
      .select(`
        *,
        books:book_id (
          id,
          title
        ),
        sagas (
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

    return NextResponse.json(volumes)
  } catch (error) {
    console.error('Error fetching volumes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/volumes - Create new volume
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { book_id, title, description, price, order_index, status, physical_available, digital_bundle } = body

    // Validate required fields
    if (!book_id || !title || !order_index) {
      return NextResponse.json({ error: 'Missing required fields: book_id, title, order_index' }, { status: 400 })
    }

    // Check if book exists
    const { data: book, error: bookError } = await adminClient
      .from('books')
      .select('id')
      .eq('id', book_id)
      .single()

    if (bookError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Check for duplicate order_index within the same book
    const { data: existingVolume, error: checkError } = await adminClient
      .from('volumes')
      .select('id')
      .eq('book_id', book_id)
      .eq('order_index', order_index)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking duplicate order_index:', checkError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (existingVolume) {
      return NextResponse.json({ error: 'Order index already exists for this book' }, { status: 409 })
    }

    const { data: volume, error } = await adminClient
      .from('volumes')
      .insert({
        book_id,
        title,
        description: description || null,
        price: price || null,
        order_index,
        status: status || 'draft',
        physical_available: physical_available || false,
        digital_bundle: digital_bundle || false
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(volume, { status: 201 })
  } catch (error) {
    console.error('Error creating volume:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
