import type { ClientBase } from '@/features/projects/types';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type Invoice = {
    id: string;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    status: InvoiceStatus;
    total_amount: number;
    notes: string;
    project: string;
    client: string;
    user: string;
    expand?: {
        client: ClientBase;
        project: {
            id: string;
            name: string;
        };
        'invoice_items(invoice)': InvoiceItem[];
    };
};

export type InvoiceItem = {
    id: string;
    invoice: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
    user: string;
};
