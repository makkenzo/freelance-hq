import { getProjectByIdAction } from '@/features/projects/actions';
import { getTasksByProjectIdAction } from '@/features/tasks/actions';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';
import { TaskList } from '@/features/tasks/components/task-list';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Separator } from '@/ui/separator';
import { Edit } from 'lucide-react';

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
    const { id: projectId } = await params;
    const [project, tasks] = await Promise.all([getProjectByIdAction(projectId), getTasksByProjectIdAction(projectId)]);

    const statusVariant = (status: string) => {
        switch (status) {
            case 'in_progress':
                return 'default';
            case 'completed':
                return 'secondary';
            case 'on_hold':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                    <p className="text-muted-foreground">Client: {project.client_name || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant={statusVariant(project.status)}>{project.status.replace('_', ' ')}</Badge>
                    <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Project
                    </Button>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Tasks</h2>

                    <CreateTaskDialog projectId={project.id} />
                </div>
                <TaskList tasks={tasks} />
            </div>
        </div>
    );
}
