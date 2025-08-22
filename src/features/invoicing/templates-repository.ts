import { createServerClient } from '@/lib/pb/server';

import type { InvoiceTemplate } from './templates-types';

export const templatesRepository = {
    async getAllByUserId(userId: string): Promise<InvoiceTemplate[]> {
        const pb = await createServerClient();
        return pb.collection('invoice_templates').getFullList<InvoiceTemplate>({
            filter: `user = "${userId}"`,
            sort: '-created',
        });
    },

    async getDefaultByUserId(userId: string): Promise<InvoiceTemplate | null> {
        const pb = await createServerClient();
        try {
            return await pb
                .collection('invoice_templates')
                .getFirstListItem<InvoiceTemplate>(`user = "${userId}" && is_default = true`);
        } catch (error: any) {
            if (error.status === 404) return null;
            console.error('Error fetching default template:', error);
            throw error;
        }
    },

    async getById(id: string, userId: string): Promise<InvoiceTemplate | null> {
        const pb = await createServerClient();
        try {
            return await pb
                .collection('invoice_templates')
                .getFirstListItem<InvoiceTemplate>(`id = "${id}" && user = "${userId}"`);
        } catch (error: any) {
            if (error.status === 404) return null;
            throw error;
        }
    },

    async create(data: FormData, userId: string): Promise<InvoiceTemplate> {
        const pb = await createServerClient();
        data.append('user', userId);
        return pb.collection('invoice_templates').create<InvoiceTemplate>(data);
    },

    async update(id: string, data: FormData, userId: string): Promise<InvoiceTemplate> {
        const pb = await createServerClient();
        data.append('user', userId);
        return pb.collection('invoice_templates').update<InvoiceTemplate>(id, data);
    },

    async delete(id: string): Promise<void> {
        const pb = await createServerClient();
        await pb.collection('invoice_templates').delete(id);
    },

    async unsetAllDefaults(userId: string, excludeId?: string): Promise<void> {
        const pb = await createServerClient();
        const otherDefaults = await pb.collection('invoice_templates').getFullList({
            filter: `user = "${userId}" && is_default = true ${excludeId ? `&& id != "${excludeId}"` : ''}`,
        });

        for (const template of otherDefaults) {
            await pb.collection('invoice_templates').update(template.id, { is_default: false });
        }
    },
};
