import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// POST /api/books/choose-route - Choose a story route (Authenticated)
export async function POST(request: NextRequest) {
  try {
    const userOrResponse = await requireAuth(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    const data = await request.json();
    
    // Validate required fields
    if (!data.route_id || !data.item_id || !data.item_type) {
      return NextResponse.json({ 
        error: 'route_id, item_id, and item_type are required' 
      }, { status: 400 });
    }

    // Check if route exists and is available
    const { data: route, error: routeError } = await supabase
      .from('story_routes')
      .select('*')
      .eq('id', data.route_id)
      .eq('item_id', data.item_id)
      .eq('item_type', data.item_type)
      .single();

    if (routeError) {
      console.error('Supabase error:', routeError);
      return NextResponse.json({ error: routeError.message }, { status: 500 });
    }

    if (!route) {
      return NextResponse.json({ 
        error: 'Story route not found' 
      }, { status: 404 });
    }

    // Check if user meets unlock conditions
    if (route.requires_previous_completion) {
      // Check if user has completed prerequisites
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userOrResponse.id)
        .eq('item_id', data.item_id)
        .eq('item_type', data.item_type)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        console.error('Error checking progress:', progressError);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      if (!progress || progress.percent_complete < 100) {
        return NextResponse.json({ 
          error: 'You must complete the previous content to unlock this route',
          unlock_hint: route.unlock_hint
        }, { status: 403 });
      }
    }

    // Check additional unlock conditions if they exist
    if (route.unlock_conditions) {
      // This would contain custom logic based on the unlock_conditions JSONB field
      // For now, we'll assume basic conditions are met
      console.log('Checking unlock conditions:', route.unlock_conditions);
    }

    // Create or update user progress for this route
    const now = new Date().toISOString();
    const routeProgressData = {
      user_id: userOrResponse.id,
      item_id: data.item_id,
      item_type: data.item_type,
      percent_complete: 0,
      last_position: `route:${route.route_key}`,
      started_at: now,
      last_accessed: now,
      total_reading_time: 0,
      session_count: 1
    };

    // Check if progress already exists
    const { data: existingProgress, error: checkError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userOrResponse.id)
      .eq('item_id', data.item_id)
      .eq('item_type', data.item_type)
      .single();

    let progressResult;
    if (checkError && checkError.code === 'PGRST116') {
      // Create new progress
      const { data: newProgress, error: createError } = await supabase
        .from('user_progress')
        .insert([routeProgressData])
        .select();

      if (createError) {
        console.error('Error creating progress:', createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      progressResult = newProgress[0];
    } else if (checkError) {
      console.error('Error checking progress:', checkError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } else {
      // Update existing progress
      const { data: updatedProgress, error: updateError } = await supabase
        .from('user_progress')
        .update({
          last_position: `route:${route.route_key}`,
          last_accessed: now,
          session_count: (existingProgress.session_count || 0) + 1
        })
        .eq('user_id', userOrResponse.id)
        .eq('item_id', data.item_id)
        .eq('item_type', data.item_type)
        .select();

      if (updateError) {
        console.error('Error updating progress:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      progressResult = updatedProgress[0];
    }

    return NextResponse.json({
      message: 'Story route chosen successfully',
      route: {
        id: route.id,
        route_key: route.route_key,
        title: route.title,
        description: route.description,
        difficulty_level: route.difficulty_level,
        estimated_duration: route.estimated_duration,
        completion_rewards: route.completion_rewards,
        narrative_impact: route.narrative_impact
      },
      progress: progressResult
    }, { status: 200 });
  } catch (error) {
    console.error('Error choosing route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/books/choose-route - Get available routes for an item
export async function GET(request: NextRequest) {
  try {
    const userOrResponse = await requireAuth(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('item_id');
    const itemType = searchParams.get('item_type');

    if (!itemId || !itemType) {
      return NextResponse.json({ 
        error: 'item_id and item_type are required' 
      }, { status: 400 });
    }

    // Get all routes for the item
    const { data: routes, error } = await supabase
      .from('story_routes')
      .select('*')
      .eq('item_id', itemId)
      .eq('item_type', itemType)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check user's progress to determine which routes are unlocked
    const { data: userProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userOrResponse.id)
      .eq('item_id', itemId)
      .eq('item_type', itemType);

    if (progressError && progressError.code !== 'PGRST116') {
      console.error('Error checking user progress:', progressError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Determine which routes are available
    const availableRoutes = routes.map(route => ({
      ...route,
      is_unlocked: !route.requires_previous_completion || 
                   route.is_default_route || 
                   (userProgress && userProgress.some(p => p.percent_complete >= 100)),
      is_current: userProgress && userProgress.some(p => 
        p.last_position === `route:${route.route_key}`
      )
    }));

    return NextResponse.json(availableRoutes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
