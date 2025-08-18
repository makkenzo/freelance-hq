import { z } from 'zod';

export const createClientSchema = z.object({
    name: z.string().min(2, 'Client name must be at least 2 characters long.'),
    email: z.email('Please enter a valid email address.').optional().or(z.literal('')),
    company: z.string().optional(),
});
