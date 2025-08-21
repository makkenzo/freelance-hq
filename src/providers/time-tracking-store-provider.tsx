'use client';

import { type TimeTrackingStore, createTimeTrackingStore } from '@/store/time-tracking-store';
import { type ReactNode, createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

export type TimeTrackingStoreApi = ReturnType<typeof createTimeTrackingStore>;

export const TimeTrackingStoreContext = createContext<TimeTrackingStoreApi | undefined>(undefined);

export interface TimeTrackingStoreProviderProps {
    children: ReactNode;
}

export const TimeTrackingStoreProvider = ({ children }: TimeTrackingStoreProviderProps) => {
    const storeRef = useRef<TimeTrackingStoreApi | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createTimeTrackingStore();
    }

    return <TimeTrackingStoreContext.Provider value={storeRef.current}>{children}</TimeTrackingStoreContext.Provider>;
};

export const useTimeTrackingStore = <T,>(selector: (store: TimeTrackingStore) => T): T => {
    const timeTrackingStoreContext = useContext(TimeTrackingStoreContext);

    if (!timeTrackingStoreContext) {
        throw new Error(`useTimeTrackingStore must be used within TimeTrackingStoreProvider`);
    }

    return useStore(timeTrackingStoreContext, selector);
};
