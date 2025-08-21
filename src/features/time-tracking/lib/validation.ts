import { z } from 'zod';

export const createTimeEntrySchema = z.object({
    duration: z.coerce.number().min(1, 'Duration must be at least 1 minute.'),
    entry_date: z.string().min(1, 'Please select a date.'),
    notes: z.string().nullable().optional(),
});
