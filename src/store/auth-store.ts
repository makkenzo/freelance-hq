import { pb } from '@/lib/pb';
import { RecordModel } from 'pocketbase';
import { createStore } from 'zustand';

export type AuthState = {
    user: RecordModel | null;
};

export type AuthActions = {
    setUser: (user: RecordModel | null) => void;
    logout: () => void;
    initializeAuth: () => void;
};

export type AuthStore = AuthState & AuthActions;

export const defaultAuthState: AuthState = {
    user: null,
};

export const createAuthStore = (initState: AuthState = defaultAuthState) => {
    return createStore<AuthStore>()((set, get) => ({
        ...initState,
        setUser: (user) => {
            set({ user });
        },
        logout: () => {
            pb.authStore.clear();
            set({ user: null });
        },
        initializeAuth: () => {
            if (pb.authStore.isValid && pb.authStore.model) {
                set({ user: pb.authStore.record });
            } else {
                set({ user: null });
            }

            pb.authStore.onChange(() => {
                set({ user: pb.authStore.record });
            });
        },
    }));
};
