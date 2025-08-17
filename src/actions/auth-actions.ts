'use server';

import { pb } from '@/lib/pb';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface ActionState {
    error?: string;
}

export async function loginAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        await pb.collection('users').authWithPassword(email, password);

        const authCookie = pb.authStore.exportToCookie({ httpOnly: false });
        (await cookies()).set('pb_auth', authCookie);
    } catch (e: any) {
        console.error(e);
        return { error: 'Invalid credentials. Please try again.' };
    }

    redirect('/dashboard');
}

export async function registerAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('passwordConfirm') as string;

    if (password !== passwordConfirm) {
        return { error: 'Passwords do not match.' };
    }

    try {
        await pb.collection('users').create({ name, email, password, passwordConfirm });
        await pb.collection('users').authWithPassword(email, password);

        const authCookie = pb.authStore.exportToCookie({ httpOnly: false });
        (await cookies()).set('pb_auth', authCookie);
    } catch (e: any) {
        console.error(e);
        return { error: 'Failed to create account. Email may already be in use.' };
    }

    redirect('/dashboard');
}
