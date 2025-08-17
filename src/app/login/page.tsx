'use client';

import { loginAction } from '@/features/auth/actions';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Checkbox } from '@/ui/checkbox';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Signing In...' : 'Sign In'}
        </Button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useActionState(loginAction, { error: undefined });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Log in to your account</CardTitle>
                    <CardDescription>Welcome back! Please enter your details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember-me" name="remember-me" />
                            <Label htmlFor="remember-me" className="text-sm font-medium">
                                Remember me for 30 days
                            </Label>
                        </div>
                        {state?.error && <p className="text-red-500 text-sm font-semibold">{state.error}</p>}
                        <SubmitButton />
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="underline font-semibold">
                            Sign up for free
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
