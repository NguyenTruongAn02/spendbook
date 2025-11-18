import { Button, Typography, Space, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { walletApi } from '@/api/walletApi';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { useAuth } from '@/contexts/AuthContext';

const { Text } = Typography;

export default function HeaderSummary() {
    const { user, logout } = useAuth();
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        walletApi.getSummary().then((data) => setTotal(data.totalBalance));
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 16px',
            }}
        >

            <div>
                <Text type="secondary">Tổng số tiền hiện có</Text>
                <div style={{ fontSize: 20, fontWeight: 600 }}>
                    {total} ₫
                </div>
            </div>


            <Space>
                {user ? (
                    <>
                        {/* <Avatar src={user.avatar}>{user.name[0]  }</Avatar> */}
                        <Text strong>{user.name}</Text>
                        <Button size="small" onClick={logout}>
                            Đăng xuất
                        </Button>
                    </>
                ) : (
                    <GoogleLoginButton />
                )}
            </Space>
        </div>
    );
}
