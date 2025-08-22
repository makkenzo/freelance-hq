'use client';

import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { upsertTemplateAction } from '../templates-actions';
import type { InvoiceTemplate } from '../templates-types';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Template'}
        </Button>
    );
}

interface InvoiceTemplateFormDialogProps {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    template: InvoiceTemplate | null;
}

export function InvoiceTemplateFormDialog({ isOpen, setOpen, template }: InvoiceTemplateFormDialogProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(upsertTemplateAction, { success: false });

    const isEditing = !!template;

    useEffect(() => {
        if (state.success) {
            toast.success(isEditing ? 'Template successfully updated!' : 'Template successfully created!');
            setOpen(false);
            formRef.current?.reset();
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, isEditing, setOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Редактировать шаблон' : 'Создать новый шаблон'}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="grid gap-4 py-4">
                    {isEditing && <input type="hidden" name="id" value={template.id} />}

                    <div className="space-y-2">
                        <Label htmlFor="name">Template Name</Label>
                        <Input id="name" name="name" defaultValue={template?.name} required />
                        {state.fieldErrors?.name && <p className="text-red-500 text-sm">{state.fieldErrors.name[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sender_details">Your Details</Label>
                        <Textarea
                            id="sender_details"
                            name="sender_details"
                            defaultValue={template?.sender_details}
                            placeholder="John Doe&#10;1234567890&#10;john.doe@example.com"
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="footer_notes">Text in the Invoice Footer</Label>
                        <Textarea
                            id="footer_notes"
                            name="footer_notes"
                            defaultValue={template?.footer_notes}
                            placeholder="Thank you for your business!"
                            rows={2}
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="is_default" name="is_default" defaultChecked={template?.is_default} />
                        <Label htmlFor="is_default">Use as Default</Label>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
