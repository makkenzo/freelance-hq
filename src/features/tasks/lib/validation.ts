import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(3, 'Task title must be at least 3 characters long.'),
});

export const updateTaskSchema = z.object({
    title: z.string().min(3, 'Task title must be at least 3 characters long.'),
    status: z.enum(['todo', 'in_progress', 'done']),
});
