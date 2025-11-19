import { Card } from 'antd';
import WalletList from '@/components/wallet/WalletList';

export default function WalletsPage() {
    return (
        <div
            style={{
                padding: 16,
                paddingTop: 24,
                marginTop: 40, 
            }}
        >
            <Card title="Danh sách ví">
                <WalletList />
            </Card>
        </div>
    );
}
