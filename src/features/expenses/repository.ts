import { createServerClient } from '@/lib/pb/server';

import type { Expense } from './types';

export const expensesRepository = {
    async getAllByUserId(userId: string): Promise<Expense[]> {
        const pb = await createServerClient();
        try {
            return await pb.collection('expenses').getFullList<Expense>({
                filter: `user = "${userId}"`,
                sort: '-expense_date',
                expand: 'project',
            });
        } catch (error) {
            console.error('Error fetching expenses:', error);
            return [];
        }
    },
};
