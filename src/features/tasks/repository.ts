import { createServerClient } from '@/lib/pb/server';
import z from 'zod';

import { createTaskSchema, updateTaskSchema } from './lib/validation';
import type { Task, TaskStatus } from './types';

type TaskCreatePayload = z.infer<typeof createTaskSchema> & {
    projectId: string;
    userId: string;
};
type TaskUpdatePayload = z.infer<typeof updateTaskSchema>;

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

    async create(data: TaskCreatePayload): Promise<Task> {
        const pb = await createServerClient();
        return await pb.collection('tasks').create<Task>({
            title: data.title,
            description: data.description,
            project: data.projectId,
            user: data.userId,
            status: 'todo',
            priority: data.priority,
            due_date: data.due_date || null,
        });
    },

    async update(taskId: string, data: TaskUpdatePayload): Promise<Task> {
        const pb = await createServerClient();
        const dataToUpdate = { ...data, due_date: data.due_date || null };
        return await pb.collection('tasks').update<Task>(taskId, dataToUpdate);
    },

    async delete(taskId: string): Promise<void> {
        const pb = await createServerClient();
        await pb.collection('tasks').delete(taskId);
    },
};
