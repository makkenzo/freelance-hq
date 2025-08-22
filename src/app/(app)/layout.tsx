import { Sidebar } from '@/features/dashboard/components/sidebar';
import { createServerClient } from '@/lib/pb/server';
import { redirect } from 'next/navigation';

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
