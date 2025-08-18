'use server';

import { getProjectByIdAction } from '@/features/projects/actions';
import { timeEntriesRepository } from '@/features/time-tracking/repository';
import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';

import { invoicesRepository } from './repository';
import type { Invoice } from './types';

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

        const timeEntries = await timeEntriesRepository.getByProjectId(project.id, userId);
        const totalMinutes = timeEntries.reduce((acc, entry) => acc + entry.duration, 0);

        if (totalMinutes === 0) {
            return { success: false, error: 'No time tracked for this project.' };
        }

        const totalHours = totalMinutes / 60;
        const totalAmount = totalHours * project.hourly_rate;

        const totalInvoices = await invoicesRepository.countAll(userId);
        const invoiceNumber = `INV-${(totalInvoices + 1).toString().padStart(4, '0')}`;

        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(issueDate.getDate() + 30);

        await invoicesRepository.create({
            invoice_number: invoiceNumber,
            issue_date: issueDate.toISOString(),
            due_date: dueDate.toISOString(),
            status: 'draft',
            total_amount: totalAmount,
            notes: `Invoice for work performed on project "${project.name}". Total hours tracked: ${totalHours.toFixed(2)}.`,
            project: project.id,
            client: project.client,
            user: userId,
        });

        revalidatePath(`/projects/${projectId}`);
        revalidatePath('/invoices');
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message || 'Failed to generate invoice.' };
    }
}
