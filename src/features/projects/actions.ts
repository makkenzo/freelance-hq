'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

import { createProjectSchema, updateProjectSchema } from './lib/validation';
import { projectsRepository } from './repository';
import type { CreateProjectActionState, Project, UpdateProjectActionState } from './types';

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
    const clientId = formData.get('clientId') as string;

    const validationResult = createProjectSchema.safeParse({ name });

    if (!validationResult.success) {
        const fieldErrors = validationResult.error.flatten().fieldErrors;
        const nameErrorMessage = fieldErrors.name?.[0];
        return { error: nameErrorMessage || 'An unknown validation error occurred.' };
    }

    try {
        await projectsRepository.create({
            name: validationResult.data.name,
            client: clientId,
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

export async function updateProjectAction(
    projectId: string,
    prevState: UpdateProjectActionState,
    formData: FormData
): Promise<UpdateProjectActionState> {
    const pb = await createServerClient();
    if (!pb.authStore.isValid) {
        return { error: 'You must be logged in.' };
    }

    const rawData = Object.fromEntries(formData.entries());
    const validationResult = updateProjectSchema.safeParse(rawData);

    if (!validationResult.success) {
        const fieldErrors = validationResult.error.format();
        return {
            error: 'Validation failed.',
            fieldErrors: {
                name: fieldErrors.name?._errors[0],
                status: fieldErrors.status?._errors[0],
                hourly_rate: fieldErrors.hourly_rate?._errors[0],
            },
        };
    }

    const { clientId, ...rest } = validationResult.data;
    const dataToUpdate = { ...rest, client: clientId };

    try {
        await projectsRepository.update(projectId, dataToUpdate);
        revalidatePath(`/projects/${projectId}`);
        revalidatePath('/dashboard');
        revalidatePath('/projects');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to update the project.' };
    }
}
