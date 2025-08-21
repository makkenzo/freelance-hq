'use client';

import { createExpenseAction } from '@/features/expenses/actions';
import type { Project } from '@/features/projects/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Adding Expense...' : 'Add Expense'}
        </Button>
    );
}

interface CreateExpenseDialogProps {
    projects: Project[];
}

export function CreateExpenseDialog({ projects }: CreateExpenseDialogProps) {
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(createExpenseAction, { success: false });

    useEffect(() => {
        if (state.success) {
            toast.success('Expense added successfully!');
            setOpen(false);
            formRef.current?.reset();
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Expense</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a New Expense</DialogTitle>
                    <DialogDescription>Fill in the details to record a new expense.</DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" placeholder="e.g., Software Subscription" required />
                        {state.fieldErrors?.description && (
                            <p className="text-red-500 text-sm">{state.fieldErrors.description[0]}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input id="amount" name="amount" type="number" step="0.01" placeholder="99.99" required />
                            {state.fieldErrors?.amount && (
                                <p className="text-red-500 text-sm">{state.fieldErrors.amount[0]}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expense_date">Date</Label>
                            <Input
                                id="expense_date"
                                name="expense_date"
                                type="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                            />
                            {state.fieldErrors?.expense_date && (
                                <p className="text-red-500 text-sm">{state.fieldErrors.expense_date[0]}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="projectId">Assign to Project (optional)</Label>
                        <Select name="projectId" defaultValue="none">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No project</SelectItem>
                                {projects.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="receipt">Receipt (optional, max 5MB)</Label>
                        <Input id="receipt" name="receipt" type="file" />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
