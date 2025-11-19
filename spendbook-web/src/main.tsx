import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'antd/dist/reset.css';
import App from '@/App';
import { AuthProvider } from '@/contexts/AuthContext';
import { WalletSummaryProvider } from '@/contexts/WalletSummaryContext';
import '@/styles/antd.override.css';
import { ToastProvider } from '@/contexts/ToastContext';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <WalletSummaryProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </WalletSummaryProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
