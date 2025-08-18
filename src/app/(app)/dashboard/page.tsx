import { getClientsAction } from '@/features/clients/actions';
import { RecentClientsList } from '@/features/clients/components/recent-clients-list';
import { UpcomingTasksList } from '@/features/clients/components/upcoming-tasks-list';
import { RevenueChart } from '@/features/invoicing/components/revenue-chart';
import { invoicesRepository } from '@/features/invoicing/repository';
import { getProjectsAction } from '@/features/projects/actions';
import { CreateProjectDialog } from '@/features/projects/components/create-project-dialog';
import { KpiCard } from '@/features/projects/components/kpi-card';
import { timeEntriesRepository } from '@/features/time-tracking/repository';
import { createServerClient } from '@/lib/pb/server';
import { formatDuration } from '@/lib/utils';
import { Briefcase, Clock, DollarSign, FileText } from 'lucide-react';

export default async function DashboardPage() {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;

    if (!userId) {
        return <p>Please log in to see your dashboard.</p>;
    }

    const [projects, clients, invoiceStats, totalMinutes, monthlyRevenue] = await Promise.all([
        getProjectsAction(),
        getClientsAction(),
        invoicesRepository.getStats(userId),
        timeEntriesRepository.getTotalMinutesTracked(userId),
        invoicesRepository.getMonthlyRevenue(userId),
    ]);
    const activeProjects = projects.filter((p) => p.status === 'in_progress').length;

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
                    <p className="text-muted-foreground">
                        Here&apos;s what&apos;s happening with your freelance business today.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <CreateProjectDialog clients={clients} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title="Total Revenue"
                    value={`$${invoiceStats.totalRevenue.toFixed(2)}`}
                    trend="All time paid invoices"
                    icon={DollarSign}
                />
                <KpiCard
                    title="Active Projects"
                    value={activeProjects.toString()}
                    trend={`Total ${projects.length} projects`}
                    icon={Briefcase}
                />
                <KpiCard
                    title="Pending Invoices"
                    value={invoiceStats.pendingCount.toString()}
                    trend={`$${invoiceStats.pendingAmount.toFixed(2)} outstanding`}
                    icon={FileText}
                />
                <KpiCard
                    title="Hours Tracked"
                    value={formatDuration(totalMinutes)}
                    trend="Total hours recorded"
                    icon={Clock}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <RevenueChart data={monthlyRevenue} />
                <UpcomingTasksList projects={projects} />
                <RecentClientsList clients={clients} />
            </div>
        </div>
    );
}
