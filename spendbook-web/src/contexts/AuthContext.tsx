import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { axiosClient } from '@/api/axiosClient';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    loginWithGoogle: (idToken: string) => Promise<void>;
    logout: () => Promise<void>;
    refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMe = async () => {
        try {
            const res = await axiosClient.get<User>('/auth/me');
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMe();
    }, []);

    const loginWithGoogle = async (idToken: string) => {
        const res = await axiosClient.post<{ user: User; token: string }>(
            '/auth/google',
            { idToken },
        );

        console.log('🟢 loginWithGoogle response:', res.data);
        const { user, token } = res.data;

        localStorage.setItem('access_token', token);
        setUser(user);
    };

    const logout = async () => {
        await axiosClient.post('/auth/logout'); 
        localStorage.removeItem('access_token');
        setUser(null);
    };

    const value: AuthContextValue = {
        user,
        loading,
        loginWithGoogle,
        logout,
        refetch: fetchMe,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
}
