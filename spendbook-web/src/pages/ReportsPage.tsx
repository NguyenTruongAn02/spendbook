import { Card } from 'antd';
import ReportFilter from '@/components/report/ReportFilter';
import ReportTable from '@/components/report/ReportTable';

export default function ReportsPage() {
    return (
        <Card title="Báo cáo & Sao kê">
            <ReportFilter />
            <div style={{ marginTop: 16 }}>
                <ReportTable />
            </div>
        </Card>
    );
}
