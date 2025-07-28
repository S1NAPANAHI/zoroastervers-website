import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET /api/books - Get hierarchy
export async function GET(request: NextRequest) {
  try {
    const userOrError = await requireAuth(request);
    if (userOrError instanceof Response) return userOrError;

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');

    const query = supabase.from('books').select(`
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
    `);

    if (filter) {
      query.ilike('title', `%${filter}%`);
    }

    const { data: books, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(books);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/books - Create new book (Admin)
export async function POST(request: NextRequest) {
  try {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    const data = await request.json();
    // Validate required fields
    if (!data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data: newBook, error } = await supabase
      .from('books')
      .insert([{
        title: data.title,
        description: data.description || null,
        author: data.author || 'Anonymous',
        price: data.price || 0,
        cover_image_url: data.cover_image_url || null,
        status: data.status || 'draft',
        total_word_count: data.total_word_count || 0,
        is_complete: data.is_complete || false,
        physical_available: data.physical_available || false,
        digital_bundle: data.digital_bundle || false,
        publication_date: data.publication_date || null
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(newBook[0], { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

