import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// POST /api/easter_eggs/unlock - Unlock an easter egg (Authenticated)
export async function POST(request: NextRequest) {
  try {
    const userOrResponse = await requireAuth(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    const data = await request.json();
    
    // Validate required fields
    if (!data.egg_id || !data.item_id || !data.item_type) {
      return NextResponse.json({ 
        error: 'egg_id, item_id, and item_type are required' 
      }, { status: 400 });
    }

    // Check if egg exists and is active
    const { data: egg, error: eggError } = await supabase
      .from('easter_eggs')
      .select('*')
      .eq('id', data.egg_id)
      .eq('item_id', data.item_id)
      .eq('item_type', data.item_type)
      .eq('is_active', true)
      .single();

    if (eggError) {
      console.error('Supabase error:', eggError);
      return NextResponse.json({ error: eggError.message }, { status: 500 });
    }

    if (!egg) {
      return NextResponse.json({ 
        error: 'Easter egg not found or not active' 
      }, { status: 404 });
    }

    // Check if user has already discovered this egg
    const { data: existingDiscovery, error: checkError } = await supabase
      .from('user_easter_egg_discoveries')
      .select('*')
      .eq('user_id', userOrResponse.id)
      .eq('easter_egg_id', data.egg_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing discovery:', checkError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (existingDiscovery) {
      return NextResponse.json({ 
        message: 'Easter egg already unlocked',
        success: true,
        alreadyUnlocked: true,
        egg: {
          title: egg.title,
          reward: egg.reward,
          points: egg.reward_data?.points || 0
        }
      });
    }

    // Unlock the egg for the user
    const discoveryData = {
      user_id: userOrResponse.id,
      easter_egg_id: data.egg_id,
      discovered_at: new Date().toISOString(),
      discovery_method: data.discovery_method || 'click',
      hints_used: data.hints_used || 0
    };

    const { data: newDiscovery, error } = await supabase
      .from('user_easter_egg_discoveries')
      .insert([discoveryData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return success response with reward information
    return NextResponse.json({
      message: 'Easter egg unlocked!',
      success: true,
      discovery: newDiscovery[0],
      egg: {
        title: egg.title,
        reward: egg.reward,
        points: egg.reward_data?.points || 0,
        exclusive_art: egg.reward_data?.exclusive_art || null
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error unlocking easter egg:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
