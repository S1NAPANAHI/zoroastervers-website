import { NextRequest, NextResponse } from 'next/server';
import { ShopData } from '@/types/shop';

// Mock database - in production, this would be a real database
let shopData: ShopData[] = [
  {
    id: 'book-1',
    title: 'Book 1: The Awakening',
    description: 'The first book in the ZOROASTER saga introduces us to a world where magic and technology collide.',
    price: 29.99,
    type: 'book',
    coverImage: '/covers/book-1.jpg',
    status: 'published',
    releaseDate: '2024-01-15',
    volumes: [
      {
        id: 'vol-1-1',
        title: 'Volume 1: Dawn of Magic',
        description: 'The awakening begins with mysterious powers emerging across the realm.',
        price: 14.99,
        coverImage: '/covers/book-1-vol-1.jpg',
        arcs: [
          {
            id: 'arc-1-1-1',
            title: 'Arc 1: The First Signs',
            description: 'Strange phenomena begin to appear throughout the kingdom.',
            price: 7.99,
            issues: [
              {
                id: 'issue-1-1-1-1',
                title: 'Issue #1: The Awakening',
                description: 'Our journey begins as reality itself starts to shift.',
                price: 2.99,
                pageCount: 24,
                releaseDate: '2024-01-15'
              }
            ]
          }
        ]
      }
    ]
  }
];

// GET - Fetch all shop data
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: shopData
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shop data' },
      { status: 500 }
    );
  }
}

// POST - Create new shop item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, type, coverImage, status, releaseDate } = body;

    // Validate required fields
    if (!title || !description || !price || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new item
    const newItem: ShopData = {
      id: `${type}-${Date.now()}`,
      title,
      description,
      price: parseFloat(price),
      type,
      coverImage: coverImage || '/covers/default.jpg',
      status: status || 'draft',
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      volumes: []
    };

    shopData.push(newItem);

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Shop item created successfully'
    });
  } catch (error) {
    console.error('Error creating shop item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create shop item' },
      { status: 500 }
    );
  }
}

// PUT - Update existing shop item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const itemIndex = shopData.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    // Update the item
    shopData[itemIndex] = { ...shopData[itemIndex], ...updates };

    return NextResponse.json({
      success: true,
      data: shopData[itemIndex],
      message: 'Shop item updated successfully'
    });
  } catch (error) {
    console.error('Error updating shop item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update shop item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove shop item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const itemIndex = shopData.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    // Remove the item
    const deletedItem = shopData.splice(itemIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedItem,
      message: 'Shop item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shop item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete shop item' },
      { status: 500 }
    );
  }
}
