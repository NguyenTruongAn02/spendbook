import { Form, InputNumber, Select, DatePicker, Input, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { walletApi, Wallet } from '@/api/walletApi';
import { transactionApi, TransactionType } from '@/api/transactionApi';
import dayjs from 'dayjs';

export default function TransactionForm() {
    const [form] = Form.useForm();
    const [wallets, setWallets] = useState<Wallet[]>([]);

    useEffect(() => {
        walletApi.getAll().then(setWallets);
    }, []);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await transactionApi.create({
                walletId: values.walletId,
                amount: values.amount,
                category: values.category,
                note: values.note,
                type: values.type,
                date: values.date.toISOString(),
            });
            message.success('Ghi nhận giao dịch thành công');
            form.resetFields();
        } catch (err) {
            // ignore validation error
        }
    };

    return (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
                name="type"
                label="Loại giao dịch"
                rules={[{ required: true, message: 'Chọn loại giao dịch' }]}
            >
                <Select
                    options={[
                        { value: 'INCOME', label: 'Thu' },
                        { value: 'EXPENSE', label: 'Chi' },
                    ]}
                />
            </Form.Item>

            <Form.Item
                name="walletId"
                label="Ví"
                rules={[{ required: true, message: 'Chọn ví' }]}
            >
                <Select
                    options={wallets.map((w) => ({
                        value: w.id,
                        label: w.name,
                    }))}
                />
            </Form.Item>

            <Form.Item
                name="amount"
                label="Số tiền"
                rules={[{ required: true, message: 'Nhập số tiền' }]}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
            </Form.Item>

            <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: 'Nhập danh mục' }]}
            >
                <Input placeholder="Ăn uống, Đi lại, Lương, Thưởng..." />
            </Form.Item>

            <Form.Item name="date" label="Ngày" initialValue={dayjs()}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item name="note" label="Ghi chú">
                <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Lưu giao dịch
                </Button>
            </Form.Item>
        </Form>
    );
}
