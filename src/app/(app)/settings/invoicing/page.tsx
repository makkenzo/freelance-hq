import { InvoiceTemplateList } from '@/features/invoicing/components/invoice-template-list';
import { getTemplatesAction } from '@/features/invoicing/templates-actions';

export default async function InvoicingSettingsPage() {
    const templates = await getTemplatesAction();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Invoice Templates</h3>
                <p className="text-sm text-muted-foreground">Create and manage templates for your invoices.</p>
            </div>

            <InvoiceTemplateList initialTemplates={templates} />
        </div>
    );
}
