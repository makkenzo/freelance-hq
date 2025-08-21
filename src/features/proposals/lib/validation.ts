import { z } from 'zod';

const proposalItemSchema = z.object({
    description: z.string().min(1, 'Item description cannot be empty.'),
    quantity: z.coerce.number().positive({ message: 'Quantity must be greater than 0.' }),
    unit_price: z.coerce.number().positive({ message: 'Price must be greater than 0.' }),
});

const itemsArraySchema = z.array(proposalItemSchema).min(1, 'Proposal must include at least one item.');

export const createProposalSchema = z.object({
    title: z.string().min(3, 'Proposal title must be at least 3 characters long.'),
    clientId: z.string().min(1, { message: 'Please select a client.' }),
    valid_until: z
        .string()
        .optional()
        .transform((val) => (val === '' ? undefined : val)),
    items: z.string().transform((str, ctx) => {
        try {
            if (!str || str === '[]') {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Proposal must include at least one item.',
                });
                return z.NEVER;
            }
            const parsed = JSON.parse(str);
            const validation = itemsArraySchema.safeParse(parsed);

            if (!validation.success) {
                const firstErrorMessage = validation.error.issues[0]?.message || 'Invalid item data.';
                ctx.addIssue({
                    code: 'custom',
                    message: `Error in items: ${firstErrorMessage}`,
                });
                return z.NEVER;
            }
            return validation.data;
        } catch (e) {
            ctx.addIssue({ code: 'custom', message: 'Invalid item format.' });
            return z.NEVER;
        }
    }),
});
