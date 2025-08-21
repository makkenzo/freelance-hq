import { createServerClient } from '@/lib/pb/server';

import type { Proposal, ProposalStatus } from './types';

export const proposalsRepository = {
    async getAllByUserId(userId: string): Promise<Proposal[]> {
        const pb = await createServerClient();
        try {
            return await pb.collection('proposals').getFullList<Proposal>({
                filter: `user = "${userId}"`,
                sort: '-created',
                expand: 'client',
            });
        } catch (error) {
            console.error('Error fetching proposals:', error);
            return [];
        }
    },

    async getById(proposalId: string, userId: string): Promise<Proposal | null> {
        const pb = await createServerClient();
        try {
            return await pb
                .collection('proposals')
                .getFirstListItem<Proposal>(`id = "${proposalId}" && user = "${userId}"`, {
                    expand: 'client,proposal_items(proposal)',
                });
        } catch (error: any) {
            if (error.status === 404) return null;
            throw error;
        }
    },

    async updateStatus(proposalId: string, status: ProposalStatus): Promise<Proposal> {
        const pb = await createServerClient();
        return pb.collection('proposals').update<Proposal>(proposalId, { status });
    },
};
