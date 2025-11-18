import { ReactNode, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

interface Props {
    children: ReactNode;
}

export default function WalletCreateButton({ children }: Props) {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields().then((values) => {
            // TODO: call api tạo ví
            console.log('create wallet', values);
            setOpen(false);
            form.resetFields();
        });
    };

    return (
        <>
            <div onClick={() => setOpen(true)}>{children}</div>
            <Modal
                title="Tạo ví mới"
                open={open}
                onOk={handleOk}
                onCancel={() => setOpen(false)}
                okText="Tạo ví"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên ví"
                        rules={[{ required: true, message: 'Nhập tên ví' }]}
                    >
                        <Input placeholder="Ví tiền mặt" />
                    </Form.Item>
                    <Form.Item name="bank" label="Ngân hàng">
                        <Select
                            allowClear
                            options={[
                                { label: 'Tiền mặt', value: 'cash' },
                                { label: 'Vietcombank', value: 'vcb' },
                                { label: 'Techcombank', value: 'tcb' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="initialBalance"
                        label="Số dư ban đầu"
                        rules={[{ required: true, message: 'Nhập số dư ban đầu' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
