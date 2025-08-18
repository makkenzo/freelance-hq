'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';

import { createClientSchema } from './lib/validation';
import { clientsRepository } from './repository';
import type { Client, CreateClientActionState } from './types';

export async function getClientsAction(): Promise<Client[]> {
    const pb = await createServerClient();
    if (!pb.authStore.record?.id) {
        return [];
    }
    return clientsRepository.getAllByUserId(pb.authStore.record.id);
}

export async function createClientAction(
    prevState: CreateClientActionState,
    formData: FormData
): Promise<CreateClientActionState> {
    const pb = await createServerClient();
    if (!pb.authStore.isValid || !pb.authStore.model?.id) {
        return { error: 'You must be logged in.' };
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;

    const validationResult = createClientSchema.safeParse({ name, email, company });
    if (!validationResult.success) {
        const fieldErrors = validationResult.error.format();
        return {
            error: 'Validation failed.',
            fieldErrors: {
                name: fieldErrors.name?._errors[0],
                client_email: fieldErrors.email?._errors[0],
            },
        };
    }

    try {
        await clientsRepository.create({
            ...validationResult.data,
            userId: pb.authStore.model.id,
        });

        revalidatePath('/clients');
        revalidatePath('/projects');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create the client. The email might already be in use.' };
    }
}
