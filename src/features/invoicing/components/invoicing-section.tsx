'use client';

import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { generateInvoiceForProjectAction } from '../actions';
import { InvoiceTemplate } from '../templates-types';
import type { Invoice } from '../types';

interface InvoicingSectionProps {
    projectId: string;
    invoices: Invoice[];
    templates: InvoiceTemplate[];
}

export function InvoicingSection({ projectId, invoices, templates }: InvoicingSectionProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(
        templates.find((t) => t.is_default)?.id ?? templates[0]?.id
    );

    const handleGenerate = () => {
        if (templates.length > 0 && !selectedTemplate) {
            toast.error('Please select a template to generate the invoice.');
            return;
        }

        startTransition(async () => {
            const result = await generateInvoiceForProjectAction(projectId, selectedTemplate);
            if (result.error) {
                toast.error(result.error);
            } else if (result.success && result.invoiceId) {
                toast.success('Invoice generated successfully! Redirecting...');
                router.push(`/invoices/${result.invoiceId}`);
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
                <div className="flex flex-col sm:flex-row items-end gap-4 pt-4 border-t">
                    <div className="w-full sm:w-64 space-y-2">
                        <Label htmlFor="template-select">Invoice Template</Label>
                        <Select
                            value={selectedTemplate}
                            onValueChange={setSelectedTemplate}
                            disabled={templates.length === 0}
                        >
                            <SelectTrigger id="template-select">
                                <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                                {templates.map((template) => (
                                    <SelectItem key={template.id} value={template.id}>
                                        {template.name} {template.is_default && '(Default)'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleGenerate} disabled={isPending || templates.length === 0}>
                        {isPending ? 'Generating...' : 'Generate Invoice from Tracked Time'}
                    </Button>
                </div>
                {templates.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                        You need to create an invoice template in Settings before you can generate an invoice.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
