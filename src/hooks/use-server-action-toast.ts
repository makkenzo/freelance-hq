'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

type ActionState = {
    error?: string;
    success?: boolean;
};

type ToastMessages = {
    loading: string;
    success: string;
    error: (error: string) => string;
};

export function useServerActionToast(state: ActionState, messages: ToastMessages, isPending: boolean) {
    const toastId = useRef<string | number | undefined>(undefined);

    useEffect(() => {
        if (isPending) {
            toastId.current = toast.loading(messages.loading);
        } else if (toastId.current) {
            if (state.error) {
                toast.error(messages.error(state.error), {
                    id: toastId.current,
                });
            }
            if (state.success) {
                toast.success(messages.success, {
                    id: toastId.current,
                });
            }
        }

        return () => {
            if (toastId.current) {
                toast.dismiss(toastId.current);
            }
        };
    }, [isPending, state, messages]);
}
