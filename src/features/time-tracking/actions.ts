'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';

import { createTimeEntrySchema } from './lib/validation';
import { timeEntriesRepository } from './repository';
import type { CreateTimeEntryActionState, TimeEntry } from './types';

export async function getTimeEntriesForTaskAction(taskId: string): Promise<TimeEntry[]> {
    const pb = await createServerClient();
    if (!pb.authStore.record?.id) return [];
    return timeEntriesRepository.getByProjectId(taskId, pb.authStore.record.id);
}

export async function createTimeEntryAction(
    { taskId, projectId }: { taskId: string; projectId: string },
    prevState: CreateTimeEntryActionState,
    formData: FormData
): Promise<CreateTimeEntryActionState> {
    const pb = await createServerClient();
    if (!pb.authStore.isValid || !pb.authStore.model?.id) {
        return { error: 'You must be logged in.' };
    }

    const rawData = {
        duration: formData.get('duration'),
        entry_date: formData.get('entry_date'),
        notes: formData.get('notes'),
    };

    const validationResult = createTimeEntrySchema.safeParse(rawData);
    if (!validationResult.success) {
        const fieldErrors = validationResult.error.format();
        return {
            error: 'Validation failed.',
            fieldErrors: {
                duration: fieldErrors.duration?._errors[0],
                entry_date: fieldErrors.entry_date?._errors[0],
            },
        };
    }

    try {
        await timeEntriesRepository.create({
            ...validationResult.data,
            taskId,
            projectId,
            userId: pb.authStore.model.id,
        });
        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create time entry.' };
    }
}

export async function deleteTimeEntryAction(entryId: string, projectId: string) {
    const pb = await createServerClient();
    if (!pb.authStore.isValid) return;

    try {
        await timeEntriesRepository.delete(entryId);
        revalidatePath(`/projects/${projectId}`);
    } catch (e) {
        console.error(e);
    }
}
