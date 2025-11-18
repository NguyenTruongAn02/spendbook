import { useEffect, useState } from 'react';
import { walletApi, WalletSummary } from '@/api/walletApi';

export function useWalletSummary() {
    const [summary, setSummary] = useState<WalletSummary | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSummary = async () => {
        try {
            const res = await walletApi.getSummary();
            setSummary(res);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    return { summary, loading, refetch: fetchSummary };
}
