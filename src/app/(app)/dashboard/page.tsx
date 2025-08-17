import { getProjectsAction } from '@/actions/project-actions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
    const projects = await getProjectsAction();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Here is an overview of your projects.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <Card key={project.id}>
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                                <CardDescription>{project.client_name || 'No client specified'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                                    {project.status.replace('_', ' ')}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted-foreground col-span-full">You don&apos;t have any projects yet.</p>
                )}
            </div>
        </div>
    );
}
