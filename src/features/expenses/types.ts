import type { Project } from '@/features/projects/types';

export type Expense = {
    id: string;
    description: string;
    amount: number;
    expense_date: string;
    receipt: string; // имя файла
    project?: string;
    user: string;
    expand?: {
        project?: Project;
    };
};

export interface CreateExpenseActionState {
    error?: string;
    fieldErrors?: {
        description?: string[];
        amount?: string[];
        expense_date?: string[];
    };
    success?: boolean;
}
