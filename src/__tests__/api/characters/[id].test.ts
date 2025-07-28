import { NextRequest } from 'next/server'
import { GET, PUT, DELETE } from '@/app/api/characters/[id]/route'
import { adminDb } from '@/lib/supabaseAdmin'

// Mock Supabase admin  
jest.mock('@/lib/supabaseAdmin', () => ({
  adminDb: {
    from: jest.fn(),
  },
}))

const mockAdminDb = adminDb as jest.Mocked<typeof adminDb>

describe('/api/characters/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/characters/[id]', () => {
    const mockCharacter = {
      id: 1,
      name: 'Test Character',
      description: 'A test character',
      status: 'active',
      importance_level: 5,
      is_main_character: false,
      is_protagonist: false,
      is_antagonist: false,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }

    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    }

    beforeEach(() => {
      mockAdminDb.from.mockReturnValue(mockQuery as any)
    })

    it('should return a character by ID', async () => {
      mockQuery.single.mockResolvedValue({
        data: mockCharacter,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters/1')
      const response = await GET(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockCharacter)
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 1)
    })

    it('should return 404 for non-existent character', async () => {
      mockQuery.single.mockResolvedValue({
        data: null,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters/999')
      const response = await GET(request, { params: { id: '999' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Character not found')
    })

    it('should include relationships when requested', async () => {
      const characterWithRelationships = {
        ...mockCharacter,
        character_relationships: [
          {
            id: 1,
            related_character_id: 2,
            relationship_type: 'friend',
            strength: 8
          }
        ]
      }

      mockQuery.single.mockResolvedValue({
        data: characterWithRelationships,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters/1?include_relationships=true')
      const response = await GET(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.character_relationships).toBeDefined()
      expect(data.character_relationships).toHaveLength(1)
    })

    it('should handle database errors', async () => {
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' }
      })

      const request = new NextRequest('http://localhost:3000/api/characters/1')
      const response = await GET(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Database connection failed')
    })

    it('should include timeline data when requested', async () => {
      mockQuery.single.mockResolvedValue({
        data: mockCharacter,
        error: null
      })

      // Mock the books query for timeline
      const mockBooksQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              title: 'Book 1',
              volumes: [{
                id: 1,
                title: 'Volume 1',
                order_index: 1,
                sagas: [{
                  id: 1,
                  title: 'Saga 1',
                  order_index: 1,
                  arcs: [{
                    id: 1,
                    title: 'Arc 1',
                    order_index: 1,
                    issues: [{
                      id: 1,
                      title: 'Issue 1',
                      order_index: 1
                    }]
                  }]
                }]
              }]
            }
          ],
          error: null
        })
      }

      mockAdminDb.from.mockReturnValueOnce(mockQuery as any)
        .mockReturnValueOnce(mockBooksQuery as any)

      const request = new NextRequest('http://localhost:3000/api/characters/1?include_timeline=true')
      const response = await GET(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.appearance_timeline).toBeDefined()
      expect(Array.isArray(data.appearance_timeline)).toBe(true)
    })
  })

  describe('PUT /api/characters/[id]', () => {
    const mockUpdate = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(),
    }

    beforeEach(() => {
      mockAdminDb.from.mockReturnValue(mockUpdate as any)
    })

    it('should update a character successfully', async () => {
      const updateData = {
        name: 'Updated Character',
        description: 'Updated description',
        status: 'inactive'
      }

      const updatedCharacter = {
        id: 1,
        ...updateData,
        updated_at: '2023-01-02T00:00:00Z'
      }

      // Mock the existence check
      mockUpdate.single.mockResolvedValueOnce({
        data: { id: 1 },
        error: null
      })

      // Mock the update operation
      mockUpdate.select.mockResolvedValue({
        data: [updatedCharacter],
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      const response = await PUT(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(updatedCharacter)
      expect(mockUpdate.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Character',
          description: 'Updated description',
          status: 'inactive',
          updated_at: expect.any(String)
        })
      )
    })

    it('should return 404 for non-existent character', async () => {
      mockUpdate.single.mockResolvedValue({
        data: null,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters/999', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated' })
      })

      const response = await PUT(request, { params: { id: '999' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Character not found')
    })

    it('should validate character ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/characters/invalid', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated' })
      })

      const response = await PUT(request, { params: { id: 'invalid' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid character ID')
    })

    it('should filter out read-only fields', async () => {
      const updateData = {
        name: 'Updated Character',
        id: 999, // Should be filtered out
        created_at: '2023-01-01T00:00:00Z', // Should be filtered out
        malicious_field: 'hack attempt' // Should be filtered out
      }

      mockUpdate.single.mockResolvedValueOnce({
        data: { id: 1 },
        error: null
      })

      mockUpdate.select.mockResolvedValue({
        data: [{ id: 1, name: 'Updated Character' }],
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      await PUT(request, { params: { id: '1' } })

      expect(mockUpdate.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Character',
          updated_at: expect.any(String)
        })
      )

      expect(mockUpdate.update).toHaveBeenCalledWith(
        expect.not.objectContaining({
          id: expect.anything(),
          created_at: expect.anything(),
          malicious_field: expect.anything()
        })
      )
    })

    it('should handle database errors during update', async () => {
      mockUpdate.single.mockResolvedValueOnce({
        data: { id: 1 },
        error: null
      })

      mockUpdate.select.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' }
      })

      const request = new NextRequest('http://localhost:3000/api/characters/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated' })
      })

      const response = await PUT(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Update failed')
    })
  })

  describe('DELETE /api/characters/[id]', () => {
    const mockDelete = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn(),
    }

    beforeEach(() => {
      mockAdminDb.from.mockReturnValue(mockDelete as any)
    })

    it('should delete a character successfully', async () => {
      mockDelete.eq.mockResolvedValue({
        data: null,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters/1', {
        method: 'DELETE'
      })

      const response = await DELETE(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Character deleted successfully')
      expect(mockDelete.eq).toHaveBeenCalledWith('id', 1)
    })

    it('should handle database errors during deletion', async () => {
      mockDelete.eq.mockResolvedValue({
        data: null,
        error: { message: 'Foreign key constraint violation' }
      })

      const request = new NextRequest('http://localhost:3000/api/characters/1', {
        method: 'DELETE'
      })

      const response = await DELETE(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Foreign key constraint violation')
    })

    it('should handle invalid character ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/characters/invalid', {
        method: 'DELETE'
      })

      const response = await DELETE(request, { params: { id: 'invalid' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})
