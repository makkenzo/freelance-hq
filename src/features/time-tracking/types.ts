export type TimeEntry = {
    id: string;
    duration: number; // в минутах
    notes: string;
    entry_date: string;
    task: string;
    project: string;
    user: string;
    invoice?: string;
    created: string;
    updated: string;
    expand?: {
        task?: {
            id: string;
            title: string;
        };
    };
};

export interface CreateTimeEntryActionState {
    error?: string;
    fieldErrors?: {
        duration?: string;
        entry_date?: string;
    };
    success?: boolean;
}
