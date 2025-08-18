import { getClientsAction } from '@/features/clients/actions';
import { RecentClientsList } from '@/features/clients/components/recent-clients-list';
import { UpcomingTasksList } from '@/features/clients/components/upcoming-tasks-list';
import { getProjectsAction } from '@/features/projects/actions';
import { CreateProjectDialog } from '@/features/projects/components/create-project-dialog';
import { KpiCard } from '@/features/projects/components/kpi-card';
import { RevenueChartPlaceholder } from '@/features/projects/components/revenue-chart';
import { Briefcase, Clock, DollarSign, FileText } from 'lucide-react';

export default async function DashboardPage() {
    const [projects, clients] = await Promise.all([getProjectsAction(), getClientsAction()]);
    const activeProjects = projects.filter((p) => p.status === 'in_progress').length;

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back, Alex!</h2>
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
                    title="Active Projects"
                    value={activeProjects.toString()}
                    trend={`Total ${projects.length} projects`}
                    icon={Briefcase}
                />

                <KpiCard title="Total Revenue" value="$24,550" trend="↑ 8.2% vs last month" icon={DollarSign} />
                <KpiCard title="Pending Invoices" value="3" trend="$5,240 outstanding" icon={FileText} />
                <KpiCard title="Hours Tracked" value="164h" trend="↑ 12% vs last month" icon={Clock} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <RevenueChartPlaceholder />

                <UpcomingTasksList projects={projects} />
                <RecentClientsList clients={clients} />
            </div>
        </div>
    );
}
