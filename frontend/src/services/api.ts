import axios from 'axios';
import { config } from '../config';

const api = axios.create({
    baseURL: config.api.baseUrl.startsWith('http') ? config.api.baseUrl : '/api/v1',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('id_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const generateText = async (prompt: string) => {
    const response = await api.post('/ai/generate', { prompt });
    return response.data;
};

export const summarizeText = async (prompt: string) => {
    const response = await api.post('/ai/summarize', { prompt });
    return response.data;
};

export const reportIncident = async (title: string, description: string, priority: number) => {
    const response = await api.post('/incidents', { title, description, priority });
    return response.data;
};
