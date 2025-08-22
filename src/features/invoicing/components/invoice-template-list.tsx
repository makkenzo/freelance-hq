'use client';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

import type { InvoiceTemplate } from '../templates-types';
import { InvoiceTemplateFormDialog } from './invoice-template-form-dialog';

interface InvoiceTemplateListProps {
    initialTemplates: InvoiceTemplate[];
}

export function InvoiceTemplateList({ initialTemplates }: InvoiceTemplateListProps) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | null>(null);

    const handleEdit = (template: InvoiceTemplate) => {
        setEditingTemplate(template);
        setDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingTemplate(null);
        setDialogOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Your Templates</CardTitle>
                    <Button size="sm" onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Template
                    </Button>
                </CardHeader>
                <CardContent>
                    {initialTemplates.length > 0 ? (
                        <ul className="divide-y">
                            {initialTemplates.map((template) => (
                                <li key={template.id} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">{template.name}</span>
                                        {template.is_default && <Badge variant="outline">Default</Badge>}
                                    </div>
                                    <div>
                                        <Button variant="outline" onClick={() => handleEdit(template)}>
                                            Edit
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-10">
                            <h3 className="text-xl font-semibold">You have no templates yet.</h3>
                            <p className="text-muted-foreground mt-2">
                                Get started by creating your first invoice template.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <InvoiceTemplateFormDialog isOpen={isDialogOpen} setOpen={setDialogOpen} template={editingTemplate} />
        </>
    );
}
