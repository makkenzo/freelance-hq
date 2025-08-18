import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import Link from 'next/link';

import type { Client } from '../types';

interface RecentClientsListProps {
    clients: Client[];
}

export function RecentClientsList({ clients }: RecentClientsListProps) {
    return (
        <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Clients</CardTitle>
                <Link href="/clients">
                    <Button variant="link" size="sm">
                        View All
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <p className="text-muted-foreground text-sm">No clients added yet.</p>
                    </div>
                ) : (
                    <ul className="divide-y">
                        {clients.slice(0, 5).map((client) => (
                            <li key={client.id} className="py-2">
                                <Link href="#" className="block hover:underline">
                                    <h4 className="font-semibold">{client.name}</h4>
                                    <p className="text-sm text-muted-foreground">{client.company || 'N/A'}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
