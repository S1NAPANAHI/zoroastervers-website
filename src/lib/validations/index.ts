import { z } from 'zod';

// =====================================================
// Common Validation Schemas
// =====================================================

// Common item types
export const ItemTypeSchema = z.enum(['book', 'volume', 'saga', 'arc', 'issue']);

// UUID schema for user IDs
export const UuidSchema = z.string().uuid('Invalid UUID format');

// ID schema for database IDs
export const IdSchema = z.number().int().positive('ID must be a positive integer');

// =====================================================
// Review Validation Schemas
// =====================================================

export const ReviewCreateSchema = z.object({
  item_id: IdSchema,
  item_type: ItemTypeSchema,
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(2000, 'Comment must be 2000 characters or less').optional().nullable(),
  is_verified_purchase: z.boolean().optional().default(false),
  is_spoiler: z.boolean().optional().default(false),
});

export const ReviewUpdateSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
  comment: z.string().max(2000, 'Comment must be 2000 characters or less').optional().nullable(),
  is_spoiler: z.boolean().optional(),
});

export const ReviewQuerySchema = z.object({
  item_id: z.string().regex(/^\d+$/, 'Invalid item_id').transform(Number).optional(),
  item_type: ItemTypeSchema.optional(),
  user_id: UuidSchema.optional(),
limit: z.string().regex(/^\\d+$/, 'Invalid limit').transform((val) =\u003e parseInt(val, 10)).min(1).max(100).optional().default(50),
offset: z.string().regex(/^\\d+$/, 'Invalid offset').transform((val) =\u003e parseInt(val, 10)).min(0).optional().default(0),
});

// =====================================================
// User Progress Validation Schemas
// =====================================================

export const UserProgressCreateSchema = z.object({
  item_id: IdSchema,
  item_type: ItemTypeSchema,
  percent_complete: z.number().int().min(0, 'Progress must be at least 0%').max(100, 'Progress must be at most 100%').default(0),
  last_position: z.string().max(1000, 'Last position must be 1000 characters or less').optional().nullable(),
  started_at: z.string().datetime().optional().nullable(),
  completed_at: z.string().datetime().optional().nullable(),
  total_reading_time: z.number().int().min(0, 'Reading time must be non-negative').optional().default(0),
  session_count: z.number().int().min(0, 'Session count must be non-negative').optional().default(0),
});

export const UserProgressUpdateSchema = z.object({
  percent_complete: z.number().int().min(0, 'Progress must be at least 0%').max(100, 'Progress must be at most 100%').optional(),
  last_position: z.string().max(1000, 'Last position must be 1000 characters or less').optional().nullable(),
  completed_at: z.string().datetime().optional().nullable(),
  total_reading_time: z.number().int().min(0, 'Reading time must be non-negative').optional(),
  session_count: z.number().int().min(0, 'Session count must be non-negative').optional(),
});

export const UserProgressQuerySchema = z.object({
  item_id: z.string().regex(/^\d+$/, 'Invalid item_id').transform(Number).optional(),
  item_type: ItemTypeSchema.optional(),
  user_id: UuidSchema.optional(),
limit: z.string().regex(/^\\d+$/, 'Invalid limit').transform((val) =\u003e parseInt(val, 10)).min(1).max(100).optional().default(50),
offset: z.string().regex(/^\\d+$/, 'Invalid offset').transform((val) =\u003e parseInt(val, 10)).min(0).optional().default(0),
});

// =====================================================
// Character Validation Schemas
// =====================================================

export const CharacterCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
  aliases: z.array(z.string().max(255, 'Alias must be 255 characters or less')).optional().default([]),
  description: z.string().max(5000, 'Description must be 5000 characters or less').optional().nullable(),
  appearance: z.record(z.any()).optional().nullable(), // JSON object
  personality: z.record(z.any()).optional().nullable(), // JSON object
  importance_level: z.number().int().min(1, 'Importance level must be at least 1').max(10, 'Importance level must be at most 10').optional().default(5),
  status: z.enum(['active', 'inactive', 'draft']).optional().default('draft'),
});

export const CharacterUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less').optional(),
  aliases: z.array(z.string().max(255, 'Alias must be 255 characters or less')).optional(),
  description: z.string().max(5000, 'Description must be 5000 characters or less').optional().nullable(),
  appearance: z.record(z.any()).optional().nullable(), // JSON object
  personality: z.record(z.any()).optional().nullable(), // JSON object
  importance_level: z.number().int().min(1, 'Importance level must be at least 1').max(10, 'Importance level must be at most 10').optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
});

// =====================================================
// Content Validation Schemas (Books, Volumes, etc.)
// =====================================================

export const ContentCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  description: z.string().max(5000, 'Description must be 5000 characters or less').optional().nullable(),
  order_index: z.number().int().min(1, 'Order index must be at least 1').optional().default(1),
  release_date: z.string().datetime().optional().nullable(),
  // Parent references vary by content type, so they're handled separately
});

export const ContentUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less').optional(),
  description: z.string().max(5000, 'Description must be 5000 characters or less').optional().nullable(),
  order_index: z.number().int().min(1, 'Order index must be at least 1').optional(),
  release_date: z.string().datetime().optional().nullable(),
});

// =====================================================
// Easter Egg Validation Schemas
// =====================================================

export const EasterEggCreateSchema = z.object({
  item_id: IdSchema,
  item_type: ItemTypeSchema,
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  clue: z.string().min(1, 'Clue is required').max(1000, 'Clue must be 1000 characters or less'),
  reward: z.string().min(1, 'Reward is required').max(1000, 'Reward must be 1000 characters or less'),
  trigger_type: z.string().max(50, 'Trigger type must be 50 characters or less').default('hidden'),
  trigger_conditions: z.record(z.any()).optional().nullable(), // JSON object
  difficulty_level: z.number().int().min(1, 'Difficulty level must be at least 1').max(5, 'Difficulty level must be at most 5').default(1),
  hint_level: z.number().int().min(1, 'Hint level must be at least 1').max(3, 'Hint level must be at most 3').default(1),
  reward_type: z.string().max(50, 'Reward type must be 50 characters or less').default('content'),
  reward_data: z.record(z.any()).optional().nullable(), // JSON object
  is_active: z.boolean().default(true),
  available_from: z.string().datetime().optional().nullable(),
  available_until: z.string().datetime().optional().nullable(),
});

// =====================================================
// Validation Helper Functions
// =====================================================

/**
 * Validates and sanitizes request body using provided schema
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const errorMessage = result.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return { success: false, error: `Validation error: ${errorMessage}` };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: 'Invalid JSON format' };
  }
}

/**
 * Validates query parameters using provided schema
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const queryObject = Object.fromEntries(searchParams.entries());
    const result = schema.safeParse(queryObject);
    
    if (!result.success) {
      const errorMessage = result.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return { success: false, error: `Query validation error: ${errorMessage}` };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: 'Invalid query parameters' };
  }
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(content: string): string {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates if a string is a valid UUID
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates if a string represents a positive integer
 */
export function isValidId(id: string): boolean {
  const num = parseInt(id, 10);
  return !isNaN(num) && num > 0 && num.toString() === id;
}

export type ReviewCreateInput = z.infer<typeof ReviewCreateSchema>;
export type ReviewUpdateInput = z.infer<typeof ReviewUpdateSchema>;
export type ReviewQueryInput = z.infer<typeof ReviewQuerySchema>;
export type UserProgressCreateInput = z.infer<typeof UserProgressCreateSchema>;
export type UserProgressUpdateInput = z.infer<typeof UserProgressUpdateSchema>;
export type UserProgressQueryInput = z.infer<typeof UserProgressQuerySchema>;
export type CharacterCreateInput = z.infer<typeof CharacterCreateSchema>;
export type CharacterUpdateInput = z.infer<typeof CharacterUpdateSchema>;
export type ContentCreateInput = z.infer<typeof ContentCreateSchema>;
export type ContentUpdateInput = z.infer<typeof ContentUpdateSchema>;
export type EasterEggCreateInput = z.infer<typeof EasterEggCreateSchema>;
