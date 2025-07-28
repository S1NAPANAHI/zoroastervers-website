import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/supabaseAdmin'

// POST /api/character-tags/assignments - Assign tags to a character
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.character_id || !data.tag_ids || !Array.isArray(data.tag_ids)) {
      return NextResponse.json({ 
        error: 'character_id and tag_ids array are required' 
      }, { status: 400 })
    }

    // First, remove existing tag assignments for this character
    const { error: deleteError } = await adminDb
      .from('character_tag_assignments')
      .delete()
      .eq('character_id', data.character_id)

    if (deleteError) {
      console.error('Error removing existing tags:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Then, create new tag assignments
    const assignments = data.tag_ids.map((tagId: number) => ({
      character_id: data.character_id,
      tag_id: tagId,
      confidence: data.confidence || 1.0,
      assigned_by: data.assigned_by || 'manual',
      notes: data.notes || null,
      created_by: data.created_by || null
    }))

    if (assignments.length > 0) {
      const { data: newAssignments, error } = await adminDb
        .from('character_tag_assignments')
        .insert(assignments)
        .select(`
          *,
          character_tags (
            id,
            name,
            description,
            category,
            color,
            icon,
            usage_count
          )
        `)

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(newAssignments, { status: 201 })
    }

    return NextResponse.json([], { status: 201 })
  } catch (error) {
    console.error('Error creating tag assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/character-tags/assignments - Get tag assignments for characters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const characterId = searchParams.get('character_id')

    if (!characterId) {
      return NextResponse.json({ error: 'character_id is required' }, { status: 400 })
    }

    const { data: assignments, error } = await adminDb
      .from('character_tag_assignments')
      .select(`
        *,
        character_tags (
          id,
          name,
          description,
          category,
          color,
          icon,
          usage_count
        )
      `)
      .eq('character_id', parseInt(characterId))

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
