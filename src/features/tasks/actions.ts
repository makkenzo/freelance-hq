'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';

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

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        due_date: formData.get('due_date') || undefined,
    };

    const validationResult = createTaskSchema.safeParse(rawData);
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
            ...validationResult.data,
            projectId: projectId,
            userId: pb.authStore.record!.id,
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

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        priority: formData.get('priority'),
        due_date: formData.get('due_date') || undefined,
    };

    const validationResult = updateTaskSchema.safeParse(rawData);

    if (!validationResult.success) {
        const fieldErrors = validationResult.error.format();
        return {
            error: 'Validation failed.',
            fieldErrors: {
                title: fieldErrors.title?._errors[0],
                status: fieldErrors.status?._errors[0],
                priority: fieldErrors.priority?._errors[0],
                due_date: fieldErrors.due_date?._errors[0],
                description: fieldErrors.description?._errors[0],
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
