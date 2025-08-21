'use client';

import { createTimeEntryAction } from '@/features/time-tracking/actions';
import { TimeTrackingSection } from '@/features/time-tracking/components/time-tracking-section';
import { TimeEntry } from '@/features/time-tracking/types';
import { useTimeTrackingStore } from '@/providers/time-tracking-store-provider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Play, Square } from 'lucide-react';
import { toast } from 'sonner';

import type { Task } from '../types';
import { TaskActions } from './task-actions';

interface TaskListProps {
    tasks: Task[];
    allTimeEntries: TimeEntry[];
}

export function TaskList({ tasks, allTimeEntries }: TaskListProps) {
    const { activeTask, startTimer, stopTimer } = useTimeTrackingStore((state) => state);
    const isAnyTaskActive = !!activeTask;

    const handleStart = (task: Task) => {
        if (isAnyTaskActive) {
            toast.warning('Another timer is already running. Please stop it first.');
            return;
        }
        startTimer(task);
    };

    const handleStop = async () => {
        const { durationInMinutes, task } = stopTimer();

        if (!task) return;

        const formData = new FormData();
        formData.append('duration', durationInMinutes.toString());
        formData.append('entry_date', new Date().toISOString().split('T')[0]);

        const result = await createTimeEntryAction(
            { taskId: task.id, projectId: task.project },
            { success: false },
            formData
        );

        if (result.success) {
            toast.success(`Time entry of ${durationInMinutes} min saved for "${task.title}"`);
        } else {
            toast.error(result.error || 'Failed to save time entry');
        }
    };

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
                <Accordion type="multiple" className="w-full">
                    {tasks.map((task) => {
                        const taskTimeEntries = allTimeEntries.filter((entry) => entry.task === task.id);
                        const isCurrentTaskActive = activeTask?.id === task.id;

                        return (
                            <AccordionItem value={task.id} key={task.id}>
                                <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                                    <AccordionTrigger className="w-full text-left p-0 hover:no-underline">
                                        <div className="flex items-center gap-4">
                                            {getStatusBadge(task.status)}
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="font-semibold">{task.title}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {task.due_date
                                                        ? `Due: ${new Date(task.due_date).toLocaleDateString()}`
                                                        : 'No due date'}
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <div className="flex items-center gap-2 pl-4">
                                        {isCurrentTaskActive ? (
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={handleStop}
                                                title="Stop Timer"
                                            >
                                                <Square className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => handleStart(task)}
                                                disabled={isAnyTaskActive}
                                                title="Start Timer"
                                            >
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                                        <TaskActions task={task} />
                                    </div>
                                </div>
                                <AccordionContent>
                                    {task.description && (
                                        <div className="px-4 pb-4 text-sm text-muted-foreground border-b">
                                            <p>{task.description}</p>
                                        </div>
                                    )}
                                    <TimeTrackingSection task={task} initialTimeEntries={taskTimeEntries} />
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </CardContent>
        </Card>
    );
}
