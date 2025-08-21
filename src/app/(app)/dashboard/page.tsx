import { getClientsAction } from '@/features/clients/actions';
import { RecentClientsList } from '@/features/clients/components/recent-clients-list';
import { UpcomingTasksList } from '@/features/clients/components/upcoming-tasks-list';
import { MetricCard } from '@/features/dashboard/components/metric-card';
import { PeriodFilter } from '@/features/dashboard/components/period-filter';
import { RevenueChart } from '@/features/invoicing/components/revenue-chart';
import { invoicesRepository } from '@/features/invoicing/repository';
import { getProjectsAction } from '@/features/projects/actions';
import { CreateProjectDialog } from '@/features/projects/components/create-project-dialog';
import { timeEntriesRepository } from '@/features/time-tracking/repository';
import { createServerClient } from '@/lib/pb/server';
import { formatDuration } from '@/lib/utils';
import { Briefcase, Clock, DollarSign, FileText, Plus } from 'lucide-react';

interface DashboardPageProps {
    searchParams: Promise<{
        period?: string;
    }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const pb = await createServerClient();
    const user = pb.authStore.record;
    const period = (await searchParams).period;

    if (!user) {
        return null;
    }

    const [invoiceStats, monthlyRevenueData, totalMinutesTracked, projects, clients] = await Promise.all([
        invoicesRepository.getStats(user.id, period),
        invoicesRepository.getMonthlyRevenue(user.id),
        timeEntriesRepository.getTotalMinutesTracked(user.id, period),
        getProjectsAction(),
        getClientsAction(),
    ]);

    const activeProjects = projects.filter((p) => p.status === 'in_progress').length;
    const totalHoursTracked = formatDuration(totalMinutesTracked);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                    <p className="text-gray-600 mt-1">
                        Here&apos;s what&apos;s happening with your freelance business today.
                    </p>
                </div>
                <CreateProjectDialog clients={clients} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4">
                <PeriodFilter />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={`$${invoiceStats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                />
                <MetricCard title="Active Projects" value={activeProjects.toString()} icon={Briefcase} />
                <MetricCard
                    title="Pending Invoices"
                    value={invoiceStats.pendingCount.toString()}
                    trend={`$${invoiceStats.pendingAmount.toLocaleString()} outstanding`}
                    icon={FileText}
                />
                <MetricCard title="Hours Tracked" value={totalHoursTracked} icon={Clock} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueChart data={monthlyRevenueData} />
                <UpcomingTasksList projects={projects} />
                <RecentClientsList clients={clients} />
            </div>
        </div>
    );
}
