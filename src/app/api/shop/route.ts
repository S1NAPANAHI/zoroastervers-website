import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: shopItems, error } = await supabase
      .from('shop_items')
      .select('*')
      .order('order_index')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(shopItems)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shop items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: shopItem, error } = await supabase
      .from('shop_items')
      .insert([{
        title: body.title,
        type: body.type,
        parent_id: body.parent_id || null,
        order_index: body.order_index || 0,
        price: body.price || 0,
        content: body.content,
        description: body.description,
        cover_image: body.cover_image,
        status: body.status || 'draft'
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(shopItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create shop item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const { data: shopItem, error } = await supabase
      .from('shop_items')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(shopItem)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update shop item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('shop_items')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Shop item deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete shop item' }, { status: 500 })
  }
}
