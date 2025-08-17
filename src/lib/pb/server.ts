import { cookies } from 'next/headers';
import PocketBase from 'pocketbase';
import 'server-only';

export async function createServerClient() {
    const cookieStore = await cookies();
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    const authCookie = cookieStore.get('pb_auth')?.value;
    pb.authStore.loadFromCookie(authCookie || '');

    try {
        if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh();
        }
    } catch (_) {
        pb.authStore.clear();
    }

    pb.authStore.onChange((token, model) => {
        const newCookie = pb.authStore.exportToCookie({
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        });
        cookieStore.set('pb_auth', newCookie);
    });

    return pb;
}
