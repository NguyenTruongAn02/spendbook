import { axiosClient } from './axiosClient';
import type { ReportFilterDto } from './reportApi';

export const excelApi = {
    exportStatement(filter: ReportFilterDto): Promise<Blob> {
        return axiosClient
            .get('/excel/statement', {
                params: {
                    walletId: filter.walletId,
                    from: filter.from,
                    to: filter.to,
                },
                responseType: 'blob',
            })
            .then((res) => res.data);
    },
};
