import { getClientsAction } from '@/features/clients/actions';
import { ClientList } from '@/features/clients/components/client-list';
import { CreateClientDialog } from '@/features/clients/components/create-client-dialog';

export default async function ClientsPage() {
    const clients = await getClientsAction();

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
                    <p className="text-muted-foreground">Manage your clients and their information.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <CreateClientDialog />
                </div>
            </div>

            {clients.length > 0 ? (
                <ClientList clients={clients} />
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-[400px]">
                    <h3 className="text-2xl font-bold tracking-tight">You have no clients yet.</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get started by adding a new client.</p>
                    <CreateClientDialog />
                </div>
            )}
        </div>
    );
}
