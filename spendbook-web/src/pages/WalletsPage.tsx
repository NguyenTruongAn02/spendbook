import { Card } from 'antd';
import WalletList from '@/components/wallet/WalletList';

export default function WalletsPage() {
    return (
        <Card title="Danh sách ví">
            <WalletList />
        </Card>
    );
}
