'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import { BarChart3, Briefcase, Clock, FileText, HelpCircle, Home, Settings, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Time Tracking', href: '#', icon: Clock }, // Placeholder
    { name: 'Reports', href: '#', icon: BarChart3 }, // Placeholder
];

const bottomNavigation = [
    { name: 'Settings', href: '#', icon: Settings },
    { name: 'Help & Support', href: '#', icon: HelpCircle },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex w-64 flex-col bg-white border-r border-gray-200">
            <div className="flex items-center gap-2 p-6 border-b border-gray-200">
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Freelance HQ</span>
            </div>

            <div className="flex items-center gap-3 p-6 border-b border-gray-200">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">AM</span>
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-900">Alex Morgan</div>
                    <div className="text-xs text-gray-500">Freelance Designer</div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {navigation.map((item) => {
                    const isCurrent = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                isCurrent
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 py-4 border-t border-gray-200 space-y-1">
                {bottomNavigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                    </Link>
                ))}
            </div>

            <div className="p-4">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade
                </Button>
            </div>
        </div>
    );
}
