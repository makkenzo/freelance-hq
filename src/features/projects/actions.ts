'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';

import { projectsRepository } from './repository';
import type { CreateProjectActionState, Project } from './types';

export async function getProjectsAction(): Promise<Project[]> {
    const pb = await createServerClient();
    if (!pb.authStore.record?.id) {
        return [];
    }
    return projectsRepository.getAllByUserId(pb.authStore.record.id);
}

export async function createProjectAction(
    prevState: CreateProjectActionState,
    formData: FormData
): Promise<CreateProjectActionState> {
    const pb = await createServerClient();
    if (!pb.authStore.isValid || !pb.authStore.model?.id) {
        return { error: 'You must be logged in to create a project.' };
    }

    const name = formData.get('name') as string;
    if (!name) {
        return { error: 'Project name is required.' };
    }

    try {
        await projectsRepository.create({
            name,
            client_name: formData.get('client_name') as string,
            userId: pb.authStore.model.id,
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create the project.' };
    }
}
