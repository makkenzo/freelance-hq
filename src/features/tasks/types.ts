export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
    id: string;
    collectionId: string;
    collectionName: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string;
    project: string;
    user: string;
    created: string;
    updated: string;
};

export interface CreateTaskActionState {
    error?: string;
    fieldErrors?: {
        title?: string;
    };
    success?: boolean;
}

export interface UpdateTaskActionState {
    error?: string;
    fieldErrors?: {
        title?: string;
        status?: string;
        priority?: string;
        due_date?: string;
        description?: string;
    };
    success?: boolean;
}
