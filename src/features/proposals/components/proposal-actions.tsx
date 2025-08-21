'use client';

import { convertProposalToProjectAction, updateProposalStatusAction } from '@/features/proposals/actions';
import type { Proposal } from '@/features/proposals/types';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { ArrowRight, Check, Send, X } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface ProposalActionsProps {
    proposal: Proposal;
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
    draft: 'secondary',
    sent: 'default',
    accepted: 'default',
    declined: 'destructive',
};

export function ProposalActions({ proposal }: ProposalActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleStatusUpdate = (status: Proposal['status']) => {
        startTransition(async () => {
            await updateProposalStatusAction(proposal.id, status);
            toast.success(`Proposal marked as ${status}.`);
        });
    };

    const handleConvertToProject = () => {
        startTransition(async () => {
            try {
                await convertProposalToProjectAction(proposal.id);
                toast.success('Proposal successfully converted to a new project!');
            } catch (error: any) {
                toast.error(error.message || 'Failed to convert to project.');
            }
        });
    };

    return (
        <div className="flex items-center gap-4">
            <Badge
                variant={statusVariantMap[proposal.status] || 'secondary'}
                className={proposal.status === 'accepted' ? 'bg-green-500 hover:bg-green-500' : ''}
            >
                {proposal.status}
            </Badge>

            {proposal.status === 'accepted' && (
                <Button onClick={handleConvertToProject} disabled={isPending}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Convert to Project
                </Button>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {proposal.status === 'draft' && (
                        <DropdownMenuItem onClick={() => handleStatusUpdate('sent')} disabled={isPending}>
                            <Send className="mr-2 h-4 w-4" />
                            Mark as Sent
                        </DropdownMenuItem>
                    )}
                    {(proposal.status === 'draft' || proposal.status === 'sent') && (
                        <>
                            <DropdownMenuItem onClick={() => handleStatusUpdate('accepted')} disabled={isPending}>
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Accepted
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleStatusUpdate('declined')}
                                disabled={isPending}
                                className="text-destructive"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Mark as Declined
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
