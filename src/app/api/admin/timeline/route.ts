import { NextRequest, NextResponse } from 'next/server';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  year: number;
  category: 'political' | 'magical' | 'technological' | 'cultural' | 'catastrophic';
  importance: 'low' | 'medium' | 'high' | 'critical';
  connections: string[];
  characters: string[];
  locations: string[];
  image?: string;
  tags: string[];
  spoilerLevel: 'none' | 'minimal' | 'moderate' | 'major';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock timeline data
let timelineEvents: TimelineEvent[] = [
  {
    id: 'dawn-age',
    title: 'The Dawn Age Begins',
    description: 'The first recorded emergence of magical energies in the known world, marking the beginning of recorded history.',
    date: 'Year 1 of the Dawn Age',
    year: 1,
    category: 'magical',
    importance: 'critical',
    connections: ['first-mages', 'crystal-discovery'],
    characters: ['The First Sage', 'Ancient Ones'],
    locations: ['Crystal Caverns', 'The Origin Point'],
    image: '/timeline/dawn-age.jpg',
    tags: ['origin', 'magic', 'beginning'],
    spoilerLevel: 'none',
    isPublished: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'crystal-catastrophe',
    title: 'The Crystal Catastrophe',
    description: 'A massive magical disaster that reshaped the continent and changed the nature of magic itself.',
    date: 'Year 847 of the Dawn Age',
    year: 847,
    category: 'catastrophic',
    importance: 'critical',
    connections: ['dawn-age', 'steam-revolution'],
    characters: ['The Last Crystal Keeper', 'Survivors of the Catastrophe'],
    locations: ['Crystal Caverns', 'The Shattered Lands', 'Refuge Cities'],
    image: '/timeline/crystal-catastrophe.jpg',
    tags: ['disaster', 'transformation', 'magic'],
    spoilerLevel: 'minimal',
    isPublished: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// GET - Fetch all timeline events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const category = searchParams.get('category');
    const spoilerLevel = searchParams.get('spoilerLevel');

    let filteredEvents = timelineEvents;

    // Filter by published status
    if (published === 'true') {
      filteredEvents = filteredEvents.filter(event => event.isPublished);
    }

    // Filter by category
    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }

    // Filter by spoiler level
    if (spoilerLevel) {
      const allowedLevels = ['none', 'minimal', 'moderate', 'major'];
      const maxLevelIndex = allowedLevels.indexOf(spoilerLevel);
      if (maxLevelIndex !== -1) {
        filteredEvents = filteredEvents.filter(event => 
          allowedLevels.indexOf(event.spoilerLevel) <= maxLevelIndex
        );
      }
    }

    // Sort by year
    filteredEvents.sort((a, b) => a.year - b.year);

    return NextResponse.json({
      success: true,
      data: filteredEvents,
      total: filteredEvents.length
    });
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch timeline events' },
      { status: 500 }
    );
  }
}

// POST - Create new timeline event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      date,
      year,
      category,
      importance,
      connections = [],
      characters = [],
      locations = [],
      image,
      tags = [],
      spoilerLevel = 'none',
      isPublished = false
    } = body;

    // Validate required fields
    if (!title || !description || !year || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, year, category' },
        { status: 400 }
      );
    }

    // Create new timeline event
    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      title,
      description,
      date: date || `Year ${year}`,
      year: parseInt(year),
      category,
      importance: importance || 'medium',
      connections,
      characters,
      locations,
      image: image || '/timeline/default.jpg',
      tags,
      spoilerLevel,
      isPublished,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    timelineEvents.push(newEvent);

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Timeline event created successfully'
    });
  } catch (error) {
    console.error('Error creating timeline event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create timeline event' },
      { status: 500 }
    );
  }
}

// PUT - Update existing timeline event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const eventIndex = timelineEvents.findIndex(event => event.id === id);
    if (eventIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Timeline event not found' },
        { status: 404 }
      );
    }

    // Update the event
    timelineEvents[eventIndex] = {
      ...timelineEvents[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: timelineEvents[eventIndex],
      message: 'Timeline event updated successfully'
    });
  } catch (error) {
    console.error('Error updating timeline event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update timeline event' },
      { status: 500 }
    );
  }
}

// DELETE - Remove timeline event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const eventIndex = timelineEvents.findIndex(event => event.id === id);
    if (eventIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Timeline event not found' },
        { status: 404 }
      );
    }

    // Remove the event
    const deletedEvent = timelineEvents.splice(eventIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedEvent,
      message: 'Timeline event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete timeline event' },
      { status: 500 }
    );
  }
}
