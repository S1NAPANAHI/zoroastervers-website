import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { ReviewInsert } from '@/lib/types';
import { validateRequest, validateQuery, ReviewCreateSchema, ReviewQuerySchema, sanitizeHtml } from '@/lib/validation';
import { applyReviewRateLimit, applyGeneralRateLimit } from '@/lib/rateLimit';

// POST /api/books/reviews - Create a new review (Authenticated)
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting first
    const generalRateCheck = await applyGeneralRateLimit(request);
    if (!generalRateCheck.success) {
      return NextResponse.json(
        { error: generalRateCheck.error },
        { 
          status: 429,
          headers: generalRateCheck.headers
        }
      );
    }

    // Authenticate user
    const userOrResponse = await requireAuth(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    // Apply review-specific rate limiting
    const reviewRateCheck = await applyReviewRateLimit(request, userOrResponse.id);
    if (!reviewRateCheck.success) {
      return NextResponse.json(
        { error: reviewRateCheck.error },
        { 
          status: 429,
          headers: reviewRateCheck.headers
        }
      );
    }

    // Validate and sanitize input using Zod
    const validation = await validateRequest(request, ReviewCreateSchema);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error 
      }, { status: 400 });
    }

    const data = validation.data;

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
    // Apply general rate limiting
    const generalRateCheck = await applyGeneralRateLimit(request);
    if (!generalRateCheck.success) {
      return NextResponse.json(
        { error: generalRateCheck.error },
        { 
          status: 429,
          headers: generalRateCheck.headers
        }
      );
    }

    // Note: Reviews are public, so no auth required for reading
    // But we can optionally get user context for personalization
    const user = await requireAuth(request);
    const isAuthenticated = !(user instanceof Response);

    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const queryValidation = validateQuery(searchParams, ReviewQuerySchema);
    if (!queryValidation.success) {
      return NextResponse.json({ 
        error: queryValidation.error 
      }, { status: 400 });
    }

    const { item_id: itemId, item_type: itemType, user_id: userId, limit, offset } = queryValidation.data;

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
