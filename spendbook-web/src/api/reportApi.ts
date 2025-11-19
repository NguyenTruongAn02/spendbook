import { axiosClient } from './axiosClient';

export type ReportTypeFilter = 'INCOME' | 'EXPENSE' | 'ALL';
export type ReportSort = 'newest' | 'oldest';

export interface ReportFilterDto {
    userId?: string;
    walletId?: string;
    from?: string;
    to?: string;

    type?: ReportTypeFilter;
    cursor?: string;
    limit?: number;
    sort?: ReportSort;
}

export interface ReportTransactionRow {
    _id: string;
    walletId: string;
    categoryId?: string;
    categoryName: string;
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    date: string;
    note?: string;
}

export interface ReportSummary {
    openingBalance: number;
    totalIncome: number;
    totalExpense: number;
    closingBalance: number;
    transactions: ReportTransactionRow[];
}

export interface ReportStatementResponse extends ReportSummary {
    transactions: ReportTransactionRow[];
    cursor: string | null;
    nextCursor: string | null;
    hasMore: boolean;
    limit: number;
    sort: ReportSort;
    type: ReportTypeFilter;
}

export interface ReportChartPoint {
    date: string;
    type: 'INCOME' | 'EXPENSE';
    total: number;
}

export const reportApi = {
    getReport(filter: ReportFilterDto): Promise<ReportStatementResponse> {
        return axiosClient
            .get('/reports/statement', { params: filter })
            .then((res) => res.data);
    },

    getChart(filter: ReportFilterDto): Promise<ReportChartPoint[]> {
        return axiosClient
            .get('/reports/chart', {
                params: {
                    walletId: filter.walletId,
                    from: filter.from,
                    to: filter.to,
                }
            })
            .then((res) => res.data);
    },
};
