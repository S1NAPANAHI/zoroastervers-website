import { http, HttpResponse } from 'msw'
import { Review, UserProgress, EasterEgg, Book, Volume } from '@/lib/types'

// Mock data
const mockReviews: Review[] = [
  {
    id: 1,
    item_id: 1,
    item_type: 'book',
    user_id: 'user-1',
    rating: 5,
    comment: 'Great book!',
    is_verified_purchase: true,
    helpful_count: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

const mockProgress: UserProgress[] = [
  {
    id: 1,
    user_id: 'user-1',
    item_id: 1,
    item_type: 'book',
    percent_complete: 50,
    last_position: 'chapter-5',
    started_at: '2024-01-01T00:00:00Z',
    completed_at: null,
    last_accessed: '2024-01-15T00:00:00Z',
    total_reading_time: 120,
    session_count: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  }
]

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Test Book',
    description: 'A test book',
    status: 'published',
    price: 15.99,
    order_index: 1,
    cover_image: '/test-cover.jpg',
    release_date: '2024-01-01',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

const mockEasterEggs: EasterEgg[] = [
  {
    id: 1,
    item_id: 1,
    item_type: 'book',
    title: 'Hidden Treasure',
    clue: 'Look closely at the book cover',
    reward: 'You found the author\'s secret note!',
    trigger_type: 'click',
    trigger_conditions: null,
    difficulty_level: 1,
    discovery_rate: 0.15,
    hint_level: 1,
    reward_type: 'points',
    reward_data: { points: 50 },
    is_active: true,
    available_from: null,
    available_until: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const handlers = [
  // Mock Supabase REST API
  http.get('http://localhost:54321/rest/v1/reviews', ({ request }) => {
    const url = new URL(request.url)
    const itemId = url.searchParams.get('item_id')
    const itemType = url.searchParams.get('item_type')
    
    let filteredReviews = mockReviews
    if (itemId) {
      filteredReviews = filteredReviews.filter(r => r.item_id === parseInt(itemId))
    }
    if (itemType) {
      filteredReviews = filteredReviews.filter(r => r.item_type === itemType)
    }
    
    return HttpResponse.json(filteredReviews)
  }),
  
  http.post('/api/books/reviews', async ({ request }) => {
    const body = await request.json() as any
    const newReview = {
      id: mockReviews.length + 1,
      ...body,
      helpful_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockReviews.push(newReview)
    return HttpResponse.json(newReview)
  }),
  
  http.get('http://localhost:54321/rest/v1/user_progress', ({ request }) => {
    const url = new URL(request.url)
    const itemId = url.searchParams.get('item_id')
    const itemType = url.searchParams.get('item_type')
    
    let filteredProgress = mockProgress
    if (itemId) {
      filteredProgress = filteredProgress.filter(p => p.item_id === parseInt(itemId))
    }
    if (itemType) {
      filteredProgress = filteredProgress.filter(p => p.item_type === itemType)
    }
    
    return HttpResponse.json(filteredProgress)
  }),
  
  http.patch('/api/books/progress', async ({ request }) => {
    const { item_id, item_type, ...updateData } = await request.json() as any
    const existingProgress = mockProgress.find(p => p.item_id === item_id && p.item_type === item_type)
    
    if (existingProgress) {
      Object.assign(existingProgress, updateData, { updated_at: new Date().toISOString() })
      return HttpResponse.json(existingProgress)
    } else {
      const newProgress = {
        id: mockProgress.length + 1,
        user_id: 'user-1',
        item_id,
        item_type,
        percent_complete: 0,
        last_position: null,
        started_at: new Date().toISOString(),
        completed_at: null,
        last_accessed: new Date().toISOString(),
        total_reading_time: 0,
        session_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updateData
      }
      mockProgress.push(newProgress)
      return HttpResponse.json(newProgress)
    }
  }),
  
  http.get('http://localhost:54321/rest/v1/books', () => {
    return HttpResponse.json(mockBooks)
  }),
  
  http.put('/api/admin/books/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const body = await request.json() as any
    const book = mockBooks.find(b => b.id === id)
    if (book) {
      Object.assign(book, body, { updated_at: new Date().toISOString() })
      return HttpResponse.json(book)
    }
    return new HttpResponse(null, { status: 404 })
  }),
  
  // Mock easter egg endpoints
  http.get('/api/easter_eggs', ({ request }) => {
    const url = new URL(request.url)
    const itemId = url.searchParams.get('item_id')
    const itemType = url.searchParams.get('item_type')
    
    let filteredEggs = mockEasterEggs
    if (itemId) {
      filteredEggs = filteredEggs.filter(e => e.item_id === parseInt(itemId))
    }
    if (itemType) {
      filteredEggs = filteredEggs.filter(e => e.item_type === itemType)
    }
    
    return HttpResponse.json(filteredEggs)
  }),
  
  // Mock general API responses
  http.get('http://localhost:54321/*', () => {
    return HttpResponse.json([])
  }),
  
  http.post('http://localhost:54321/*', () => {
    return HttpResponse.json({ success: true })
  })
];
