import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z.string().min(3, 'Project name must be at least 3 characters long.'),
});

export const updateProjectSchema = z.object({
    name: z.string().min(3, 'Project name must be at least 3 characters long.'),
    status: z.enum(['in_progress', 'completed', 'on_hold']),
    hourly_rate: z.coerce.number().min(0, 'Hourly rate must be a positive number.'),
    clientId: z.string().optional(),
});
