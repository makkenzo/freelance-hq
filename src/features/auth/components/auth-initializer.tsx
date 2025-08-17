'use client';

import { useAuthStore } from '@/providers/auth-store-provider';
import { useEffect, useRef } from 'react';

function AuthInitializer() {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initializeAuth();
            initialized.current = true;
        }
    }, [initializeAuth]);

    return null;
}

export default AuthInitializer;
