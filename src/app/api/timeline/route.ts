import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: timelineEvents, error } = await supabase
      .from('timeline_events')
      .select('*')
      .order('date')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(timelineEvents)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timeline events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: timelineEvent, error } = await supabase
      .from('timeline_events')
      .insert([{
        title: body.title,
        date: body.date,
        category: body.category,
        description: body.description,
        details: body.details,
        book_reference: body.book_reference
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(timelineEvent, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create timeline event' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const { data: timelineEvent, error } = await supabase
      .from('timeline_events')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(timelineEvent)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update timeline event' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('timeline_events')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Timeline event deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete timeline event' }, { status: 500 })
  }
}
