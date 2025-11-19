import { Button, Typography, Space, Avatar, Dropdown, Menu } from 'antd';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletSummary } from '@/contexts/WalletSummaryContext';

const { Text } = Typography;

export default function HeaderSummary() {
    const { user, logout } = useAuth();
    const { total, loading } = useWalletSummary();

    const menu = (
        <Menu
            items={[
                {
                    key: 'logout',
                    label: (
                        <span onClick={logout} style={{ color: 'red' }}>
                            Đăng xuất
                        </span>
                    ),
                },
            ]}
        />
    );

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0px 16px',
                color: 'white',
            }}
        >
            <div>
                <Text
                    style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: 16,
                        fontWeight: 700,
                    }}
                >
                    {loading ? 'Đang tính tổng tiền...' : `Tổng tiền: ${total.toLocaleString()} ₫`}
                </Text>
            </div>

            <div>
                {user ? (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar src={user.avatar}>{user.name[0]}</Avatar>
                            <Text strong style={{ color: '#fff' }}>
                                {user.name}
                            </Text>
                        </Space>
                    </Dropdown>
                ) : (
                    <GoogleLoginButton />
                )}
            </div>
        </div>
    );
}
