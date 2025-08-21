import { ProposalActions } from '@/features/proposals/components/proposal-actions';
import { proposalsRepository } from '@/features/proposals/repository';
import { createServerClient } from '@/lib/pb/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Separator } from '@/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { notFound } from 'next/navigation';

interface ProposalDetailsPageProps {
    params: { id: string };
}

export default async function ProposalDetailsPage({ params }: ProposalDetailsPageProps) {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;
    if (!userId) notFound();

    const proposal = await proposalsRepository.getById(params.id, userId);
    if (!proposal) notFound();

    const lineItems = proposal.expand?.['proposal_items(proposal)'] || [];

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold text-primary">PROPOSAL</p>
                            <CardTitle className="text-4xl font-bold mt-1">{proposal.title}</CardTitle>
                        </div>
                        <ProposalActions proposal={proposal} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <h3 className="font-semibold">Prepared for</h3>
                            <p className="text-muted-foreground">
                                {proposal.expand?.client.name} <br />
                                {proposal.expand?.client.company}
                            </p>
                        </div>
                        <div className="space-y-1 text-right">
                            <h3 className="font-semibold">Details</h3>
                            <p className="text-muted-foreground">
                                Date: {new Date(proposal.created).toLocaleDateString()} <br />
                                {proposal.valid_until &&
                                    `Valid Until: ${new Date(proposal.valid_until).toLocaleDateString()}`}
                            </p>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-center">Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lineItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.description}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-center">${item.unit_price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex justify-end pt-4">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span>${proposal.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
