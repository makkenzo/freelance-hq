import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(3, 'Task title must be at least 3 characters long.'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    due_date: z.string().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(3, 'Task title must be at least 3 characters long.'),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'done']),
    priority: z.enum(['low', 'medium', 'high']),
    due_date: z.string().optional(),
});
