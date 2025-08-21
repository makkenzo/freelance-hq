import { getProposalsAction } from '@/features/proposals/actions';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import Link from 'next/link';

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
    draft: 'secondary',
    sent: 'default',
    accepted: 'default',
    declined: 'destructive',
};

export default async function ProposalsPage() {
    const proposals = await getProposalsAction();

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Proposals</h2>
                    <p className="text-muted-foreground">Create and manage your project proposals.</p>
                </div>
                <Button asChild>
                    <Link href="/proposals/new">Create Proposal</Link>
                </Button>
            </div>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {proposals.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/proposals/${p.id}`} className="hover:underline text-primary">
                                            {p.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{p.expand?.client.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={statusVariantMap[p.status] || 'secondary'}
                                            className={p.status === 'accepted' ? 'bg-green-500 hover:bg-green-500' : ''}
                                        >
                                            {p.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${p.total_amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {proposals.length === 0 && (
                        <div className="text-center p-8">
                            <h3 className="text-xl font-bold tracking-tight">No proposals yet.</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Create your first proposal to win a new project.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
