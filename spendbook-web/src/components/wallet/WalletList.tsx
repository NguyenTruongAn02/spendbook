import { useEffect, useState } from 'react';
import { List, Tag } from 'antd';
import { walletApi, Wallet } from '@/api/walletApi';
import WalletCreateButton from './WalletCreateButton';
import { PlusOutlined } from '@ant-design/icons';

export default function WalletList() {
    const [wallets, setWallets] = useState<Wallet[]>([]);

    const fetchData = async () => {
        const res = await walletApi.getAll();
        setWallets(res);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <List
                dataSource={wallets}
                itemLayout="horizontal"
                renderItem={(w) => (
                    <List.Item>
                        <List.Item.Meta
                            title={
                                <>
                                    {w.name}{' '}
                                    {w.bankName && <Tag color="blue">{w.bankName}</Tag>}
                                </>
                            }
                            description={`Số dư: ${w.balance} ${w.currency}`}
                        />
                    </List.Item>
                )}
            />

            <div style={{ marginTop: 16 }}>
                <WalletCreateButton>
                    <a>
                        <PlusOutlined /> Thêm ví mới
                    </a>
                </WalletCreateButton>
            </div>
        </>
    );
}
