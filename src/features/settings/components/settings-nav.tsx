'use client';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarNavItems = [
    {
        title: 'Profile',
        href: '/settings/profile',
    },
    {
        title: 'Account',
        href: '/settings/account',
    },
    {
        title: 'Invoicing',
        href: '/settings/invoicing',
    },
    {
        title: 'Notifications',
        href: '/settings/notifications',
    },
];

export function SettingsNav() {
    const pathname = usePathname();

    return (
        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        pathname === item.href ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline',
                        'justify-start'
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    );
}
