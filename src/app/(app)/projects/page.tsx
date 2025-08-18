import { getClientsAction } from '@/features/clients/actions';
import { getProjectsAction } from '@/features/projects/actions';
import { CreateProjectDialog } from '@/features/projects/components/create-project-dialog';
import { Badge } from '@/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import Link from 'next/link';

export default async function ProjectsPage() {
    const [projects, clients] = await Promise.all([getProjectsAction(), getClientsAction()]);

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">Here is a list of all your projects.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <CreateProjectDialog clients={clients} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Link href={`/projects/${project.id}`} key={project.id}>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    {project.name}
                                    <Badge variant={project.status === 'in_progress' ? 'default' : 'secondary'}>
                                        {project.status.replace('_', ' ')}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Client: {project.expand?.client?.name || 'N/A'}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-[400px]">
                    <h3 className="text-2xl font-bold tracking-tight">You have no projects yet.</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get started by creating a new project.</p>
                    <CreateProjectDialog clients={clients} />
                </div>
            )}
        </div>
    );
}
