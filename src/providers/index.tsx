import { AuthStoreProvider } from './auth-store-provider';

export default function ZustandProvider({ children }: { children: React.ReactNode }) {
    return <AuthStoreProvider>{children}</AuthStoreProvider>;
}
