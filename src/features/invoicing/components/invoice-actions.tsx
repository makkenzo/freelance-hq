'use client';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { useTransition } from 'react';

import { updateInvoiceStatusAction } from '../actions';
import type { Invoice } from '../types';

interface InvoiceActionsProps {
    invoice: Invoice;
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleUpdateStatus = (status: Invoice['status']) => {
        startTransition(async () => {
            await updateInvoiceStatusAction(invoice.id, status);
        });
    };

    const getStatusBadge = () => {
        switch (invoice.status) {
            case 'paid':
                return <Badge className="bg-green-500 hover:bg-green-500">Paid</Badge>;
            case 'sent':
                return <Badge className="bg-blue-500 hover:bg-blue-500">Sent</Badge>;
            case 'overdue':
                return <Badge variant="destructive">Overdue</Badge>;
            default:
                return <Badge variant="secondary">Draft</Badge>;
        }
    };

    return (
        <div className="flex items-center gap-4">
            {getStatusBadge()}
            {invoice.status === 'draft' && (
                <Button onClick={() => handleUpdateStatus('sent')} disabled={isPending}>
                    Mark as Sent
                </Button>
            )}
            {invoice.status === 'sent' && (
                <Button onClick={() => handleUpdateStatus('paid')} disabled={isPending}>
                    Mark as Paid
                </Button>
            )}
        </div>
    );
}
