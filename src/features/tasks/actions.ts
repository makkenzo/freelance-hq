'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';
import z from 'zod';

import { createTaskSchema, updateTaskSchema } from './lib/validation';
import { tasksRepository } from './repository';
import type { CreateTaskActionState, Task, TaskStatus, UpdateTaskActionState } from './types';

export async function getTasksByProjectIdAction(projectId: string): Promise<Task[]> {
    const pb = await createServerClient();
    if (!pb.authStore.record?.id) {
        return [];
    }

    const tasks = await tasksRepository.getAllByProjectId(projectId, pb.authStore.record.id);
    return tasks;
}

export async function createTaskAction(
    projectId: string,
    prevState: CreateTaskActionState,
    formData: FormData
): Promise<CreateTaskActionState> {
    const pb = await createServerClient();
    if (!pb.authStore.isValid || !pb.authStore.model?.id) {
        return { error: 'You must be logged in to create a task.' };
    }

    const title = formData.get('title') as string;

    const validationResult = createTaskSchema.safeParse({ title });
    if (!validationResult.success) {
        const fieldErrors = validationResult.error.format();
        return {
            error: 'Validation failed.',
            fieldErrors: {
                title: fieldErrors.title?._errors[0],
            },
        };
    }

    try {
        await tasksRepository.create({
            title: validationResult.data.title,
            projectId: projectId,
            userId: pb.authStore.model.id,
        });

        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create the task.' };
    }
}

export async function updateTaskAction(
    taskId: string,
    projectId: string,
    prevState: UpdateTaskActionState,
    formData: FormData
): Promise<UpdateTaskActionState> {
    const pb = await createServerClient();
    if (!pb.authStore.isValid) {
        return { error: 'You must be logged in.' };
    }

    const title = formData.get('title') as string;
    const status = formData.get('status') as TaskStatus;

    const validationResult = updateTaskSchema.safeParse({ title, status });

    if (!validationResult.success) {
        const fieldErrors = validationResult.error.format();
        return {
            error: 'Validation failed.',

            fieldErrors: {
                title: fieldErrors.title?._errors[0],
                status: fieldErrors.status?._errors[0],
            },
        };
    }

    try {
        await tasksRepository.update(taskId, validationResult.data);
        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to update the task.' };
    }
}

export async function deleteTaskAction(
    taskId: string,
    projectId: string
): Promise<{ success: boolean; error?: string }> {
    const pb = await createServerClient();
    if (!pb.authStore.isValid) {
        return { success: false, error: 'You must be logged in.' };
    }

    try {
        await tasksRepository.delete(taskId);
        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to delete the task.' };
    }
}
