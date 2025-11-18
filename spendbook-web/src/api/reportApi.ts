import { axiosClient } from './axiosClient';

export interface ReportFilterDto {
    walletId?: string;
    fromDate?: string;
    toDate?: string;
}

export interface ReportRow {
    date: string;
    walletName: string;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    amount: number;
    note?: string;
}

export interface ReportSummary {
    openingBalance: number;
    totalIn: number;
    totalOut: number;
    closingBalance: number;
    rows: ReportRow[];
}

export const reportApi = {
    getReport(filter: ReportFilterDto): Promise<ReportSummary> {
        return axiosClient
            .get('/reports', { params: filter })
            .then((res) => res.data);
    },
};
