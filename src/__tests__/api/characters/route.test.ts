import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/characters/route'
import { adminDb } from '@/lib/supabaseAdmin'

// Mock Supabase admin
jest.mock('@/lib/supabaseAdmin', () => ({
  adminDb: {
    from: jest.fn(),
  },
}))

const mockAdminDb = adminDb as jest.Mocked<typeof adminDb>

describe('/api/characters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/characters', () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
    }

    beforeEach(() => {
      mockAdminDb.from.mockReturnValue(mockQuery as any)
    })

    it('should return all characters with default parameters', async () => {
      const mockCharacters = [
        {
          id: 1,
          name: 'Test Character',
          description: 'A test character',
          status: 'active',
          importance_level: 5,
          is_main_character: false,
          is_protagonist: false,
          is_antagonist: false,
          character_relationships: []
        }
      ]

      mockQuery.select.mockResolvedValue({
        data: mockCharacters,
        error: null,
        count: 1
      })

      const request = new NextRequest('http://localhost:3000/api/characters')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        data: mockCharacters,
        pagination: {
          offset: 0,
          limit: 50,
          total: 1
        }
      })
      expect(mockAdminDb.from).toHaveBeenCalledWith('characters')
    })

    it('should filter characters by search term', async () => {
      const mockCharacters = [
        {
          id: 1,
          name: 'Hero Character',
          description: 'A heroic character',
          status: 'active',
          character_relationships: []
        }
      ]

      mockQuery.select.mockResolvedValue({
        data: mockCharacters,
        error: null,
        count: 1
      })

      const request = new NextRequest('http://localhost:3000/api/characters?search=Hero')
      const response = await GET(request)

      expect(mockQuery.or).toHaveBeenCalledWith(
        expect.stringContaining('name.ilike.%Hero%')
      )
    })

    it('should filter characters by status', async () => {
      const request = new NextRequest('http://localhost:3000/api/characters?status=deceased')
      mockQuery.select.mockResolvedValue({
        data: [],
        error: null,
        count: 0
      })

      await GET(request)

      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'deceased')
    })

    it('should filter characters by importance level', async () => {
      const request = new NextRequest('http://localhost:3000/api/characters?importance=main')
      mockQuery.select.mockResolvedValue({
        data: [],
        error: null,
        count: 0
      })

      await GET(request)

      expect(mockQuery.eq).toHaveBeenCalledWith('is_main_character', true)
    })

    it('should return CSV format when requested', async () => {
      const mockCharacters = [
        {
          id: 1,
          name: 'Test Character',
          aliases: ['Alias1'],
          description: 'A test character',
          status: 'active',
          importance_level: 5,
          is_main_character: false,
          is_protagonist: false,
          is_antagonist: false,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ]

      mockQuery.select.mockResolvedValue({
        data: mockCharacters,
        error: null,
        count: 1
      })

      const request = new NextRequest('http://localhost:3000/api/characters?format=csv')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('text/csv')
      expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="characters.csv"')
    })

    it('should handle database errors', async () => {
      mockQuery.select.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
        count: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Database connection failed')
    })

    it('should apply pagination correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/characters?offset=10&limit=20')
      mockQuery.select.mockResolvedValue({
        data: [],
        error: null,
        count: 0
      })

      await GET(request)

      expect(mockQuery.range).toHaveBeenCalledWith(10, 29) // offset to offset + limit - 1
    })

    it('should apply sorting correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/characters?sort=name&order=asc')
      mockQuery.select.mockResolvedValue({
        data: [],
        error: null,
        count: 0
      })

      await GET(request)

      expect(mockQuery.order).toHaveBeenCalledWith('name', { ascending: true })
    })
  })

  describe('POST /api/characters', () => {
    const mockInsert = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn(),
    }

    beforeEach(() => {
      mockAdminDb.from.mockReturnValue(mockInsert as any)
    })

    it('should create a new character successfully', async () => {
      const newCharacter = {
        name: 'New Character',
        description: 'A new character',
        status: 'active',
        importance_level: 5
      }

      const createdCharacter = {
        id: 1,
        ...newCharacter,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }

      mockInsert.select.mockResolvedValue({
        data: [createdCharacter],
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCharacter)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(createdCharacter)
      expect(mockInsert.insert).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'New Character',
          description: 'A new character',
          status: 'active',
          importance_level: 5
        })
      ])
    })

    it('should require name field', async () => {
      const invalidCharacter = {
        description: 'A character without a name'
      }

      const request = new NextRequest('http://localhost:3000/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidCharacter)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name is required')
    })

    it('should handle database errors during creation', async () => {
      mockInsert.select.mockResolvedValue({
        data: null,
        error: { message: 'Unique constraint violation' }
      })

      const request = new NextRequest('http://localhost:3000/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Character' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Unique constraint violation')
    })

    it('should set default values for optional fields', async () => {
      const minimalCharacter = { name: 'Minimal Character' }

      mockInsert.select.mockResolvedValue({
        data: [{ id: 1, ...minimalCharacter }],
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(minimalCharacter)
      })

      await POST(request)

      expect(mockInsert.insert).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'Minimal Character',
          aliases: [],
          description: null,
          status: 'active',
          importance_level: 5,
          is_main_character: false,
          is_protagonist: false,
          is_antagonist: false,
          skills: [],
          abilities: [],
          weaknesses: [],
          tags: []
        })
      ])
    })

    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/characters', {
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

  describe('Bulk Import', () => {
    it('should handle CSV bulk import', async () => {
      const csvContent = 'name,description,status\\nCharacter 1,Description 1,active\\nCharacter 2,Description 2,inactive'
      const formData = new FormData()
      const file = new File([csvContent], 'characters.csv', { type: 'text/csv' })
      formData.append('file', file)

      const mockInsert = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: [
            { id: 1, name: 'Character 1', description: 'Description 1', status: 'active' },
            { id: 2, name: 'Character 2', description: 'Description 2', status: 'inactive' }
          ],
          error: null
        })
      }

      mockAdminDb.from.mockReturnValue(mockInsert as any)

      const request = new NextRequest('http://localhost:3000/api/characters', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.imported).toBe(2)
      expect(data.total).toBe(2)
    })

    it('should handle JSON bulk import', async () => {
      const jsonContent = JSON.stringify([
        { name: 'Character 1', description: 'Description 1' },
        { name: 'Character 2', description: 'Description 2' }
      ])

      const formData = new FormData()
      const file = new File([jsonContent], 'characters.json', { type: 'application/json' })
      formData.append('file', file)

      const mockInsert = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: [
            { id: 1, name: 'Character 1' },
            { id: 2, name: 'Character 2' }
          ],
          error: null
        })
      }

      mockAdminDb.from.mockReturnValue(mockInsert as any)

      const request = new NextRequest('http://localhost:3000/api/characters', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.imported).toBe(2)
    })

    it('should reject unsupported file formats', async () => {
      const formData = new FormData()
      const file = new File(['content'], 'characters.txt', { type: 'text/plain' })
      formData.append('file', file)

      const request = new NextRequest('http://localhost:3000/api/characters', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Unsupported file format')
    })

    it('should require file for bulk import', async () => {
      const formData = new FormData()

      const request = new NextRequest('http://localhost:3000/api/characters', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('No file provided')
    })
  })
})
