import AuthInitializer from '@/features/auth/components/auth-initializer';
import ZustandProvider from '@/providers';
import { Toaster } from '@/ui/sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Freelance HQ',
    description: 'Freelance HQ is a web app for freelancers to manage their projects and clients.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <ZustandProvider>
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    <AuthInitializer /> {children} <Toaster richColors position="top-right" />
                </body>
            </ZustandProvider>
        </html>
    );
}
