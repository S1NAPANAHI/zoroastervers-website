import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET /api/books/[id] - Get specific book with full hierarchy
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userOrResponse = await requireAuth(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    const { data: book, error } = await supabase
      .from('books')
      .select(`
        *,
        volumes (
          *,
          sagas (
            *,
            arcs (
              *,
              issues (
                *
              )
            )
          )
        ),
        reviews (
          *,
          users (
            id,
            email,
            role
          )
        )
      `)
      .eq('id', params.id)
      .single();

    if (error && error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/books/[id] - Update book (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    const data = await request.json();
    const id = params.id;

    // Remove any fields that shouldn't be updated directly
    const { created_at, updated_at, ...updateData } = data;

    const { data: updatedBook, error } = await supabase
      .from('books')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error && error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(updatedBook[0]);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/books/[id] - Delete book (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    const id = params.id;

    // Check if book exists first
    const { data: existingBook, error: checkError } = await supabase
      .from('books')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError && checkError.code === 'PGRST116') {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (checkError) {
      console.error('Supabase error:', checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    // Delete the book (this will cascade delete related items due to foreign key constraints)
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
