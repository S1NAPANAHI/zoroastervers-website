import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const issueId = parseInt(params.id)

    const { data: updatedIssue, error } = await supabaseAdmin
      .from('issues')
      .update({
        title: data.title,
        description: data.description,
        price: data.price,
        arc_id: data.arc_id,
        word_count: data.word_count,
        status: data.status,
        release_date: data.release_date,
        cover_image: data.cover_image,
        tags: data.tags,
        order_index: data.order_index,
        updated_at: new Date().toISOString()
      })
      .eq('id', issueId)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!updatedIssue || updatedIssue.length === 0) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    return NextResponse.json(updatedIssue[0])
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const issueId = parseInt(params.id)

    const { error } = await supabaseAdmin
      .from('issues')
      .delete()
      .eq('id', issueId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Issue deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
