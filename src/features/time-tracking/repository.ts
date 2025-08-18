import { createServerClient } from '@/lib/pb/server';

import type { TimeEntry } from './types';

export const timeEntriesRepository = {
    async getByTaskId(taskId: string, userId: string): Promise<TimeEntry[]> {
        const pb = await createServerClient();
        try {
            return await pb.collection('time_entries').getFullList<TimeEntry>({
                filter: `task = "${taskId}" && user = "${userId}"`,
                sort: '-entry_date',
            });
        } catch (error) {
            console.error('Error fetching time entries:', error);
            return [];
        }
    },

    async create(data: {
        duration: number;
        entry_date: string;
        notes?: string;
        taskId: string;
        projectId: string;
        userId: string;
    }): Promise<TimeEntry> {
        const pb = await createServerClient();
        return await pb.collection('time_entries').create<TimeEntry>({
            duration: data.duration,
            entry_date: data.entry_date,
            notes: data.notes,
            task: data.taskId,
            project: data.projectId,
            user: data.userId,
        });
    },

    async delete(entryId: string): Promise<void> {
        const pb = await createServerClient();
        await pb.collection('time_entries').delete(entryId);
    },
};
