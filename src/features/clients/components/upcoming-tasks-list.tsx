import { getProjectsAction } from '@/features/projects/actions';
import { getTasksByProjectIdAction } from '@/features/tasks/actions';
import type { Task } from '@/features/tasks/types';
import { createServerClient } from '@/lib/pb/server';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import Link from 'next/link';

interface UpcomingTasksListProps {
    projects: Awaited<ReturnType<typeof getProjectsAction>>;
}

export async function UpcomingTasksList({ projects }: UpcomingTasksListProps) {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;

    if (!userId) {
        return null;
    }

    const tasksPromises = projects.map(async (project) => {
        return getTasksByProjectIdAction(project.id);
    });

    const allTasks = (await Promise.all(tasksPromises)).flat();

    const upcomingTasks = allTasks
        .filter((task: Task) => task.status !== 'done')
        .sort((a, b) => {
            if (!a.created || !b.created) return 0;
            return new Date(a.created).getTime() - new Date(b.created).getTime();
        })
        .slice(0, 5);

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Tasks</CardTitle>
                <Link href="/projects">
                    <Button variant="link" size="sm">
                        View All
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {upcomingTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <p className="text-muted-foreground text-sm">No upcoming tasks.</p>
                    </div>
                ) : (
                    <ul className="divide-y">
                        {upcomingTasks.map((task) => (
                            <li key={task.id} className="py-2 flex justify-between items-center">
                                <Link href={`/projects/${task.project}`} className="block hover:underline">
                                    <h4 className="font-semibold">{task.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Project: {projects.find((p) => p.id === task.project)?.name || 'N/A'}
                                    </p>
                                </Link>
                                <span className="text-xs text-muted-foreground">
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
