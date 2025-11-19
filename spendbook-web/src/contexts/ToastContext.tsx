import React, { createContext, useContext } from 'react';
import { notification } from 'antd';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastApi = {
    success: (message: string, description?: string) => void;
    error: (err: any, fallbackMessage?: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const toast: ToastApi = {
        success(message, description) {
            api.success({
                message,
                description,
                placement: 'topRight',
            });
        },

        error(err: any, fallbackMessage = 'Đã xảy ra lỗi') {
            let message = fallbackMessage;
            let description = '';

            if (err?.response?.data?.error?.message) {
                message = 'Lỗi';
                description = err.response.data.error.message;
            } else if (err instanceof Error) {
                description = err.message;
            } else if (typeof err === 'string') {
                description = err;
            } else {
                description = fallbackMessage;
            }

            console.log('err toast', description);

            api.error({
                message,
                description,
                placement: 'topRight',
            });
        },
    };

    return (
        <ToastContext.Provider value={toast}>
            {contextHolder}
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast phải được dùng bên trong <ToastProvider>');
    }
    return ctx;
};
