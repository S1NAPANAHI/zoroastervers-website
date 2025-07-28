import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/supabaseAdmin'
import { CharacterRelationship } from '@/lib/supabase'

// GET /api/characters/relationships - List all character relationships
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const characterId = searchParams.get('character_id')
    const relationshipType = searchParams.get('type')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = adminDb
      .from('character_relationships')
      .select(`
        *,
        character:characters!character_id (
          id,
          name,
          avatar_url
        ),
        related_character:characters!related_character_id (
          id,
          name,
          avatar_url
        )
      `)

    // Apply filters
    if (characterId) {
      query = query.or(`character_id.eq.${characterId},related_character_id.eq.${characterId}`)
    }

    if (relationshipType) {
      query = query.eq('relationship_type', relationshipType)
    }

    if (status) {
      query = query.eq('status', status)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    query = query.order('created_at', { ascending: false })

    const { data: relationships, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: relationships,
      pagination: {
        offset,
        limit,
        total: count || 0
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/characters/relationships - Create a new character relationship
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.character_id || !data.related_character_id || !data.relationship_type) {
      return NextResponse.json({
        error: 'character_id, related_character_id, and relationship_type are required'
      }, { status: 400 })
    }

    // Prevent self-relationships
    if (data.character_id === data.related_character_id) {
      return NextResponse.json({
        error: 'A character cannot have a relationship with themselves'
      }, { status: 400 })
    }

    const relationshipData = {
      character_id: data.character_id,
      related_character_id: data.related_character_id,
      relationship_type: data.relationship_type,
      relationship_subtype: data.relationship_subtype || null,
      description: data.description || null,
      strength: data.strength || 5,
      is_mutual: data.is_mutual || false,
      status: data.status || 'active',
      started_at: data.started_at || null,
      ended_at: data.ended_at || null,
      context: data.context || null,
      created_by: data.created_by || null,
      updated_by: data.updated_by || null
    }

    const { data: newRelationship, error } = await adminDb
      .from('character_relationships')
      .insert([relationshipData])
      .select(`
        *,
        character:characters!character_id (
          id,
          name,
          avatar_url
        ),
        related_character:characters!related_character_id (
          id,
          name,
          avatar_url
        )
      `)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If the relationship is mutual, create the reverse relationship
    if (data.is_mutual) {
      const reverseRelationshipData = {
        character_id: data.related_character_id,
        related_character_id: data.character_id,
        relationship_type: data.relationship_type,
        relationship_subtype: data.relationship_subtype || null,
        description: data.description || null,
        strength: data.strength || 5,
        is_mutual: true,
        status: data.status || 'active',
        started_at: data.started_at || null,
        ended_at: data.ended_at || null,
        context: data.context || null,
        created_by: data.created_by || null,
        updated_by: data.updated_by || null
      }

      await adminDb
        .from('character_relationships')
        .insert([reverseRelationshipData])
    }

    return NextResponse.json(newRelationship[0], { status: 201 })
  } catch (error) {
    console.error('Error creating relationship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
