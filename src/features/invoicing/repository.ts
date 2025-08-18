import { createServerClient } from '@/lib/pb/server';

import type { Invoice } from './types';

export const invoicesRepository = {
    async getAllByUserId(userId: string): Promise<Invoice[]> {
        const pb = await createServerClient();
        return pb.collection('invoices').getFullList<Invoice>({
            filter: `user = "${userId}"`,
            sort: '-issue_date',
            expand: 'client,project',
        });
    },

    async getByProjectId(projectId: string, userId: string): Promise<Invoice[]> {
        const pb = await createServerClient();
        return pb.collection('invoices').getFullList<Invoice>({
            filter: `project = "${projectId}" && user = "${userId}"`,
            sort: '-issue_date',
            expand: 'client,project',
        });
    },

    async create(data: Omit<Invoice, 'id' | 'expand'>): Promise<Invoice> {
        const pb = await createServerClient();
        return pb.collection('invoices').create<Invoice>(data);
    },

    async countAll(userId: string): Promise<number> {
        const pb = await createServerClient();
        const { totalItems } = await pb.collection('invoices').getList(1, 1, {
            filter: `user = "${userId}"`,
        });
        return totalItems;
    },
};
