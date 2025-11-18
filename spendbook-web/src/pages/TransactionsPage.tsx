import { Card, Row, Col } from 'antd';
import TransactionForm from '@/components/transaction/TransactionForm';
import TransactionList from '@/components/transaction/TransactionList';

export default function TransactionsPage() {
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
                <Card title="Thêm giao dịch">
                    <TransactionForm />
                </Card>
            </Col>
            <Col xs={24} md={16}>
                <Card title="Lịch sử giao dịch">
                    <TransactionList />
                </Card>
            </Col>
        </Row>
    );
}
