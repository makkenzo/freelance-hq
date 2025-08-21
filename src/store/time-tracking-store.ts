import type { Task } from '@/features/tasks/types';
import { createStore } from 'zustand';

export type TimeTrackingState = {
    activeTask: Task | null;
    startTime: number | null;
    elapsedSeconds: number;
    timerInterval: NodeJS.Timeout | null;
};

export type TimeTrackingActions = {
    startTimer: (task: Task) => void;
    stopTimer: () => { durationInMinutes: number; task: Task | null };
    _tick: () => void;
};

export type TimeTrackingStore = TimeTrackingState & TimeTrackingActions;

export const defaultTimeTrackingState: TimeTrackingState = {
    activeTask: null,
    startTime: null,
    elapsedSeconds: 0,
    timerInterval: null,
};

export const createTimeTrackingStore = (initState: TimeTrackingState = defaultTimeTrackingState) => {
    return createStore<TimeTrackingStore>((set, get) => ({
        ...initState,
        startTimer: (task) => {
            const { timerInterval } = get();
            if (timerInterval) {
                clearInterval(timerInterval);
            }

            const newInterval = setInterval(() => get()._tick(), 1000);

            set({
                activeTask: task,
                startTime: Date.now(),
                elapsedSeconds: 0,
                timerInterval: newInterval,
            });
        },
        stopTimer: () => {
            const { timerInterval, startTime, elapsedSeconds, activeTask } = get();
            if (timerInterval) {
                clearInterval(timerInterval);
            }

            const durationInMinutes = Math.round(elapsedSeconds / 60);

            set({
                activeTask: null,
                startTime: null,
                elapsedSeconds: 0,
                timerInterval: null,
            });

            return { durationInMinutes: durationInMinutes > 0 ? durationInMinutes : 1, task: activeTask };
        },
        _tick: () => {
            const { startTime } = get();
            if (startTime) {
                set({ elapsedSeconds: Math.floor((Date.now() - startTime) / 1000) });
            }
        },
    }));
};
