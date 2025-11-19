import {
    Form,
    InputNumber,
    Select,
    DatePicker,
    Input,
    Button,
    Modal,
} from 'antd';
import { useEffect, useState } from 'react';
import { walletApi, Wallet } from '@/api/walletApi';
import { transactionApi } from '@/api/transactionApi';
import { categoryApi, Category } from '@/api/categoryApi';
import dayjs from 'dayjs';
import { useWalletSummary } from '@/contexts/WalletSummaryContext';
import { useToast } from '@/contexts/ToastContext';

interface TransactionFormProps {
    onCreated?: () => void;
}

export default function TransactionForm({ onCreated }: TransactionFormProps) {
    const [form] = Form.useForm();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [typeSelected, setTypeSelected] = useState<'INCOME' | 'EXPENSE'>(
        'EXPENSE',
    );

    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [categoryForm] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const toast = useToast();
    const { refresh: refreshWalletSummary } = useWalletSummary();

    const loadWallets = async () => {
        const data = await walletApi.getAll();
        setWallets(data);
    };

    const loadCategories = async () => {
        const data = await categoryApi.getAll();
        setCategories(data);
    };

    useEffect(() => {
        loadWallets();
        loadCategories();
        form.setFieldsValue({
            type: 'EXPENSE',
            date: dayjs(),
        });
    }, []);

    const handleSubmit = async () => {
        if (submitting) return;
        try {
            setSubmitting(true);

            const values = await form.validateFields();

            await transactionApi.create({
                walletId: values.walletId,
                amount: values.amount,
                type: values.type,
                categoryId: values.categoryId,
                note: values.note,
                date: values.date.toISOString(),
            });

            toast.success('Ghi nhận giao dịch thành công');
            await refreshWalletSummary();

            form.resetFields();
            form.setFieldsValue({
                type: 'EXPENSE',
                date: dayjs(),
            });
            setTypeSelected('EXPENSE');

            // callback để reload list
            onCreated?.();
        } catch (err) {
            toast.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateCategory = async () => {
        try {
            const values = await categoryForm.validateFields();

            await categoryApi.create({
                name: values.name,
                type: values.type,
                icon: values.icon,
            });

            toast.success('Tạo danh mục thành công');
            categoryForm.resetFields();
            setOpenCategoryModal(false);

            await loadCategories();
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <>
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Form.Item
                    name="type"
                    label="Loại giao dịch"
                    rules={[{ required: true }]}
                    initialValue="EXPENSE"
                >
                    <Select
                        onChange={(v) => setTypeSelected(v)}
                        options={[
                            { value: 'INCOME', label: 'Thu' },
                            { value: 'EXPENSE', label: 'Chi' },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="walletId"
                    label="Ví"
                    rules={[{ required: true }]}
                >
                    <Select
                        options={wallets.map((w) => ({
                            value: w._id,
                            label: w.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="categoryId"
                    label="Danh mục"
                    rules={[{ required: true }]}
                >
                    <Select
                        placeholder="Chọn danh mục"
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Button
                                    type="link"
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        paddingLeft: 0,
                                    }}
                                    onClick={() => setOpenCategoryModal(true)}
                                >
                                    + Thêm danh mục
                                </Button>
                            </>
                        )}
                        options={categories
                            .filter((c) => c.type === typeSelected)
                            .map((c) => ({
                                value: c._id,
                                label: `${c.icon || ''} ${c.name}`,
                            }))}
                    />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Số tiền"
                    rules={[{ required: true }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        formatter={(v) =>
                            `${v}`.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ',',
                            )
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Ngày"
                    initialValue={dayjs()}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item name="note" label="Ghi chú">
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={submitting}
                    >
                        Lưu giao dịch
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                title="Tạo danh mục mới"
                open={openCategoryModal}
                onCancel={() => setOpenCategoryModal(false)}
                onOk={handleCreateCategory}
                okText="Tạo"
                cancelText="Hủy"
            >
                <Form form={categoryForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Loại"
                        rules={[{ required: true }]}
                        initialValue={typeSelected}
                    >
                        <Select
                            options={[
                                { value: 'INCOME', label: 'Thu' },
                                { value: 'EXPENSE', label: 'Chi' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="icon" label="Biểu tượng (emoji)">
                        <Input placeholder="Ví dụ: 🍔, 🚗, 💰..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
