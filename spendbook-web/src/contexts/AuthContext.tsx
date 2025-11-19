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
    const [user, setUser] = useState<User | null>(() => {
        const raw = localStorage.getItem('user');
        if (!raw) return null;
        try {
            return JSON.parse(raw) as User;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const fetchMe = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        // try {
        //     const res = await axiosClient.get<User>('/auth/me');
        //     setUser(res.data);
        //     localStorage.setItem('user', JSON.stringify(res.data));
        // } catch {
        //     localStorage.removeItem('access_token');
        //     localStorage.removeItem('user');
        //     setUser(null);
        // } finally {
        //     setLoading(false);
        // }
        setLoading(false);
    };

    useEffect(() => {
        fetchMe();
    }, []);

    const loginWithGoogle = async (idToken: string) => {
        const res = await axiosClient.post<{ user: User; token: string }>(
            '/auth/google',
            { idToken },
        );

        const { user, token } = res.data;

        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const logout = async () => {
        try {
            await axiosClient.post('/auth/logout');
        } catch {

        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
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