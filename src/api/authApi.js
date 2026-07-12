import axiosInstance from './axiosInstance';

export const authApi = {
  login: (payload) => axiosInstance.post('/auth/login', payload),
  register: (payload) => axiosInstance.post('/auth/register', payload),
  forgotPassword: (payload) => axiosInstance.post('/auth/forgot-password', payload),
  resetPassword: (payload) => axiosInstance.post('/auth/reset-password', payload),
  refreshToken: (refreshToken) => axiosInstance.post('/auth/refresh-token', { refreshToken }),
  logout: () => axiosInstance.post('/auth/logout'),
  me: () => axiosInstance.get('/auth/me'),
};
