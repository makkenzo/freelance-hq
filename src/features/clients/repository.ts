import { createServerClient } from '@/lib/pb/server';

import type { Client } from './types';

export const clientsRepository = {
    async getAllByUserId(userId: string): Promise<Client[]> {
        const pb = await createServerClient();
        try {
            return await pb.collection('clients').getFullList<Client>({
                filter: `user = "${userId}"`,
                sort: 'name',
            });
        } catch (error) {
            console.error('Error fetching clients:', error);
            return [];
        }
    },

    async create(data: { name: string; email?: string; company?: string; userId: string }): Promise<Client> {
        const pb = await createServerClient();
        return await pb.collection('clients').create<Client>({
            name: data.name,
            client_email: data.email,
            company: data.company,
            user: data.userId,
        });
    },
};
