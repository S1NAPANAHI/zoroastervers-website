import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'

// GET /api/admin/volumes/[id] - Get specific volume
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: volume, error } = await adminClient
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
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!volume) {
      return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
    }

    return NextResponse.json(volume)
  } catch (error) {
    console.error('Error fetching volume:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/volumes/[id] - Update specific volume
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { book_id, title, description, price, order_index, status, physical_available, digital_bundle } = body

    // Check if volume exists
    const { data: existingVolume, error: checkError } = await adminClient
      .from('volumes')
      .select('*')
      .eq('id', params.id)
      .single()

    if (checkError || !existingVolume) {
      return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
    }

    // If updating book_id, check if the new book exists
    if (book_id && book_id !== existingVolume.book_id) {
      const { data: book, error: bookError } = await adminClient
        .from('books')
        .select('id')
        .eq('id', book_id)
        .single()

      if (bookError || !book) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
      }
    }

    // If updating order_index, check for duplicates within the same book
    if (order_index && (order_index !== existingVolume.order_index || (book_id && book_id !== existingVolume.book_id))) {
      const checkBookId = book_id || existingVolume.book_id
      
      const { data: duplicateVolume, error: duplicateError } = await adminClient
        .from('volumes')
        .select('id')
        .eq('book_id', checkBookId)
        .eq('order_index', order_index)
        .neq('id', params.id)
        .single()

      if (duplicateError && duplicateError.code !== 'PGRST116') {
        console.error('Error checking duplicate order_index:', duplicateError)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }

      if (duplicateVolume) {
        return NextResponse.json({ error: 'Order index already exists for this book' }, { status: 409 })
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (book_id !== undefined) updateData.book_id = book_id
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description || null
    if (price !== undefined) updateData.price = price || null
    if (order_index !== undefined) updateData.order_index = order_index
    if (status !== undefined) updateData.status = status
    if (physical_available !== undefined) updateData.physical_available = physical_available
    if (digital_bundle !== undefined) updateData.digital_bundle = digital_bundle

    const { data: volume, error } = await adminClient
      .from('volumes')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(volume)
  } catch (error) {
    console.error('Error updating volume:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/volumes/[id] - Delete specific volume
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if volume exists
    const { data: existingVolume, error: checkError } = await adminClient
      .from('volumes')
      .select('id')
      .eq('id', params.id)
      .single()

    if (checkError || !existingVolume) {
      return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
    }

    // Delete the volume (this will cascade delete sagas, arcs, and issues due to foreign key constraints)
    const { error } = await adminClient
      .from('volumes')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Volume deleted successfully' })
  } catch (error) {
    console.error('Error deleting volume:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
