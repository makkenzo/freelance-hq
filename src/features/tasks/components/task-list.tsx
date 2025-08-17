import { Badge } from '@/ui/badge';
import { Card, CardContent } from '@/ui/card';

import type { Task } from '../types';
import { TaskActions } from './task-actions';

interface TaskListProps {
    tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center h-60 bg-gray-50/50 rounded-lg">
                    <h3 className="text-xl font-semibold tracking-tight">No tasks yet.</h3>
                    <p className="text-sm text-muted-foreground">Add your first task to get started.</p>
                </CardContent>
            </Card>
        );
    }

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'done':
                return <Badge variant="secondary">Done</Badge>;
            case 'in_progress':
                return <Badge>In Progress</Badge>;
            default:
                return <Badge variant="outline">To Do</Badge>;
        }
    };

    return (
        <Card>
            <CardContent className="p-0">
                <ul className="divide-y">
                    {tasks.map((task) => (
                        <li key={task.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                            <div className="flex items-center gap-4">
                                {getStatusBadge(task.status)}
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">{task.title}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {task.due_date
                                            ? `Due: ${new Date(task.due_date).toLocaleDateString()}`
                                            : 'No due date'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                                <TaskActions task={task} />
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
