'use client';

import { useAuthStore } from '@/providers/auth-store-provider';
import { useEffect } from 'react';

function AuthInitializer() {
    const { initializeAuth } = useAuthStore((state) => state);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return null;
}

export default AuthInitializer;
