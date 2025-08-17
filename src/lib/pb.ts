import { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export async function initPocketBase(request: NextRequest) {
    const pb_server = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    const cookie = request.cookies.get('pb_auth')?.value;
    pb_server.authStore.loadFromCookie(cookie || '');

    try {
        if (pb_server.authStore.isValid) {
            await pb_server.collection('users').authRefresh();
        }
    } catch (_) {
        pb_server.authStore.clear();
    }

    return pb_server;
}
