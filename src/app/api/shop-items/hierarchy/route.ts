import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/supabaseAdmin'

// GET /api/shop-items/hierarchy - Get hierarchical shop items for association picker
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parent_id')
    const type = searchParams.get('type')

    let query = adminDb
      .from('shop_items')
      .select('*')
      .eq('status', 'published')
      .order('order_index')

    // Filter by parent ID if provided
    if (parentId && parentId !== 'null') {
      query = query.eq('parent_id', parentId)
    } else if (parentId === 'null') {
      query = query.is('parent_id', null)
    }

    // Filter by type if provided
    if (type) {
      query = query.eq('type', type)
    }

    const { data: items, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(items || [])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/shop-items/hierarchy/full - Get full hierarchical structure
export async function POST(request: NextRequest) {
  try {
    // Get all shop items with hierarchical structure
    const { data: books, error } = await adminDb
      .from('shop_items')
      .select(`
        id,
        title,
        type,
        order_index,
        parent_id,
        status
      `)
      .eq('status', 'published')
      .order('type')
      .order('order_index')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!books) {
      return NextResponse.json([])
    }

    // Build hierarchical structure
    const hierarchy = buildHierarchy(books)
    
    return NextResponse.json(hierarchy)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to build hierarchical structure
function buildHierarchy(items: any[]) {
  const itemMap = new Map()
  const roots: any[] = []

  // Create a map of all items
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] })
  })

  // Build the hierarchy
  items.forEach(item => {
    const currentItem = itemMap.get(item.id)
    
    if (item.parent_id) {
      const parent = itemMap.get(item.parent_id)
      if (parent) {
        parent.children.push(currentItem)
      }
    } else {
      roots.push(currentItem)
    }
  })

  return roots
}
