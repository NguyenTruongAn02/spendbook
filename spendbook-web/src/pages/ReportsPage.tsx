import { useState, useEffect } from 'react';
import { Card, Grid } from 'antd';
import ReportFilter from '@/components/report/ReportFilter';
import ReportTable from '@/components/report/ReportTable';
import {
    reportApi,
    ReportFilterDto,
    ReportSummary,
    ReportChartPoint,
    ReportTransactionRow,
    ReportTypeFilter,
} from '@/api/reportApi';
import { useToast } from '@/contexts/ToastContext';

const DEFAULT_LIMIT = 10;

export default function ReportPage() {
    const [filter, setFilter] = useState<ReportFilterDto | null>(null);
    const [summary, setSummary] = useState<ReportSummary | undefined>();
    const [chartData, setChartData] = useState<ReportChartPoint[]>([]);

    const [transactions, setTransactions] = useState<ReportTransactionRow[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);

    const [typeFilter, setTypeFilter] = useState<ReportTypeFilter>('ALL');

    const [loading, setLoading] = useState(false);

    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    const toast = useToast();

    const handleFilterSubmit = (f: ReportFilterDto) => {
        setFilter(f);
        setNextCursor(null);
        setHasMore(false);
        setTransactions([]);
    };

    useEffect(() => {
        if (!filter?.from || !filter?.to) return;

        let cancelled = false;

        const fetchInitial = async () => {
            if (loading) return;
            setLoading(true);
            try {
                const [summaryRes, chartRes] = await Promise.all([
                    reportApi.getReport({
                        ...filter,
                        type: typeFilter,
                        sort: 'newest',
                        cursor: undefined,
                        limit: DEFAULT_LIMIT,
                    }),
                    reportApi.getChart(filter),
                ]);

                if (cancelled) return;

                setSummary(summaryRes);
                setChartData(chartRes);

                setTransactions(summaryRes.transactions || []);
                setNextCursor(summaryRes.nextCursor ?? null);
                setHasMore(summaryRes.hasMore ?? false);
            } catch (err) {
                console.error('Lỗi tải báo cáo:', err);
                toast.error(err, 'Không tải được báo cáo');
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchInitial();

        return () => {
            cancelled = true;
        };
    }, [filter, typeFilter, toast]);

    const handleLoadMore = async () => {
        if (!filter?.from || !filter?.to) return;
        if (!nextCursor) return;
        if (loading) return;

        setLoading(true);
        try {
            const res = await reportApi.getReport({
                ...filter,
                type: typeFilter,
                sort: 'newest',
                cursor: nextCursor,
                limit: DEFAULT_LIMIT,
            });

            setTransactions((prev) => [...prev, ...(res.transactions || [])]);
            setNextCursor(res.nextCursor ?? null);
            setHasMore(res.hasMore ?? false);

            setSummary(res);
        } catch (err) {
            console.error('Lỗi tải thêm giao dịch báo cáo:', err);
            toast.error(err, 'Không tải thêm được giao dịch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            style={isMobile ? { marginTop: 6 } : { marginTop: 60 }}
            title="Báo cáo thu chi"
        >
            <ReportFilter onSubmit={handleFilterSubmit} loading={loading} />

            <div style={{ marginTop: 16 }}>
                <ReportTable
                    summary={summary}
                    chartData={chartData}
                    loading={loading && !transactions.length}
                    transactions={transactions}
                    hasMore={hasMore}
                    onLoadMore={handleLoadMore}
                    typeFilter={typeFilter}
                    onTypeFilterChange={(t) => {
                        if (t === typeFilter) return;
                        setTypeFilter(t);
                        setNextCursor(null);
                        setHasMore(false);
                        setTransactions([]);
                    }}
                />
            </div>
        </Card>
    );
}
