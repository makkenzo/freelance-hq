import { getInvoiceByIdAction } from '@/features/invoicing/actions';
import { InvoiceActions } from '@/features/invoicing/components/invoice-actions';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { Separator } from '@/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';

interface InvoiceDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function InvoiceDetailsPage({ params }: InvoiceDetailsPageProps) {
    const { id: invoiceId } = await params;
    const invoice = await getInvoiceByIdAction(invoiceId);

    const template = invoice.expand?.template;
    const labels = template?.labels ?? {};

    const lineItems = invoice.expand?.['invoice_items(invoice)'] || [];
    const subtotal = lineItems.reduce((acc, item) => acc + item.total, 0);

    const accentStyle = template?.accent_color ? { color: template.accent_color } : {};

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <Card className="shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                        {template?.logo && (
                            <img
                                src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/invoice_templates/${template.id}/${template.logo}`}
                                alt="Company Logo"
                                className="h-16 w-auto object-contain mb-4"
                            />
                        )}
                        {template?.sender_details ? (
                            <div
                                className="prose prose-sm text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: template.sender_details }}
                            />
                        ) : (
                            <p className="text-muted-foreground">Your Company Name</p>
                        )}
                    </div>
                    <div className="text-left sm:text-right">
                        <h1 className="text-4xl font-bold" style={accentStyle}>
                            {labels.title || 'INVOICE'}
                        </h1>
                        <p className="text-lg">{invoice.invoice_number}</p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <h3 className="font-semibold">Billed To</h3>
                            <p className="text-muted-foreground">
                                {invoice.expand?.client.name} <br />
                                {invoice.expand?.client.company} <br />
                                {invoice.expand?.client.client_email}
                            </p>
                        </div>
                        <div className="space-y-1 text-right">
                            <h3 className="font-semibold">Invoice Details</h3>
                            <p className="text-muted-foreground">
                                Issue Date: {new Date(invoice.issue_date).toLocaleDateString()} <br />
                                Due Date: {new Date(invoice.due_date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead style={accentStyle}>{labels.item_description || 'Description'}</TableHead>
                                <TableHead className="text-center" style={accentStyle}>
                                    {labels.item_quantity || 'Hours'}
                                </TableHead>
                                <TableHead className="text-center" style={accentStyle}>
                                    {labels.item_rate || 'Rate'}
                                </TableHead>
                                <TableHead className="text-right" style={accentStyle}>
                                    {labels.item_amount || 'Amount'}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lineItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.description}</TableCell>
                                    <TableCell className="text-center">{item.quantity.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">${item.unit_price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Separator />

                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total</span>
                                <span>${invoice.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {invoice.notes && (
                        <div className="pt-4 border-t">
                            <h4 className="font-semibold mb-1">Notes</h4>
                            <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                        </div>
                    )}

                    {template?.footer_notes && (
                        <div className="pt-4 border-t">
                            <div
                                className="prose prose-sm text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: template.footer_notes }}
                            />
                        </div>
                    )}

                    <div className="pt-6 flex justify-end">
                        <InvoiceActions invoice={invoice} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
