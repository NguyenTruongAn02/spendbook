import ExcelJS from "exceljs";
import { getStatement } from "@/modules/reports/report.service";

export async function exportStatementExcel(
    userId: string,
    walletId: string,
    from: Date,
    to: Date
) {
    const data = await getStatement(userId, walletId, from, to);

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Statement");

    ws.addRow(["Số dư đầu kỳ", data.openingBalance]);
    ws.addRow(["Tổng thu", data.totalIncome]);
    ws.addRow(["Tổng chi", data.totalExpense]);
    ws.addRow(["Số dư cuối kỳ", data.closingBalance]);
    ws.addRow([]);

    ws.addRow(["Ngày", "Loại", "Danh mục", "Số tiền", "Ghi chú"]);

    data.transactions.forEach(tx => {
        ws.addRow([
            tx.date.toISOString().slice(0, 10),
            tx.type === "INCOME" ? "Thu" : "Chi",
            tx.categoryName,
            tx.amount,
            tx.note || ""
        ]);
    });

    const buffer = await wb.xlsx.writeBuffer();
    return buffer;
}
