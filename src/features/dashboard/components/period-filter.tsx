'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function PeriodFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPeriod = searchParams.get('period') || 'all_time';

    const handlePeriodChange = (period: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('period', period);
        router.push(`${pathname}?${params.toString()}`);
    };

    const periods = [
        { label: 'Last 7 Days', value: 'last_7_days' },
        { label: 'Last 30 Days', value: 'last_30_days' },
        { label: 'Last 12 Months', value: 'last_12_months' },
        { label: 'All Time', value: 'all_time' },
    ];

    return periods.map((period) => (
        <Button
            key={period.value}
            variant={currentPeriod === period.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handlePeriodChange(period.value)}
            className={cn(
                'transition-colors hover:bg-white w-full',
                currentPeriod === period.value && 'bg-white text-foreground shadow '
            )}
        >
            {period.label}
        </Button>
    ));
}
