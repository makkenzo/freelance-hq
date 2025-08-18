import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

import type { Client } from '../types';

interface ClientListProps {
    clients: Client[];
}

export function ClientList({ clients }: ClientListProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
                <Card key={client.id}>
                    <CardHeader>
                        <CardTitle>{client.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="text-sm text-muted-foreground">{client.company || 'No company'}</p>
                        <p className="text-sm text-muted-foreground">{client.client_email || 'No email'}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
