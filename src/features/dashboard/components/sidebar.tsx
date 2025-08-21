'use client';

import { createTimeEntryAction } from '@/features/time-tracking/actions';
import { cn, formatSecondsToHMS } from '@/lib/utils';
import { useTimeTrackingStore } from '@/providers/time-tracking-store-provider';
import { Button } from '@/ui/button';
import {
    BarChart3,
    Briefcase,
    Clock,
    FileText,
    HelpCircle,
    Home,
    Receipt,
    Settings,
    Square,
    Users,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Expenses', href: '/expenses', icon: Receipt },
    { name: 'Time Tracking', href: '#', icon: Clock }, // Placeholder
    { name: 'Reports', href: '#', icon: BarChart3 }, // Placeholder
];

const bottomNavigation = [
    { name: 'Settings', href: '#', icon: Settings },
    { name: 'Help & Support', href: '#', icon: HelpCircle },
];

const ActiveTimer = () => {
    const { activeTask, elapsedSeconds, stopTimer } = useTimeTrackingStore((state) => state);

    if (!activeTask) return null;

    const handleStop = async () => {
        const { durationInMinutes, task } = stopTimer();

        if (!task) return;

        const formData = new FormData();
        formData.append('duration', durationInMinutes.toString());
        formData.append('entryDate', new Date().toISOString().split('T')[0]);

        const result = await createTimeEntryAction(
            {
                taskId: task.id,
                projectId: task.project,
            },
            { success: false },
            formData
        );

        if (result.success) {
            toast.success(`Time entry of ${durationInMinutes} min saved for "${task.title}"`);
        } else {
            toast.error(result.error || 'Failed to save time entry');
        }
    };

    return (
        <div className="p-4 border-t border-gray-200 bg-amber-50">
            <div className="text-sm font-semibold text-gray-800 truncate">{activeTask.title}</div>
            <div className="flex items-center justify-between mt-2">
                <div className="text-lg font-mono text-gray-900">{formatSecondsToHMS(elapsedSeconds)}</div>
                <Button variant="destructive" size="sm" onClick={handleStop}>
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                </Button>
            </div>
        </div>
    );
};

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

            <ActiveTimer />

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
