import { createServerClient } from '@/lib/pb/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
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
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                            <span>Freelance HQ</span>
                        </Link>
                    </div>
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/projects"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            Projects
                        </Link>

                        <Link
                            href="/clients"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            Clients
                        </Link>
                    </nav>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <div className="w-full flex-1"></div>
                    <UserNav user={pb.authStore.record} />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
