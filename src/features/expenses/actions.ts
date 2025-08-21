'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';

import { createExpenseSchema } from './lib/validation';
import { expensesRepository } from './repository';
import type { CreateExpenseActionState, Expense } from './types';

export async function getExpensesAction(): Promise<Expense[]> {
    const pb = await createServerClient();
    if (!pb.authStore.record?.id) {
        return [];
    }
    return expensesRepository.getAllByUserId(pb.authStore.record.id);
}

export async function createExpenseAction(
    prevState: CreateExpenseActionState,
    formData: FormData
): Promise<CreateExpenseActionState> {
    const pb = await createServerClient();
    const userId = pb.authStore.model?.id;
    if (!pb.authStore.isValid || !userId) {
        return { error: 'You must be logged in.' };
    }

    const rawData = {
        description: formData.get('description'),
        amount: formData.get('amount'),
        expense_date: formData.get('expense_date'),
        projectId: formData.get('projectId') || undefined,
        receipt: formData.get('receipt'),
    };

    const validationResult = createExpenseSchema.safeParse(rawData);

    if (!validationResult.success) {
        const fieldErrors = validationResult.error.format();
        return {
            error: 'Validation failed.',
            fieldErrors: {
                description: fieldErrors.description?._errors,
                amount: fieldErrors.amount?._errors,
                expense_date: fieldErrors.expense_date?._errors,
            },
        };
    }

    try {
        const dataToCreate: any = {
            ...validationResult.data,
            user: userId,
        };

        if (validationResult.data.projectId === 'none') {
            delete dataToCreate.projectId;
        } else {
            dataToCreate.project = validationResult.data.projectId;
        }

        await pb.collection('expenses').create(dataToCreate);

        revalidatePath('/expenses');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create the expense.' };
    }
}
