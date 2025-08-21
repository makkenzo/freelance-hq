import { getDateFilter } from '@/lib/helpers';
import { createServerClient } from '@/lib/pb/server';

import type { TimeEntry } from './types';

export const timeEntriesRepository = {
    async getByProjectId(projectId: string, userId: string): Promise<TimeEntry[]> {
        const pb = await createServerClient();
        try {
            return await pb.collection('time_entries').getFullList<TimeEntry>({
                filter: `project = "${projectId}" && user = "${userId}"`,
                sort: '-entry_date',
            });
        } catch (error) {
            console.error('Error fetching time entries:', error);
            return [];
        }
    },

    async getUninvoicedByProjectId(projectId: string, userId: string): Promise<TimeEntry[]> {
        const pb = await createServerClient();
        try {
            return await pb.collection('time_entries').getFullList<TimeEntry>({
                filter: `project = "${projectId}" && user = "${userId}" && invoice = null`,
                sort: '-entry_date',
                expand: 'task',
            });
        } catch (error) {
            console.error('Error fetching uninvoiced time entries:', error);
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

    async getTotalMinutesTracked(userId: string, period?: string): Promise<number> {
        const pb = await createServerClient();
        const dateFilter = getDateFilter(period);

        const entries = await pb.collection('time_entries').getFullList<TimeEntry>({
            filter: `user = "${userId}"${dateFilter ? ' && ' + dateFilter : ''}`,
            fields: 'duration',
        });

        return entries.reduce((acc, entry) => acc + entry.duration, 0);
    },
};
