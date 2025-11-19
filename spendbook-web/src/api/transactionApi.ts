import { axiosClient } from './axiosClient';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
    _id: string;
    userId: string;
    walletId: string;
    categoryId?: string;
    categoryName: string;
    type: TransactionType;
    amount: number;
    date: string;
    note?: string;
}

export type HistorySort = 'newest' | 'oldest';
export type HistoryFilterType = TransactionType | 'ALL';

export interface TransactionCursorResponse {
    items: Transaction[];
    limit: number;
    sort: HistorySort;
    type: HistoryFilterType;
    nextCursor?: string | null;
    hasMore: boolean;
}

export interface TransactionHistoryParams {
    cursor?: string;
    limit?: number;
    sort?: HistorySort;
    type?: HistoryFilterType;
}

export const transactionApi = {
    getHistory(params: TransactionHistoryParams = {}): Promise<TransactionCursorResponse> {
        return axiosClient
            .get('/transactions/history', { params })
            .then((res) => res.data);
    },

    create(payload: {
        walletId: string;
        type: TransactionType;
        amount: number;
        categoryId?: string;
        note?: string;
        date: string;
    }): Promise<Transaction> {
        return axiosClient.post('/transactions', payload).then((res) => res.data);
    },
};
