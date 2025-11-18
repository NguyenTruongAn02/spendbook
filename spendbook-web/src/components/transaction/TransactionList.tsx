import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { transactionApi, Transaction } from '@/api/transactionApi';

export default function TransactionList() {
    const [data, setData] = useState<Transaction[]>([]);

    const fetchData = async () => {
        const res = await transactionApi.getAll();
        setData(res);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Table
            rowKey="id"
            size="small"
            dataSource={data}
            pagination={{ pageSize: 10 }}
            columns={[
                {
                    title: 'Ngày',
                    dataIndex: 'date',
                    render: (v: string) =>
                        new Date(v).toLocaleDateString('vi-VN'),
                },
                {
                    title: 'Ví',
                    dataIndex: 'walletName',
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
                    dataIndex: 'category',
                },
                {
                    title: 'Số tiền',
                    dataIndex: 'amount',
                    align: 'right',
                    render: (v: number) => v.toLocaleString('vi-VN'),
                },
                {
                    title: 'Ghi chú',
                    dataIndex: 'note',
                },
            ]}
        />
    );
}
