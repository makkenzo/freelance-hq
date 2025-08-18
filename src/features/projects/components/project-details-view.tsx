'use client';

import type { Client } from '@/features/clients/types';
import { InvoicingSection } from '@/features/invoicing/components/invoicing-section';
import type { Invoice } from '@/features/invoicing/types';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';
import { TaskList } from '@/features/tasks/components/task-list';
import type { Task } from '@/features/tasks/types';
import { TimeEntry } from '@/features/time-tracking/types';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Separator } from '@/ui/separator';
import { Edit } from 'lucide-react';
import { Suspense, useState } from 'react';

import type { Project } from '../types';
import { EditProjectDialog } from './edit-project-dialog';

interface ProjectDetailsViewProps {
    project: Project;
    tasks: Task[];
    invoices: Invoice[];
    clients: Client[];
    timeEntries: TimeEntry[];
}

export function ProjectDetailsView({ project, tasks, invoices, clients, timeEntries }: ProjectDetailsViewProps) {
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

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
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                        <p className="text-muted-foreground">Client: {project.expand?.client?.name || 'N/A'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant={statusVariant(project.status)}>{project.status.replace('_', ' ')}</Badge>
                        <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
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
                    <TaskList tasks={tasks} allTimeEntries={timeEntries} />
                </div>

                <InvoicingSection projectId={project.id} invoices={invoices} />
            </div>

            <EditProjectDialog
                project={project}
                clients={clients}
                open={isEditDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </>
    );
}
