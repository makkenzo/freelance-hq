import { getExpensesAction } from '@/features/expenses/actions';
import { CreateExpenseDialog } from '@/features/expenses/components/create-expense-dialog';
import { getProjectsAction } from '@/features/projects/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';

export default async function ExpensesPage() {
    const [expenses, projects] = await Promise.all([getExpensesAction(), getProjectsAction()]);

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
                    <p className="text-muted-foreground">Manage your business expenses.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <CreateExpenseDialog projects={projects} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{new Date(expense.expense_date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">{expense.description}</TableCell>
                                    <TableCell>{expense.expand?.project?.name || 'N/A'}</TableCell>
                                    <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {expenses.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                            <h3 className="text-xl font-bold tracking-tight">No expenses recorded yet.</h3>
                            <p className="text-sm text-muted-foreground mt-2">Get started by adding a new expense.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
