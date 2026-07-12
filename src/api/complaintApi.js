import axiosInstance from './axiosInstance';

export const complaintApi = {
  // Citizen
  create: (payload) => axiosInstance.post('/complaints', payload),
  getMine: (params) => axiosInstance.get('/complaints/mine', { params }),
  getById: (id) => axiosInstance.get(`/complaints/${id}`),
  getNearby: (params) => axiosInstance.get('/complaints/nearby', { params }),
  getBookmarks: () => axiosInstance.get('/complaints/bookmarks'),
  bookmark: (id) => axiosInstance.post(`/complaints/${id}/bookmark`),
  removeBookmark: (id) => axiosInstance.delete(`/complaints/${id}/bookmark`),
  rate: (id, payload) => axiosInstance.post(`/complaints/${id}/rating`, payload),
  addComment: (id, payload) => axiosInstance.post(`/complaints/${id}/comments`, payload),

  // Officer
  getAssigned: (params) => axiosInstance.get('/complaints/assigned', { params }),
  accept: (id) => axiosInstance.patch(`/complaints/${id}/accept`),
  reject: (id, payload) => axiosInstance.patch(`/complaints/${id}/reject`, payload),
  updateProgress: (id, payload) => axiosInstance.patch(`/complaints/${id}/progress`, payload),
  uploadProgressPhoto: (id, formData) =>
    axiosInstance.post(`/complaints/${id}/progress-photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Manager / Admin
  getAll: (params) => axiosInstance.get('/complaints', { params }),
  assignOfficer: (id, officerId) =>
    axiosInstance.patch(`/complaints/${id}/assign`, { officerId }),
  getHeatmapData: (params) => axiosInstance.get('/complaints/heatmap', { params }),
  getAnalytics: (params) => axiosInstance.get('/complaints/analytics', { params }),

  // Uploads (Cloudinary unsigned upload happens client-side, see utils/cloudinary.js)
};
