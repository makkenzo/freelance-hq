export type Client = {
    id: string;
    collectionId: string;
    collectionName: string;
    name: string;
    client_email: string;
    company: string;
    user: string;
    created: string;
    updated: string;
};

export interface CreateClientActionState {
    error?: string;
    fieldErrors?: {
        name?: string;
        client_email?: string;
    };
    success?: boolean;
}
