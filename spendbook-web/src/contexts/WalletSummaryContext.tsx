import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { walletApi, WalletSummary } from '@/api/walletApi';

interface WalletSummaryContextValue {
    total: number;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

const WalletSummaryContext = createContext<WalletSummaryContextValue | undefined>(undefined);

export function WalletSummaryProvider({ children }: { children: ReactNode }) {
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            setError(null);
            const data: WalletSummary = await walletApi.getSummary();
            setTotal(data.totalBalance);
        } catch (err) {
            console.error('Lỗi khi lấy tổng số dư:', err);
            setError('Không lấy được tổng tiền');
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    const value: WalletSummaryContextValue = {
        total,
        loading,
        error,
        refresh: fetchSummary,
    };

    return (
        <WalletSummaryContext.Provider value={value}>
            {children}
        </WalletSummaryContext.Provider>
    );
}

export function useWalletSummary() {
    const ctx = useContext(WalletSummaryContext);
    if (!ctx) {
        throw new Error('useWalletSummary must be used within WalletSummaryProvider');
    }
    return ctx;
}
