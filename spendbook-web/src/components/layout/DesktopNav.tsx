import { Menu } from 'antd';
import { WalletOutlined, SwapOutlined, BarChartOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const items = [
    { key: '/wallets', icon: <WalletOutlined />, label: 'Ví' },
    { key: '/transactions', icon: <SwapOutlined />, label: 'Thu chi' },
    { key: '/reports', icon: <BarChartOutlined />, label: 'Báo cáo' },
];

export default function DesktopNav() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={(e) => navigate(e.key)}
        />
    );
}
