import { Form, Select, DatePicker, Button, Space, Grid } from 'antd';
import { useEffect, useState } from 'react';
import { walletApi, Wallet } from '@/api/walletApi';
import dayjs, { Dayjs } from 'dayjs';
import type { ReportFilterDto } from '@/api/reportApi';
import ExportExcelButton from './ExportExcelButton';

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

interface ReportFilterProps {
    onSubmit?: (filter: ReportFilterDto) => void;
    loading?: boolean;
}

type FilterFormValues = {
    walletId?: string;
    range?: [Dayjs, Dayjs];
};

export default function ReportFilter({ onSubmit, loading }: ReportFilterProps) {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [form] = Form.useForm<FilterFormValues>();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    useEffect(() => {
        walletApi.getAll().then(setWallets);
    }, []);

    const buildFilter = (): ReportFilterDto | null => {
        const values = form.getFieldsValue();
        const [from, to] = values.range || [];

        const filter: ReportFilterDto = {
            walletId: values.walletId,
            from: from ? from.startOf('day').toISOString() : undefined,
            to: to ? to.endOf('day').toISOString() : undefined,
        };

        return filter;
    };

    const handleSubmit = () => {
        const values = form.getFieldsValue();

        const [from, to] = values.range || [];

        const filter: ReportFilterDto = {
            walletId: values.walletId,
            from: from ? from.startOf('day').toISOString() : undefined,
            to: to ? to.endOf('day').toISOString() : undefined,
        };

        console.log('Report filter submit:', filter);
        onSubmit?.(filter);
    };

    const today = dayjs();
    const presets: {
        label: string;
        value: [Dayjs, Dayjs];
    }[] = [
            {
                label: 'Hôm nay',
                value: [today.startOf('day'), today.endOf('day')],
            },
            {
                label: 'Tháng này',
                value: [today.startOf('month'), today.endOf('month')],
            },
            {
                label: 'Năm nay',
                value: [today.startOf('year'), today.endOf('year')],
            },
        ];

    return (
        <div
            style={{
                padding: isMobile ? 8 : 12,
                background: '#fafafa',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                marginBottom: 12,
            }}
        >
            <Form
                layout={isMobile ? 'vertical' : 'inline'}
                form={form}
                onFinish={handleSubmit}
                disabled={loading}
                style={{
                    width: '100%',
                    rowGap: 8,
                }}
            >
                <Form.Item
                    name="walletId"
                    label="Ví"
                    style={{
                        flex: isMobile ? '0 0 100%' : '0 0 auto',
                        minWidth: isMobile ? '100%' : 220,
                        marginBottom: isMobile ? 8 : 0,
                    }}
                >
                    <Select
                        allowClear
                        placeholder="Tất cả ví"
                        style={{ width: '100%' }}
                        options={wallets.map((w) => ({
                            value: w._id,
                            label: w.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="range"
                    label="Khoảng thời gian"
                    initialValue={[today.startOf('month'), today.endOf('month')]}
                    style={{
                        flex: isMobile ? '0 0 100%' : '0 0 auto',
                        minWidth: isMobile ? '100%' : 260,
                        marginBottom: isMobile ? 8 : 0,
                    }}
                >
                    <RangePicker
                        format="DD/MM/YYYY"
                        presets={presets}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    style={{
                        flex: isMobile ? '0 0 100%' : '0 0 auto',
                        marginBottom: isMobile ? 0 : 0,
                    }}
                >
                    <Space
                        style={{
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: isMobile ? 'stretch' : 'flex-start',
                        }}
                        direction={isMobile ? 'vertical' : 'horizontal'}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block={isMobile}
                        >
                            Xem báo cáo
                        </Button>
                        <ExportExcelButton
                            getFilter={buildFilter}
                            loading={loading}
                            block={isMobile}
                        />
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}
