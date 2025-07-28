import { NextRequest, NextResponse } from 'next/server'

// POST /api/characters/bulk-import/preview - Preview import data with field mapping
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fieldMapping = formData.get('fieldMapping')
    
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

    if (!rawData.length) {
      return NextResponse.json({ error: 'No data found in file' }, { status: 400 })
    }

    // Get available fields from the first row
    const detectedFields = Object.keys(rawData[0])
    
    // Database field definitions for mapping
    const databaseFields = [
      { key: 'name', label: 'Name', required: true, type: 'string' },
      { key: 'aliases', label: 'Aliases', required: false, type: 'array' },
      { key: 'description', label: 'Description', required: false, type: 'string' },
      { key: 'appearance', label: 'Appearance', required: false, type: 'object' },
      { key: 'height', label: 'Height', required: false, type: 'string' },
      { key: 'weight', label: 'Weight', required: false, type: 'string' },
      { key: 'eye_color', label: 'Eye Color', required: false, type: 'string' },
      { key: 'hair_color', label: 'Hair Color', required: false, type: 'string' },
      { key: 'age_range', label: 'Age Range', required: false, type: 'string' },
      { key: 'personality', label: 'Personality', required: false, type: 'object' },
      { key: 'skills', label: 'Skills', required: false, type: 'array' },
      { key: 'abilities', label: 'Abilities', required: false, type: 'array' },
      { key: 'weaknesses', label: 'Weaknesses', required: false, type: 'array' },
      { key: 'motivations', label: 'Motivations', required: false, type: 'string' },
      { key: 'fears', label: 'Fears', required: false, type: 'string' },
      { key: 'status', label: 'Status', required: false, type: 'enum', options: ['active', 'inactive', 'deceased', 'unknown'] },
      { key: 'importance_level', label: 'Importance Level (1-10)', required: false, type: 'number' },
      { key: 'is_main_character', label: 'Is Main Character', required: false, type: 'boolean' },
      { key: 'is_protagonist', label: 'Is Protagonist', required: false, type: 'boolean' },
      { key: 'is_antagonist', label: 'Is Antagonist', required: false, type: 'boolean' },
      { key: 'first_appearance', label: 'First Appearance', required: false, type: 'string' },
      { key: 'creator', label: 'Creator', required: false, type: 'string' },
      { key: 'voice_actor', label: 'Voice Actor', required: false, type: 'string' },
      { key: 'tags', label: 'Tags', required: false, type: 'array' }
    ]

    // Auto-suggest field mappings based on similarity
    const suggestedMapping = generateFieldMapping(detectedFields, databaseFields)

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

    // Preview first 10 rows with validation
    const previewData = mappedData.slice(0, 10).map((row, index) => ({
      rowIndex: index,
      data: row,
      validation: validateCharacterData(row),
      mapped: transformForDatabase(row)
    }))

    // Summary statistics
    const stats = {
      totalRows: rawData.length,
      validRows: mappedData.filter(row => row.name && row.name.trim()).length,
      invalidRows: mappedData.filter(row => !row.name || !row.name.trim()).length,
      duplicateNames: findDuplicateNames(mappedData)
    }

    return NextResponse.json({
      detectedFields,
      databaseFields,
      suggestedMapping,
      previewData,
      stats,
      totalRows: rawData.length
    })

  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json({ error: 'Failed to preview import data' }, { status: 500 })
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

// Generate suggested field mapping
function generateFieldMapping(detectedFields: string[], databaseFields: any[]): any {
  const mapping: any = {}
  
  detectedFields.forEach(detected => {
    const normalized = detected.toLowerCase().replace(/[_\s-]/g, '')
    
    const match = databaseFields.find(dbField => {
      const dbNormalized = dbField.key.toLowerCase().replace(/[_\s-]/g, '')
      const labelNormalized = dbField.label.toLowerCase().replace(/[_\s-]/g, '')
      
      return dbNormalized === normalized || 
             labelNormalized === normalized ||
             dbNormalized.includes(normalized) ||
             normalized.includes(dbNormalized)
    })
    
    if (match) {
      mapping[detected] = match.key
    }
  })
  
  return mapping
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

// Validate character data
function validateCharacterData(data: any): any {
  const errors = []
  const warnings = []
  
  // Required field validation
  if (!data.name || !data.name.trim()) {
    errors.push('Name is required')
  }
  
  // Type validation
  if (data.importance_level && (isNaN(data.importance_level) || data.importance_level < 1 || data.importance_level > 10)) {
    warnings.push('Importance level should be between 1-10')
  }
  
  if (data.status && !['active', 'inactive', 'deceased', 'unknown'].includes(data.status)) {
    warnings.push('Invalid status value')
  }
  
  // Array field validation
  const arrayFields = ['aliases', 'skills', 'abilities', 'weaknesses', 'tags']
  arrayFields.forEach(field => {
    if (data[field] && typeof data[field] === 'string') {
      try {
        JSON.parse(data[field])
      } catch {
        warnings.push(`${field} should be a valid JSON array or comma-separated values`)
      }
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
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

// Find duplicate names
function findDuplicateNames(data: any[]): string[] {
  const names = data.map(row => row.name?.trim().toLowerCase()).filter(Boolean)
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
  return [...new Set(duplicates)]
}
