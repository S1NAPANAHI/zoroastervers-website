import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const bookId = parseInt(params.id)

    const { data: updatedBook, error } = await supabaseAdmin
      .from('books')
      .update({
        title: data.title,
        description: data.description,
        price: data.price,
        cover_image: data.cover_image,
        status: data.status,
        total_word_count: data.total_word_count,
        is_complete: data.is_complete,
        physical_edition: data.physical_edition,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookId)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!updatedBook || updatedBook.length === 0) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json(updatedBook[0])
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const bookId = parseInt(params.id)

    const { error } = await supabaseAdmin
      .from('books')
      .delete()
      .eq('id', bookId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
