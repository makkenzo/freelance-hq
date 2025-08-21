'use server';

import { getProjectByIdAction } from '@/features/projects/actions';
import { timeEntriesRepository } from '@/features/time-tracking/repository';
import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

import { invoicesRepository } from './repository';
import type { Invoice, InvoiceItem, InvoiceStatus } from './types';

export async function getInvoicesForProjectAction(projectId: string): Promise<Invoice[]> {
    const pb = await createServerClient();
    if (!pb.authStore.record?.id) return [];
    return invoicesRepository.getByProjectId(projectId, pb.authStore.record.id);
}

export async function generateInvoiceForProjectAction(
    projectId: string
): Promise<{ success: boolean; error?: string }> {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;
    if (!userId) {
        return { success: false, error: 'You must be logged in.' };
    }

    try {
        const project = await getProjectByIdAction(projectId);
        if (!project.client) {
            return { success: false, error: 'Project must have a client to generate an invoice.' };
        }
        if (!project.hourly_rate || project.hourly_rate <= 0) {
            return { success: false, error: 'Project must have a positive hourly rate. Please edit the project.' };
        }

        const timeEntries = await timeEntriesRepository.getUninvoicedByProjectId(project.id, userId);

        if (timeEntries.length === 0) {
            return { success: false, error: 'No new uninvoiced time tracked for this project.' };
        }

        const tasksWithTime: Record<string, { description: string; totalMinutes: number }> = {};

        for (const entry of timeEntries) {
            const taskId = entry.expand?.task?.id || 'general';
            const taskTitle = entry.expand?.task?.title || project.name;
            if (!tasksWithTime[taskId]) {
                tasksWithTime[taskId] = { description: taskTitle, totalMinutes: 0 };
            }
            tasksWithTime[taskId].totalMinutes += entry.duration;
        }

        let totalAmount = 0;
        const invoiceItemsData: Omit<InvoiceItem, 'id' | 'invoice' | 'user'>[] = [];

        for (const taskId in tasksWithTime) {
            const item = tasksWithTime[taskId];
            const quantity = parseFloat((item.totalMinutes / 60).toFixed(2)); // часы
            const unit_price = project.hourly_rate;
            const total = parseFloat((quantity * unit_price).toFixed(2));

            invoiceItemsData.push({
                description: item.description,
                quantity,
                unit_price,
                total,
            });
            totalAmount += total;
        }

        const totalInvoices = await invoicesRepository.countAll(userId);
        const invoiceNumber = `INV-${(totalInvoices + 1).toString().padStart(4, '0')}`;

        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(issueDate.getDate() + 30);

        const newInvoice = await invoicesRepository.create({
            invoice_number: invoiceNumber,
            issue_date: issueDate.toISOString(),
            due_date: dueDate.toISOString(),
            status: 'draft',
            total_amount: totalAmount,
            notes: `Invoice for work performed on project "${project.name}".`,
            project: project.id,
            client: project.client,
            user: userId,
        });

        for (const itemData of invoiceItemsData) {
            await pb.collection('invoice_items').create({
                ...itemData,
                invoice: newInvoice.id,
                user: userId,
            });
        }

        for (const entry of timeEntries) {
            await pb.collection('time_entries').update(entry.id, { 'invoice+': newInvoice.id });
        }

        revalidatePath(`/projects/${projectId}`);
        revalidatePath('/invoices');
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message || 'Failed to generate invoice.' };
    }
}

export async function getInvoiceByIdAction(invoiceId: string): Promise<Invoice> {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;
    if (!userId) notFound();

    const invoice = await invoicesRepository.getById(invoiceId, userId);
    if (!invoice) notFound();

    return invoice;
}

export async function updateInvoiceStatusAction(
    invoiceId: string,
    status: InvoiceStatus
): Promise<{ success: boolean; error?: string }> {
    const pb = await createServerClient();
    if (!pb.authStore.isValid) {
        return { success: false, error: 'You must be logged in.' };
    }

    try {
        const invoice = await invoicesRepository.updateStatus(invoiceId, status);

        revalidatePath(`/invoices/${invoiceId}`);
        revalidatePath('/invoices');
        revalidatePath('/dashboard');
        revalidatePath(`/projects/${invoice.project}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to update invoice status.' };
    }
}

export async function getAllInvoicesAction(): Promise<Invoice[]> {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;
    if (!userId) return [];

    return invoicesRepository.getAllByUserId(userId);
}
