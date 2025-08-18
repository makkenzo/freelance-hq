import { getInvoiceByIdAction } from '@/features/invoicing/actions';
import { InvoiceActions } from '@/features/invoicing/components/invoice-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Separator } from '@/ui/separator';

interface InvoiceDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function InvoiceDetailsPage({ params }: InvoiceDetailsPageProps) {
    const { id: invoiceId } = await params;
    const invoice = await getInvoiceByIdAction(invoiceId);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-4xl font-bold">{invoice.invoice_number}</CardTitle>
                        <CardDescription>Project: {invoice.expand?.project.name}</CardDescription>
                    </div>
                    <InvoiceActions invoice={invoice} />
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
                    <Separator />
                    {/* В будущем здесь будет таблица с line items */}
                    <div className="flex justify-between items-center py-4">
                        <span className="text-muted-foreground">Description</span>
                        <span className="font-semibold">Amount</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-4">
                        <span className="text-muted-foreground">{invoice.notes}</span>
                        <span className="font-semibold">${invoice.total_amount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-end">
                        <div className="w-1/3 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${invoice.total_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${invoice.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
