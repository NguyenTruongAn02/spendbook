import { axiosClient } from '@/api/axiosClient';

export interface Wallet {
    _id: string;
    name: string;
    bankName?: string;
    accountNumber?: string;
    startDate: string;
    openingBalance: number;
    currentBalance: number;
    isArchived: boolean;
    isDeleted: boolean;
    transactionsCount: number;
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
        accountNumber?: string;
        startDate: string;
        openingBalance: number;
    }): Promise<Wallet> {
        return axiosClient.post('/wallets', payload).then((res) => res.data);
    },

    update(id: string, payload: Partial<Wallet>): Promise<Wallet> {
        return axiosClient.patch(`/wallets/${id}`, payload).then((res) => res.data);
    },

    archive(id: string): Promise<Wallet> {
        return axiosClient.patch(`/wallets/${id}/archive`).then((res) => res.data);
    },

    restore(id: string): Promise<Wallet> {
        return axiosClient.patch(`/wallets/${id}/restore`).then((res) => res.data);
    },

    remove(id: string): Promise<Wallet> {
        return axiosClient.delete(`/wallets/${id}`).then((res) => res.data);
    },
};
