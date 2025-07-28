import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/characters/relationships/route'
import { adminDb } from '@/lib/supabaseAdmin'

// Mock Supabase admin
jest.mock('@/lib/supabaseAdmin', () => ({
  adminDb: {
    from: jest.fn(),
  },
}))

const mockAdminDb = adminDb as jest.Mocked<typeof adminDb>

describe('/api/characters/relationships', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/characters/relationships', () => {
    const mockRelationships = [
      {
        id: 1,
        character_id: 1,
        related_character_id: 2,
        relationship_type: 'friend',
        relationship_subtype: 'best friend',
        description: 'Childhood friends',
        strength: 8,
        is_mutual: true,
        status: 'active',
        character: {
          id: 1,
          name: 'Character A',
          avatar_url: 'avatar_a.jpg'
        },
        related_character: {
          id: 2,
          name: 'Character B',
          avatar_url: 'avatar_b.jpg'
        }
      }
    ]

    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      order: jest.fn(),
    }

    beforeEach(() => {
      mockAdminDb.from.mockReturnValue(mockQuery as any)
    })

    it('should return all relationships with default parameters', async () => {
      mockQuery.order.mockResolvedValue({
        data: mockRelationships,
        error: null,
        count: 1
      })

      const request = new NextRequest('http://localhost:3000/api/characters/relationships')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        data: mockRelationships,
        pagination: {
          offset: 0,
          limit: 50,
          total: 1
        }
      })
      expect(mockAdminDb.from).toHaveBeenCalledWith('character_relationships')
    })

    it('should filter relationships by character ID', async () => {
      mockQuery.order.mockResolvedValue({
        data: mockRelationships,
        error: null,
        count: 1
      })

      const request = new NextRequest('http://localhost:3000/api/characters/relationships?character_id=1')
      await GET(request)

      expect(mockQuery.or).toHaveBeenCalledWith('character_id.eq.1,related_character_id.eq.1')
    })

    it('should filter relationships by type', async () => {
      mockQuery.order.mockResolvedValue({
        data: mockRelationships,
        error: null,
        count: 1
      })

      const request = new NextRequest('http://localhost:3000/api/characters/relationships?type=friend')
      await GET(request)

      expect(mockQuery.eq).toHaveBeenCalledWith('relationship_type', 'friend')
    })

    it('should filter relationships by status', async () => {
      mockQuery.order.mockResolvedValue({
        data: mockRelationships,
        error: null,
        count: 1
      })

      const request = new NextRequest('http://localhost:3000/api/characters/relationships?status=active')
      await GET(request)

      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'active')
    })

    it('should apply pagination correctly', async () => {
      mockQuery.order.mockResolvedValue({
        data: mockRelationships,
        error: null,
        count: 1
      })

      const request = new NextRequest('http://localhost:3000/api/characters/relationships?offset=10&limit=20')
      await GET(request)

      expect(mockQuery.range).toHaveBeenCalledWith(10, 29)
    })

    it('should handle database errors', async () => {
      mockQuery.order.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
        count: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters/relationships')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Database connection failed')
    })
  })

  describe('POST /api/characters/relationships', () => {
    const mockInsert = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn(),
    }

    beforeEach(() => {
      mockAdminDb.from.mockReturnValue(mockInsert as any)
    })

    it('should create a new relationship successfully', async () => {
      const newRelationship = {
        character_id: 1,
        related_character_id: 2,
        relationship_type: 'friend',
        relationship_subtype: 'close friend',
        description: 'Met during college',
        strength: 7,
        is_mutual: true,
        status: 'active'
      }

      const createdRelationship = {
        id: 1,
        ...newRelationship,
        character: {
          id: 1,
          name: 'Character A',
          avatar_url: 'avatar_a.jpg'
        },
        related_character: {
          id: 2,
          name: 'Character B',  
          avatar_url: 'avatar_b.jpg'
        }
      }

      mockInsert.select.mockResolvedValue({
        data: [createdRelationship],
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRelationship)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(createdRelationship)
      expect(mockInsert.insert).toHaveBeenCalledWith([
        expect.objectContaining({
          character_id: 1,
          related_character_id: 2,
          relationship_type: 'friend',
          relationship_subtype: 'close friend',
          description: 'Met during college',
          strength: 7,
          is_mutual: true,
          status: 'active'
        })
      ])
    })

    it('should require required fields', async () => {
      const invalidRelationship = {
        character_id: 1,
        // missing related_character_id and relationship_type
      }

      const request = new NextRequest('http://localhost:3000/api/characters/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidRelationship)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('character_id, related_character_id, and relationship_type are required')
    })

    it('should prevent self-relationships', async () => {
      const selfRelationship = {
        character_id: 1,
        related_character_id: 1,
        relationship_type: 'friend'
      }

      const request = new NextRequest('http://localhost:3000/api/characters/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selfRelationship)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('A character cannot have a relationship with themselves')
    })

    it('should set default values for optional fields', async () => {
      const minimalRelationship = {
        character_id: 1,
        related_character_id: 2,
        relationship_type: 'friend'
      }

      mockInsert.select.mockResolvedValue({
        data: [{ id: 1, ...minimalRelationship }],
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(minimalRelationship)
      })

      await POST(request)

      expect(mockInsert.insert).toHaveBeenCalledWith([
        expect.objectContaining({
          character_id: 1,
          related_character_id: 2,
          relationship_type: 'friend',
          relationship_subtype: null,
          description: null,
          strength: 5,
          is_mutual: false,
          status: 'active',
          started_at: null,
          ended_at: null,
          context: null,
          created_by: null,
          updated_by: null
        })
      ])
    })

    it('should create reverse relationship if mutual', async () => {
      const mutualRelationship = {
        character_id: 1,
        related_character_id: 2,
        relationship_type: 'friend',
        is_mutual: true
      }

      // Mock two insert calls - one for main relationship, one for reverse
      mockInsert.select.mockResolvedValueOnce({
        data: [{ id: 1, ...mutualRelationship }],
        error: null
      })

      // Mock the reverse relationship insert
      const mockReverseInsert = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: [{ id: 2, character_id: 2, related_character_id: 1 }],
          error: null
        })
      }

      mockAdminDb.from.mockReturnValueOnce(mockInsert as any)
        .mockReturnValueOnce(mockReverseInsert as any)

      const request = new NextRequest('http://localhost:3000/api/characters/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mutualRelationship)
      })

      await POST(request)

      // Verify both relationships are created
      expect(mockInsert.insert).toHaveBeenCalledWith([
        expect.objectContaining({
          character_id: 1,
          related_character_id: 2,
          is_mutual: true
        })
      ])

      expect(mockReverseInsert.insert).toHaveBeenCalledWith([
        expect.objectContaining({
          character_id: 2,
          related_character_id: 1,
          is_mutual: true
        })
      ])
    })

    it('should handle database errors during creation', async () => {
      mockInsert.select.mockResolvedValue({
        data: null,
        error: { message: 'Foreign key constraint violation' }
      })

      const request = new NextRequest('http://localhost:3000/api/characters/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character_id: 1,
          related_character_id: 2,
          relationship_type: 'friend'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Foreign key constraint violation')
    })

    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/characters/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})
