import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/supabaseAdmin'
import { Character } from '@/lib/supabase'

// POST /api/characters/bulk-import - Import multiple characters with field mapping
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fieldMapping = formData.get('fieldMapping')
    const confirm = formData.get('confirm') === 'true'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const content = await file.text()
    let rawData: any[] = []

    // Parse CSV or JSON
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      rawData = parseCSV(content)
    } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
      const parsed = JSON.parse(content)
      rawData = Array.isArray(parsed) ? parsed : [parsed]
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 })
    }

    if (!Array.isArray(rawData) || !rawData.length) {
      return NextResponse.json({ error: 'Invalid file format or no data found' }, { status: 400 })
    }

    // Apply field mapping if provided
    let mappedData = rawData
    if (fieldMapping) {
      try {
        const mapping = JSON.parse(fieldMapping as string)
        mappedData = applyFieldMapping(rawData, mapping)
      } catch (error) {
        return NextResponse.json({ error: 'Invalid field mapping format' }, { status: 400 })
      }
    }

    // Transform and validate characters
    const validCharacters = mappedData
      .filter(char => char.name && char.name.trim())
      .map(char => transformForDatabase(char))

    if (!validCharacters.length) {
      return NextResponse.json({ error: 'No valid characters found in import data' }, { status: 400 })
    }

    // If not confirmed, return preview instead of importing
    if (!confirm) {
      return NextResponse.json({
        preview: true,
        message: 'Preview of import data',
        totalRows: rawData.length,
        validRows: validCharacters.length,
        invalidRows: rawData.length - validCharacters.length,
        characters: validCharacters.slice(0, 10) // Preview first 10
      })
    }

    // Insert characters into database
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
      total: rawData.length,
      skipped: rawData.length - validCharacters.length
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
    const values = parseCSVLine(lines[i])
    const obj: any = {}
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || null
    })
    
    data.push(obj)
  }
  
  return data
}

// Helper function to parse CSV line (handles quoted values)
function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

// Apply field mapping to raw data
function applyFieldMapping(data: any[], mapping: any): any[] {
  return data.map(row => {
    const mappedRow: any = {}
    
    Object.keys(row).forEach(key => {
      const mappedKey = mapping[key] || key
      mappedRow[mappedKey] = row[key]
    })
    
    return mappedRow
  })
}

// Transform data for database insertion
function transformForDatabase(data: any): any {
  const transformed: any = {
    name: data.name?.trim() || null,
    description: data.description || null,
    height: data.height || null,
    weight: data.weight || null,
    eye_color: data.eye_color || null,
    hair_color: data.hair_color || null,
    age_range: data.age_range || null,
    motivations: data.motivations || null,
    fears: data.fears || null,
    status: data.status || 'active',
    importance_level: parseInt(data.importance_level) || 5,
    is_main_character: parseBoolean(data.is_main_character),
    is_protagonist: parseBoolean(data.is_protagonist),
    is_antagonist: parseBoolean(data.is_antagonist),
    first_appearance: data.first_appearance || null,
    creator: data.creator || null,
    voice_actor: data.voice_actor || null
  }
  
  // Handle array fields
  const arrayFields = ['aliases', 'skills', 'abilities', 'weaknesses', 'tags']
  arrayFields.forEach(field => {
    if (data[field]) {
      if (typeof data[field] === 'string') {
        try {
          transformed[field] = JSON.parse(data[field])
        } catch {
          // Try comma-separated values
          transformed[field] = data[field].split(',').map((s: string) => s.trim()).filter(Boolean)
        }
      } else if (Array.isArray(data[field])) {
        transformed[field] = data[field]
      } else {
        transformed[field] = []
      }
    } else {
      transformed[field] = []
    }
  })
  
  // Handle JSON fields
  if (data.appearance && typeof data.appearance === 'string') {
    try {
      transformed.appearance = JSON.parse(data.appearance)
    } catch {
      transformed.appearance = { description: data.appearance }
    }
  } else {
    transformed.appearance = data.appearance || null
  }
  
  if (data.personality && typeof data.personality === 'string') {
    try {
      transformed.personality = JSON.parse(data.personality)
    } catch {
      transformed.personality = { description: data.personality }
    }
  } else {
    transformed.personality = data.personality || null
  }
  
  return transformed
}

// Helper function to parse boolean values
function parseBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim()
    return lower === 'true' || lower === '1' || lower === 'yes' || lower === 'y'
  }
  return Boolean(value)
}
