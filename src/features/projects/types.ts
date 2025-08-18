export type ClientBase = {
    id: string;
    name: string;
    client_email: string;
    company: string;
};

export type Project = {
    id: string;
    collectionId: string;
    collectionName: string;
    name: string;
    client: string;
    status: 'in_progress' | 'completed' | 'on_hold';
    user: string;
    created: string;
    updated: string;
    expand?: {
        client: ClientBase;
    };
};

export interface CreateProjectActionState {
    error?: string;
    success?: boolean;
}
