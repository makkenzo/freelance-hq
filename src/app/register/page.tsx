'use client';

import { registerAction } from '@/features/auth/actions';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Creating Account...' : 'Create Account'}
        </Button>
    );
}

export default function RegisterPage() {
    const [state, formAction] = useActionState(registerAction, { error: undefined });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
                    <CardDescription>Enter your information to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" type="text" placeholder="Alex Morgan" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passwordConfirm">Confirm Password</Label>
                            <Input
                                id="passwordConfirm"
                                name="passwordConfirm"
                                type="password"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                        {state?.error && <p className="text-red-500 text-sm font-semibold">{state.error}</p>}
                        <SubmitButton />
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="underline font-semibold">
                            Log in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
