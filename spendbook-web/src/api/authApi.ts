import { axiosClient } from './axiosClient';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export const authApi = {
    me(): Promise<User> {
        return axiosClient.get('/auth/me').then((res) => res.data);
    },
    logout(): Promise<void> {
        return axiosClient.post('/auth/logout').then((res) => res.data);
    },
    getGoogleLoginUrl(): string {
        return `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
    },
};
