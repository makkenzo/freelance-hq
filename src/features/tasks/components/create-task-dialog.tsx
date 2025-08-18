'use client';

import { createTaskAction } from '@/features/tasks/actions';
import { useServerActionToast } from '@/hooks/use-server-action-toast';
import { Button } from '@/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { PlusCircle } from 'lucide-react';
import { RefObject, useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { CreateTaskActionState } from '../types';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Adding Task...' : 'Add Task'}
        </Button>
    );
}

function CreateTaskForm({
    formAction,
    state,
    formRef,
}: {
    formAction: (payload: FormData) => void;
    state: CreateTaskActionState;
    formRef: RefObject<HTMLFormElement | null>;
}) {
    const { pending } = useFormStatus();
    useServerActionToast(
        state,
        {
            loading: 'Adding task...',
            success: 'Task added!',
            error: (error) => `Error: ${error}`,
        },
        pending
    );

    return (
        <form ref={formRef} action={formAction} className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" name="title" placeholder="e.g., Design the homepage mockup" required />
                {state.fieldErrors?.title && (
                    <p className="text-red-500 text-sm font-semibold">{state.fieldErrors.title}</p>
                )}
            </div>
            {state.error && !state.fieldErrors && <p className="text-red-500 text-sm font-semibold">{state.error}</p>}
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <SubmitButton />
            </DialogFooter>
        </form>
    );
}

interface CreateTaskDialogProps {
    projectId: string;
}

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const createTaskActionWithProjectId = createTaskAction.bind(null, projectId);

    const [state, formAction] = useActionState(createTaskActionWithProjectId, {
        success: false,
    });

    useEffect(() => {
        if (state.success) {
            setOpen(false);
            formRef.current?.reset();
        }
    }, [state.success]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a New Task</DialogTitle>
                    <DialogDescription>Fill in the details below to add a new task.</DialogDescription>
                </DialogHeader>
                <CreateTaskForm formAction={formAction} state={state} formRef={formRef} />
            </DialogContent>
        </Dialog>
    );
}
