import { Table, Typography } from 'antd';
import { ReportRow, ReportSummary } from '@/api/reportApi';

// Tạm thời cho 1 sample summary & rows; sau bạn truyền dữ liệu thật vào
const sample: ReportSummary = {
    openingBalance: 1000000,
    totalIn: 5000000,
    totalOut: 3000000,
    closingBalance: 3000000,
    rows: [],
};

const { Text } = Typography;

export default function ReportTable() {
    const data: ReportRow[] = sample.rows;

    return (
        <>
            <div style={{ marginBottom: 8 }}>
                <Text>
                    Số dư đầu kỳ:{' '}
                    <b>{sample.openingBalance.toLocaleString('vi-VN')} ₫</b>
                </Text>
                {' • '}
                <Text type="success">
                    Tổng thu:{' '}
                    <b>{sample.totalIn.toLocaleString('vi-VN')} ₫</b>
                </Text>
                {' • '}
                <Text type="danger">
                    Tổng chi:{' '}
                    <b>{sample.totalOut.toLocaleString('vi-VN')} ₫</b>
                </Text>
                {' • '}
                <Text>
                    Số dư cuối kỳ:{' '}
                    <b>{sample.closingBalance.toLocaleString('vi-VN')} ₫</b>
                </Text>
            </div>

            <Table
                rowKey={(r, idx) => `${r.date}-${idx}`}
                dataSource={data}
                pagination={{ pageSize: 20 }}
                size="small"
                columns={[
                    {
                        title: 'Ngày',
                        dataIndex: 'date',
                    },
                    {
                        title: 'Ví',
                        dataIndex: 'walletName',
                    },
                    {
                        title: 'Loại',
                        dataIndex: 'type',
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
        </>
    );
}
