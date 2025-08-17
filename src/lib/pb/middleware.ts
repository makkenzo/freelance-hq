import type { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';
import 'server-only';

export async function createMiddlewareClient(request: NextRequest) {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    const cookie = request.cookies.get('pb_auth')?.value;
    pb.authStore.loadFromCookie(cookie || '');

    try {
        if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh();
        }
    } catch (_) {
        pb.authStore.clear();
    }

    return pb;
}
