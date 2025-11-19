// src/components/wallet/WalletList.tsx
import { ReactElement, useEffect, useState } from 'react';
import {
    List,
    Tag,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    message,
    Popconfirm,
    Tooltip,
    Select,
} from 'antd';
import { walletApi, Wallet } from '@/api/walletApi';
import WalletCreateButton from '@/components/wallet/WalletCreateButton';
import {
    PlusOutlined,
    WalletOutlined,
    BankOutlined,
    CreditCardOutlined,
    DollarCircleOutlined,
    EditOutlined,
    EyeInvisibleOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useWalletSummary } from '@/contexts/WalletSummaryContext';

interface EditFormValues {
    name: string;
    bankName?: string;
    accountNumber?: string;
    startDate: dayjs.Dayjs;
    openingBalance: number;
}

export default function WalletList() {
    const { refresh: refreshSummary } = useWalletSummary();

    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [editOpen, setEditOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
    const [editForm] = Form.useForm<EditFormValues>();
    const [editLoading, setEditLoading] = useState(false);

    const fetchData = async () => {
        try {
            const res = await walletApi.getAll();
            setWallets(res);
        } catch (err) {
            console.error('Lỗi load ví:', err);
        }
    };

    const reloadAll = async () => {
        await Promise.all([fetchData(), refreshSummary()]);
    };

    useEffect(() => {
        reloadAll();
    }, []);

    const gradientMap: Record<string, string> = {
        'Tiền mặt': 'linear-gradient(135deg, #fef3c7, #ffedd5)',
        'Vietcombank': 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
        'Techcombank': 'linear-gradient(135deg, #fee2e2, #fecaca)',
        'MB Bank': 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    };

    const iconMap: Record<string, ReactElement> = {
        'Tiền mặt': <DollarCircleOutlined style={{ fontSize: 22, color: '#d97706' }} />,
        'Vietcombank': <BankOutlined style={{ fontSize: 22, color: '#047857' }} />,
        'Techcombank': <CreditCardOutlined style={{ fontSize: 22, color: '#b91c1c' }} />,
        'MB Bank': <BankOutlined style={{ fontSize: 22, color: '#1d4ed8' }} />,
    };

    const openEditModal = (wallet: Wallet) => {
        setEditingWallet(wallet);
        editForm.setFieldsValue({
            name: wallet.name,
            bankName: wallet.bankName,
            accountNumber: wallet.accountNumber,
            startDate: dayjs(wallet.startDate),
            openingBalance: wallet.openingBalance,
        });
        setEditOpen(true);
    };

    const handleEditOk = async () => {
        if (!editingWallet) return;
        try {
            const values = await editForm.validateFields();
            setEditLoading(true);

            await walletApi.update(editingWallet._id, {
                name: values.name,
                bankName: values.bankName,
                accountNumber: values.accountNumber,
                startDate: values.startDate.format('YYYY-MM-DD'),
                openingBalance: values.openingBalance,
            });

            message.success('Cập nhật ví thành công');
            setEditOpen(false);
            setEditingWallet(null);
            await reloadAll();
        } catch (err) {
            if ((err as any)?.errorFields) return;
            console.error('Lỗi cập nhật ví:', err);
            message.error('Cập nhật ví thất bại');
        } finally {
            setEditLoading(false);
        }
    };

    const handleArchive = async (id: string) => {
        try {
            await walletApi.archive(id);
            message.success('Đã ẩn ví');
            fetchData();
        } catch (err) {
            console.error('Lỗi ẩn ví:', err);
            message.error('Ẩn ví thất bại');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await walletApi.remove(id);
            message.success('Đã xoá ví');
            await reloadAll();
        } catch (err) {
            console.error('Lỗi xoá ví:', err);
            message.error('Xoá ví thất bại');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
            }}
        >
            <List
                dataSource={wallets}
                itemLayout="horizontal"
                renderItem={(w) => {
                    const bankKey = w.bankName || 'Tiền mặt';
                    const isCash = bankKey === 'Tiền mặt';

                    const background =
                        gradientMap[bankKey] || 'linear-gradient(135deg, #e5e7eb, #f3f4f6)';

                    const icon =
                        iconMap[bankKey] ||
                        <WalletOutlined style={{ fontSize: 22, color: '#374151' }} />;

                    return (
                        <List.Item
                            key={w._id}
                            style={{
                                background,
                                borderRadius: 12,
                                marginBottom: 8,
                                padding: '12px 16px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                            }}
                            actions={[
                                <Tooltip title="Sửa ví" key="edit">
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => openEditModal(w)}
                                    />
                                </Tooltip>,
                                // <Tooltip title="Ẩn ví (không hiển thị nữa)" key="archive">
                                //     <Popconfirm
                                //         title="Ẩn ví này?"
                                //         description="Ví sẽ không còn hiển thị trong danh sách, nhưng vẫn lưu trong hệ thống."
                                //         okText="Đồng ý"
                                //         cancelText="Huỷ"
                                //         onConfirm={() => handleArchive(w._id)}
                                //     >
                                //         <Button type="text" icon={<EyeInvisibleOutlined />} />
                                //     </Popconfirm>
                                // </Tooltip>,
                                <Tooltip title="Xoá vĩnh viễn" key="delete">
                                    <Popconfirm
                                        title="Xoá ví?"
                                        description="Hành động này không thể hoàn tác."
                                        okText="Xoá"
                                        okButtonProps={{ danger: true }}
                                        cancelText="Huỷ"
                                        onConfirm={() => handleDelete(w._id)}
                                    >
                                        <Button type="text" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </Tooltip>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'rgba(255,255,255,0.7)',
                                        }}
                                    >
                                        {icon}
                                    </div>
                                }
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontWeight: 600 }}>{w.name}</span>

                                        {isCash && <Tag color="gold">Tiền mặt</Tag>}
                                        {!isCash && w.bankName && (
                                            <Tag color="blue">{w.bankName}</Tag>
                                        )}
                                    </div>
                                }
                                description={
                                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                                        Số dư hiện tại:{' '}
                                        <strong>
                                            {Number(w.currentBalance || 0).toLocaleString()} ₫
                                        </strong>
                                        <br />
                                        Tiền ban đầu:{' '}
                                        <strong>
                                            {Number(w.openingBalance || 0).toLocaleString()} ₫
                                        </strong>
                                        {w.accountNumber && (
                                            <>
                                                <br />
                                                Số tài khoản:{' '}
                                                <strong>{w.accountNumber}</strong>
                                            </>
                                        )}
                                    </div>
                                }
                            />
                        </List.Item>
                    );
                }}
            />

            <div style={{ marginTop: 8 }}>
                <WalletCreateButton onCreated={reloadAll}>
                    <Button type="dashed" block icon={<PlusOutlined />}>
                        Thêm ví mới
                    </Button>
                </WalletCreateButton>
            </div>

            <Modal
                title="Sửa thông tin ví"
                open={editOpen}
                onOk={handleEditOk}
                onCancel={() => {
                    setEditOpen(false);
                    setEditingWallet(null);
                }}
                confirmLoading={editLoading}
                okText="Lưu"
                cancelText="Huỷ"
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên ví"
                        rules={[{ required: true, message: 'Nhập tên ví' }]}
                    >
                        <Input />
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

                    <Form.Item name="accountNumber" label="Số tài khoản">
                        <Input placeholder="Bỏ trống nếu là ví tiền mặt" />
                    </Form.Item>

                    <Form.Item
                        name="startDate"
                        label="Ngày bắt đầu"
                        rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item
                        name="openingBalance"
                        label="Số dư ban đầu"
                        rules={[{ required: true, message: 'Nhập số dư ban đầu' }]}
                    >
                        <InputNumber<number>
                            style={{ width: '100%' }}
                            disabled={editingWallet?.transactionsCount > 0}
                            min={0}
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(v) => Number((v || '0').replace(/,/g, ''))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
