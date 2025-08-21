import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];

export const createExpenseSchema = z.object({
    description: z.string().min(3, 'Description must be at least 3 characters long.'),
    amount: z.coerce.number().positive('Amount must be a positive number.'),
    expense_date: z.string().min(1, 'Please select a date.'),
    projectId: z.string().optional(),
    receipt: z
        .any()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            '.jpg, .jpeg, .png, .webp and .pdf files are accepted.'
        )
        .optional(),
});
