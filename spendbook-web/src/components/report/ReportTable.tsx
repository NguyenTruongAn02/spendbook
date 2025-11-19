import { useEffect, useState, useMemo } from 'react';
import { Card, Col, Row, Table, Typography, Select, Button } from 'antd';
import type {
    ReportSummary,
    ReportChartPoint,
    ReportTransactionRow,
    ReportTypeFilter,
} from '@/api/reportApi';
import { Column } from '@ant-design/plots';
import { Wallet, walletApi } from '@/api/walletApi';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface ReportTableProps {
    summary?: ReportSummary;
    chartData?: ReportChartPoint[];
    loading?: boolean;

    transactions: ReportTransactionRow[];
    hasMore: boolean;
    onLoadMore: () => void;

    typeFilter: ReportTypeFilter;
    onTypeFilterChange: (t: ReportTypeFilter) => void;
}

type SeriesPoint = {
    period: string;
    total: number;
};

export default function ReportTable({
    summary,
    chartData = [],
    loading,
    transactions,
    hasMore,
    onLoadMore,
    typeFilter,
    onTypeFilterChange,
}: ReportTableProps) {
    const data = transactions || [];

    const [walletMap, setWalletMap] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const wallets: Wallet[] = await walletApi.getAll();
                const map: Record<string, string> = {};
                wallets.forEach((w) => {
                    map[w._id] = w.name;
                });
                setWalletMap(map);
            } catch (err) {
                console.error('Lỗi tải danh sách ví:', err);
            }
        };

        fetchWallets();
    }, []);

    const { incomeData, expenseData, useMonthly } = useMemo(() => {
        if (!chartData || chartData.length === 0) {
            return {
                incomeData: [] as SeriesPoint[],
                expenseData: [] as SeriesPoint[],
                useMonthly: false,
            };
        }

        const sorted = [...chartData].sort((a, b) =>
            a.date.localeCompare(b.date),
        );

        const firstDay = dayjs(sorted[0].date);
        const lastDay = dayjs(sorted[sorted.length - 1].date);
        const diffDays = lastDay.diff(firstDay, 'day');

        let useMonthly = diffDays > 60;

        if (!useMonthly) {
            const incomeDaily: SeriesPoint[] = [];
            const expenseDaily: SeriesPoint[] = [];

            sorted.forEach((d) => {
                const point: SeriesPoint = {
                    period: d.date,
                    total: d.total,
                };
                if (d.type === 'INCOME') incomeDaily.push(point);
                else expenseDaily.push(point);
            });

            return {
                incomeData: incomeDaily,
                expenseData: expenseDaily,
                useMonthly,
            };
        }

        const monthlyMap: Record<
            string,
            { income: number; expense: number }
        > = {};

        sorted.forEach((d) => {
            const monthKey = dayjs(d.date).format('YYYY-MM');
            if (!monthlyMap[monthKey]) {
                monthlyMap[monthKey] = { income: 0, expense: 0 };
            }
            if (d.type === 'INCOME') {
                monthlyMap[monthKey].income += d.total;
            } else {
                monthlyMap[monthKey].expense += d.total;
            }
        });

        const incomeMonthly: SeriesPoint[] = [];
        const expenseMonthly: SeriesPoint[] = [];

        Object.entries(monthlyMap).forEach(([month, v]) => {
            incomeMonthly.push({ period: month, total: v.income });
            expenseMonthly.push({ period: month, total: v.expense });
        });

        return {
            incomeData: incomeMonthly,
            expenseData: expenseMonthly,
            useMonthly,
        };
    }, [chartData]);

    const axisLabelName = useMonthly ? 'Tháng' : 'Ngày';

    const incomeConfig = {
        data: incomeData,
        xField: 'period',
        yField: 'total',
        padding: 'auto' as const,
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: !useMonthly,
            },
        },
        yAxis: {
            label: {
                formatter: (v: string) => Number(v).toLocaleString('vi-VN'),
            },
        },
        meta: {
            period: { alias: axisLabelName },
            total: { alias: 'Tổng thu' },
        },
        columnStyle: {
            radius: [4, 4, 0, 0],
        },
    };

    const expenseConfig = {
        data: expenseData,
        xField: 'period',
        yField: 'total',
        padding: 'auto' as const,
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: !useMonthly,
            },
        },
        yAxis: {
            label: {
                formatter: (v: string) => Number(v).toLocaleString('vi-VN'),
            },
        },
        meta: {
            period: { alias: axisLabelName },
            total: { alias: 'Tổng chi' },
        },
        columnStyle: {
            radius: [4, 4, 0, 0],
        },
    };

    return (
        <>
            {summary && (
                <div style={{ marginBottom: 12 }}>
                    <Text>
                        Số dư đầu kỳ:{' '}
                        <b>{summary.openingBalance.toLocaleString('vi-VN')} ₫</b>
                    </Text>
                    {' • '}
                    <Text type="success">
                        Tổng thu:{' '}
                        <b>{summary.totalIncome.toLocaleString('vi-VN')} ₫</b>
                    </Text>
                    {' • '}
                    <Text type="danger">
                        Tổng chi:{' '}
                        <b>{summary.totalExpense.toLocaleString('vi-VN')} ₫</b>
                    </Text>
                    {' • '}
                    <Text>
                        Số dư cuối kỳ:{' '}
                        <b>{summary.closingBalance.toLocaleString('vi-VN')} ₫</b>
                    </Text>
                </div>
            )}

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} md={12}>
                    <Card
                        size="small"
                        title={
                            <Title level={5}>
                                Biểu đồ Thu ({useMonthly ? 'theo tháng' : 'theo ngày'})
                            </Title>
                        }
                    >
                        {incomeData.length === 0 ? (
                            <Text type="secondary">
                                Chưa có dữ liệu thu trong khoảng thời gian này.
                            </Text>
                        ) : (
                            <Column {...incomeConfig} />
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        size="small"
                        title={
                            <Title level={5}>
                                Biểu đồ Chi ({useMonthly ? 'theo tháng' : 'theo ngày'})
                            </Title>
                        }
                    >
                        {expenseData.length === 0 ? (
                            <Text type="secondary">
                                Chưa có dữ liệu chi trong khoảng thời gian này.
                            </Text>
                        ) : (
                            <Column {...expenseConfig} />
                        )}
                    </Card>
                </Col>
            </Row>

            <Card
                size="small"
                title="Chi tiết giao dịch"
                extra={
                    <Select
                        size="small"
                        value={typeFilter}
                        onChange={onTypeFilterChange}
                        style={{ width: 140 }}
                        options={[
                            { value: 'ALL', label: 'Tất cả' },
                            { value: 'INCOME', label: 'Chỉ Thu' },
                            { value: 'EXPENSE', label: 'Chỉ Chi' },
                        ]}
                    />
                }
            >
                <Table
                    rowKey={(r: any, idx) => `${r._id || r.date}-${idx}`}
                    dataSource={data}
                    loading={loading}
                    pagination={false}
                    size="small"
                    columns={[
                        {
                            title: 'Ngày',
                            dataIndex: 'date',
                            render: (value: string) =>
                                value ? dayjs(value).format('DD/MM/YYYY') : '',
                        },
                        {
                            title: 'Ví',
                            dataIndex: 'walletId',
                            render: (walletId: string) =>
                                walletMap[walletId] || '(Không tìm thấy ví)',
                        },
                        {
                            title: 'Loại',
                            dataIndex: 'type',
                            render: (v: 'INCOME' | 'EXPENSE') =>
                                v === 'INCOME' ? (
                                    <Text type="success">Thu</Text>
                                ) : (
                                    <Text type="danger">Chi</Text>
                                ),
                        },
                        {
                            title: 'Danh mục',
                            dataIndex: 'categoryName',
                        },
                        {
                            title: 'Số tiền',
                            dataIndex: 'amount',
                            align: 'right',
                            render: (v: number, r: any) => (
                                <Text type={r.type === 'INCOME' ? 'success' : 'danger'}>
                                    {v.toLocaleString('vi-VN')}
                                </Text>
                            ),
                        },
                        {
                            title: 'Ghi chú',
                            dataIndex: 'note',
                        },
                    ]}
                />

                <div style={{ marginTop: 12, textAlign: 'center' }}>
                    {hasMore ? (
                        <Button
                            size="small"
                            onClick={onLoadMore}
                            loading={!!loading}
                            disabled={!!loading}
                        >
                            Tải thêm
                        </Button>
                    ) : (
                        data.length > 0 && (
                            <Text type="secondary">
                                Đã tải hết giao dịch trong khoảng thời gian này.
                            </Text>
                        )
                    )}
                </div>
            </Card>
        </>
    );
}
