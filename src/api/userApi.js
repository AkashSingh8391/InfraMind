import axiosInstance from './axiosInstance';

export const userApi = {
  getProfile: () => axiosInstance.get('/users/me'),
  updateProfile: (payload) => axiosInstance.put('/users/me', payload),
  uploadAvatar: (formData) =>
    axiosInstance.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Admin - user management
  getAllUsers: (params) => axiosInstance.get('/admin/users', { params }),
  updateUserRole: (id, role) => axiosInstance.patch(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id) => axiosInstance.patch(`/admin/users/${id}/status`),

  // Departments
  getDepartments: () => axiosInstance.get('/departments'),
  createDepartment: (payload) => axiosInstance.post('/departments', payload),
  updateDepartment: (id, payload) => axiosInstance.put(`/departments/${id}`, payload),

  // Officers (for managers)
  getOfficers: (departmentId) =>
    axiosInstance.get('/officers', { params: { departmentId } }),
  getOfficerLeaderboard: () => axiosInstance.get('/officers/leaderboard'),

  // Audit logs
  getAuditLogs: (params) => axiosInstance.get('/admin/audit-logs', { params }),
};
