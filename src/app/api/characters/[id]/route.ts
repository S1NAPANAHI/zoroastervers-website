import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/supabaseAdmin'
import { Character } from '@/lib/supabase'

// GET /api/characters/[id] - Get a single character by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const characterId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const includeRelationships = searchParams.get('include_relationships') === 'true'
    const includeAssociations = searchParams.get('include_associations') === 'true'
    const includeTimeline = searchParams.get('include_timeline') === 'true'

    let selectQuery = '*'
    
    if (includeRelationships) {
      selectQuery += `,
        character_relationships!character_id (
          id,
          related_character_id,
          relationship_type,
          relationship_subtype,
          description,
          strength,
          is_mutual,
          status,
          started_at,
          ended_at,
          context,
          created_at,
          updated_at
        ),
        related_relationships:character_relationships!related_character_id (
          id,
          character_id,
          relationship_type,
          relationship_subtype,
          description,
          strength,
          is_mutual,
          status,
          started_at,
          ended_at,
          context,
          created_at,
          updated_at
        )`
    }

    if (includeAssociations) {
      selectQuery += `,
        character_associations (
          id,
          association_type,
          association_name,
          association_description,
          role,
          relationship_nature,
          importance,
          status,
          started_at,
          ended_at,
          notes,
          context,
          created_at,
          updated_at
        )`
    }

    const { data: character, error } = await adminDb
      .from('characters')
      .select(selectQuery)
      .eq('id', characterId)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    // If timeline is requested, fetch appearance timeline data
    let appearanceTimeline = []
    if (includeTimeline) {
      try {
        // This is a mock implementation - in a real app you'd have character_appearances table
        // For now, we'll return mock data based on the hierarchical structure
        const { data: books } = await adminDb
          .from('books')
          .select(`
            id, title,
            volumes (
              id, title, order_index,
              sagas (
                id, title, order_index,
                arcs (
                  id, title, order_index,
                  issues (
                    id, title, order_index
                  )
                )
              )
            )
          `)
          .eq('status', 'published')
          .order('id')

        // Transform hierarchical data into appearance timeline format
        if (books && books.length > 0) {
          books.forEach(book => {
            if (book.volumes) {
              book.volumes.forEach(volume => {
                if (volume.sagas) {
                  volume.sagas.forEach(saga => {
                    if (saga.arcs) {
                      saga.arcs.forEach(arc => {
                        if (arc.issues) {
                          arc.issues.forEach(issue => {
                            appearanceTimeline.push({
                              id: `${book.id}-${volume.id}-${saga.id}-${arc.id}-${issue.id}`,
                              book: book.title,
                              volume: volume.title,
                              saga: saga.title,
                              arc: arc.title,
                              issue: issue.title,
                              order_index: issue.order_index,
                              description: `Character appears in ${issue.title}`,
                              significance: 'Story progression'
                            })
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      } catch (timelineError) {
        console.error('Error fetching timeline:', timelineError)
        // Continue without timeline data
      }
    }

    const response = {
      ...character,
      appearance_timeline: includeTimeline ? appearanceTimeline : undefined
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/characters/[id] - Update a single character
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const characterId = parseInt(params.id)
    const updateData = await request.json()

    // Validate character ID
    if (isNaN(characterId)) {
      return NextResponse.json({ error: 'Invalid character ID' }, { status: 400 })
    }

    // First check if character exists
    const { data: existingCharacter, error: fetchError } = await adminDb
      .from('characters')
      .select('id')
      .eq('id', characterId)
      .single()

    if (fetchError || !existingCharacter) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    // Filter out read-only fields
    const allowedFields = {
      name: updateData.name,
      aliases: updateData.aliases,
      description: updateData.description,
      appearance: updateData.appearance,
      height: updateData.height,
      weight: updateData.weight,
      eye_color: updateData.eye_color,
      hair_color: updateData.hair_color,
      age_range: updateData.age_range,
      personality: updateData.personality,
      skills: updateData.skills,
      abilities: updateData.abilities,
      weaknesses: updateData.weaknesses,
      motivations: updateData.motivations,
      fears: updateData.fears,
      avatar_url: updateData.avatar_url,
      images: updateData.images,
      status: updateData.status,
      importance_level: updateData.importance_level,
      is_main_character: updateData.is_main_character,
      is_antagonist: updateData.is_antagonist,
      is_protagonist: updateData.is_protagonist,
      universe_id: updateData.universe_id,
      series_id: updateData.series_id,
      season_id: updateData.season_id,
      work_id: updateData.work_id,
      first_appearance: updateData.first_appearance,
      creator: updateData.creator,
      voice_actor: updateData.voice_actor,
      tags: updateData.tags,
      updated_by: updateData.updated_by
    }

    // Remove undefined fields
    const filteredUpdateData = Object.fromEntries(
      Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
    )

    // Add updated_at timestamp
    filteredUpdateData.updated_at = new Date().toISOString()

    const { data: updatedCharacter, error } = await adminDb
      .from('characters')
      .update(filteredUpdateData)
      .eq('id', characterId)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!updatedCharacter || updatedCharacter.length === 0) {
      return NextResponse.json({ error: 'Failed to update character' }, { status: 500 })
    }

    return NextResponse.json(updatedCharacter[0])
  } catch (error) {
    console.error('Error updating character:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/characters/[id] - Delete a character by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const characterId = parseInt(params.id);

    const { error } = await adminDb
      .from<Character>('characters')
      .delete()
      .eq('id', characterId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

