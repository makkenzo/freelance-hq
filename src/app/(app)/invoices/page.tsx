import { invoicesRepository } from '@/features/invoicing/repository';
import { createServerClient } from '@/lib/pb/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';

export default async function InvoicesPage() {
    const pb = await createServerClient();
    const userId = pb.authStore.record?.id;
    const invoices = userId ? await invoicesRepository.getAllByUserId(userId) : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Invoices</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Number</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                                <TableCell>{invoice.expand?.client.name}</TableCell>
                                <TableCell>{invoice.expand?.project.name}</TableCell>
                                <TableCell>{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                                <TableCell>{invoice.status}</TableCell>
                                <TableCell className="text-right">${invoice.total_amount.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
