import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

// Pasang token di setiap request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token kedaluwarsa -> logout otomatis
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && useAuthStore.getState().token) {
      useAuthStore.getState().logout();
      // file ini bukan komponen, jadi pakai window.location (bukan router)
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error))
    return error.response?.data?.message ?? error.message;
  return 'Terjadi kesalahan';
}
