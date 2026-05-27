import axios from 'axios';

export const userAxios = axios.create({
    baseURL: '/api'
});

userAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});