import { Routes, Route, Navigate } from 'react-router-dom';
import WalletsPage from '@/pages/WalletsPage';
import TransactionsPage from '@/pages/TransactionsPage';
import ReportsPage from '@/pages/ReportsPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/wallets" replace />} />
        <Route path="/wallets" element={<WalletsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);
