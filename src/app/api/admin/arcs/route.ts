import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: arcs, error } = await supabaseAdmin
      .from('arcs')
      .select(`
        *,
        sagas (
          id,
          title,
          volumes (
            id,
            title,
            books (
              id,
              title
            )
          )
        ),
        issues (
          id,
          title,
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(arcs)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const { data: newArc, error } = await supabaseAdmin
      .from('arcs')
      .insert([{
        title: data.title,
        description: data.description,
        price: data.price,
        saga_id: data.saga_id,
        order_index: data.order_index || 0,
        status: data.status || 'draft',
        is_complete: data.is_complete || false,
        bundle_discount: data.bundle_discount || 0.00
      }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newArc[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
