'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';

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

export interface CreateProjectActionState {
    error?: string;
    success?: boolean;
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

export async function createProjectAction(
    prevState: CreateProjectActionState,
    formData: FormData
): Promise<CreateProjectActionState> {
    const pb = await createServerClient();

    if (!pb.authStore.isValid) {
        return { error: 'You must be logged in to create a project.' };
    }

    const name = formData.get('name') as string;
    const client_name = formData.get('client_name') as string;

    if (!name) {
        return { error: 'Project name is required.' };
    }

    try {
        const newRecord = await pb.collection('projects').create({
            name,
            client_name,
            user: pb.authStore.model?.id,
            status: 'in_progress',
        });

        revalidatePath('/dashboard');

        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create the project.' };
    }
}
