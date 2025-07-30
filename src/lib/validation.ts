import { z } from 'zod';

export const validate = {
    // Add your validation methods here
};

// FIXME: Replace with real validation logic
export const validateRequest = () => true;
export const validateQuery = () => true;
export const isValidUuid = (id: string) => /^[0-9a-f-]{36}$/i.test(id);
export const sanitizeHtml = (html: string) => html; // TODO: real sanitizer

// FIXME: Define proper schemas
export const ReviewCreateSchema = z.object({});
export const ReviewQuerySchema = z.object({});
export const UserProgressQuerySchema = z.object({});
