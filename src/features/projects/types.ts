export type Project = {
    id: string;
    collectionId: string;
    collectionName: string;
    name: string;
    client_name: string;
    status: 'in_progress' | 'completed' | 'on_hold';
    user: string;
    created: string;
    updated: string;
};

export interface CreateProjectActionState {
    error?: string;
    success?: boolean;
}
