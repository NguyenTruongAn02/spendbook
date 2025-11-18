import { axiosClient } from './axiosClient';

export interface Wallet {
    id: string;
    name: string;
    bankName?: string;
    balance: number;
    currency: string;
}

export interface WalletSummary {
    totalBalance: number;
}

export const walletApi = {
    getSummary(): Promise<WalletSummary> {
        return axiosClient.get('/wallets/summary').then((res) => res.data);
    },
    getAll(): Promise<Wallet[]> {
        return axiosClient.get('/wallets').then((res) => res.data);
    },
    create(payload: {
        name: string;
        bankName?: string;
        initialBalance: number;
    }): Promise<Wallet> {
        return axiosClient.post('/wallets', payload).then((res) => res.data);
    },
};
