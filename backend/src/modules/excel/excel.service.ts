import ExcelJS from "exceljs";
import { Types } from "mongoose";
import { Transaction } from "@/modules/transactions/transaction.model";
import { Wallet } from "@/modules/wallets/wallet.model";
import { DailyWalletSummary } from "@/modules/reports/dailyWalletSummary.model";
import type { Response } from "express";

export async function exportStatementExcel(
    userId: string,
    walletId: string,
    from: Date,
    to: Date,
    stream: Response
): Promise<void> {
    const userObjectId = new Types.ObjectId(userId);

    const wallet = await Wallet.findOne({ _id: walletId, userId: userObjectId });
    if (!wallet) throw new Error("Không tìm thấy ví");

    const fromDay = new Date(from);
    fromDay.setUTCHours(0, 0, 0, 0);

    const toDay = new Date(to);
    toDay.setUTCHours(23, 59, 59, 999);

    const wId = new Types.ObjectId(walletId);

    const [aggBefore, aggRange] = await Promise.all([
        DailyWalletSummary.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    walletId: wId,
                    date: { $lt: fromDay },
                },
            },
            {
                $group: {
                    _id: null,
                    income: { $sum: "$totalIncome" },
                    expense: { $sum: "$totalExpense" },
                },
            },
        ]),
        DailyWalletSummary.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    walletId: wId,
                    date: { $gte: fromDay, $lte: toDay },
                },
            },
            {
                $group: {
                    _id: null,
                    income: { $sum: "$totalIncome" },
                    expense: { $sum: "$totalExpense" },
                },
            },
        ]),
    ]);

    const before = aggBefore[0] || { income: 0, expense: 0 };
    const range = aggRange[0] || { income: 0, expense: 0 };

    const openingBalance =
        wallet.openingBalance + (before.income || 0) - (before.expense || 0);
    const totalIncome = range.income || 0;
    const totalExpense = range.expense || 0;
    const closingBalance = openingBalance + totalIncome - totalExpense;

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
        stream,
        useStyles: true,
        useSharedStrings: true,
    });

    const ws = workbook.addWorksheet("Statement");

    ws.addRow(["Tài khoản", wallet.name]).commit();
    ws.addRow([
        "Khoảng thời gian",
        `${fromDay.toISOString().slice(0, 10)} đến ${toDay
            .toISOString()
            .slice(0, 10)}`,
    ]).commit();
    ws.addRow([]).commit();

    ws.addRow(["Số dư đầu kỳ", openingBalance]).commit();
    ws.addRow(["Tổng thu", totalIncome]).commit();
    ws.addRow(["Tổng chi", totalExpense]).commit();
    ws.addRow(["Số dư cuối kỳ", closingBalance]).commit();
    ws.addRow([]).commit();

    ws.addRow(["Ngày", "Loại", "Danh mục", "Số tiền", "Ghi chú"]).commit();

    const cursor = Transaction.find({
        userId: userObjectId,
        walletId: wId,
        date: { $gte: fromDay, $lte: toDay },
    })
        .sort({ date: 1, _id: 1 })
        .cursor();

    for await (const tx of cursor) {
        ws.addRow([
            tx.date.toISOString().slice(0, 10),
            tx.type === "INCOME" ? "Thu" : "Chi",
            tx.categoryName,
            tx.amount,
            tx.note || "",
        ]).commit();
    }

    await workbook.commit();
}
