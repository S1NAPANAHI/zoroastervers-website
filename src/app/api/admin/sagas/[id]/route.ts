import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'

// GET /api/admin/sagas/[id] - Get specific saga
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: saga, error } = await adminClient
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
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!saga) {
      return NextResponse.json({ error: 'Saga not found' }, { status: 404 })
    }

    return NextResponse.json(saga)
  } catch (error) {
    console.error('Error fetching saga:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/sagas/[id] - Update specific saga
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { volume_id, title, description, order_index, status, word_count } = body

    // Check if saga exists
    const { data: existingSaga, error: checkError } = await adminClient
      .from('sagas')
      .select('*')
      .eq('id', params.id)
      .single()

    if (checkError || !existingSaga) {
      return NextResponse.json({ error: 'Saga not found' }, { status: 404 })
    }

    // If updating volume_id, check if the new volume exists
    if (volume_id && volume_id !== existingSaga.volume_id) {
      const { data: volume, error: volumeError } = await adminClient
        .from('volumes')
        .select('id')
        .eq('id', volume_id)
        .single()

      if (volumeError || !volume) {
        return NextResponse.json({ error: 'Volume not found' }, { status: 404 })
      }
    }

    // If updating order_index, check for duplicates within the same volume
    if (order_index && (order_index !== existingSaga.order_index || (volume_id && volume_id !== existingSaga.volume_id))) {
      const checkVolumeId = volume_id || existingSaga.volume_id
      
      const { data: duplicateSaga, error: duplicateError } = await adminClient
        .from('sagas')
        .select('id')
        .eq('volume_id', checkVolumeId)
        .eq('order_index', order_index)
        .neq('id', params.id)
        .single()

      if (duplicateError && duplicateError.code !== 'PGRST116') {
        console.error('Error checking duplicate order_index:', duplicateError)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }

      if (duplicateSaga) {
        return NextResponse.json({ error: 'Order index already exists for this volume' }, { status: 409 })
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (volume_id !== undefined) updateData.volume_id = volume_id
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description || null
    if (order_index !== undefined) updateData.order_index = order_index
    if (status !== undefined) updateData.status = status
    if (word_count !== undefined) updateData.word_count = word_count || null

    const { data: saga, error } = await adminClient
      .from('sagas')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(saga)
  } catch (error) {
    console.error('Error updating saga:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/sagas/[id] - Delete specific saga
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if saga exists
    const { data: existingSaga, error: checkError } = await adminClient
      .from('sagas')
      .select('id')
      .eq('id', params.id)
      .single()

    if (checkError || !existingSaga) {
      return NextResponse.json({ error: 'Saga not found' }, { status: 404 })
    }

    // Delete the saga (this will cascade delete arcs and issues due to foreign key constraints)
    const { error } = await adminClient
      .from('sagas')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Saga deleted successfully' })
  } catch (error) {
    console.error('Error deleting saga:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
