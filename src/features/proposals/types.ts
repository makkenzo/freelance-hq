import type { Client } from '@/features/clients/types';

import type { ProposalItem } from './types-proposal-item';

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'declined';

export type Proposal = {
    id: string;
    title: string;
    status: ProposalStatus;
    client: string;
    total_amount: number;
    valid_until?: string;
    user: string;
    created: string;
    updated: string;
    expand?: {
        client: Client;
        'proposal_items(proposal)': ProposalItem[];
    };
};

export interface CreateProposalActionState {
    error?: string;
    fieldErrors?: { [key: string]: string[] | undefined };
    success?: boolean;
    proposalId?: string;
}
