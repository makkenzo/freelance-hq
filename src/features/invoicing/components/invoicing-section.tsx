'use client';

import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { useTransition } from 'react';

import { generateInvoiceForProjectAction } from '../actions';
import type { Invoice } from '../types';

interface InvoicingSectionProps {
    projectId: string;
    invoices: Invoice[];
}

export function InvoicingSection({ projectId, invoices }: InvoicingSectionProps) {
    const [isPending, startTransition] = useTransition();

    const handleGenerate = () => {
        startTransition(async () => {
            const result = await generateInvoiceForProjectAction(projectId);
            if (result.error) {
                alert(result.error);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoicing</CardTitle>
                <CardDescription>Manage invoices for this project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ul className="divide-y">
                    {invoices.map((invoice) => (
                        <li key={invoice.id} className="py-2 flex justify-between items-center">
                            <div>
                                <span className="font-semibold">{invoice.invoice_number}</span>
                                <span
                                    className={`ml-2 text-xs font-bold p-1 rounded ${invoice.status === 'paid' ? 'bg-green-200' : 'bg-gray-200'}`}
                                >
                                    {invoice.status}
                                </span>
                            </div>
                            <span>${invoice.total_amount.toFixed(2)}</span>
                        </li>
                    ))}
                    {invoices.length === 0 && <p className="text-sm text-muted-foreground">No invoices yet.</p>}
                </ul>
                <Button onClick={handleGenerate} disabled={isPending}>
                    {isPending ? 'Generating...' : 'Generate Invoice from Tracked Time'}
                </Button>
            </CardContent>
        </Card>
    );
}
