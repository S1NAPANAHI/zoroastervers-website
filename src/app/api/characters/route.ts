import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/supabaseAdmin'
import { Character } from '@/lib/supabase'

// GET /api/characters - List characters with query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const importance = searchParams.get('importance') || ''
    const sortBy = searchParams.get('sort') || 'created_at'
    const sortOrder = searchParams.get('order') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const format = searchParams.get('format') || 'json' // json or csv
    const selectedIds = searchParams.get('ids') // specific ids to export, comma-separated

    let query = adminDb
      .from('characters')
      .select(`
        *,
        character_relationships!character_id (
          id,
          related_character_id,
          relationship_type,
          relationship_subtype,
          strength,
          status
        )
      `)

    // Apply specific IDs filter
    if (selectedIds) {
      const idsArray = selectedIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      query = query.in('id', idsArray)
    }

    // Apply search filter
    if (search) {
      query = query.or(`
        name.ilike.%${search}%,
        description.ilike.%${search}%,
        aliases.cs.{"${search}"},
        skills.cs.{"${search}"},
        tags.cs.{"${search}"}
      `)
    }

    // Apply status filter
    if (status) {
      query = query.eq('status', status)
    }

    // Apply importance filter
    if (importance === 'main') {
      query = query.eq('is_main_character', true)
    } else if (importance === 'protagonist') {
      query = query.eq('is_protagonist', true)
    } else if (importance === 'antagonist') {
      query = query.eq('is_antagonist', true)
    } else if (importance && !isNaN(parseInt(importance))) {
      query = query.eq('importance_level', parseInt(importance))
    }

    // Apply sorting
    const ascending = sortOrder.toLowerCase() === 'asc'
    query = query.order(sortBy, { ascending })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: characters, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Handle Export
    if (format === 'csv') {
      const csvData = convertToCSV(characters || [])
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="characters.csv"'
        }
      })
    } else if (format === 'json') {
      return NextResponse.json(characters || [])
    }

    return NextResponse.json({
      data: characters,
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

// POST /api/characters - Create new character or bulk import
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    // Handle bulk import
    if (contentType.includes('text/csv') || contentType.includes('multipart/form-data')) {
      return handleBulkImport(request)
    }

    // Handle single character creation
    const data = await request.json()
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Set default values
    const characterData = {
      name: data.name,
      aliases: data.aliases || [],
      description: data.description || null,
      appearance: data.appearance || null,
      height: data.height || null,
      weight: data.weight || null,
      eye_color: data.eye_color || null,
      hair_color: data.hair_color || null,
      age_range: data.age_range || null,
      personality: data.personality || null,
      skills: data.skills || [],
      abilities: data.abilities || [],
      weaknesses: data.weaknesses || [],
      motivations: data.motivations || null,
      fears: data.fears || null,
      avatar_url: data.avatar_url || null,
      images: data.images || null,
      status: data.status || 'active',
      importance_level: data.importance_level || 5,
      is_main_character: data.is_main_character || false,
      is_antagonist: data.is_antagonist || false,
      is_protagonist: data.is_protagonist || false,
      universe_id: data.universe_id || null,
      series_id: data.series_id || null,
      season_id: data.season_id || null,
      work_id: data.work_id || null,
      first_appearance: data.first_appearance || null,
      creator: data.creator || null,
      voice_actor: data.voice_actor || null,
      tags: data.tags || [],
      created_by: data.created_by || null,
      updated_by: data.updated_by || null
    }

    const { data: newCharacter, error } = await adminDb
      .from('characters')
      .insert([characterData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newCharacter[0], { status: 201 })
  } catch (error) {
    console.error('Error creating character:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to convert characters to CSV
function convertToCSV(characters: Character[]): string {
  if (!characters.length) return ''
  
  const headers = [
    'id', 'name', 'aliases', 'description', 'appearance', 'height', 'weight', 
    'eye_color', 'hair_color', 'age_range', 'personality', 'skills', 'abilities', 
    'weaknesses', 'motivations', 'fears', 'status', 'importance_level',
    'is_main_character', 'is_protagonist', 'is_antagonist', 'first_appearance', 
    'creator', 'voice_actor', 'tags', 'created_at', 'updated_at'
  ]
  
  const csvRows = [headers.join(',')]
  
  characters.forEach(char => {
    const row = headers.map(header => {
      const value = char[header as keyof Character]
      
      if (value === null || value === undefined) {
        return ''
      }
      
      if (Array.isArray(value)) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      }
      
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      }
      
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`
      }
      
      return value.toString()
    })
    csvRows.push(row.join(','))
  })
  
  return csvRows.join('\n')
}

// Helper function to handle bulk import
async function handleBulkImport(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const content = await file.text()
    let characters: any[] = []

    // Parse CSV or JSON
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      characters = parseCSV(content)
    } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
      characters = JSON.parse(content)
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 })
    }

    if (!Array.isArray(characters)) {
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 })
    }

    // Validate and insert characters
    const validCharacters = characters.filter(char => char.name).map(char => ({
      name: char.name,
      description: char.description || null,
      status: char.status || 'active',
      importance_level: parseInt(char.importance_level) || 5,
      is_main_character: Boolean(char.is_main_character),
      is_protagonist: Boolean(char.is_protagonist),
      is_antagonist: Boolean(char.is_antagonist),
      age_range: char.age_range || null,
      height: char.height || null,
      weight: char.weight || null,
      eye_color: char.eye_color || null,
      hair_color: char.hair_color || null,
      first_appearance: char.first_appearance || null,
      creator: char.creator || null,
      voice_actor: char.voice_actor || null
    }))

    const { data, error } = await adminDb
      .from('characters')
      .insert(validCharacters)
      .select()

    if (error) {
      console.error('Bulk import error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: `Successfully imported ${data.length} characters`,
      imported: data.length,
      total: characters.length
    }, { status: 201 })
  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json({ error: 'Bulk import failed' }, { status: 500 })
  }
}

// Helper function to parse CSV
function parseCSV(csv: string): any[] {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
    const obj: any = {}
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || null
    })
    
    data.push(obj)
  }
  
  return data
}

