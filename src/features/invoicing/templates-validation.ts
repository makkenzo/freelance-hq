import { z } from 'zod';

export const upsertTemplateSchema = z.object({
    name: z.string().min(3, 'Template name is too short.'),
    accent_color: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, 'Enter a valid hex color code. Example: #FF0000')
        .optional()
        .or(z.literal('')),
    sender_details: z.string().optional(),
    footer_notes: z.string().optional(),
    is_default: z.coerce.boolean(),
});
