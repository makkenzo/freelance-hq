'use server';

import { createServerClient } from '@/lib/pb/server';
import { cookies } from 'next/headers';

export interface Project {
    id: string;
    collectionId: string;
    collectionName: string;
    name: string;
    client_name: string;
    status: 'in_progress' | 'completed' | 'on_hold';
    user: string;
    created: string;
    updated: string;
}

export async function getProjectsAction(): Promise<Project[]> {
    const pb = await createServerClient();

    if (!pb.authStore.isValid) {
        return [];
    }

    try {
        const records = await pb.collection('projects').getFullList<Project>({
            filter: `user = "${pb.authStore.model?.id}"`,
            sort: '-created',
        });
        return records;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}
