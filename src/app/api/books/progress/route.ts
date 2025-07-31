import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { UserProgressInsert, UserProgressUpdate } from '@/lib/types';
import { validateRequest, validateQuery, UserProgressCreateSchema, UserProgressUpdateSchema, UserProgressQuerySchema } from '@/lib/validations';
import { applyProgressRateLimit, applyGeneralRateLimit } from '@/lib/rateLimit';

// PATCH /api/books/progress - Update user progress (Authenticated)
export async function PATCH(request: NextRequest) {
  try {
    // Apply general rate limiting first
    const generalRateCheck = applyGeneralRateLimit();
    if (!generalRateCheck) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Authenticate user
    const userOrResponse = await requireAuth(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    // Apply progress-specific rate limiting
    const progressRateCheck = applyProgressRateLimit();
    if (!progressRateCheck) {
      return NextResponse.json(
        { error: 'Progress rate limit exceeded' },
        { status: 429 }
      );
    }

    // Get request body and validate basic structure first
    const body = await request.json();
    
    // Validate required fields for progress update
    if (!body.item_id || !body.item_type) {
      return NextResponse.json({ 
        error: 'item_id and item_type are required' 
      }, { status: 400 });
    }

    // Use the body directly for now (validation schemas are placeholders)
    const data = body;

    // Basic validation
    const validTypes = ['book', 'volume', 'saga', 'arc', 'issue'];
    if (!validTypes.includes(data.item_type)) {
      return NextResponse.json({ 
        error: 'Invalid item_type' 
      }, { status: 400 });
    }

    if (data.percent_complete !== undefined && (data.percent_complete < 0 || data.percent_complete > 100)) {
      return NextResponse.json({ 
        error: 'percent_complete must be between 0 and 100' 
      }, { status: 400 });
    }

    // Check if progress record exists
    const { data: existingProgress, error: checkError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userOrResponse.id)
      .eq('item_id', data.item_id)
      .eq('item_type', data.item_type)
      .single();

    const now = new Date().toISOString();

    if (checkError && checkError.code === 'PGRST116') {
      // No existing progress, create new record
      const progressData: UserProgressInsert = {
        user_id: userOrResponse.id,
        item_id: data.item_id,
        item_type: data.item_type,
        percent_complete: data.percent_complete || 0,
        last_position: data.last_position || undefined,
        started_at: data.started_at || now,
        completed_at: (data.percent_complete && data.percent_complete >= 100) ? now : undefined,
        last_accessed: now,
        total_reading_time: data.total_reading_time || 0,
        session_count: 1
      };

      const { data: newProgress, error } = await supabase
        .from('user_progress')
        .insert([progressData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(newProgress[0], { status: 201 });
    } else if (checkError) {
      console.error('Error checking existing progress:', checkError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } else {
      // Update existing progress
      const updateData: UserProgressUpdate = {
        last_accessed: now,
        session_count: (existingProgress.session_count || 0) + 1
      };

      // Update fields if provided
      if (data.percent_complete !== undefined) {
        updateData.percent_complete = data.percent_complete;
        // Mark as completed if 100%
        if (data.percent_complete >= 100 && !existingProgress.completed_at) {
          updateData.completed_at = now;
        }
      }

      if (data.last_position !== undefined) {
        updateData.last_position = data.last_position;
      }

      if (data.total_reading_time !== undefined) {
        updateData.total_reading_time = data.total_reading_time;
      }

      const { data: updatedProgress, error } = await supabase
        .from('user_progress')
        .update(updateData)
        .eq('user_id', userOrResponse.id)
        .eq('item_id', data.item_id)
        .eq('item_type', data.item_type)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(updatedProgress[0]);
    }
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/books/progress - Get user progress
export async function GET(request: NextRequest) {
  try {
    // Apply general rate limiting
    const generalRateCheck = applyGeneralRateLimit();
    if (!generalRateCheck) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Authenticate user
    const userOrResponse = await requireAuth(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const queryValidation = validateQuery(searchParams, UserProgressQuerySchema);
    if (!queryValidation.success) {
      return NextResponse.json({ 
        error: queryValidation.error 
      }, { status: 400 });
    }

    const { item_id: itemId, item_type: itemType, limit, offset } = queryValidation.data;

    let query = supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userOrResponse.id)
      .order('last_accessed', { ascending: false });

    // Apply filters
    if (itemId) {
      query = query.eq('item_id', itemId);
    }
    if (itemType) {
      query = query.eq('item_type', itemType);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: progress, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
