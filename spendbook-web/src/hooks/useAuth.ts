import { useEffect, useState } from 'react';
import { axiosClient } from '@/api/axiosClient';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    console.log('🟢 useAuth user:', user);

    const fetchMe = async () => {
        try {
            const res = await axiosClient.get('/auth/me');
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
        const res = await axiosClient.post('/auth/google', { idToken });

        console.log('🟢 loginWithGoogle response:', res.data);
        const { user, token } = res.data; 

        localStorage.setItem('access_token', token);
        setUser(user);
    };

    const logout = async () => {
        await axiosClient.post('/auth/logout');
        setUser(null);
    };

    return { user, loading, loginWithGoogle, logout, refetch: fetchMe };
}
