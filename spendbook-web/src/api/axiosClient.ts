import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});


axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (res) => {

        if (res.data && res.data.data !== undefined) {
            return { ...res, data: res.data.data };
        }
        return res;
    },
    (error) => {
        if (error.response?.status === 401) {

        }
        return Promise.reject(error);
    }
);
