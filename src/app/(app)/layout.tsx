import { Sidebar } from '@/features/dashboard/components/sidebar';
import { createServerClient } from '@/lib/pb/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function UserNav({ user }: { user: any }) {
    return (
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, {user.name || user.email}</span>

            <form
                action={async () => {
                    'use server';
                    (await cookies()).delete('pb_auth');
                    redirect('/login');
                }}
            >
                <button type="submit" className="text-sm font-semibold underline">
                    Logout
                </button>
            </form>
        </div>
    );
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const pb = await createServerClient();

    if (!pb.authStore.isValid) {
        redirect('/login');
    }

    return (
        <div className="flex h-screen bg-gray-50 w-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
    );
}
