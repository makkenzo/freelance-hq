import { createServerClient } from '@/lib/pb/server';

import type { Task, TaskStatus } from './types';

type TaskUpdatePayload = {
    title?: string;
    status?: TaskStatus;
};

export const tasksRepository = {
    async getAllByProjectId(projectId: string, userId: string): Promise<Task[]> {
        const pb = await createServerClient();
        try {
            return await pb.collection('tasks').getFullList<Task>({
                filter: `project = "${projectId}" && user = "${userId}"`,
                sort: '-created',
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    },

    async create(data: { title: string; projectId: string; userId: string }): Promise<Task> {
        const pb = await createServerClient();
        return await pb.collection('tasks').create<Task>({
            title: data.title,
            project: data.projectId,
            user: data.userId,
            status: 'todo',
            priority: 'medium',
        });
    },

    async update(taskId: string, data: TaskUpdatePayload): Promise<Task> {
        const pb = await createServerClient();
        return await pb.collection('tasks').update<Task>(taskId, data);
    },

    async delete(taskId: string): Promise<void> {
        const pb = await createServerClient();
        await pb.collection('tasks').delete(taskId);
    },
};
