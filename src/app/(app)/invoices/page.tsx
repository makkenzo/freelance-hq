import { getAllInvoicesAction } from '@/features/invoicing/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import Link from 'next/link';

export default async function InvoicesPage() {
    const invoices = await getAllInvoicesAction();

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
                                <TableCell className="font-medium">
                                    <Link href={`/invoices/${invoice.id}`} className="hover:underline text-primary">
                                        {invoice.invoice_number}
                                    </Link>
                                </TableCell>
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
