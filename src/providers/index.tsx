import { AuthStoreProvider } from './auth-store-provider';
import { TimeTrackingStoreProvider } from './time-tracking-store-provider';

export default function ZustandProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthStoreProvider>
            <TimeTrackingStoreProvider>{children}</TimeTrackingStoreProvider>
        </AuthStoreProvider>
    );
}
