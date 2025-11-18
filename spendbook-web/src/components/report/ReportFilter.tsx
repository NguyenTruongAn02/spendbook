import { Form, Select, DatePicker, Button } from 'antd';
import { useEffect, useState } from 'react';
import { walletApi, Wallet } from '@/api/walletApi';

export default function ReportFilter() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        walletApi.getAll().then(setWallets);
    }, []);

    const handleSubmit = () => {
        const values = form.getFieldsValue();
        console.log('Report filter submit:', values);
        // TODO: gọi API report ở parent hoặc context
    };

    return (
        <Form layout="inline" form={form} onFinish={handleSubmit}>
            <Form.Item name="walletId" label="Ví">
                <Select
                    allowClear
                    style={{ minWidth: 160 }}
                    options={wallets.map((w) => ({
                        value: w.id,
                        label: w.name,
                    }))}
                />
            </Form.Item>
            <Form.Item name="range" label="Khoảng thời gian">
                <DatePicker.RangePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Xem báo cáo
                </Button>
            </Form.Item>
        </Form>
    );
}
