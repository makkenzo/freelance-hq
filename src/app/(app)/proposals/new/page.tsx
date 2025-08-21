import { getClientsAction } from '@/features/clients/actions';
import { ProposalForm } from '@/features/proposals/components/proposal-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';

export default async function NewProposalPage() {
    const clients = await getClientsAction();

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Proposal</CardTitle>
                    <CardDescription>
                        Fill out the details below. You can add multiple line items to build your quote.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProposalForm clients={clients} />
                </CardContent>
            </Card>
        </div>
    );
}
