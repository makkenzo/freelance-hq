'use server';

import { createServerClient } from '@/lib/pb/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createProposalSchema } from './lib/validation';
import { proposalsRepository } from './repository';
import type { CreateProposalActionState, Proposal, ProposalStatus } from './types';

export async function getProposalsAction(): Promise<Proposal[]> {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;
    if (!userId) return [];
    return proposalsRepository.getAllByUserId(userId);
}

export async function createProposalAction(
    prevState: CreateProposalActionState,
    formData: FormData
): Promise<CreateProposalActionState> {
    const pb = await createServerClient();
    const userId = pb.authStore.model?.id;
    if (!userId) return { error: 'You must be logged in.' };

    const validUntilValue = formData.get('valid_until');

    const validationResult = createProposalSchema.safeParse({
        title: formData.get('title'),
        clientId: formData.get('clientId'),
        valid_until: validUntilValue || undefined,
        items: formData.get('items'),
    });

    if (!validationResult.success) {
        console.error('Validation Error:', validationResult.error.flatten());
        return {
            error: 'Validation failed. Please check the fields.',
            fieldErrors: validationResult.error.flatten().fieldErrors,
        };
    }

    const { title, clientId, valid_until, items } = validationResult.data;

    try {
        const total_amount = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

        const newProposal = await pb.collection('proposals').create({
            title,
            client: clientId,
            valid_until: valid_until || null,
            total_amount,
            status: 'draft',
            user: userId,
        });

        for (const item of items) {
            await pb.collection('proposal_items').create({
                proposal: newProposal.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total: item.quantity * item.unit_price,
                user: userId,
            });
        }

        revalidatePath('/proposals');
        return { success: true, proposalId: newProposal.id };
    } catch (e: any) {
        return { error: e.message || 'Failed to create proposal.' };
    }
}

export async function updateProposalStatusAction(proposalId: string, status: ProposalStatus) {
    await proposalsRepository.updateStatus(proposalId, status);
    revalidatePath(`/proposals/${proposalId}`);
    revalidatePath('/proposals');
}

export async function convertProposalToProjectAction(proposalId: string) {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;
    if (!userId) throw new Error('Not authenticated');

    const proposal = await proposalsRepository.getById(proposalId, userId);
    if (!proposal || proposal.status !== 'accepted') {
        throw new Error('Proposal not found or not accepted.');
    }

    const newProject = await pb.collection('projects').create({
        name: proposal.title,
        client: proposal.client,
        user: userId,
        status: 'in_progress',
    });

    const items = proposal.expand?.['proposal_items(proposal)'] || [];
    for (const item of items) {
        await pb.collection('tasks').create({
            title: item.description,
            project: newProject.id,
            user: userId,
            status: 'todo',
            priority: 'medium',
        });
    }

    revalidatePath('/projects');
    revalidatePath('/proposals');
    redirect(`/projects/${newProject.id}`);
}
