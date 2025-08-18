'use client';

import type { Task } from '@/features/tasks/types';
import { formatDuration } from '@/lib/utils';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Trash2 } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { createTimeEntryAction, deleteTimeEntryAction } from '../actions';
import type { TimeEntry } from '../types';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button size="sm" type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save'}
        </Button>
    );
}

interface TimeTrackingSectionProps {
    task: Task;
    initialTimeEntries: TimeEntry[];
}

export function TimeTrackingSection({ task, initialTimeEntries }: TimeTrackingSectionProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const totalMinutes = initialTimeEntries.reduce((acc, entry) => acc + entry.duration, 0);

    const createAction = createTimeEntryAction.bind(null, { taskId: task.id, projectId: task.project });
    const [state, formAction] = useActionState(createAction, { success: false });

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
        }
    }, [state.success]);

    return (
        <div className="bg-muted/50 p-4 rounded-b-lg border-t">
            <h4 className="font-semibold mb-2">Time Entries</h4>
            <div className="text-sm font-bold mb-4">Total Time: {formatDuration(totalMinutes)}</div>

            <ul className="space-y-2 mb-4 text-sm">
                {initialTimeEntries.map((entry) => (
                    <li key={entry.id} className="flex justify-between items-center bg-background p-2 rounded">
                        <div>
                            <span>{new Date(entry.entry_date).toLocaleDateString()} - </span>
                            <span className="font-semibold">{formatDuration(entry.duration)}</span>
                            {entry.notes && (
                                <p className="text-xs text-muted-foreground italic">&quot;{entry.notes}&quot;</p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => deleteTimeEntryAction(entry.id, task.project)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </li>
                ))}
            </ul>

            <form ref={formRef} action={formAction} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                <div className="space-y-1">
                    <Label htmlFor="duration" className="text-xs">
                        Duration (min)
                    </Label>
                    <Input id="duration" name="duration" type="number" placeholder="60" required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="entry_date" className="text-xs">
                        Date
                    </Label>
                    <Input
                        id="entry_date"
                        name="entry_date"
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>
                <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="notes" className="text-xs">
                        Notes (optional)
                    </Label>
                    <Input id="notes" name="notes" placeholder="Worked on UI refinements" />
                </div>
                <div className="md:col-start-4 flex justify-end">
                    <SubmitButton />
                </div>
                {state.error && <p className="text-red-500 text-sm col-span-full">{state.error}</p>}
            </form>
        </div>
    );
}
