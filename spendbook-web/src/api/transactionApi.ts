import { axiosClient } from './axiosClient';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
    id: string;
    walletId: string;
    walletName: string;
    type: TransactionType;
    amount: number;
    category: string;
    note?: string;
    date: string; 
}

export const transactionApi = {
    getAll(): Promise<Transaction[]> {
        return axiosClient.get('/transactions').then((res) => res.data);
    },
    create(payload: {
        walletId: string;
        type: TransactionType;
        amount: number;
        category: string;
        note?: string;
        date: string;
    }): Promise<Transaction> {
        return axiosClient.post('/transactions', payload).then((res) => res.data);
    },
};
