import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { excelApi } from '@/api/excelApi';
import type { ReportFilterDto } from '@/api/reportApi';
import { useToast } from '@/contexts/ToastContext';
import { useState } from 'react';

interface ExportExcelButtonProps {
    getFilter: () => ReportFilterDto | null; 
    loading?: boolean;                        
    block?: boolean;                          
}

export default function ExportExcelButton({
    getFilter,
    loading,
    block,
}: ExportExcelButtonProps) {
    const toast = useToast();
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        if (loading || exporting) return;

        const filter = getFilter();
        if (!filter || !filter.walletId || !filter.from || !filter.to) {
            toast.error('Vui lòng chọn ví và khoảng thời gian để xuất Excel');
            return;
        }

        try {
            setExporting(true);
            const blob = await excelApi.exportStatement(filter);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `statement_${filter.walletId}_${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Đã xuất Excel');
        } catch (err) {
            console.error('Lỗi xuất Excel:', err);
            toast.error(err, 'Xuất Excel thất bại');
        } finally {
            setExporting(false);
        }
    };

    return (
        <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={loading || exporting}
            loading={exporting}
            block={block}
        >
            Xuất Excel
        </Button>
    );
}
