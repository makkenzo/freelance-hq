'use client';

import { createClientAction } from '@/features/clients/actions';
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
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Adding Client...' : 'Add Client'}
        </Button>
    );
}

export function CreateClientDialog() {
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction] = useActionState(createClientAction, { success: false });

    useEffect(() => {
        if (state.success) {
            setOpen(false);
            formRef.current?.reset();
        }
    }, [state.success]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Client</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a New Client</DialogTitle>
                    <DialogDescription>Fill in the details to add a new client.</DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Client Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" required />
                        {state.fieldErrors?.name && <p className="text-red-500 text-sm">{state.fieldErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="john@example.com" />
                        {state.fieldErrors?.client_email && (
                            <p className="text-red-500 text-sm">{state.fieldErrors.client_email}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" name="company" placeholder="Acme Inc." />
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
