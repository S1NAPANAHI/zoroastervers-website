import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// GET /api/characters/templates - Get character templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // protagonist, antagonist, supporting
    
    const templatesPath = path.join(process.cwd(), 'src/data/character_templates.json')
    const templatesData = fs.readFileSync(templatesPath, 'utf8')
    const templates = JSON.parse(templatesData)
    
    // Return specific template type or all templates
    if (type && templates[type]) {
      return NextResponse.json(templates[type])
    }
    
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error loading templates:', error)
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 })
  }
}

// POST /api/characters/templates - Create character from template
export async function POST(request: NextRequest) {
  try {
    const { type, customizations } = await request.json()
    
    if (!type) {
      return NextResponse.json({ error: 'Template type is required' }, { status: 400 })
    }
    
    const templatesPath = path.join(process.cwd(), 'src/data/character_templates.json')
    const templatesData = fs.readFileSync(templatesPath, 'utf8')
    const templates = JSON.parse(templatesData)
    
    if (!templates[type]) {
      return NextResponse.json({ error: 'Template type not found' }, { status: 404 })
    }
    
    // Merge template with customizations
    const characterData = {
      ...templates[type],
      ...customizations,
      // Ensure arrays are properly handled
      aliases: customizations?.aliases || templates[type].aliases || [],
      skills: customizations?.skills || templates[type].skills || [],
      abilities: customizations?.abilities || templates[type].abilities || [],
      weaknesses: customizations?.weaknesses || templates[type].weaknesses || [],
      tags: customizations?.tags || templates[type].tags || []
    }
    
    return NextResponse.json(characterData)
  } catch (error) {
    console.error('Error creating character from template:', error)
    return NextResponse.json({ error: 'Failed to create character from template' }, { status: 500 })
  }
}
