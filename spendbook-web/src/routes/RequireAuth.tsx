// src/routes/RequireAuth.tsx
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Spin, Modal, Typography } from 'antd';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

const { Text } = Typography;

export function RequireAuth({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    console.log('🟢 RequireAuth loading:', loading);
    const location = useLocation();
    if (loading) {
        return (
            <div style={{ padding: 32, textAlign: 'center' }}>
                <Spin />
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <Modal
                    open={true}
                    footer={null}
                    closable={false}
                    centered
                >
                    <div
                        style={{
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 20,
                            padding: '16px 0',
                        }}
                    >
                        <Text strong style={{ fontSize: 18 }}>
                            Vui lòng đăng nhập để tiếp tục
                        </Text>

                        <GoogleLoginButton />

                    </div>
                </Modal>

                {children}
            </>
        );
    }

    return <>{children}</>;
}
