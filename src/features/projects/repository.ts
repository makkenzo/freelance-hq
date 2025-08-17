import { createServerClient } from '@/lib/pb/server';

import type { Project } from './types';

export const projectsRepository = {
    async getAllByUserId(userId: string): Promise<Project[]> {
        const pb = await createServerClient();
        try {
            return await pb.collection('projects').getFullList<Project>({
                filter: `user = "${userId}"`,
                sort: '-created',
            });
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    },

    async create(data: { name: string; client_name: string; userId: string }): Promise<Project> {
        const pb = await createServerClient();
        return await pb.collection('projects').create<Project>({
            ...data,
            user: data.userId,
            status: 'in_progress',
        });
    },
};
