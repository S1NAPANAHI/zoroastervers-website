import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { ReviewInsert } from '@/lib/types';

// POST /api/books/reviews - Create a new review (Authenticated)
export async function POST(request: NextRequest) {
  try {
    const userOrResponse = await requireAuth(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    const data = await request.json();
    
    // Validate required fields
    if (!data.item_id || !data.item_type || !data.rating) {
      return NextResponse.json({ 
        error: 'item_id, item_type, and rating are required' 
      }, { status: 400 });
    }

    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json({ 
        error: 'Rating must be between 1 and 5' 
      }, { status: 400 });
    }

    // Validate item_type
    const validTypes = ['book', 'volume', 'saga', 'arc', 'issue'];
    if (!validTypes.includes(data.item_type)) {
      return NextResponse.json({ 
        error: 'Invalid item_type. Must be one of: ' + validTypes.join(', ') 
      }, { status: 400 });
    }

    // Check if user has already reviewed this item
    const { data: existingReview, error: checkError } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userOrResponse.id)
      .eq('item_id', data.item_id)
      .eq('item_type', data.item_type)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing review:', checkError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (existingReview) {
      return NextResponse.json({ 
        error: 'You have already reviewed this item' 
      }, { status: 409 });
    }

    // Create the review
    const reviewData: ReviewInsert = {
      user_id: userOrResponse.id,
      item_id: data.item_id,
      item_type: data.item_type,
      rating: data.rating,
      comment: data.comment || null,
      is_verified_purchase: data.is_verified_purchase || false,
      is_spoiler: data.is_spoiler || false,
      helpful_count: 0
    };

    const { data: newReview, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select(`
        *,
        users (
          id,
          email,
          role
        )
      `);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/books/reviews - Get reviews with filtering
export async function GET(request: NextRequest) {
  try {
    const userOrResponse = await requireAuth(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('item_id');
    const itemType = searchParams.get('item_type');
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('reviews')
      .select(`
        *,
        users (
          id,
          email,
          role
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (itemId) {
      query = query.eq('item_id', itemId);
    }
    if (itemType) {
      query = query.eq('item_type', itemType);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
