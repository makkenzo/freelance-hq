'use client';

import type { Client } from '@/features/clients/types';
import { Button } from '@/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { updateProjectAction } from '../actions';
import type { Project } from '../types';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Changes'}
        </Button>
    );
}

interface EditProjectDialogProps {
    project: Project;
    clients: Client[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({ project, clients, open, onOpenChange }: EditProjectDialogProps) {
    const updateAction = updateProjectAction.bind(null, project.id);
    const [state, formAction] = useActionState(updateAction, { success: false });

    useEffect(() => {
        if (state.success) {
            onOpenChange(false);
        }
    }, [state.success, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogDescription>
                        Make changes to your project here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input id="name" name="name" defaultValue={project.name} required />
                        {state.fieldErrors?.name && <p className="text-red-500 text-sm">{state.fieldErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={project.status}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="on_hold">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                        <Input
                            id="hourly_rate"
                            name="hourly_rate"
                            type="number"
                            step="0.01"
                            defaultValue={project.hourly_rate}
                        />
                        {state.fieldErrors?.hourly_rate && (
                            <p className="text-red-500 text-sm">{state.fieldErrors.hourly_rate}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clientId">Client</Label>
                        <Select name="clientId" defaultValue={project.client || 'none'}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No client</SelectItem>
                                {clients.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
