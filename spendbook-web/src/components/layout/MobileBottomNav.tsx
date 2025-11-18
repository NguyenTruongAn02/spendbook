import { Button } from 'antd';
import {
    WalletOutlined,
    SwapOutlined,
    BarChartOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import WalletCreateButton from '@/components/wallet/WalletCreateButton';

export default function MobileBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const isSelected = (path: string) =>
        location.pathname.startsWith(path) ? '#1677ff' : '#8c8c8c';

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 64,
                background: '#fff',
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                zIndex: 100,
            }}
        >
    
            <Button
                type="text"
                onClick={() => navigate('/transactions')}
                icon={<SwapOutlined style={{ fontSize: 22, color: isSelected('/transactions') }} />}
            />


            <WalletCreateButton>
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<PlusOutlined />}
                    style={{
                        width: 64,
                        height: 64,
                        marginBottom: 32,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    }}
                />
            </WalletCreateButton>

        
            <Button
                type="text"
                onClick={() => navigate('/reports')}
                icon={
                    <BarChartOutlined style={{ fontSize: 22, color: isSelected('/reports') }} />
                }
            />
        </div>
    );
}
