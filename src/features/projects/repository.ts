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

    async getById(projectId: string, userId: string): Promise<Project | null> {
        const pb = await createServerClient();
        try {
            return await pb
                .collection('projects')
                .getFirstListItem<Project>(`id = "${projectId}" && user = "${userId}"`);
        } catch (error: any) {
            if (error.status === 404) {
                return null;
            }
            console.error('Error fetching project by ID:', error);
            throw error;
        }
    },

    async create(data: { name: string; client_name?: string; userId: string }): Promise<Project> {
        const pb = await createServerClient();
        return await pb.collection('projects').create<Project>({
            ...data,
            user: data.userId,
            status: 'in_progress',
        });
    },
};
