import { useEffect, useState } from 'react';
import { Button, Space, Table, Tag, Select, Typography } from 'antd';
import {
    transactionApi,
    Transaction,
    TransactionCursorResponse,
    HistoryFilterType,
    HistorySort,
} from '@/api/transactionApi';
import { walletApi, Wallet } from '@/api/walletApi';

const DEFAULT_LIMIT = 10;
const { Text } = Typography;

interface TransactionListProps {
    reloadKey?: number;
}

export default function TransactionList({ reloadKey }: TransactionListProps) {
    const [items, setItems] = useState<Transaction[]>([]);
    const [walletMap, setWalletMap] = useState<Record<string, string>>({});
    const [nextCursor, setNextCursor] = useState<string | undefined>();
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);

    const [typeFilter, setTypeFilter] = useState<HistoryFilterType>('ALL');
    const [sort, setSort] = useState<HistorySort>('newest');

    const fetchWallets = async () => {
        const wallets: Wallet[] = await walletApi.getAll();
        const map: Record<string, string> = {};
        wallets.forEach((w) => {
            map[w._id] = w.name;
        });
        setWalletMap(map);
    };

    const loadHistory = async (opts?: {
        reset?: boolean;
        typeOverride?: HistoryFilterType;
        sortOverride?: HistorySort;
    }) => {
        if (loading) return;
        setLoading(true);
        try {
            const effectiveType = opts?.typeOverride ?? typeFilter;
            const effectiveSort = opts?.sortOverride ?? sort;

            const res: TransactionCursorResponse =
                await transactionApi.getHistory({
                    cursor: opts?.reset ? undefined : nextCursor,
                    limit: DEFAULT_LIMIT,
                    sort: effectiveSort,
                    type: effectiveType,
                });

            if (opts?.reset) {
                setItems(res.items);
            } else {
                setItems((prev) => [...prev, ...res.items]);
            }

            setNextCursor(res.nextCursor ?? undefined);
            setHasMore(res.hasMore);
            setInitialLoaded(true);
        } catch (err) {
            console.error('Lỗi tải lịch sử giao dịch:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    useEffect(() => {
        setItems([]);
        setNextCursor(undefined);
        setHasMore(false);
        setInitialLoaded(false);
        loadHistory({ reset: true });
    }, [reloadKey]);

    return (
        <>
            <div
                style={{
                    marginBottom: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 8,
                    flexWrap: 'wrap',
                }}
            >
                <Space size="small" wrap>
                    <Text strong>Lọc:</Text>
                    <Select<HistoryFilterType>
                        size="small"
                        value={typeFilter}
                        style={{ width: 130 }}
                        onChange={(v) => {
                            setTypeFilter(v);
                            setItems([]);
                            setNextCursor(undefined);
                            setHasMore(false);
                            setInitialLoaded(false);
                            loadHistory({ reset: true, typeOverride: v });
                        }}
                        options={[
                            { value: 'ALL', label: 'Tất cả' },
                            { value: 'INCOME', label: 'Chỉ Thu' },
                            { value: 'EXPENSE', label: 'Chỉ Chi' },
                        ]}
                    />
                    <Select<HistorySort>
                        size="small"
                        value={sort}
                        style={{ width: 150 }}
                        onChange={(v) => {
                            setSort(v);
                            setItems([]);
                            setNextCursor(undefined);
                            setHasMore(false);
                            setInitialLoaded(false);
                            loadHistory({ reset: true, sortOverride: v });
                        }}
                        options={[
                            { value: 'newest', label: 'Mới nhất trước' },
                            { value: 'oldest', label: 'Cũ nhất trước' },
                        ]}
                    />
                </Space>
            </div>

            <Table
                rowKey="_id"
                size="small"
                dataSource={items}
                pagination={false}
                loading={loading && !initialLoaded}
                columns={[
                    {
                        title: 'Ngày',
                        dataIndex: 'date',
                        render: (v: string) =>
                            new Date(v).toLocaleDateString('vi-VN'),
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
                        render: (v: string) => (
                            <Tag color={v === 'INCOME' ? 'green' : 'red'}>
                                {v === 'INCOME' ? 'Thu' : 'Chi'}
                            </Tag>
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
                        render: (v: number) =>
                            v.toLocaleString('vi-VN', {
                                minimumFractionDigits: 0,
                            }),
                    },
                    {
                        title: 'Ghi chú',
                        dataIndex: 'note',
                    },
                ]}
            />

            <div style={{ marginTop: 12, textAlign: 'center' }}>
                <Space>
                    {hasMore ? (
                        <Button
                            onClick={() => loadHistory()}
                            loading={loading && initialLoaded}
                        >
                            Tải thêm
                        </Button>
                    ) : (
                        initialLoaded && (
                            <span style={{ color: '#999' }}>
                                Đã tải hết dữ liệu.
                            </span>
                        )
                    )}
                </Space>
            </div>
        </>
    );
}
