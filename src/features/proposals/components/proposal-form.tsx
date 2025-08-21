'use client';

import type { Client } from '@/features/clients/types';
import { createProposalAction } from '@/features/proposals/actions';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

interface ProposalItem {
    description: string;
    quantity: number;
    unit_price: number;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="lg">
            {pending ? 'Saving Proposal...' : 'Save Proposal'}
        </Button>
    );
}

interface ProposalFormProps {
    clients: Client[];
}

export function ProposalForm({ clients }: ProposalFormProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(createProposalAction, { success: false });
    const [items, setItems] = useState<ProposalItem[]>([{ description: '', quantity: 1, unit_price: 0 }]);
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0), 0);

    useEffect(() => {
        if (state.success && state.proposalId) {
            toast.success('Proposal created successfully!');
            router.push(`/proposals/${state.proposalId}`);
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    const handleItemChange = (index: number, field: keyof ProposalItem, value: string | number) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    return (
        <form action={formAction}>
            <input type="hidden" name="items" value={JSON.stringify(items)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Proposal Title</Label>
                    <Input id="title" name="title" placeholder="e.g., New Corporate Website" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="clientId">Client</Label>
                    <Select name="clientId" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Items</h3>
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <Input
                                placeholder="Item description"
                                className="col-span-6"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                required
                            />
                            <Input
                                type="number"
                                placeholder="Quantity"
                                className="col-span-2"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                required
                            />
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="Unit Price"
                                className="col-span-2"
                                value={item.unit_price}
                                onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                                required
                            />
                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <span className="text-sm text-muted-foreground w-16 text-right">
                                    ${((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeItem(index)}
                                    disabled={items.length <= 1}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" onClick={addItem} className="mt-4">
                    Add Item
                </Button>
            </div>

            <div className="flex justify-end items-center mt-6 pt-4 border-t">
                <div className="text-right">
                    <span className="text-muted-foreground">Total:</span>
                    <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <SubmitButton />
            </div>
        </form>
    );
}
