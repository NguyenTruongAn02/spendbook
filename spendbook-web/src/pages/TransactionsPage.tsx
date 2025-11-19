import { useState } from 'react';
import { Card, Row, Col, Grid, Button } from 'antd';
import TransactionForm from '@/components/transaction/TransactionForm';
import TransactionList from '@/components/transaction/TransactionList';
import { useNavigate } from 'react-router-dom';
import { WalletOutlined } from '@ant-design/icons';

export default function TransactionsPage() {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const navigate = useNavigate();

    const [reloadKey, setReloadKey] = useState(0);

    const handleTransactionCreated = () => {
        setReloadKey((k) => k + 1);
    };

    return (
        <>
            {isMobile && (
                <div style={{ marginBottom: 12 }}>
                    <Button
                        type="primary"
                        shape="round"
                        icon={<WalletOutlined />}
                        size="large"
                        onClick={() => navigate('/wallets')}
                        style={{
                            background: '#1677ff',
                            paddingInline: 20,
                            fontWeight: 600,
                        }}
                    >
                        Ví của bạn
                    </Button>
                </div>
            )}
            <Row
                style={isMobile ? { marginTop: 6 } : { marginTop: 60 }}
                gutter={[16, 16]}
            >
                <Col xs={24} md={8}>
                    <Card title="Thêm giao dịch">
                        <TransactionForm onCreated={handleTransactionCreated} />
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card title="Lịch sử giao dịch">
                        <TransactionList reloadKey={reloadKey} />
                    </Card>
                </Col>
            </Row>
        </>
    );
}
