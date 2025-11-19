// src/components/wallet/WalletCreateButton.tsx
import { ReactNode, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { walletApi } from '@/api/walletApi';

interface Props {
    children: ReactNode;
    onCreated?: () => void;
}

interface FormValues {
    name: string;
    bankName?: string;
    accountNumber?: string;
    startDate: Dayjs;
    openingBalance: number;
}

export default function WalletCreateButton({ children, onCreated }: Props) {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            setLoading(true);

            await walletApi.create({
                name: values.name,
                bankName: values.bankName,
                accountNumber: values.accountNumber || '',
                startDate: values.startDate.format('YYYY-MM-DD'),
                openingBalance: values.openingBalance,
            });

            message.success('Tạo ví thành công');
            setOpen(false);
            form.resetFields();
            onCreated?.();
        } catch (err) {
            if ((err as any)?.errorFields) return;
            console.error('Lỗi tạo ví:', err);
            message.error('Tạo ví thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
                {children}
            </div>
            <Modal
                title="Tạo ví mới"
                open={open}
                onOk={handleOk}
                onCancel={() => setOpen(false)}
                okText="Tạo ví"
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        bankName: 'Tiền mặt',
                        startDate: dayjs(),
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Tên ví"
                        rules={[{ required: true, message: 'Nhập tên ví' }]}
                    >
                        <Input placeholder="Ví tiền mặt" />
                    </Form.Item>

                    <Form.Item name="bankName" label="Ngân hàng / Loại ví">
                        <Select
                            allowClear
                            options={[
                                { label: 'Tiền mặt', value: 'Tiền mặt' },
                                { label: 'Vietcombank', value: 'Vietcombank' },
                                { label: 'Techcombank', value: 'Techcombank' },
                                { label: 'MB Bank', value: 'MB Bank' },
                            ]}
                            placeholder="Chọn ngân hàng hoặc Tiền mặt"
                        />
                    </Form.Item>

                    <Form.Item
                        name="accountNumber"
                        label="Số tài khoản"
                    >
                        <Input placeholder="Bỏ trống nếu là ví tiền mặt" />
                    </Form.Item>

                    <Form.Item
                        name="startDate"
                        label="Ngày bắt đầu"
                        rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>

                    <Form.Item
                        name="openingBalance"
                        label="Số dư ban đầu"
                        rules={[{ required: true, message: 'Nhập số dư ban đầu' }]}
                    >
                        <InputNumber<number>
                            style={{ width: '100%' }}
                            min={0}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value) => {
                                if (!value) return 0;
                                const cleaned = value.replace(/,/g, '');
                                return Number(cleaned);
                            }}
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
}
