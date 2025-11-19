// src/routes/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import WalletsPage from '@/pages/WalletsPage';
import TransactionsPage from '@/pages/TransactionsPage';
import ReportsPage from '@/pages/ReportsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { RequireAuth } from './RequireAuth';

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/wallets" replace />} />

        <Route
            path="/wallets"
            element={
                <RequireAuth>
                    <WalletsPage />
                </RequireAuth>
            }
        />
        <Route
            path="/transactions"
            element={
                <RequireAuth>
                    <TransactionsPage />
                </RequireAuth>
            }
        />
        <Route
            path="/reports"
            element={
                <RequireAuth>
                    <ReportsPage />
                </RequireAuth>
            }
        />

        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);
