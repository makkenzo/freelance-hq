import { createServerClient } from '@/lib/pb/server';

import type { Project } from './types';

type ProjectUpdatePayload = {
    name: string;
    status: 'in_progress' | 'completed' | 'on_hold';
    hourly_rate: number;
    client?: string;
};

export const projectsRepository = {
    async getAllByUserId(userId: string): Promise<Project[]> {
        const pb = await createServerClient();
        try {
            return await pb.collection('projects').getFullList<Project>({
                filter: `user = "${userId}"`,
                sort: '-created',
                expand: 'client',
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
                .getFirstListItem<Project>(`id = "${projectId}" && user = "${userId}"`, {
                    expand: 'client',
                });
        } catch (error: any) {
            if (error.status === 404) {
                return null;
            }
            console.error('Error fetching project by ID:', error);
            throw error;
        }
    },

    async create(data: { name: string; client?: string; userId: string }): Promise<Project> {
        const pb = await createServerClient();
        return await pb.collection('projects').create<Project>({
            name: data.name,
            client: data.client,
            user: data.userId,
            status: 'in_progress',
        });
    },

    async update(projectId: string, data: ProjectUpdatePayload): Promise<Project> {
        const pb = await createServerClient();
        const payload = { ...data };
        if (!payload.client || payload.client === 'none') {
            delete payload.client;
        }
        return await pb.collection('projects').update<Project>(projectId, payload);
    },
};
