'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

import { createProjectSchema } from './lib/validation';
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
    const client_name = formData.get('client_name') as string;

    const validationResult = createProjectSchema.safeParse({ name, client_name });

    if (!validationResult.success) {
        const fieldErrors = validationResult.error.flatten().fieldErrors;
        const nameErrorMessage = fieldErrors.name?.[0];
        return { error: nameErrorMessage || 'An unknown validation error occurred.' };
    }

    try {
        await projectsRepository.create({
            ...validationResult.data,
            userId: pb.authStore.model.id,
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create the project.' };
    }
}

export async function getProjectByIdAction(projectId: string): Promise<Project> {
    const pb = await createServerClient();
    if (!pb.authStore.record?.id) {
        notFound();
    }

    const project = await projectsRepository.getById(projectId, pb.authStore.record.id);

    if (!project) {
        notFound();
    }

    return project;
}
