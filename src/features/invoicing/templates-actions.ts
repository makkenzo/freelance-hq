'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';

import { templatesRepository } from './templates-repository';
import type { InvoiceTemplate, UpsertTemplateActionState } from './templates-types';
import { upsertTemplateSchema } from './templates-validation';

export async function getTemplatesAction(): Promise<InvoiceTemplate[]> {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;
    if (!userId) {
        return [];
    }
    return templatesRepository.getAllByUserId(userId);
}

export async function upsertTemplateAction(
    prevState: UpsertTemplateActionState,
    formData: FormData
): Promise<UpsertTemplateActionState> {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;
    if (!userId) {
        return { error: 'Вы не авторизованы.' };
    }

    const id = formData.get('id') as string | null;

    const validationResult = upsertTemplateSchema.safeParse(Object.fromEntries(formData));

    if (!validationResult.success) {
        return {
            error: 'Ошибка валидации.',
            fieldErrors: validationResult.error.flatten().fieldErrors,
        };
    }

    try {
        if (validationResult.data.is_default) {
            await templatesRepository.unsetAllDefaults(userId, id ?? undefined);
        }

        if (id) {
            await templatesRepository.update(id, formData, userId);
        } else {
            await templatesRepository.create(formData, userId);
        }

        revalidatePath('/settings/invoicing');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Не удалось сохранить шаблон.' };
    }
}

export async function deleteTemplateAction(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await templatesRepository.delete(id);
        revalidatePath('/settings/invoicing');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Не удалось удалить шаблон.' };
    }
}
