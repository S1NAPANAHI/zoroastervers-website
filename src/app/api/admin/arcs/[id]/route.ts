import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase'

// GET /api/admin/arcs/[id] - Get specific arc
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: arc, error } = await adminClient
      .from('arcs')
      .select(`
        *,
        sagas:saga_id (
          id,
          title,
          volumes:volume_id (
            id,
            title,
            books:book_id (
              id,
              title
            )
          )
        ),
        issues (
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

    if (!arc) {
      return NextResponse.json({ error: 'Arc not found' }, { status: 404 })
    }

    return NextResponse.json(arc)
  } catch (error) {
    console.error('Error fetching arc:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/arcs/[id] - Update specific arc
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { saga_id, title, description, order_index, status, word_count } = body

    // Check if arc exists
    const { data: existingArc, error: checkError } = await adminClient
      .from('arcs')
      .select('*')
      .eq('id', params.id)
      .single()

    if (checkError || !existingArc) {
      return NextResponse.json({ error: 'Arc not found' }, { status: 404 })
    }

    // If updating saga_id, check if the new saga exists
    if (saga_id && saga_id !== existingArc.saga_id) {
      const { data: saga, error: sagaError } = await adminClient
        .from('sagas')
        .select('id')
        .eq('id', saga_id)
        .single()

      if (sagaError || !saga) {
        return NextResponse.json({ error: 'Saga not found' }, { status: 404 })
      }
    }

    // If updating order_index, check for duplicates within the same saga
    if (order_index && (order_index !== existingArc.order_index || (saga_id && saga_id !== existingArc.saga_id))) {
      const checkSagaId = saga_id || existingArc.saga_id
      
      const { data: duplicateArc, error: duplicateError } = await adminClient
        .from('arcs')
        .select('id')
        .eq('saga_id', checkSagaId)
        .eq('order_index', order_index)
        .neq('id', params.id)
        .single()

      if (duplicateError && duplicateError.code !== 'PGRST116') {
        console.error('Error checking duplicate order_index:', duplicateError)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }

      if (duplicateArc) {
        return NextResponse.json({ error: 'Order index already exists for this saga' }, { status: 409 })
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (saga_id !== undefined) updateData.saga_id = saga_id
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description || null
    if (order_index !== undefined) updateData.order_index = order_index
    if (status !== undefined) updateData.status = status
    if (word_count !== undefined) updateData.word_count = word_count || null

    const { data: arc, error } = await adminClient
      .from('arcs')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(arc)
  } catch (error) {
    console.error('Error updating arc:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/arcs/[id] - Delete specific arc
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if arc exists
    const { data: existingArc, error: checkError } = await adminClient
      .from('arcs')
      .select('id')
      .eq('id', params.id)
      .single()

    if (checkError || !existingArc) {
      return NextResponse.json({ error: 'Arc not found' }, { status: 404 })
    }

    // Delete the arc (this will cascade delete issues due to foreign key constraints)
    const { error } = await adminClient
      .from('arcs')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Arc deleted successfully' })
  } catch (error) {
    console.error('Error deleting arc:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
