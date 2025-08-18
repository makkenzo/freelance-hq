import { getClientsAction } from '@/features/clients/actions';
import { getInvoicesForProjectAction } from '@/features/invoicing/actions';
import { getProjectByIdAction } from '@/features/projects/actions';
import { ProjectDetailsView } from '@/features/projects/components/project-details-view';
import { getTasksByProjectIdAction } from '@/features/tasks/actions';
import { timeEntriesRepository } from '@/features/time-tracking/repository';
import { createServerClient } from '@/lib/pb/server';

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;
    if (!userId) return null;

    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    const [project, tasks, invoices, clients, timeEntries] = await Promise.all([
        getProjectByIdAction(projectId),
        getTasksByProjectIdAction(projectId),
        getInvoicesForProjectAction(projectId),
        getClientsAction(),
        timeEntriesRepository.getByProjectId(projectId, userId),
    ]);

    return (
        <ProjectDetailsView
            project={project}
            tasks={tasks}
            invoices={invoices}
            clients={clients}
            timeEntries={timeEntries}
        />
    );
}
