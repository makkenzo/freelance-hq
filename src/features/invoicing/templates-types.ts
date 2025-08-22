export type InvoiceTemplateLabels = {
    title?: string;
    item_description?: string;
    item_quantity?: string;
    item_rate?: string;
    item_amount?: string;
};

export type InvoiceTemplate = {
    id: string;
    name: string;
    user: string;
    logo?: string;
    sender_details?: string;
    accent_color?: string;
    footer_notes?: string;
    labels?: InvoiceTemplateLabels;
    is_default: boolean;
    expand?: {};
};

export interface UpsertTemplateActionState {
    error?: string;
    fieldErrors?: { [key: string]: string[] | undefined };
    success?: boolean;
}
