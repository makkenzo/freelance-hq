import { getDateFilter } from '@/lib/helpers';
import { createServerClient } from '@/lib/pb/server';

import type { Invoice, InvoiceStatus } from './types';

export const invoicesRepository = {
    async getAllByUserId(userId: string): Promise<Invoice[]> {
        const pb = await createServerClient();
        return pb.collection('invoices').getFullList<Invoice>({
            filter: `user = "${userId}"`,
            sort: '-issue_date',
            expand: 'client,project',
        });
    },

    async getByProjectId(projectId: string, userId: string): Promise<Invoice[]> {
        const pb = await createServerClient();
        return pb.collection('invoices').getFullList<Invoice>({
            filter: `project = "${projectId}" && user = "${userId}"`,
            sort: '-issue_date',
            expand: 'client,project',
        });
    },

    async create(data: Omit<Invoice, 'id' | 'expand'>): Promise<Invoice> {
        const pb = await createServerClient();
        return pb.collection('invoices').create<Invoice>(data);
    },

    async countAll(userId: string): Promise<number> {
        const pb = await createServerClient();
        const { totalItems } = await pb.collection('invoices').getList(1, 1, {
            filter: `user = "${userId}"`,
        });
        return totalItems;
    },

    async getStats(
        userId: string,
        period?: string
    ): Promise<{ totalRevenue: number; pendingAmount: number; pendingCount: number }> {
        const pb = await createServerClient();
        const dateFilter = getDateFilter(period);

        const invoices = await pb.collection('invoices').getFullList<Invoice>({
            filter: `user = "${userId}"${dateFilter ? ' && ' + dateFilter : ''}`,
            fields: 'status,total_amount',
        });

        let totalRevenue = 0;
        let pendingAmount = 0;
        let pendingCount = 0;

        for (const invoice of invoices) {
            if (invoice.status === 'paid') {
                totalRevenue += invoice.total_amount;
            }
            if (invoice.status === 'sent' || invoice.status === 'overdue') {
                pendingAmount += invoice.total_amount;
                pendingCount++;
            }
        }

        return { totalRevenue, pendingAmount, pendingCount };
    },

    async getMonthlyRevenue(userId: string): Promise<{ month: string; revenue: number }[]> {
        const pb = await createServerClient();

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
        const dateFilter = `issue_date >= "${twelveMonthsAgo.toISOString().slice(0, 19).replace('T', ' ')}"`;

        const invoices = await pb.collection('invoices').getFullList<Invoice>({
            filter: `user = "${userId}" && status = "paid" && ${dateFilter}`,
            fields: 'issue_date,total_amount',
        });

        const monthlyData: { [key: string]: number } = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        invoices.forEach((invoice) => {
            const date = new Date(invoice.issue_date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = 0;
            }
            monthlyData[monthKey] += invoice.total_amount;
        });

        return Object.entries(monthlyData)
            .map(([key, revenue]) => {
                const [year, monthIndex] = key.split('-');
                return {
                    date: new Date(parseInt(year), parseInt(monthIndex)),
                    month: `${monthNames[parseInt(monthIndex)]} '${year.slice(2)}`,
                    revenue,
                };
            })
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(-12);
    },

    async getById(invoiceId: string, userId: string): Promise<Invoice | null> {
        const pb = await createServerClient();
        try {
            return await pb
                .collection('invoices')
                .getFirstListItem<Invoice>(`id = "${invoiceId}" && user = "${userId}"`, {
                    expand: 'client,project,invoice_items(invoice),template',
                });
        } catch (error: any) {
            if (error.status === 404) return null;
            console.error('Error fetching invoice by ID:', error);
            throw error;
        }
    },

    async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<Invoice> {
        const pb = await createServerClient();
        return await pb.collection('invoices').update<Invoice>(invoiceId, { status });
    },
};
